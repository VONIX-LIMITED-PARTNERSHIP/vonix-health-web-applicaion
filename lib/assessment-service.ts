import type { SupabaseClient } from "@supabase/supabase-js"
import type { AssessmentAnswer } from "@/types/assessment"

export class AssessmentService {
  static async analyzeAssessment(answers: AssessmentAnswer[], categoryId: string, language = "th") {
    console.log("🔍 AssessmentService: Starting analysis...")
    console.log("🔍 AssessmentService: Language:", language)
    console.log("🔍 AssessmentService: Category:", categoryId)
    console.log("🔍 AssessmentService: Answers count:", answers.length)

    try {
      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          categoryId,
          language, // Make sure language is sent
        }),
      })

      console.log("🔍 AssessmentService: API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ AssessmentService: API error:", errorData)
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      console.log("✅ AssessmentService: Analysis completed successfully")

      return {
        success: true,
        analysis: data.analysis,
      }
    } catch (error) {
      console.error("❌ AssessmentService: Analysis error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async saveAssessment(
    supabase: SupabaseClient,
    userId: string,
    categoryId: string,
    answers: AssessmentAnswer[],
    analysis: any,
    language = "th",
  ) {
    console.log("💾 AssessmentService: Saving assessment...")
    console.log("💾 AssessmentService: User ID:", userId)
    console.log("💾 AssessmentService: Category:", categoryId)
    console.log("💾 AssessmentService: Language:", language)

    try {
      // Calculate scores
      const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
      const maxScore = answers.length * 5 // Assuming max score per question is 5
      const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

      // Prepare assessment data
      const assessmentData = {
        user_id: userId,
        category_id: categoryId,
        answers: answers,
        total_score: totalScore,
        max_score: maxScore,
        percentage: percentage,
        risk_level: analysis.riskLevel || "medium",
        risk_factors: analysis.riskFactors || [],
        recommendations: analysis.recommendations || [],
        ai_summary: analysis.summary || "",
        language: language, // Save language
        completed_at: new Date().toISOString(),
      }

      console.log("💾 AssessmentService: Assessment data prepared")

      const { data, error } = await supabase.from("assessments").insert([assessmentData]).select().single()

      if (error) {
        console.error("❌ AssessmentService: Save error:", error)
        throw error
      }

      console.log("✅ AssessmentService: Assessment saved successfully")
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Save assessment error:", error)
      return { data: null, error }
    }
  }

  static async getLatestAssessmentForUserAndCategory(supabase: SupabaseClient, userId: string, categoryId: string) {
    console.log("🔍 AssessmentService: Getting latest assessment...")
    console.log("🔍 AssessmentService: User ID:", userId)
    console.log("🔍 AssessmentService: Category:", categoryId)

    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("❌ AssessmentService: Get assessment error:", error)
        throw error
      }

      console.log("✅ AssessmentService: Latest assessment retrieved")
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get latest assessment error:", error)
      return { data: null, error }
    }
  }

  static async getAssessmentById(supabase: SupabaseClient, assessmentId: string) {
    console.log("🔍 AssessmentService: Getting assessment by ID:", assessmentId)

    try {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) {
        console.error("❌ AssessmentService: Get assessment by ID error:", error)
        throw error
      }

      console.log("✅ AssessmentService: Assessment retrieved by ID")
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get assessment by ID error:", error)
      return { data: null, error }
    }
  }

  static async getAllAssessmentsForUser(supabase: SupabaseClient, userId: string) {
    console.log("🔍 AssessmentService: Getting all assessments for user:", userId)

    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) {
        console.error("❌ AssessmentService: Get all assessments error:", error)
        throw error
      }

      console.log("✅ AssessmentService: All assessments retrieved")
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Get all assessments error:", error)
      return { data: null, error }
    }
  }

  static async deleteAllAssessmentsForUser(supabase: SupabaseClient, userId: string) {
    console.log("🗑️ AssessmentService: Deleting all assessments for user:", userId)

    try {
      const { error } = await supabase.from("assessments").delete().eq("user_id", userId)

      if (error) {
        console.error("❌ AssessmentService: Delete all assessments error:", error)
        throw error
      }

      console.log("✅ AssessmentService: All assessments deleted")
      return { error: null }
    } catch (error) {
      console.error("❌ AssessmentService: Delete all assessments error:", error)
      return { error }
    }
  }
}
