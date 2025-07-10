import type { AssessmentCategory, AssessmentResult, DashboardStats, AIAnalysisResult } from "@/types/assessment"
import { getAssessmentCategories } from "@/data/assessment-questions" // Import getAssessmentCategories
import { v4 as uuidv4 } from "uuid" // Import uuid

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
  // Changed to store a list of assessments under one key
  private static readonly GUEST_ASSESSMENTS_LIST_KEY = "guest-assessments-list"
  private static readonly DASHBOARD_STATS_KEY = "guest-dashboard-stats"
  private static readonly AI_ANALYSIS_KEY_PREFIX = "guest-ai-analysis-" // This prefix might become redundant if AI analysis is part of AssessmentResult

  // Helper to get all stored guest assessments
  private static getStoredAssessments(): AssessmentResult[] {
    try {
      const stored = localStorage.getItem(GuestAssessmentService.GUEST_ASSESSMENTS_LIST_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error getting stored guest assessments list:", error)
      return []
    }
  }

  // Helper to save the list of guest assessments
  private static saveStoredAssessments(assessments: AssessmentResult[]) {
    try {
      localStorage.setItem(GuestAssessmentService.GUEST_ASSESSMENTS_LIST_KEY, JSON.stringify(assessments))
    } catch (error) {
      console.error("Error saving stored guest assessments list:", error)
    }
  }

  static saveAssessment(
    category: AssessmentCategory,
    result: Omit<AssessmentResult, "id" | "completedAt" | "category"> & { aiAnalysis?: AIAnalysisResult },
  ) {
    try {
      const assessments = GuestAssessmentService.getStoredAssessments()

      // Create a new AssessmentResult with unique ID and timestamp
      const newAssessment: AssessmentResult = {
        ...result,
        id: uuidv4(), // Generate a unique ID
        completedAt: new Date().toISOString(), // Add completion timestamp
        category: category.id, // Ensure category ID is correctly set
      }

      // Add the new assessment to the list
      assessments.push(newAssessment)
      GuestAssessmentService.saveStoredAssessments(assessments)

      // Update dashboard stats based on the new list
      GuestAssessmentService.updateDashboardStats()
    } catch (error) {
      console.error("Error saving guest assessment:", error)
    }
  }

  // New method to get an assessment by its unique ID
  static getAssessmentById(id: string): AssessmentResult | null {
    try {
      const assessments = GuestAssessmentService.getStoredAssessments()
      return assessments.find((a) => a.id === id) || null
    } catch (error) {
      console.error("Error getting guest assessment by ID:", error)
      return null
    }
  }

  // Renamed and updated to get all assessments, sorted by completion date
  static getLatestAssessments(): AssessmentResult[] {
    try {
      const assessments = GuestAssessmentService.getStoredAssessments()
      // Sort by timestamp to get the latest first
      return assessments.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    } catch (error) {
      console.error("Error getting latest guest assessments:", error)
      return []
    }
  }

  // Update dashboard stats based on the current list of assessments
  static updateDashboardStats() {
    try {
      const allLatest = GuestAssessmentService.getLatestAssessments()
      const updatedStats: DashboardStats = {
        totalAssessments: allLatest.length,
        lastAssessmentDate: allLatest.length > 0 ? allLatest[0].completedAt : null,
        riskLevels: {},
        overallRisk: "low", // Default to low, will be updated
        recommendations: [],
      }

      const riskOrder = ["low", "medium", "high", "very-high"]
      let overallHighestRisk: AssessmentResult["riskLevel"] = "low"

      allLatest.forEach((item) => {
        updatedStats.riskLevels[item.category] = item.riskLevel
        if (riskOrder.indexOf(item.riskLevel) > riskOrder.indexOf(overallHighestRisk)) {
          overallHighestRisk = item.riskLevel
        }
      })
      updatedStats.overallRisk = overallHighestRisk

      updatedStats.recommendations = GuestAssessmentService.generateRecommendations(allLatest)

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
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (
          key &&
          (key === GuestAssessmentService.GUEST_ASSESSMENTS_LIST_KEY || // Clear the new list key
            key === GuestAssessmentService.DASHBOARD_STATS_KEY ||
            key === "guestUser") // Explicitly add "guestUser"
        ) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })
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

    // Assuming 6 categories total, check if all are completed
    const completedCategories = new Set(results.map((r) => r.category))
    // Pass a dummy locale to getAssessmentCategories if `t` doesn't provide it directly
    const allCategories = getAssessmentCategories("en").map((cat) => cat.id)
    if (completedCategories.size < allCategories.length) {
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
