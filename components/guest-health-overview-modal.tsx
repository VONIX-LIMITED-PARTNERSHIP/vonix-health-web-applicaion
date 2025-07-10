"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRiskLevelBadgeClass, type RiskLevel } from "@/utils/risk-level"
import { BarChart, Shield, Activity, Clock } from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import type { DashboardStats } from "@/types/assessment"

export interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
  /** Overall risk level to highlight (optional, defaults to `"unknown"`). */
  overallRisk?: RiskLevel
}

/**
 * Light-weight modal used on the home page for guest users.
 * It shows a quick summary of their most recent assessment.
 */
export function GuestHealthOverviewModal({ isOpen, onClose }: GuestHealthOverviewModalProps) {
  const { t } = useTranslation(["common"])
  const { locale } = useLanguage()
  const { getRiskLevelLabel: getTranslatedRiskLabel, getRiskLevelDescription: getTranslatedRiskDescription } =
    useRiskLevelTranslation()

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)

  // Load guest dashboard stats when modal opens
  useState(() => {
    if (isOpen) {
      const stats = GuestAssessmentService.getDashboardStats()
      setDashboardStats(stats)
    }
  }, [isOpen])

  const overallRisk = dashboardStats?.overallRisk || "unknown"
  const totalAssessments = dashboardStats?.totalAssessments || 0
  const lastAssessmentDate = dashboardStats?.lastAssessmentDate
    ? new Date(dashboardStats.lastAssessmentDate).toLocaleDateString(locale === "th" ? "th-TH" : "en-US")
    : t("no_data")
  const recommendations = dashboardStats?.recommendations || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            {t("your_health_overview")}
          </DialogTitle>
          <DialogDescription>{t("guest_overview_description")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Overall Risk */}
          <div className="flex items-center gap-3">
            <span className="font-medium">{t("overall_risk")}:</span>
            <Badge className={getRiskLevelBadgeClass(overallRisk)}>{getTranslatedRiskLabel(overallRisk)}</Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              <span>
                {t("total_assessments")}:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{totalAssessments}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                {t("last_assessment")}:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{lastAssessmentDate}</span>
              </span>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("recommendations")}
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <Button className="mt-6 w-full" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* Default export so `import GuestHealthOverviewModal from` also works */
export default GuestHealthOverviewModal
