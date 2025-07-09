import type { AssessmentCategory, AssessmentResult, DashboardStats } from "@/types/assessment"

// This is a workaround to use useTranslation in a static class method.
// In a real application, you might pass the `t` function as an argument
// or use a different translation approach for non-React contexts.
let t: (key: string) => string = (key) => key // Default fallback

// This function should be called once, e.g., in a root layout or provider,
// to set the translation function for the service.
export const setGuestServiceTranslation = (translateFn: (key: string) => string) => {
  t = translateFn
}

export class GuestAssessmentService {
  private static readonly STORAGE_KEY_PREFIX = "guest-assessment-"
  private static readonly DASHBOARD_STATS_KEY = "guest-dashboard-stats"

  static saveAssessment(category: AssessmentCategory, result: AssessmentResult) {
    try {
      const key = `${GuestAssessmentService.STORAGE_KEY_PREFIX}${category}`
      localStorage.setItem(key, JSON.stringify(result))
      GuestAssessmentService.updateDashboardStats(category, result)
    } catch (error) {
      console.error("Error saving guest assessment:", error)
    }
  }

  static getAssessment(category: AssessmentCategory): AssessmentResult | null {
    try {
      const key = `${GuestAssessmentService.STORAGE_KEY_PREFIX}${category}`
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error getting guest assessment:", error)
      return null
    }
  }

  static getLatestAssessments(): { category: AssessmentCategory; result: AssessmentResult }[] {
    try {
      const assessments: { category: AssessmentCategory; result: AssessmentResult }[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(GuestAssessmentService.STORAGE_KEY_PREFIX)) {
          const category = key.replace(GuestAssessmentService.STORAGE_KEY_PREFIX, "") as AssessmentCategory
          const result = GuestAssessmentService.getAssessment(category)
          if (result) {
            assessments.push({ category, result })
          }
        }
      }
      // Sort by timestamp to get the latest for each category if multiple exist (though typically only one per category)
      return assessments.sort(
        (a, b) => new Date(b.result.completedAt).getTime() - new Date(a.result.completedAt).getTime(),
      )
    } catch (error) {
      console.error("Error getting latest guest assessments:", error)
      return []
    }
  }

  static updateDashboardStats(category: AssessmentCategory, result: AssessmentResult) {
    try {
      const currentStats = GuestAssessmentService.getDashboardStats()
      const updatedStats = { ...currentStats }

      // Update total assessments
      const allLatest = GuestAssessmentService.getLatestAssessments()
      updatedStats.totalAssessments = allLatest.length

      // Update last assessment date
      const latestOverallAssessment = allLatest.length > 0 ? allLatest[0].result : null
      updatedStats.lastAssessmentDate = latestOverallAssessment?.completedAt
        ? new Date(latestOverallAssessment.completedAt).toISOString().split("T")[0]
        : null

      // Update risk levels
      updatedStats.riskLevels[category] = result.riskLevel

      // Calculate overall risk based on all latest assessments
      const riskOrder = ["low", "medium", "high", "very-high"]
      let overallHighestRisk: AssessmentResult["riskLevel"] = "low"
      allLatest.forEach((item) => {
        if (riskOrder.indexOf(item.result.riskLevel) > riskOrder.indexOf(overallHighestRisk)) {
          overallHighestRisk = item.result.riskLevel
        }
      })
      updatedStats.overallRisk = overallHighestRisk

      // Generate recommendations (simplified for guest)
      updatedStats.recommendations = GuestAssessmentService.generateRecommendations(
        allLatest.map((item) => item.result),
      )

      localStorage.setItem(GuestAssessmentService.DASHBOARD_STATS_KEY, JSON.stringify(updatedStats))
    } catch (error) {
      console.error("Error updating guest dashboard stats:", error)
    }
  }

  static getDashboardStats(): DashboardStats {
    try {
      const storedStats = localStorage.getItem(GuestAssessmentService.DASHBOARD_STATS_KEY)
      if (storedStats) {
        return JSON.parse(storedStats)
      }
    } catch (error) {
      console.error("Error getting guest dashboard stats:", error)
    }

    // Default initial stats with translation
    return {
      totalAssessments: 0,
      lastAssessmentDate: null,
      riskLevels: {},
      overallRisk: "unknown", // Default to unknown or low
      recommendations: [],
    }
  }

  static clearAllGuestData() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(GuestAssessmentService.STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key)
        }
      }
      localStorage.removeItem(GuestAssessmentService.DASHBOARD_STATS_KEY)
      console.log("All guest assessment data cleared.")
    } catch (error) {
      console.error("Error clearing all guest data:", error)
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

    if (results.length < 6) {
      // Assuming 6 categories total
      recommendations.push(t("recommendation_complete_all_assessments"))
    }

    if (recommendations.length === 0) {
      recommendations.push(t("recommendation_maintain_health"))
    }

    return recommendations
  }

  // This method is needed by app/page.tsx to calculate dashboard stats for guest users
  // It's a wrapper around getDashboardStats for compatibility with the old call signature
  static calculateDashboardStats(): DashboardStats {
    return GuestAssessmentService.getDashboardStats()
  }
}
