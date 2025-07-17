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
  private static readonly AI_ANALYSIS_KEY_PREFIX = "guest-ai-analysis-"

  static saveAssessment(category: AssessmentCategory, result: AssessmentResult) {
    try {
      const key = `${GuestAssessmentService.STORAGE_KEY_PREFIX}${category}`

      // Ensure the result has a proper percentage calculation
      if (!result.percentage || result.percentage === 0) {
        result.percentage = this.calculatePercentageFromScore(result.score || 0)
      }

      localStorage.setItem(key, JSON.stringify(result))
      GuestAssessmentService.updateDashboardStats(category, result)
    } catch (error) {
      console.error("Error saving guest assessment:", error)
    }
  }

  private static calculatePercentageFromScore(score: number): number {
    // Convert score to percentage (assuming score is out of 100)
    // If score is already a percentage, return as is
    if (score >= 0 && score <= 100) {
      return Math.round(score)
    }

    // If score seems to be out of a different scale, normalize it
    // This is a fallback calculation
    return Math.min(100, Math.max(0, Math.round(score)))
  }

  static getAssessment(category: AssessmentCategory): AssessmentResult | null {
    try {
      const key = `${GuestAssessmentService.STORAGE_KEY_PREFIX}${category}`
      const stored = localStorage.getItem(key)
      if (!stored) return null

      const result = JSON.parse(stored) as AssessmentResult

      // Ensure percentage is calculated if missing
      if (!result.percentage || result.percentage === 0) {
        result.percentage = this.calculatePercentageFromScore(result.score || 0)
        // Update the stored result with calculated percentage
        localStorage.setItem(key, JSON.stringify(result))
      }

      return result
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
            // Ensure percentage is properly set
            if (!result.percentage || result.percentage === 0) {
              result.percentage = this.calculatePercentageFromScore(result.score || 0)
            }
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
      if (typeof window === "undefined") return

      const keysToRemove: string[] = []

      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (
          key &&
          (key.startsWith(GuestAssessmentService.STORAGE_KEY_PREFIX) ||
            key.startsWith(GuestAssessmentService.AI_ANALYSIS_KEY_PREFIX) ||
            key === GuestAssessmentService.DASHBOARD_STATS_KEY ||
            key === "guestUser" ||
            key.startsWith("guest-") ||
            key.includes("guest"))
        ) {
          keysToRemove.push(key)
        }
      }

      // Remove all identified keys
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        console.log(`Removed localStorage key: ${key}`)
      })

      // Also clear sessionStorage for any guest data
      const sessionKeysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (key.startsWith("guest-") || key.includes("guest"))) {
          sessionKeysToRemove.push(key)
        }
      }

      sessionKeysToRemove.forEach((key) => {
        sessionStorage.removeItem(key)
        console.log(`Removed sessionStorage key: ${key}`)
      })

      console.log(
        `All guest assessment data cleared. Removed ${keysToRemove.length} localStorage keys and ${sessionKeysToRemove.length} sessionStorage keys.`,
      )
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

  static getAssessmentByCategory(categoryId: string): any | null {
    try {
      const assessment = GuestAssessmentService.getAssessment(categoryId as AssessmentCategory)
      if (!assessment) return null

      // Ensure percentage is calculated
      const percentage = assessment.percentage || this.calculatePercentageFromScore(assessment.score || 0)

      // Convert to format expected by results page
      return {
        id: assessment.id,
        category_id: assessment.category,
        category_title: categoryId, // You might want to get the actual title from assessment categories
        answers: assessment.answers,
        total_score: assessment.score,
        max_score: 100,
        percentage: percentage,
        risk_level: assessment.riskLevel,
        risk_factors: assessment.aiAnalysis?.riskFactors?.th || [],
        recommendations: assessment.aiAnalysis?.recommendations?.th || [],
        completed_at: assessment.completedAt,
        ai_analysis: assessment.aiAnalysis,
      }
    } catch (error) {
      console.error("Error getting guest assessment by category:", error)
      return null
    }
  }

  // Helper method to recalculate all percentages for existing assessments
  static recalculateAllPercentages() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(GuestAssessmentService.STORAGE_KEY_PREFIX)) {
          const stored = localStorage.getItem(key)
          if (stored) {
            const result = JSON.parse(stored) as AssessmentResult
            if (!result.percentage || result.percentage === 0) {
              result.percentage = this.calculatePercentageFromScore(result.score || 0)
              localStorage.setItem(key, JSON.stringify(result))
              console.log(`Updated percentage for ${key}: ${result.percentage}%`)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error recalculating percentages:", error)
    }
  }
}
