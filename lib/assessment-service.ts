import type { AssessmentAnswer, AssessmentResult, AIAnalysisResult, BilingualArray } from "@/types/assessment"
import { assessmentCategories } from "@/data/assessment-questions"
import type { SupabaseClient } from "@supabase/supabase-js"

export class AssessmentService {
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
    supabaseClient: SupabaseClient,
    userId: string,
    categoryId: string,
    categoryTitle: string,
    answers: AssessmentAnswer[],
    aiAnalysis?: AIAnalysisResult,
  ): Promise<{ data: any; error: any }> {
    try {
      // Do not save guest assessments to the database
      if (categoryId === "guest-assessment") {
        console.warn("Skipping database save for guest assessment.")
        return { data: { id: "guest-assessment-completed" }, error: null } // Return a dummy success
      }

      if (!userId) {
        throw new Error("User not authenticated")
      }

      if (!Array.isArray(answers) || answers.length === 0) {
        throw new Error("Invalid answers array")
      }

      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      // คำนวณผลลัพธ์
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
          riskFactors: aiAnalysis.riskFactors,
          recommendations: aiAnalysis.recommendations,
          summary: aiAnalysis.summary,
        }
      } else {
        // This error should ideally not be hit if logic in AssessmentForm is correct
        throw new Error("AI analysis required for non-basic assessments")
      }

      // Convert bilingual data to simple arrays for database compatibility
      let riskFactorsForDb: string[] = []
      let recommendationsForDb: string[] = []

      if (result.riskFactors) {
        if (Array.isArray(result.riskFactors)) {
          riskFactorsForDb = result.riskFactors
        } else if (typeof result.riskFactors === "object" && result.riskFactors.th) {
          riskFactorsForDb = result.riskFactors.th
        }
      }

      if (result.recommendations) {
        if (Array.isArray(result.recommendations)) {
          recommendationsForDb = result.recommendations
        } else if (typeof result.recommendations === "object" && result.recommendations.th) {
          recommendationsForDb = result.recommendations.th
        }
      }

      // เตรียมข้อมูลสำหรับบันทึก - ใช้ JSONB arrays โดยตรง
      const assessmentData = {
        user_id: userId,
        category_id: categoryId,
        category_title: categoryTitle,
        answers: answers, // Supabase will handle JSONB conversion
        total_score: Math.round(result.totalScore),
        max_score: Math.round(result.percentage), // Use percentage as total score for consistency with AI analysis
        percentage: Math.round(result.percentage),
        risk_level: result.riskLevel,
        risk_factors: riskFactorsForDb, // Direct array, Supabase handles JSONB
        recommendations: recommendationsForDb, // Direct array, Supabase handles JSONB
        completed_at: new Date().toISOString(),
        ai_analysis: aiAnalysis || null, // Store full bilingual data
      }

      const { data: insertedData, error } = await supabaseClient
        .from("assessments")
        .insert(assessmentData)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      if (!insertedData) {
        throw new Error("No data returned from insert operation")
      }

      return { data: insertedData, error: null }
    } catch (error) {
      let errorMessage = "เกิดข้อผิดพลาดในการบันทึก"

      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต"
        } else if (error.message.includes("authentication") || error.message.includes("unauthorized")) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่"
        } else {
          errorMessage = error.message
        }
      }

      return { data: null, error: errorMessage }
    }
  }

  static async getLatestAssessmentForUserAndCategory(
    supabaseClient: SupabaseClient,
    userId: string,
    categoryId: string,
  ): Promise<{ data: any; error: any }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await supabaseClient
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (!data) {
        return { data: null, error: null }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message || "Failed to retrieve latest assessment" }
    }
  }

  static async getAssessmentById(
    supabaseClient: SupabaseClient,
    assessmentId: string,
    userId: string, // Add userId parameter
  ): Promise<{ data: any; error: any }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }
      if (!userId) {
        throw new Error("User ID is required for fetching assessment by ID.")
      }

      const { data, error } = await supabaseClient
        .from("assessments")
        .select("*")
        .eq("id", assessmentId)
        .eq("user_id", userId) // Crucial: Filter by user_id
        .single()

      if (error) {
        // If error.code is 'PGRST116' (No rows found), it means no assessment for this ID and user
        if (error.code === "PGRST116") {
          return { data: null, error: "Assessment not found or you do not have permission to view it." }
        }
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message || "Failed to retrieve assessment" }
    }
  }

  static async getUserAssessments(
    supabaseClient: SupabaseClient,
    userId: string,
  ): Promise<{ data: any[]; error: any }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await supabaseClient
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

  static async getLatestUserAssessments(
    supabaseClient: SupabaseClient,
    userId: string,
  ): Promise<{ data: any[]; error: any }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      const { data, error } = await supabaseClient
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

    // Return bilingual format for consistency
    const bilingualRiskFactors: BilingualArray = {
      th: riskFactors,
      en: riskFactors, // For basic assessment, we'll use the same for both languages
    }

    const bilingualRecommendations: BilingualArray = {
      th: recommendations,
      en: recommendations, // For basic assessment, we'll use the same for both languages
    }

    return {
      categoryId: "basic",
      totalScore,
      maxScore,
      percentage,
      riskLevel,
      riskFactors: bilingualRiskFactors,
      recommendations: bilingualRecommendations,
    }
  }

  static async testConnection(supabaseClient: SupabaseClient): Promise<boolean> {
    try {
      if (!supabaseClient) return false

      const { data, error } = await supabaseClient.from("profiles").select("id").limit(1)
      return !error
    } catch (error) {
      return false
    }
  }

  static cleanup() {
    this.activeRequests.forEach((controller, key) => {
      controller.abort()
    })
    this.activeRequests.clear()
  }
}
