import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { assessmentCategories } from "@/data/assessment-questions"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]
type AssessmentInsert = Database["public"]["Tables"]["assessments"]["Insert"]

interface BilingualAnalysis {
  th: {
    riskLevel: string
    riskFactors: string[]
    recommendations: string[]
    summary: string
  }
  en: {
    riskLevel: string
    riskFactors: string[]
    recommendations: string[]
    summary: string
  }
}

export class AssessmentService {
  private static activeRequests = new Map<string, AbortController>()

  static get assessmentCategories() {
    return assessmentCategories
  }

  static getCategory(categoryId: string) {
    return assessmentCategories.find((cat) => cat.id === categoryId)
  }

  /**
   * Analyze assessment with AI (bilingual)
   */
  static async analyzeWithAI(
    categoryId: string,
    answers: AssessmentAnswer[],
  ): Promise<{ data: BilingualAnalysis | null; error: Error | null }> {
    try {
      console.log("🚀 AssessmentService: Starting AI analysis...")

      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          answers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      console.log("✅ AssessmentService: AI analysis completed")
      return { data: result.data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: AI analysis failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  /**
   * Save assessment to database with bilingual results
   */
  static async saveAssessment(
    supabase: SupabaseClient<Database>,
    userId: string,
    categoryId: string,
    categoryTitle: string,
    answers: AssessmentAnswer[],
    bilingualAnalysis: BilingualAnalysis | null,
  ): Promise<{ data: AssessmentRow | null; error: string | null }> {
    try {
      console.log("💾 AssessmentService: Saving assessment...")

      // Calculate basic risk level if no AI analysis
      let riskLevel = "low"
      if (!bilingualAnalysis) {
        const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
        const maxScore = answers.length * 5 // Assuming max score per question is 5
        const percentage = (totalScore / maxScore) * 100

        if (percentage >= 75) riskLevel = "critical"
        else if (percentage >= 50) riskLevel = "high"
        else if (percentage >= 25) riskLevel = "moderate"
        else riskLevel = "low"
      } else {
        riskLevel = bilingualAnalysis.th.riskLevel
      }

      // Prepare assessment data
      const assessmentData: AssessmentInsert = {
        user_id: userId,
        category_id: categoryId,
        category_title: categoryTitle,
        answers: answers as any,
        risk_level: riskLevel,
        risk_factors: bilingualAnalysis?.th.riskFactors || [],
        recommendations: bilingualAnalysis?.th.recommendations || [],
        summary: bilingualAnalysis?.th.summary || null,
        summary_en: bilingualAnalysis?.en.summary || null,
        risk_factors_en: bilingualAnalysis?.en.riskFactors || null,
        recommendations_en: bilingualAnalysis?.en.recommendations || null,
        language: "th", // Default language
      }

      // Insert into database
      const { data, error } = await supabase.from("assessments").insert(assessmentData).select().single()

      if (error) {
        console.error("❌ AssessmentService: Database save failed:", error)
        throw error
      }

      console.log("✅ AssessmentService: Assessment saved successfully")
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Save assessment failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to save assessment",
      }
    }
  }

  /**
   * Get assessment by ID
   */
  static async getAssessment(
    supabase: SupabaseClient<Database>,
    assessmentId: string,
  ): Promise<{ data: AssessmentRow | null; error: string | null }> {
    try {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get assessment failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to get assessment",
      }
    }
  }

  /**
   * Get user assessments
   */
  static async getUserAssessments(
    supabase: SupabaseClient<Database>,
    userId: string,
  ): Promise<{ data: AssessmentRow[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get user assessments failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to get assessments",
      }
    }
  }

  static async getLatestAssessmentForUserAndCategory(
    supabaseClient: SupabaseClient<Database>,
    userId: string,
    categoryId: string,
  ): Promise<{ data: AssessmentRow | null; error: string | null }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      console.log("🔍 AssessmentService: Fetching latest assessment for user:", userId, "category:", categoryId)

      const { data, error } = await supabaseClient
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("❌ AssessmentService: Supabase fetch error:", error)
        throw error
      }

      if (!data) {
        console.log("⚠️ AssessmentService: No assessment found for user and category")
        return { data: null, error: null }
      }

      console.log("✅ AssessmentService: Found latest assessment:", data.id)
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get latest assessment failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to retrieve latest assessment",
      }
    }
  }

  static async getAssessmentById(
    supabaseClient: SupabaseClient<Database>,
    assessmentId: string,
  ): Promise<{ data: AssessmentRow | null; error: string | null }> {
    try {
      if (!supabaseClient) {
        throw new Error("Database connection not available")
      }

      console.log("🔍 AssessmentService: Fetching assessment by ID:", assessmentId)

      const { data, error } = await supabaseClient.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) {
        console.error("❌ AssessmentService: Supabase fetch by ID error:", error)
        throw error
      }

      console.log("✅ AssessmentService: Found assessment by ID:", data.id)
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get assessment by ID failed:", error)
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to retrieve assessment",
      }
    }
  }

  static async getUserAssessments(
    supabaseClient: SupabaseClient<Database>,
    userId: string,
  ): Promise<{ data: AssessmentRow[] | null; error: string | null }> {
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
    supabaseClient: SupabaseClient<Database>,
    userId: string,
  ): Promise<{ data: AssessmentRow[] | null; error: string | null }> {
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

  private static calculateBasicAssessmentResult(answers: AssessmentAnswer[], language = "th"): AssessmentResult {
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
            riskFactors.push(language === "en" ? "Underweight" : "น้ำหนักต่ำกว่าเกณฑ์")
            recommendations.push(language === "en" ? "Should gain weight to normal range" : "ควรเพิ่มน้ำหนักให้อยู่ในเกณฑ์ปกติ")
          } else if (bmi >= 25) {
            riskFactors.push(language === "en" ? "Overweight or obesity" : "น้ำหนักเกินหรือโรคอ้วน")
            recommendations.push(
              language === "en" ? "Should lose weight and exercise regularly" : "ควรลดน้ำหนักและออกกำลังกายสม่ำเสมอ",
            )
          }
        }
      }

      if (question.id === "basic-6" && Array.isArray(answer.answer)) {
        const diseases = answer.answer as string[]
        diseases.forEach((disease) => {
          if (disease !== (language === "en" ? "No chronic diseases" : "ไม่มีโรคประจำตัว")) {
            riskFactors.push(disease)
            if (disease.includes("diabetes") || disease.includes("เบาหวาน")) {
              recommendations.push(
                language === "en" ? "Monitor blood sugar levels regularly" : "ควบคุมระดับน้ำตาลในเลือดอย่างสม่ำเสมอ",
              )
            } else if (disease.includes("hypertension") || disease.includes("ความดันโลหิตสูง")) {
              recommendations.push(language === "en" ? "Monitor blood pressure regularly" : "ตรวจวัดความดันโลหิตเป็นประจำ")
            }
          }
        })
      }

      if (question.id === "basic-7" && Array.isArray(answer.answer)) {
        const allergies = answer.answer as string[]
        allergies.forEach((allergy) => {
          if (allergy !== (language === "en" ? "No allergies" : "ไม่มีการแพ้")) {
            riskFactors.push(language === "en" ? `Allergic to: ${allergy}` : `แพ้: ${allergy}`)
          }
        })
      }
    })

    if (riskFactors.length === 0) {
      recommendations.push(
        language === "en" ? "Your basic health data is within normal limits" : "ข้อมูลสุขภาพพื้นฐานของคุณอยู่ในเกณฑ์ปกติ",
      )
      recommendations.push(
        language === "en" ? "Should have annual health checkups to monitor health" : "ควรตรวจสุขภาพประจำปีเพื่อติดตามสุขภาพ",
      )
    } else {
      recommendations.push(
        language === "en" ? "Should consult a doctor for personalized advice" : "ควรปรึกษาแพทย์เพื่อรับคำแนะนำเฉพาะบุคคล",
      )
      recommendations.push(
        language === "en"
          ? "Bring this information to show your doctor during treatment"
          : "นำข้อมูลนี้ไปแสดงแพทย์เมื่อไปรับการรักษา",
      )
    }

    return {
      categoryId: "basic",
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      riskLevel: "",
      riskFactors,
      recommendations,
    }
  }

  static async testConnection(supabaseClient: SupabaseClient<Database>): Promise<boolean> {
    try {
      if (!supabaseClient) return false

      const { data, error } = await supabaseClient.from("profiles").select("id").limit(1)
      return !error
    } catch (error) {
      console.error("AssessmentService.testConnection: Failed to test connection:", error)
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
