"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Activity, Heart, BarChart } from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import type { DashboardStats, AssessmentResult } from "@/types/assessment"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage hook

interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GuestHealthOverviewModal({ isOpen, onClose }: GuestHealthOverviewModalProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [latestAssessments, setLatestAssessments] = useState<{ category: string; result: AssessmentResult }[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { locale } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      try {
        const stats = GuestAssessmentService.getDashboardStats()
        setDashboardStats(stats)
        const assessments = GuestAssessmentService.getLatestAssessments()
        setLatestAssessments(assessments)
      } catch (error) {
        console.error("Failed to load guest health overview:", error)
        setDashboardStats(null)
        setLatestAssessments([])
      } finally {
        setLoading(false)
      }
    }
  }, [isOpen])

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "outline"
      case "medium":
        return "default"
      case "high":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("guest_health_overview")}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {t("guest_health_overview_description")}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">{t("loading_health_data")}...</span>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center space-x-3">
                  <BarChart className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("total_assessments")}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats?.totalAssessments || 0}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("last_assessment")}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats?.lastAssessmentDate || t("not_available")}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("overall_risk_level")}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {dashboardStats?.overallRisk || t("not_assessed")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detailed Assessment Results */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t("your_assessments")}</h3>
              {latestAssessments.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">{t("no_assessments_found")}</p>
              ) : (
                <div className="space-y-4">
                  {latestAssessments.map((assessment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white capitalize">
                          {t(assessment.category.toLowerCase() + "_assessment")}
                        </h4>
                        <Badge variant={getRiskBadgeVariant(assessment.result.riskLevel || "")}>
                          {assessment.result.riskLevel || t("not_assessed")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t("completed_on")}:{" "}
                        {new Date(assessment.result.timestamp).toLocaleDateString(locale === "th" ? "th-TH" : "en-US")}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{assessment.result.summary}</p>
                      {assessment.result.recommendations && assessment.result.recommendations.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">{t("recommendations")}:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                            {assessment.result.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* General Recommendations */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t("general_recommendations")}</h3>
              {dashboardStats?.recommendations && dashboardStats.recommendations.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                  {dashboardStats.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{t("no_general_recommendations")}</p>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
