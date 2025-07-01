import { createServerClient } from "@/lib/supabase-server"
import type { AssessmentAnswer } from "@/types/assessment"
import type { Database } from "@/types/database"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]
type AssessmentInsert = Database["public"]["Tables"]["assessments"]["Insert"]

export interface BilingualAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"

  // Thai language results
  riskFactors: string[]
  recommendations: string[]
  summary: string

  // English language results
  riskFactorsEn: string[]
  recommendationsEn: string[]
  summaryEn: string
}

export interface SaveAssessmentParams {
  userId: string
  categoryId: string
  categoryTitle: string
  categoryTitleEn?: string
  answers: AssessmentAnswer[]
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  language: "th" | "en"

  // Thai language results
  riskFactors: string[]
  recommendations: string[]
  summary: string

  // English language results
  riskFactorsEn: string[]
  recommendationsEn: string[]
  summaryEn: string
}

export class AssessmentService {
  private supabase

  constructor() {
    this.supabase = createServerClient()
  }

  async saveAssessment(
    params: SaveAssessmentParams,
  ): Promise<{ success: boolean; error?: string; data?: AssessmentRow }> {
    try {
      console.log("💾 Saving bilingual assessment to database...")

      const assessmentData: AssessmentInsert = {
        user_id: params.userId,
        category_id: params.categoryId,
        category_title: params.categoryTitle,
        category_title_en: params.categoryTitleEn || null,
        answers: params.answers as any,
        total_score: params.totalScore,
        max_score: params.maxScore,
        percentage: params.percentage,
        risk_level: params.riskLevel,
        language: params.language,

        // Thai language fields
        risk_factors: params.riskFactors,
        recommendations: params.recommendations,
        summary: params.summary,

        // English language fields
        risk_factors_en: params.riskFactorsEn,
        recommendations_en: params.recommendationsEn,
        summary_en: params.summaryEn,
      }

      const { data, error } = await this.supabase.from("assessments").insert(assessmentData).select().single()

      if (error) {
        console.error("❌ Database save error:", error)
        return { success: false, error: error.message }
      }

      console.log("✅ Bilingual assessment saved successfully")
      return { success: true, data }
    } catch (error) {
      console.error("❌ Assessment service error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getAssessmentsByUser(userId: string): Promise<{ success: boolean; data?: AssessmentRow[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching assessments:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("❌ Assessment service error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getAssessmentById(id: string): Promise<{ success: boolean; data?: AssessmentRow; error?: string }> {
    try {
      const { data, error } = await this.supabase.from("assessments").select("*").eq("id", id).single()

      if (error) {
        console.error("❌ Error fetching assessment:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error("❌ Assessment service error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async deleteAssessment(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from("assessments").delete().eq("id", id).eq("user_id", userId)

      if (error) {
        console.error("❌ Error deleting assessment:", error)
        return { success: false, error: error.message }
      }

      console.log("✅ Assessment deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("❌ Assessment service error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async deleteAllAssessments(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from("assessments").delete().eq("user_id", userId)

      if (error) {
        console.error("❌ Error deleting all assessments:", error)
        return { success: false, error: error.message }
      }

      console.log("✅ All assessments deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("❌ Assessment service error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  // Helper method to get localized content from assessment
  getLocalizedAssessmentContent(assessment: AssessmentRow, language: "th" | "en") {
    return {
      categoryTitle:
        language === "en" ? assessment.category_title_en || assessment.category_title : assessment.category_title,
      riskFactors: language === "en" ? assessment.risk_factors_en || assessment.risk_factors : assessment.risk_factors,
      recommendations:
        language === "en" ? assessment.recommendations_en || assessment.recommendations : assessment.recommendations,
      summary: language === "en" ? assessment.summary_en || assessment.summary : assessment.summary,
    }
  }
}

export const assessmentService = new AssessmentService()
