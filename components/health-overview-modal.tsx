"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Apple,
  Brain,
  Dumbbell,
  Moon,
  User,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Activity,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getRiskLevelBadgeClass, getBilingualArray, getBilingualText } from "@/utils/risk-level"

interface HealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AssessmentData {
  id: string
  category_id: string
  category_title: string
  total_score: number
  max_score: number
  percentage: number
  risk_level: string
  risk_factors: string[]
  recommendations: string[]
  completed_at: string
  ai_analysis?: {
    summary?: any
    riskFactors?: any
    recommendations?: any
  }
}

const categoryIcons = {
  basic: User,
  heart: Heart,
  nutrition: Apple,
  mental: Brain,
  physical: Dumbbell,
  sleep: Moon,
}

export function HealthOverviewModal({ isOpen, onClose }: HealthOverviewModalProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  // Helper functions for bilingual data
  const getSafeRiskFactors = (assessment: AssessmentData): string[] => {
    // Try to get from AI analysis first (bilingual)
    if (assessment.ai_analysis?.riskFactors) {
      return getBilingualArray(assessment.ai_analysis.riskFactors, locale)
    }
    // Fallback to legacy data
    return assessment.risk_factors || []
  }

  const getSafeRecommendations = (assessment: AssessmentData): string[] => {
    // Try to get from AI analysis first (bilingual)
    if (assessment.ai_analysis?.recommendations) {
      return getBilingualArray(assessment.ai_analysis.recommendations, locale)
    }
    // Fallback to legacy data
    return assessment.recommendations || []
  }

  const getSafeSummary = (assessment: AssessmentData): string | null => {
    // Try to get from AI analysis first (bilingual)
    if (assessment.ai_analysis?.summary) {
      return getBilingualText(assessment.ai_analysis.summary, locale)
    }
    return null
  }

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchHealthOverview()
    }
  }, [isOpen, user?.id, locale])

  const fetchHealthOverview = async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      console.log("🔍 HealthOverview: กำลังโหลดข้อมูลการประเมินทั้งหมด...")

      const { data, error: fetchError } = await AssessmentService.getUserAssessments(supabase, user.id)

      if (fetchError) {
        console.error("❌ HealthOverview: เกิดข้อผิดพลาดในการโหลดข้อมูล:", fetchError)
        setError(fetchError)
        return
      }

      if (data && data.length > 0) {
        console.log("✅ HealthOverview: โหลดข้อมูลสำเร็จ จำนวน:", data.length, "รายการ")
        setAssessments(data)
      } else {
        console.log("ℹ️ HealthOverview: ไม่พบข้อมูลการประเมิน")
        setAssessments([])
      }
    } catch (err) {
      console.error("❌ HealthOverview: เกิดข้อผิดพลาดที่ไม่คาดคิด:", err)
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelLabel = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return locale === "th" ? "ความเสี่ยงต่ำ" : "Low Risk"
      case "medium":
        return locale === "th" ? "ความเสี่ยงปานกลาง" : "Medium Risk"
      case "high":
        return locale === "th" ? "ความเสี่ยงสูง" : "High Risk"
      case "very-high":
      case "very_high":
        return locale === "th" ? "ความเสี่ยงสูงมาก" : "Very High Risk"
      default:
        return locale === "th" ? "ไม่ระบุ" : "Unspecified"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "high":
      case "very-high":
      case "very_high":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (locale === "th") {
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate dashboard statistics using bilingual data
  const calculateStats = () => {
    if (assessments.length === 0) {
      return {
        overallScore: 0,
        totalRiskFactors: 0,
        completedAssessments: 0,
        canGenerateReport: false,
      }
    }

    // Calculate overall score (average percentage)
    const totalPercentage = assessments.reduce((sum, assessment) => sum + assessment.percentage, 0)
    const overallScore = Math.round(totalPercentage / assessments.length)

    // Count unique risk factors using bilingual data
    const allRiskFactors = new Set<string>()
    assessments.forEach((assessment) => {
      const riskFactors = getSafeRiskFactors(assessment)
      riskFactors.forEach((factor) => allRiskFactors.add(factor))
    })

    const completedAssessments = assessments.length
    const canGenerateReport = completedAssessments >= 3

    return {
      overallScore,
      totalRiskFactors: allRiskFactors.size,
      completedAssessments,
      canGenerateReport,
    }
  }

  const stats = calculateStats()

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("not_logged_in")}</DialogTitle>
            <DialogDescription>{t("login_to_view_health_overview")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            {t("health_overview_modal_title")}
          </DialogTitle>
          <DialogDescription>{t("health_overview_modal_description")}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">{t("loading_details")}</span>
          </div>
        ) : error ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t("error_loading_details")}: {error}
            </AlertDescription>
          </Alert>
        ) : assessments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t("no_assessment_data")}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t("start_assessment_to_view")}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Summary Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    {t("summary_overview")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.overallScore}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t("overall_score")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.totalRiskFactors}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t("risk_factors_found")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.completedAssessments}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t("assessments_completed")}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${stats.canGenerateReport ? "text-green-600" : "text-gray-400"}`}
                      >
                        {stats.canGenerateReport ? t("report_ready") : t("report_not_ready")}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t("health_report_status")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Latest Assessments */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {t("latest_assessments")}
                </h3>
                <div className="space-y-4">
                  {assessments.map((assessment) => {
                    const IconComponent =
                      categoryIcons[assessment.category_id as keyof typeof categoryIcons] || FileText
                    const riskFactors = getSafeRiskFactors(assessment)
                    const recommendations = getSafeRecommendations(assessment)
                    const summary = getSafeSummary(assessment)

                    return (
                      <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{assessment.category_title}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(assessment.completed_at)}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {assessment.category_id !== "basic" ? (
                                <Badge className={getRiskLevelBadgeClass(assessment.risk_level)}>
                                  {getRiskLevelLabel(assessment.risk_level)}
                                </Badge>
                              ) : (
                                <Badge variant="outline">{t("completed")}</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Score Display */}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{t("score_label")}</span>
                              <span className="font-medium">
                                {assessment.total_score}/{assessment.max_score} ({assessment.percentage}%)
                              </span>
                            </div>

                            {/* AI Summary (if available) */}
                            {summary && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  AI Summary
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">{summary}</div>
                              </div>
                            )}

                            {/* Risk Factors */}
                            {riskFactors.length > 0 && (
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                  {getRiskIcon(assessment.risk_level)}
                                  {t("risk_factors")} ({riskFactors.length})
                                </div>
                                <div className="space-y-1">
                                  {riskFactors.slice(0, 3).map((factor, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                                    >
                                      <span className="text-orange-500 mt-0.5">•</span>
                                      {factor}
                                    </div>
                                  ))}
                                  {riskFactors.length > 3 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                      +{riskFactors.length - 3} {locale === "th" ? "รายการเพิ่มเติม" : "more items"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Recommendations */}
                            {recommendations.length > 0 && (
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {t("recommendations_label")} ({recommendations.length})
                                </div>
                                <div className="space-y-1">
                                  {recommendations.slice(0, 2).map((recommendation, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                                    >
                                      <span className="text-green-500 mt-0.5">•</span>
                                      {recommendation}
                                    </div>
                                  ))}
                                  {recommendations.length > 2 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                      +{recommendations.length - 2} {locale === "th" ? "รายการเพิ่มเติม" : "more items"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* No data message */}
                            {riskFactors.length === 0 && recommendations.length === 0 && !summary && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                {t("no_risk_factors_found")}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>{t("close")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
