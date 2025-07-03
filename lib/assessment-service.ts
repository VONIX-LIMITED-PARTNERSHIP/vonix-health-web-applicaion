import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export class AssessmentService {
  static async saveAssessment(
    supabase: SupabaseClient<Database>,
    assessmentData: {
      user_id: string
      category_id: string
      category_title_th: string
      category_title_en: string
      total_score: number
      max_score: number
      percentage: number
      risk_level: string
      risk_factors_th: string[]
      risk_factors_en: string[]
      recommendations_th: string[]
      recommendations_en: string[]
      summary_th: string
      summary_en: string
      answers: any[]
    },
  ) {
    console.log("💾 AssessmentService: Saving assessment...")
    console.log("📊 Data to save:", assessmentData)

    try {
      const { data, error } = await supabase.from("assessments").insert(assessmentData).select().single()

      if (error) {
        console.error("❌ AssessmentService: Save error:", error)
        return { data: null, error: error.message }
      }

      console.log("✅ AssessmentService: Assessment saved successfully")
      console.log("📋 Saved assessment:", data)
      return { data, error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected save error:", error)
      return { data: null, error: error.message }
    }
  }

  static async getAssessmentById(supabase: SupabaseClient<Database>, assessmentId: string) {
    console.log("🔍 AssessmentService: Getting assessment by ID:", assessmentId)

    try {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) {
        console.error("❌ AssessmentService: Get by ID error:", error)
        return { data: null, error: error.message }
      }

      console.log("✅ AssessmentService: Assessment found by ID")
      console.log("📋 Assessment data:", data)
      return { data, error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected get by ID error:", error)
      return { data: null, error: error.message }
    }
  }

  static async getLatestAssessmentForUserAndCategory(
    supabase: SupabaseClient<Database>,
    userId: string,
    categoryId: string,
  ) {
    console.log("🔍 AssessmentService: Getting latest assessment for user and category")
    console.log("👤 User ID:", userId)
    console.log("📂 Category ID:", categoryId)

    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("❌ AssessmentService: Get latest error:", error)
        return { data: null, error: error.message }
      }

      console.log("✅ AssessmentService: Latest assessment found")
      console.log("📋 Assessment data:", data)
      return { data, error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected get latest error:", error)
      return { data: null, error: error.message }
    }
  }

  static async getUserAssessments(supabase: SupabaseClient<Database>, userId: string) {
    console.log("🔍 AssessmentService: Getting all assessments for user:", userId)

    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ AssessmentService: Get user assessments error:", error)
        return { data: null, error: error.message }
      }

      console.log("✅ AssessmentService: User assessments found:", data?.length || 0)
      return { data, error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected get user assessments error:", error)
      return { data: null, error: error.message }
    }
  }

  static async deleteAssessment(supabase: SupabaseClient<Database>, assessmentId: string) {
    console.log("🗑️ AssessmentService: Deleting assessment:", assessmentId)

    try {
      const { error } = await supabase.from("assessments").delete().eq("id", assessmentId)

      if (error) {
        console.error("❌ AssessmentService: Delete error:", error)
        return { error: error.message }
      }

      console.log("✅ AssessmentService: Assessment deleted successfully")
      return { error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected delete error:", error)
      return { error: error.message }
    }
  }

  static async deleteAllUserAssessments(supabase: SupabaseClient<Database>, userId: string) {
    console.log("🗑️ AssessmentService: Deleting all assessments for user:", userId)

    try {
      const { error } = await supabase.from("assessments").delete().eq("user_id", userId)

      if (error) {
        console.error("❌ AssessmentService: Delete all error:", error)
        return { error: error.message }
      }

      console.log("✅ AssessmentService: All user assessments deleted successfully")
      return { error: null }
    } catch (error: any) {
      console.error("❌ AssessmentService: Unexpected delete all error:", error)
      return { error: error.message }
    }
  }
}
