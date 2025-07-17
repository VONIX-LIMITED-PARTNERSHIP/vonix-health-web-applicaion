import type { AssessmentCategory, AssessmentResult, DashboardStats, RiskLevel } from "@/types/assessment"
import { getAssessmentCategories } from "@/data/assessment-questions" // Import getAssessmentCategories

/* -------------------------------------------------------------------------- */
/*                                  i18n                                     */
/* -------------------------------------------------------------------------- */

/**
 * Internal translate helper – defaults to echoing the key.
 * Components can inject their own translate function (e.g. from
 * `useTranslation`) by calling `setGuestServiceTranslation`.
 */
let t: (key: string) => string = (key) => key

/**
 * Call this once (e.g. in a root provider) to provide the translate function
 * that will be used inside this service.
 */
export const setGuestServiceTranslation = (translateFn: (key: string) => string) => {
  t = translateFn
}

/* -------------------------------------------------------------------------- */
/*                            Local-storage helpers                           */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "vonix_guest_assessments"

/**
 * Wrapper around JSON.parse with error handling.
 */
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                         GuestAssessmentService class                       */
/* -------------------------------------------------------------------------- */

export class GuestAssessmentService {
  /* ------------------------------- CRUD Ops ------------------------------ */

  /**
   * Save a completed assessment result for a guest user.
   */
  static saveAssessment(categoryId: AssessmentCategory, result: AssessmentResult): void {
    try {
      const all = this.getGuestAssessments()
      // Remove any existing entry for the same category so we only keep the latest
      const filtered = all.filter((a) => a.category !== categoryId)
      filtered.push(result)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error("Failed to save guest assessment:", error)
    }
  }

  /**
   * Fetch **all** guest assessments from localStorage.
   */
  static getGuestAssessments(): AssessmentResult[] {
    return safeParse<AssessmentResult[]>(localStorage.getItem(STORAGE_KEY)) ?? []
  }

  /**
   * Convert a raw `score` (0–100 or any arbitrary scale) into a 0-100 percentage.
   * If the score is already between 0–100 we keep it, otherwise we normalise it.
   */
  private static calculatePercentageFromScore(score: number): number {
    if (score >= 0 && score <= 100) return Math.round(score)
    return Math.min(100, Math.max(0, Math.round(score)))
  }

  /**
   * Return the **latest** assessment result for every category, sorted by the
   * completion date (newest first).
   *
   * The shape matches the original API used by other components:
   *   [{ category: "heart", result: AssessmentResult }, ...]
   */
  static getLatestAssessments(): { category: AssessmentCategory; result: AssessmentResult }[] {
    const latestByCategory = new Map<AssessmentCategory, AssessmentResult>()

    this.getGuestAssessments().forEach((a) => {
      const current = latestByCategory.get(a.category)
      if (!current || new Date(a.completedAt) > new Date(current.completedAt)) {
        latestByCategory.set(a.category, a)
      }
    })

    return Array.from(latestByCategory.entries())
      .map(([category, result]) => ({ category, result }))
      .sort((a, b) => new Date(b.result.completedAt).getTime() - new Date(a.result.completedAt).getTime())
  }

  /**
   * Iterate over every saved guest assessment and make sure it has a valid
   * `.percentage` field.  If any entry is updated, persist the repaired list
   * back to `localStorage`.
   *
   * This keeps backward-compat with data that was saved before we consistently
   * stored percentage values.
   */
  static recalculateAllPercentages(): void {
    try {
      const assessments = this.getGuestAssessments()
      let changed = false

      assessments.forEach((a) => {
        if (!a.percentage || a.percentage === 0) {
          a.percentage = this.calculatePercentageFromScore(a.score ?? 0)
          changed = true
        }
      })

      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments))
      }
    } catch (error) {
      console.error("GuestAssessmentService.recalculateAllPercentages error:", error)
    }
  }

  /**
   * Get the latest assessment for a specific category.
   */
  static getLatestGuestAssessmentForCategory(categoryId: AssessmentCategory): AssessmentResult | null {
    const assessments = this.getGuestAssessments()
    const categoryAssessments = assessments.filter((a) => a.category === categoryId)
    if (categoryAssessments.length === 0) {
      return null
    }
    return categoryAssessments.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]
  }

  /**
   * Formats an AssessmentResult object into a structure expected by the
   * GuestAssessmentResultsPage, including snake_case keys and localized
   * AI analysis fields.
   */
  static formatAssessmentResultForDisplay(assessment: AssessmentResult, locale: string): any {
    const assessmentCategories = getAssessmentCategories(locale)
    const category = assessmentCategories.find((cat) => cat.id === assessment.category)
    const categoryTitle = category ? category.title : assessment.category

    const riskFactors = assessment.aiAnalysis
      ? assessment.aiAnalysis.riskFactors[locale === "th" ? "th" : "en"]
      : assessment.riskFactors // Use direct field if no AI analysis

    const recommendations = assessment.aiAnalysis
      ? assessment.aiAnalysis.recommendations[locale === "th" ? "th" : "en"]
      : assessment.recommendations // Use direct field if no AI analysis

    const summary = assessment.aiAnalysis
      ? assessment.aiAnalysis.summary[locale === "th" ? "th" : "en"]
      : assessment.summary // Use direct field if no AI analysis

    return {
      id: assessment.id,
      category_id: assessment.category,
      category_title: categoryTitle,
      answers: assessment.answers,
      total_score: assessment.score,
      max_score: 100, // Assuming max score is 100 for percentage
      percentage: assessment.percentage,
      risk_level: assessment.riskLevel,
      risk_factors: riskFactors,
      recommendations: recommendations,
      summary: summary,
      completed_at: assessment.completedAt,
      ai_analysis: assessment.aiAnalysis,
    }
  }

  /* --------------------------- Dashboard helpers ------------------------- */

  /**
   * Calculate dashboard statistics based on the latest assessments.
   */
  static getGuestDashboardStats(locale: string): DashboardStats {
    const latest = this.getLatestAssessments()

    // Aggregate risk levels
    const riskLevels: Record<AssessmentCategory, RiskLevel> = {} as Record<AssessmentCategory, RiskLevel>
    let overallRisk: RiskLevel = "low"
    const riskOrder: RiskLevel[] = ["low", "medium", "high", "very-high"]

    const recommendations: string[] = []

    latest.forEach(({ category, result }) => {
      riskLevels[category] = result.riskLevel
      if (riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(overallRisk)) {
        overallRisk = result.riskLevel
      }

      // Prefer AI-generated recs if available
      const recs = result.aiAnalysis?.recommendations?.[locale === "th" ? "th" : "en"] || result.recommendations || []
      recs.forEach((r) => {
        if (!recommendations.includes(r)) recommendations.push(r)
      })
    })

    if (recommendations.length === 0) {
      recommendations.push(t("recommendation_maintain_health"))
    }

    return {
      totalAssessments: latest.length,
      lastAssessmentDate: latest.length > 0 ? latest[0].result.completedAt : null,
      riskLevels,
      overallRisk,
      recommendations,
    }
  }

  /**
   * BACK-COMPAT: older code calls `GuestAssessmentService.getDashboardStats()`
   * without a locale parameter.  Delegate to `getGuestDashboardStats`, using
   * `"en"` as a sensible default.
   */
  static getDashboardStats(): DashboardStats {
    return this.getGuestDashboardStats("en")
  }

  /* ------------------------------ Utilities ------------------------------ */

  /**
   * Completely remove all guest assessment data.
   */
  static clearGuestAssessments(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/* Default export retained for backward-compatibility */
export default GuestAssessmentService
