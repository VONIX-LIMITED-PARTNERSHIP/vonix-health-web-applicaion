import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { createClientComponentClient } from "@/lib/supabase"
import { assessmentCategories } from "@/data/assessment-questions"

export class AssessmentService {
  private static supabase = createClientComponentClient()
  private static activeRequests = new Map<string, AbortController>()

  static async analyzeWithAI(categoryId: string, answers: AssessmentAnswer[]): Promise<{ data: any; error: any }> {
    try {
      const category = assessmentCategories.find((cat) => cat.id === categoryId)
      if (!category) {
        throw new Error("Category not found")
      }

      // Add question text to answers for better AI analysis
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

    try {
      // Validate inputs first
      if (!userId) {
        throw new Error("User not authenticated")
      }

      if (!answers || answers.length === 0) {
        throw new Error("No answers provided")
      }

      if (!this.supabase) {
        throw new Error("Database connection not available")
      }

      // Cancel any existing request for this user/category
      const existingKey = `save-${userId}-${categoryId}`
      const existingController = this.activeRequests.get(existingKey)
      if (existingController) {
        existingController.abort()
        this.activeRequests.delete(existingKey)
      }

      // Create new AbortController with timeout
      const abortController = new AbortController()
      this.activeRequests.set(existingKey, abortController)

      // Set timeout for the entire operation (15 seconds)
      const timeoutId = setTimeout(() => {
        abortController.abort()
        this.activeRequests.delete(existingKey)
      }, 15000)

      try {
        // Calculate result
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

        // Check for recent duplicate (last 30 seconds)
        const { data: recentAssessments } = await this.supabase
          .from("assessments")
          .select("id, completed_at")
          .eq("user_id", userId)
          .eq("category_id", categoryId)
          .gte("completed_at", new Date(Date.now() - 30 * 1000).toISOString())
          .order("completed_at", { ascending: false })
          .limit(1)

        if (recentAssessments && recentAssessments.length > 0) {
          clearTimeout(timeoutId)
          this.activeRequests.delete(existingKey)
          return { data: recentAssessments[0], error: null }
        }

        // Prepare data for database
        const assessmentData = {
          user_id: userId,
          category_id: categoryId,
          category_title: categoryTitle,
          answers: answers, // Let Supabase handle JSONB conversion
          total_score: Math.round(result.totalScore),
          max_score: Math.round(result.maxScore),
          percentage: Math.round(result.percentage),
          risk_level: result.riskLevel,
          risk_factors: result.riskFactors || [],
          recommendations: result.recommendations || [],
          completed_at: new Date().toISOString(),
        }

        // Insert with proper error handling
        const { data: insertedData, error } = await this.supabase
          .from("assessments")
          .insert(assessmentData)
          .select()
          .single()

        // Clear timeout since we got a response
        clearTimeout(timeoutId)
        this.activeRequests.delete(existingKey)

        if (error) {
          // Handle specific error cases
          if (error.code === "23505") {
            // Unique constraint violation
            return { data: null, error: "Assessment already exists for this category" }
          }

          if (error.message.includes("JSON")) {
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
              throw new Error(`Database retry failed: ${retryError.message}`)
            }

            return { data: retryResult, error: null }
          }

          throw new Error(`Database error: ${error.message}`)
        }

        if (!insertedData) {
          throw new Error("No data returned from insert operation")
        }

        // Log audit (non-blocking)
        this.logAudit(userId, "assessment_completed", "assessments", insertedData.id, {
          category_id: categoryId,
          score: result.percentage,
          risk_level: result.riskLevel,
          ai_analysis: categoryId !== "basic",
        }).catch((err) => {})

        return { data: insertedData, error: null }
      } catch (operationError) {
        // Clear timeout and cleanup
        clearTimeout(timeoutId)
        this.activeRequests.delete(existingKey)
        throw operationError
      }
    } catch (error) {
      // Clean up any remaining requests
      const existingKey = `save-${userId}-${categoryId}`
      this.activeRequests.delete(existingKey)

      if (error instanceof Error && error.name === "AbortError") {
        return { data: null, error: "การบันทึกถูกยกเลิกเนื่องจากใช้เวลานานเกินไป" }
      }

      let errorMessage = "เกิดข้อผิดพลาดในการบันทึก"

      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต"
        } else if (error.message.includes("authentication") || error.message.includes("unauthorized")) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่"
        } else if (error.message.includes("already exists")) {
          errorMessage = "ข้อมูลนี้ถูกบันทึกไปแล้ว"
        } else {
          errorMessage = error.message
        }
      }

      return { data: null, error: errorMessage }
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

      // Filter to get only the latest assessment for each category
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
    const category = assessmentCategories.find((cat) => cat.id === "basic")
    if (!category) throw new Error("Basic category not found")

    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
    const maxScore = answers.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" | "very-high"
    if (percentage < 30) riskLevel = "low"
    else if (percentage < 50) riskLevel = "medium"
    else if (percentage < 70) riskLevel = "high"
    else riskLevel = "very-high"

    // Extract risk factors and recommendations based on answers
    const riskFactors: string[] = []
    const recommendations: string[] = []

    // Analyze specific answers for basic health data
    answers.forEach((answer) => {
      const question = category.questions.find((q) => q.id === answer.questionId)
      if (!question) return

      // BMI calculation and risk assessment
      if (question.id === "basic-3" || question.id === "basic-4") {
        const weightAnswer = answers.find((a) => a.questionId === "basic-3")
        const heightAnswer = answers.find((a) => a.questionId === "basic-4")

        if (weightAnswer && heightAnswer) {
          const weight = Number(weightAnswer.answer)
          const height = Number(heightAnswer.answer) / 100 // convert cm to m
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

      // Chronic diseases
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

      // Drug allergies
      if (question.id === "basic-7" && Array.isArray(answer.answer)) {
        const allergies = answer.answer as string[]
        allergies.forEach((allergy) => {
          if (allergy !== "ไม่มีการแพ้") {
            riskFactors.push(`แพ้: ${allergy}`)
          }
        })
      }
    })

    // General recommendations
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
    } catch (error) {}
  }

  static async testConnection(): Promise<boolean> {
    try {
      if (!this.supabase) return false

      const { data, error } = await this.supabase.from("profiles").select("id").limit(1)
      return !error
    } catch (error) {
      return false
    }
  }

  // Clean up method to cancel all pending requests
  static cleanup() {
    console.log("🧹 Cleaning up pending requests...")
    this.activeRequests.forEach((controller, key) => {
      controller.abort()
    })
    this.activeRequests.clear()
  }
}
