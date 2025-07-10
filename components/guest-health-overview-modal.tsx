"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Activity, AlertTriangle, TrendingUp, X } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useRiskLevelTranslation, getRiskLevelColor, getRiskLevelBadgeClass } from "@/utils/risk-level"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"

interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DashboardStats {
  overallRisk: string
  totalAssessments: number
  lastAssessmentDate: string | null
  recommendations: string[]
  riskFactors: Array<{
    category: string
    level: string
    score: number
  }>
}

export function GuestHealthOverviewModal({ isOpen, onClose }: GuestHealthOverviewModalProps) {
  const { t } = useTranslation()
  const { getRiskLevelLabel, getRiskLevelDescription } = useRiskLevelTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadDashboardStats()
    }
  }, [isOpen])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const dashboardStats = await GuestAssessmentService.getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      // Set default stats if loading fails
      setStats({
        overallRisk: "unknown",
        totalAssessments: 0,
        lastAssessmentDate: null,
        recommendations: [],
        riskFactors: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("never")
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return t("unknown")
    }
  }

  const getRiskScore = (level: string): number => {
    switch (level?.toLowerCase()) {
      case "low":
        return 25
      case "moderate":
        return 50
      case "high":
        return 75
      case "critical":
        return 100
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t("healthOverview")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("healthOverview")}
          </DialogTitle>
          <Button variant="ghost" size="sm" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Risk Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t("overallRiskStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge
                    className={getRiskLevelBadgeClass(stats?.overallRisk)}
                    style={{ borderColor: getRiskLevelColor(stats?.overallRisk) }}
                  >
                    {getRiskLevelLabel(stats?.overallRisk)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{getRiskLevelDescription(stats?.overallRisk)}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: getRiskLevelColor(stats?.overallRisk) }}>
                    {getRiskScore(stats?.overallRisk || "unknown")}%
                  </div>
                  <div className="text-sm text-muted-foreground">{t("riskScore")}</div>
                </div>
              </div>
              <Progress value={getRiskScore(stats?.overallRisk || "unknown")} className="h-2" />
            </CardContent>
          </Card>

          {/* Assessment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("assessmentSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("totalAssessments")}</span>
                    <span className="font-medium">{stats?.totalAssessments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("lastAssessment")}</span>
                    <span className="font-medium">{formatDate(stats?.lastAssessmentDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t("nextSteps")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.recommendations && stats.recommendations.length > 0 ? (
                    stats.recommendations.slice(0, 3).map((recommendation, index) => (
                      <div key={index} className="text-sm">
                        • {recommendation}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">{t("noRecommendationsAvailable")}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors Breakdown */}
          {stats?.riskFactors && stats.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("riskFactorsBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.riskFactors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{factor.category}</span>
                        <Badge
                          className={getRiskLevelBadgeClass(factor.level)}
                          style={{ borderColor: getRiskLevelColor(factor.level) }}
                        >
                          {getRiskLevelLabel(factor.level)}
                        </Badge>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              {t("close")}
            </Button>
            <Button
              onClick={() => {
                onClose()
                window.location.href = "/guest-assessment"
              }}
              className="flex-1"
            >
              {t("takeNewAssessment")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GuestHealthOverviewModal
