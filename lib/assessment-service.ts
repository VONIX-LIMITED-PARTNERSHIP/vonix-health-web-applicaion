import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { AssessmentCategory, AssessmentResult, DashboardStats } from "@/types/assessment"
import { getAssessmentCategories } from "@/data/assessment-questions"

const supabase = createClientComponentClient()

// This is a workaround to use useTranslation in a static class method.
let t: (key: string) => string = (key) => key // Default fallback

export const setServiceTranslation = (translateFn: (key: string) => string) => {
  t = translateFn
}

export class AssessmentService {
  static async saveAssessment(
    userId: string,
    category: AssessmentCategory,
    result: Omit<AssessmentResult, "id" | "completedAt" | "category">,
  ): Promise<{ data: AssessmentResult | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          user_id: userId,
          category_id: category.id,
          answers: result.answers,
          total_score: result.totalScore,
          max_score: result.maxScore,
          percentage: result.percentage,
          risk_level: result.riskLevel,
          ai_analysis: {
            riskFactors: result.riskFactors,
            recommendations: result.recommendations,
            summary: result.summary,
          },
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving assessment:", error)
        return { data: null, error: new Error(error.message) }
      }

      // Map the database response to AssessmentResult type
      const savedAssessment: AssessmentResult = {
        id: data.id,
        category: data.category_id,
        completedAt: data.completed_at,
        answers: data.answers,
        totalScore: data.total_score,
        maxScore: data.max_score,
        percentage: data.percentage,
        riskLevel: data.risk_level,
        riskFactors: data.ai_analysis?.riskFactors,
        recommendations: data.ai_analysis?.recommendations,
        summary: data.ai_analysis?.summary,
      }

      // Update dashboard stats after saving
      await AssessmentService.updateDashboardStats(userId)

      return { data: savedAssessment, error: null }
    } catch (err) {
      console.error("Unexpected error saving assessment:", err)
      return { data: null, error: err instanceof Error ? err : new Error("An unexpected error occurred") }
    }
  }

  static async getAssessmentById(
    assessmentId: string,
  ): Promise<{ data: AssessmentResult | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) {
        console.error("Error fetching assessment by ID:", error)
        return { data: null, error: new Error(error.message) }
      }

      if (!data) {
        return { data: null, error: new Error("Assessment not found") }
      }

      const assessment: AssessmentResult = {
        id: data.id,
        category: data.category_id,
        completedAt: data.completed_at,
        answers: data.answers,
        totalScore: data.total_score,
        maxScore: data.max_score,
        percentage: data.percentage,
        riskLevel: data.risk_level,
        riskFactors: data.ai_analysis?.riskFactors,
        recommendations: data.ai_analysis?.recommendations,
        summary: data.ai_analysis?.summary,
      }

      return { data: assessment, error: null }
    } catch (err) {
      console.error("Unexpected error getting assessment by ID:", err)
      return { data: null, error: err instanceof Error ? err : new Error("An unexpected error occurred") }
    }
  }

  static async getLatestAssessments(userId: string): Promise<{ data: AssessmentResult[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) {
        console.error("Error fetching latest assessments:", error)
        return { data: [], error: new Error(error.message) }
      }

      const assessments: AssessmentResult[] = data.map((item: any) => ({
        id: item.id,
        category: item.category_id,
        completedAt: item.completed_at,
        answers: item.answers,
        totalScore: item.total_score,
        maxScore: item.max_score,
        percentage: item.percentage,
        riskLevel: item.risk_level,
        riskFactors: item.ai_analysis?.riskFactors,
        recommendations: item.ai_analysis?.recommendations,
        summary: item.ai_analysis?.summary,
      }))

      return { data: assessments, error: null }
    } catch (err) {
      console.error("Unexpected error getting latest assessments:", err)
      return { data: [], error: err instanceof Error ? err : new Error("An unexpected error occurred") }
    }
  }

  static async updateDashboardStats(userId: string): Promise<{ data: DashboardStats | null; error: Error | null }> {
    try {
      const { data: allAssessments, error: assessmentsError } = await AssessmentService.getLatestAssessments(userId)

      if (assessmentsError) {
        return { data: null, error: assessmentsError }
      }

      const updatedStats: DashboardStats = {
        totalAssessments: allAssessments.length,
        lastAssessmentDate: allAssessments.length > 0 ? allAssessments[0].completedAt : null,
        riskLevels: {},
        overallRisk: "low", // Default to low, will be updated
        recommendations: [],
      }

      const riskOrder = ["low", "medium", "high", "very-high"]
      let overallHighestRisk: AssessmentResult["riskLevel"] = "low"

      allAssessments.forEach((item) => {
        updatedStats.riskLevels[item.category] = item.riskLevel
        if (riskOrder.indexOf(item.riskLevel) > riskOrder.indexOf(overallHighestRisk)) {
          overallHighestRisk = item.riskLevel
        }
      })
      updatedStats.overallRisk = overallHighestRisk

      updatedStats.recommendations = AssessmentService.generateRecommendations(allAssessments)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({ dashboard_stats: updatedStats })
        .eq("id", userId)
        .select()
        .single()

      if (profileError) {
        console.error("Error updating profile dashboard stats:", profileError)
        return { data: null, error: new Error(profileError.message) }
      }

      return { data: profileData.dashboard_stats, error: null }
    } catch (err) {
      console.error("Unexpected error updating dashboard stats:", err)
      return { data: null, error: err instanceof Error ? err : new Error("An unexpected error occurred") }
    }
  }

  static async getDashboardStats(userId: string): Promise<{ data: DashboardStats | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.from("profiles").select("dashboard_stats").eq("id", userId).single()

      if (error) {
        console.error("Error fetching dashboard stats:", error)
        return { data: null, error: new Error(error.message) }
      }

      return { data: data?.dashboard_stats || null, error: null }
    } catch (err) {
      console.error("Unexpected error getting dashboard stats:", err)
      return { data: null, error: err instanceof Error ? err : new Error("An unexpected error occurred") }
    }
  }

  private static generateRecommendations(results: AssessmentResult[]): string[] {
    const recommendations: string[] = []

    const highRiskCategories = results.filter((r) => r.riskLevel === "high" || r.riskLevel === "very-high")
    const mediumRiskCategories = results.filter((r) => r.riskLevel === "medium")

    if (highRiskCategories.length > 0) {
      recommendations.push(t("recommendation_consult_doctor"))
    }

    if (mediumRiskCategories.length > 0) {
      recommendations.push(t("recommendation_improve_behavior"))
    }

    const completedCategories = new Set(results.map((r) => r.category))
    const allCategories = getAssessmentCategories("en").map((cat) => cat.id) // Use a dummy locale
    if (completedCategories.size < allCategories.length) {
      recommendations.push(t("recommendation_complete_all_assessments"))
    }

    if (recommendations.length === 0) {
      recommendations.push(t("recommendation_maintain_health"))
    }

    return recommendations
  }
}
