import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { createClientComponentClient } from "@/lib/supabase"
import { assessmentCategories } from "@/data/assessment-questions"

export class AssessmentService {
  private static supabase = createClientComponentClient()
  private static activeRequests = new Map<string, AbortController>()

  static get assessmentCategories() {
    return assessmentCategories
  }

  static getCategory(categoryId: string) {
    return assessmentCategories.find((cat) => cat.id === categoryId)
  }

  static async analyzeWithAI(categoryId: string, answers: AssessmentAnswer[]): Promise<{ data: any; error: any }> {
    try {
      const category = AssessmentService.getCategory(categoryId)
      if (!category) {
        throw new Error("Category not found")
      }

      const enrichedAnswers = answers.map((answer) => {
        const question = category.questions.find((q) => q.id === answer.questionId)
        return {
          ...answer,
          question: question?.question || "ไม่ระบุคำถาม",
        }
      })

      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          categoryTitle: category.title,
          answers: enrichedAnswers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze assessment")
      }

      const result = await response.json()
      return { data: result.analysis, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async saveAssessment(
    userId: string,
    categoryId: string,
    categoryTitle: string,
    answers: AssessmentAnswer[],
    aiAnalysis?: any,
  ): Promise<{ data: any; error: any }> {
    const requestId = `save-${userId}-${categoryId}-${Date.now()}`

    console.log("AssessmentService.saveAssessment: START - Received answers:", answers)
    console.log("AssessmentService.saveAssessment: Type of answers:", typeof answers)
    console.log("AssessmentService.saveAssessment: Is answers an Array?", Array.isArray(answers))
    console.log("AssessmentService.saveAssessment: Answers length property:", answers?.length)

    try {
      if (!userId) {
        throw new Error("User not authenticated")
      }

      if (!Array.isArray(answers) || answers.length === 0) {
        console.error(
          "AssessmentService.saveAssessment: CRITICAL VALIDATION FAILED - answers array is not valid or empty at check point.",
          { answers },
        )
        throw new Error("AssessmentServiceError: Answers array is invalid or empty.")
      }

      if (!this.supabase) {
        throw new Error("Database connection not available")
      }

      const existingKey = `save-${userId}-${categoryId}`
      const existingController = this.activeRequests.get(existingKey)
      if (existingController) {
        console.warn(`AssessmentService.saveAssessment: Aborting existing request for ${existingKey}`)
        existingController.abort()
        this.activeRequests.delete(existingKey)
      }

      const abortController = new AbortController()
      this.activeRequests.set(existingKey, abortController)

      const timeoutId = setTimeout(() => {
        console.warn(`AssessmentService.saveAssessment: Request for ${existingKey} timed out. Aborting.`)
        abortController.abort()
        this.activeRequests.delete(existingKey)
      }, 15000)

      try {
        let result: AssessmentResult

        if (categoryId === "basic") {
          result = this.calculateBasicAssessmentResult(answers)
        } else if (aiAnalysis) {
          result = {
            categoryId,
            totalScore: aiAnalysis.score,
            maxScore: 100,
            percentage: aiAnalysis.score,
            riskLevel: aiAnalysis.riskLevel,
            riskFactors: aiAnalysis.riskFactors || [],
            recommendations: aiAnalysis.recommendations || [],
          }
        } else {
          throw new Error("AI analysis required for non-basic assessments")
        }

        const { data: recentAssessments } = await this.supabase
          .from("assessments")
          .select("id, completed_at")
          .eq("user_id", userId)
          .eq("category_id", categoryId)
          .gte("completed_at", new Date(Date.now() - 30 * 1000).toISOString())
          .order("completed_at", { ascending: false })
          .limit(1)

        if (recentAssessments && recentAssessments.length > 0) {
          console.log("AssessmentService.saveAssessment: Found recent duplicate, returning existing assessment.")
          clearTimeout(timeoutId)
          this.activeRequests.delete(existingKey)
          return { data: recentAssessments[0], error: null }
        }

        const assessmentData = {
          user_id: userId,
          category_id: categoryId,
          category_title: categoryTitle,
          answers: answers,
          total_score: Math.round(result.totalScore),
          max_score: Math.round(result.maxScore),
          percentage: Math.round(result.percentage),
          risk_level: result.riskLevel,
          risk_factors: result.riskFactors || [],
          recommendations: result.recommendations || [],
          completed_at: new Date().toISOString(),
        }

        console.log("AssessmentService.saveAssessment: Inserting data to Supabase:", assessmentData)
        const { data: insertedData, error } = await this.supabase
          .from("assessments")
          .insert(assessmentData)
          .select()
          .single()

        clearTimeout(timeoutId)
        this.activeRequests.delete(existingKey)

        if (error) {
          console.error("AssessmentService.saveAssessment: Supabase insert error:", error)
          if (error.code === "23505") {
            return { data: null, error: "Assessment already exists for this category" }
          }

          if (error.message.includes("JSON")) {
            console.warn(
              "AssessmentService.saveAssessment: JSON error detected, attempting retry with stringified answers.",
            )
            const retryData = {
              ...assessmentData,
              answers: JSON.stringify(answers),
            }

            const { data: retryResult, error: retryError } = await this.supabase
              .from("assessments")
              .insert(retryData)
              .select()
              .single()

            if (retryError) {
              console.error("AssessmentService.saveAssessment: Database retry failed:", retryError)
              throw new Error(`Database retry failed: ${retryError.message}`)
            }
            console.log("AssessmentService.saveAssessment: Database retry successful.")
            return { data: retryResult, error: null }
          }

          throw new Error(`Database error: ${error.message}`)
        }

        if (!insertedData) {
          console.error("AssessmentService.saveAssessment: No data returned from insert operation.")
          throw new Error("No data returned from insert operation")
        }

        console.log("AssessmentService.saveAssessment: Insert successful, insertedData:", insertedData)

        this.logAudit(userId, "assessment_completed", "assessments", insertedData.id, {
          category_id: categoryId,
          score: result.percentage,
          risk_level: result.riskLevel,
          ai_analysis: categoryId !== "basic",
        }).catch((err) => {
          console.error("AssessmentService.saveAssessment: Audit log failed:", err)
        })

        return { data: insertedData, error: null }
      } catch (operationError) {
        console.error("AssessmentService.saveAssessment: Caught operation error:", operationError)
        clearTimeout(timeoutId)
        this.activeRequests.delete(existingKey)
        throw operationError
      }
    } catch (error) {
      const existingKey = `save-${userId}-${categoryId}`
      this.activeRequests.delete(existingKey)

      console.error("AssessmentService.saveAssessment: Caught error in outer try-catch:", error)

      if (error instanceof Error && error.name === "AbortError") {
        return { data: null, error: "การบันทึกถูกยกเลิกเนื่องจากใช้เวลานานเกินไป" }
      }

      let errorMessage = "เกิดข้อผิดพลาดในการบันทึก"

      if (error instanceof Error) {
        if (error.message.includes("AssessmentServiceError: Answers array is invalid or empty.")) {
          errorMessage = "assessment.no_answers_found"
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต"
        } else if (error.message.includes("authentication") || error.message.includes("unauthorized")) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่"
        } else if (error.message.includes("already exists")) {
          errorMessage = "ข้อมูลนี้ถูกบันทึกไปแล้ว"
        } else {
          errorMessage = error.message
        }
      } else if (typeof error === "string") {
        errorMessage = error
      }

      return { data: null, error: errorMessage }
    }
  }

  // NEW: Function to get the latest assessment for a specific user and category
  static async getLatestAssessmentForUserAndCategory(
    userId: string,
    categoryId: string,
  ): Promise<{ data: any; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error("Database connection not available")
      }
      console.log(
        `AssessmentService.getLatestAssessmentForUserAndCategory: Fetching latest for user ${userId}, category ${categoryId}`,
      )
      const { data, error } = await this.supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single() // Use single() to get one record or null

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows found"
        console.error("AssessmentService.getLatestAssessmentForUserAndCategory: Supabase error:", error)
        throw error
      }

      if (!data) {
        console.log(
          `AssessmentService.getLatestAssessmentForUserAndCategory: No latest assessment found for user ${userId}, category ${categoryId}`,
        )
      } else {
        console.log(`AssessmentService.getLatestAssessmentForUserAndCategory: Found latest assessment:`, data.id)
      }

      return { data, error: null }
    } catch (error) {
      console.error("AssessmentService.getLatestAssessmentForUserAndCategory: Caught error:", error)
      return { data: null, error: (error as Error).message || "Failed to retrieve latest assessment." }
    }
  }

  static async getUserAssessments(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await this.supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }

  static async getLatestUserAssessments(userId: string): Promise<{ data: any[]; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await this.supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) throw error

      const latestByCategory = new Map()
      const allAssessments = data || []

      allAssessments.forEach((assessment) => {
        const categoryId = assessment.category_id
        const currentLatest = latestByCategory.get(categoryId)

        if (!currentLatest || new Date(assessment.completed_at) > new Date(currentLatest.completed_at)) {
          latestByCategory.set(categoryId, assessment)
        }
      })

      const latestAssessments = Array.from(latestByCategory.values())
      return { data: latestAssessments, error: null }
    } catch (error) {
      return { data: [], error }
    }
  }

  static async getAssessmentById(assessmentId: string): Promise<{ data: any; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await this.supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private static calculateBasicAssessmentResult(answers: AssessmentAnswer[]): AssessmentResult {
    const category = AssessmentService.getCategory("basic")
    if (!category) throw new Error("Basic category not found")

    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
    const maxScore = answers.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    let riskLevel: "low" | "medium" | "high" | "very-high"
    if (percentage < 30) riskLevel = "low"
    else if (percentage < 50) riskLevel = "medium"
    else if (percentage < 70) riskLevel = "high"
    else riskLevel = "very-high"

    const riskFactors: string[] = []
    const recommendations: string[] = []

    answers.forEach((answer) => {
      const question = category.questions.find((q) => q.id === answer.questionId)
      if (!question) return

      if (question.id === "basic-3" || question.id === "basic-4") {
        const weightAnswer = answers.find((a) => a.questionId === "basic-3")
        const heightAnswer = answers.find((a) => a.questionId === "basic-4")

        if (weightAnswer && heightAnswer) {
          const weight = Number(weightAnswer.answer)
          const height = Number(heightAnswer.answer) / 100
          const bmi = weight / (height * height)

          if (bmi < 18.5) {
            riskFactors.push("น้ำหนักต่ำกว่าเกณฑ์")
            recommendations.push("ควรเพิ่มน้ำหนักให้อยู่ในเกณฑ์ปกติ")
          } else if (bmi >= 25) {
            riskFactors.push("น้ำหนักเกินหรือโรคอ้วน")
            recommendations.push("ควรลดน้ำหนักและออกกำลังกายสม่ำเสมอ")
          }
        }
      }

      if (question.id === "basic-6" && Array.isArray(answer.answer)) {
        const diseases = answer.answer as string[]
        diseases.forEach((disease) => {
          if (disease !== "ไม่มีโรคประจำตัว") {
            riskFactors.push(disease)
            if (disease === "เบาหวาน") {
              recommendations.push("ควบคุมระดับน้ำตาลในเลือดอย่างสม่ำเสมอ")
            } else if (disease === "ความดันโลหิตสูง") {
              recommendations.push("ตรวจวัดความดันโลหิตเป็นประจำ")
            }
          }
        })
      }

      if (question.id === "basic-7" && Array.isArray(answer.answer)) {
        const allergies = answer.answer as string[]
        allergies.forEach((allergy) => {
          if (allergy !== "ไม่มีการแพ้") {
            riskFactors.push(`แพ้: ${allergy}`)
          }
        })
      }
    })

    if (riskFactors.length === 0) {
      recommendations.push("ข้อมูลสุขภาพพื้นฐานของคุณอยู่ในเกณฑ์ปกติ")
      recommendations.push("ควรตรวจสุขภาพประจำปีเพื่อติดตามสุขภาพ")
    } else {
      recommendations.push("ควรปรึกษาแพทย์เพื่อรับคำแนะนำเฉพาะบุคคล")
      recommendations.push("นำข้อมูลนี้ไปแสดงแพทย์เมื่อไปรับการรักษา")
    }

    return {
      categoryId: "basic",
      totalScore,
      maxScore,
      percentage,
      riskLevel,
      riskFactors,
      recommendations,
    }
  }

  private static async logAudit(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details: any,
  ) {
    try {
      if (!this.supabase) return

      await this.supabase.from("audit_logs").insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        user_agent: typeof window !== "undefined" ? navigator.userAgent : null,
      })
    } catch (error) {
      console.error("AssessmentService.logAudit: Failed to log audit:", error)
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      if (!this.supabase) return false

      const { data, error } = await this.supabase.from("profiles").select("id").limit(1)
      return !error
    } catch (error) {
      console.error("AssessmentService.testConnection: Failed to test connection:", error)
      return false
    }
  }

  static cleanup() {
    console.log("AssessmentService.cleanup: Aborting all active requests.")
    this.activeRequests.forEach((controller, key) => {
      controller.abort()
    })
    this.activeRequests.clear()
  }
}
