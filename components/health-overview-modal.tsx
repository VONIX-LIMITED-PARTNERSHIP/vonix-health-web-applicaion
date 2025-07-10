"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Apple,
  Brain,
  Dumbbell,
  Moon,
  User,
  AlertTriangle,
  Calendar,
  Activity,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Info,
  X,
  Target,
  Award,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Eye,
  ExternalLink,
} from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getRiskLevelBadgeClass, getBilingualArray, getBilingualText } from "@/utils/risk-level"
import { useRouter } from "next/navigation"

interface HealthOverviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  targetAssessmentId?: string | null
  onTargetAssessmentIdChange?: (id: string | null) => void
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

const categoryColors = {
  basic: "from-blue-500 to-cyan-500",
  heart: "from-red-500 to-pink-500",
  nutrition: "from-green-500 to-emerald-500",
  mental: "from-purple-500 to-violet-500",
  physical: "from-orange-500 to-amber-500",
  sleep: "from-indigo-500 to-blue-500",
}

export function HealthOverviewModal({
  isOpen,
  onOpenChange,
  targetAssessmentId,
  onTargetAssessmentIdChange,
}: HealthOverviewModalProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const router = useRouter()
  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  // Helper functions for bilingual data
  const getSafeRiskFactors = (assessment: AssessmentData): string[] => {
    if (assessment.ai_analysis?.riskFactors) {
      return getBilingualArray(assessment.ai_analysis.riskFactors, locale)
    }
    return assessment.risk_factors || []
  }

  const getSafeRecommendations = (assessment: AssessmentData): string[] => {
    if (assessment.ai_analysis?.recommendations) {
      return getBilingualArray(assessment.ai_analysis.recommendations, locale)
    }
    return assessment.recommendations || []
  }

  const getSafeSummary = (assessment: AssessmentData): string | null => {
    if (assessment.ai_analysis?.summary) {
      return getBilingualText(assessment.ai_analysis.summary, locale)
    }
    return null
  }

  const getLatestAssessmentsByCategory = (allAssessments: AssessmentData[]): AssessmentData[] => {
    const latestByCategory = new Map<string, AssessmentData>()

    allAssessments.forEach((assessment) => {
      const categoryId = assessment.category_id
      const currentLatest = latestByCategory.get(categoryId)

      if (!currentLatest || new Date(assessment.completed_at) > new Date(currentLatest.completed_at)) {
        latestByCategory.set(categoryId, assessment)
      }
    })

    return Array.from(latestByCategory.values()).sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
    )
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
      const { data, error: fetchError } = await AssessmentService.getUserAssessments(supabase, user.id)

      if (fetchError) {
        setError(fetchError)
        return
      }

      if (data && data.length > 0) {
        const latestAssessments = getLatestAssessmentsByCategory(data)
        setAssessments(latestAssessments)
      } else {
        setAssessments([])
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  const handleViewResults = (assessment: AssessmentData) => {
    // Close the modal first
    onOpenChange(false)

    // Navigate to the assessment results page
    router.push(`/assessment/${assessment.category_id}/results?id=${assessment.id}`)
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

  const calculateStats = () => {
    if (assessments.length === 0) {
      return {
        overallScore: 0,
        totalRiskFactors: 0,
        completedAssessments: 0,
        canGenerateReport: false,
        healthScore: 0,
        improvementAreas: 0,
      }
    }

    const totalPercentage = assessments.reduce((sum, assessment) => sum + assessment.percentage, 0)
    const overallScore = Math.round(totalPercentage / assessments.length)

    const allRiskFactors = new Set<string>()
    assessments.forEach((assessment) => {
      const riskFactors = getSafeRiskFactors(assessment)
      riskFactors.forEach((factor) => allRiskFactors.add(factor))
    })

    const completedAssessments = assessments.length
    const canGenerateReport = completedAssessments >= 3

    // Calculate health score based on risk levels
    let healthScore = 100
    assessments.forEach((assessment) => {
      switch (assessment.risk_level?.toLowerCase()) {
        case "high":
          healthScore -= 15
          break
        case "very-high":
        case "very_high":
          healthScore -= 25
          break
        case "medium":
          healthScore -= 8
          break
      }
    })
    healthScore = Math.max(0, healthScore)

    const improvementAreas = assessments.filter(
      (a) => a.risk_level === "high" || a.risk_level === "very-high" || a.risk_level === "very_high",
    ).length

    return {
      overallScore,
      totalRiskFactors: allRiskFactors.size,
      completedAssessments,
      canGenerateReport,
      healthScore,
      improvementAreas,
    }
  }

  const stats = calculateStats()

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("not_logged_in")}</DialogTitle>
            <DialogDescription>{t("login_to_view_health_overview")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => onOpenChange(false)}>{t("close")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3 text-3xl font-bold">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("health_overview_modal_title")}
                </span>
              </DialogTitle>
              <DialogDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400">
                {t("health_overview_modal_description")}
              </DialogDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400">{t("loading_details")}</p>
            </div>
          </div>
        ) : error ? (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {t("error_loading_details")}: {error}
            </AlertDescription>
          </Alert>
        ) : assessments.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t("no_assessment_data")}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t("start_assessment_to_view")}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-8">
              {/* Dashboard Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Health Score */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 dark:bg-emerald-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-500 text-white">
                        <Target className="h-6 w-6" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                        {stats.healthScore >= 80
                          ? t("health_status_excellent")
                          : stats.healthScore >= 60
                            ? t("health_status_good")
                            : t("health_status_needs_improvement")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {t("overall_health_score_summary")}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                          {stats.healthScore}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-lg">/100</span>
                      </div>
                      <Progress value={stats.healthScore} className="h-2 bg-emerald-200 dark:bg-emerald-800" />
                    </div>
                  </CardContent>
                </Card>

                {/* Completed Assessments */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-500 text-white">
                        <Award className="h-6 w-6" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {stats.completedAssessments}/6
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {t("completed_assessments_summary")}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                          {stats.completedAssessments}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-lg">{t("categories_unit")}</span>
                      </div>
                      <Progress
                        value={(stats.completedAssessments / 6) * 100}
                        className="h-2 bg-blue-200 dark:bg-blue-800"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 dark:bg-orange-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-orange-500 text-white">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                        {stats.improvementAreas > 0 ? t("health_status_needs_improvement") : t("health_status_good")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        {t("risk_factors_summary")}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-orange-800 dark:text-orange-200">
                          {stats.totalRiskFactors}
                        </span>
                        <span className="text-orange-600 dark:text-orange-400 text-lg">{t("items_unit")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                        <Shield className="h-4 w-4" />
                        <span>
                          {stats.improvementAreas} {t("improvement_areas_summary")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Status */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-700 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500 text-white">
                        <FileText className="h-6 w-6" />
                      </div>
                      <Badge
                        className={`${stats.canGenerateReport ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}`}
                      >
                        {stats.canGenerateReport ? t("ready_to_use") : t("not_ready")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {t("health_report_summary")}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {stats.canGenerateReport ? t("ready_to_use") : t("not_ready")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                        <Clock className="h-4 w-4" />
                        <span>{t("requires_3_categories_for_report")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-8" />

              {/* Assessment Categories */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t("latest_assessments_by_category_title")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {assessments.map((assessment) => {
                    const IconComponent =
                      categoryIcons[assessment.category_id as keyof typeof categoryIcons] || FileText
                    const colorGradient =
                      categoryColors[assessment.category_id as keyof typeof categoryColors] ||
                      "from-gray-500 to-gray-600"
                    const riskFactors = getSafeRiskFactors(assessment)
                    const recommendations = getSafeRecommendations(assessment)
                    const summary = getSafeSummary(assessment)

                    return (
                      <Card
                        key={assessment.id}
                        className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-4 rounded-2xl bg-gradient-to-br ${colorGradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                              >
                                <IconComponent className="h-8 w-8" />
                              </div>
                              <div>
                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                  {assessment.category_title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-4 w-4" />
                                  {t("completed_on")}: {formatDate(assessment.completed_at)}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              {assessment.category_id !== "basic" ? (
                                <Badge
                                  className={`${getRiskLevelBadgeClass(assessment.risk_level)} px-3 py-1 text-sm font-medium`}
                                >
                                  {getRiskLevelLabel(assessment.risk_level)}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                                  {t("completed")}
                                </Badge>
                              )}
                              <div className="mt-2 text-right">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                  {assessment.percentage}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {assessment.total_score}/{assessment.max_score}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{t("assessment_score_label")}</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {assessment.percentage}%
                              </span>
                            </div>
                            <Progress value={assessment.percentage} className="h-3" />
                          </div>

                          {/* AI Summary */}
                          {summary && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                  {t("ai_analysis_label")}
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{summary}</p>
                            </div>
                          )}

                          {/* Risk Factors & Recommendations */}
                          <div className={`grid grid-cols-1 ${riskFactors.length > 0 ? "md:grid-cols-1" : ""}`}>
                            {/* Risk Factors */}
                            {riskFactors.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {getRiskIcon(assessment.risk_level)}
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {t("risk_factors")} ({riskFactors.length})
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {riskFactors.slice(0, 2).map((factor, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                                      <span className="leading-relaxed">{factor}</span>
                                    </div>
                                  ))}
                                  {riskFactors.length > 2 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500 pl-3">
                                      +{riskFactors.length - 2} {t("items_unit")}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* No data message */}
                          {riskFactors.length === 0 && recommendations.length === 0 && !summary && (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">{t("no_risk_factors_found")}</p>
                            </div>
                          )}

                          {/* View Results Button */}
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              onClick={() => handleViewResults(assessment)}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view_detailed_results_button")}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
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

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
