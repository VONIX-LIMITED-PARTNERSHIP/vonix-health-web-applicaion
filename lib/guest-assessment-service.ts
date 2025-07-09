export interface GuestAssessment {
  id: string
  category: string
  timestamp: string // ISO string
  riskLevel: "low" | "medium" | "high" | "very_high" | ""
  summary: string
  recommendations: string[]
}

interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  overallRisk: string
  recommendations: string[]
}

const STORAGE_KEY = "guest-assessments"

function read(): GuestAssessment[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as GuestAssessment[]) : []
  } catch {
    return []
  }
}

export class GuestAssessmentService {
  /** Return raw array (all assessments) */
  static getAll(): GuestAssessment[] {
    return read()
  }

  /** Latest assessment for every category, newest first */
  static getLatestAssessments(): { category: string; result: GuestAssessment }[] {
    const all = read()
    const latestByCategory = new Map<string, GuestAssessment>()

    all.forEach((a) => {
      const existing = latestByCategory.get(a.category)
      if (!existing || new Date(a.timestamp) > new Date(existing.timestamp)) {
        latestByCategory.set(a.category, a)
      }
    })

    // newest → oldest
    return Array.from(latestByCategory.entries())
      .sort(([, a], [, b]) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(([category, result]) => ({ category, result }))
  }

  /** Light-weight dashboard information */
  static getDashboardStats(): DashboardStats {
    const assessments = read()
    if (assessments.length === 0) {
      return {
        totalAssessments: 0,
        lastAssessmentDate: null,
        overallRisk: "",
        recommendations: [],
      }
    }

    // total
    const totalAssessments = assessments.length

    // last date
    const sorted = [...assessments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const lastAssessmentDate = sorted[0]?.timestamp ?? null

    // overall risk: take max risk level severity
    const riskOrder = ["low", "medium", "high", "very_high"]
    const highest = sorted.reduce(
      (prev, cur) => {
        if (riskOrder.indexOf(cur.riskLevel) > riskOrder.indexOf(prev)) return cur.riskLevel
        return prev
      },
      "" as GuestAssessment["riskLevel"],
    )

    // gather unique recommendations (latest 10)
    const recSet = new Set<string>()
    sorted.forEach((a) => a.recommendations?.forEach((r) => recSet.add(r)))
    const recommendations = Array.from(recSet).slice(0, 10)

    return {
      totalAssessments,
      lastAssessmentDate,
      overallRisk: highest,
      recommendations,
    }
  }
}
