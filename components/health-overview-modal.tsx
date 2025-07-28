"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Apple,
  Brain,
  MoonIcon,
  Dumbbell,
  BarChart,
  Calendar,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  TrendingUp,
  Target,
  Award,
  Zap,
  Eye,
  X,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { getRiskLevelText, getRiskLevelBadgeClass } from "@/utils/risk-level"
import { useRouter } from "next/navigation"

interface HealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AssessmentResult {
  id: string
  category: string
  categoryId: string
  percentage: number
  riskLevel: string
  completedAt: string
  totalScore: number
  maxScore: number
}

interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  overallRisk: string | null
}

export function HealthOverviewModal({ isOpen, onClose }: HealthOverviewModalProps) {
  const { t } = useTranslation(["common", "guest_health_overview"])
  const { locale } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [assessments, setAssessments] = useState<AssessmentResult[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true)
      fetchHealthOverview()
    }
  }, [isOpen, user?.id])

  const fetchHealthOverview = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await AssessmentService.getUserAssessments(supabase, user.id)

      if (error) {
        console.error("Failed to load health overview data:", error)
        setDashboardStats(null)
        setAssessments([])
        return
      }

      if (data && data.length > 0) {
        // Get latest assessment for each category
        const latestByCategory = new Map<string, any>()

        data.forEach((assessment) => {
          const categoryId = assessment.category_id
          const currentLatest = latestByCategory.get(categoryId)

          if (!currentLatest || new Date(assessment.completed_at) > new Date(currentLatest.completed_at)) {
            latestByCategory.set(categoryId, assessment)
          }
        })

        const latestAssessments = Array.from(latestByCategory.values())

        // Transform data to match expected format
        const transformedAssessments: AssessmentResult[] = latestAssessments.map((assessment) => ({
          id: assessment.id,
          category: assessment.category_title,
          categoryId: assessment.category_id,
          percentage: assessment.percentage || 0,
          riskLevel: assessment.risk_level || "low",
          completedAt: assessment.completed_at,
          totalScore: assessment.total_score || 0,
          maxScore: assessment.max_score || 0,
        }))

        setAssessments(transformedAssessments)

        // Calculate dashboard stats
        const stats: DashboardStats = {
          totalAssessments: transformedAssessments.length,
          lastAssessmentDate:
            transformedAssessments.length > 0
              ? transformedAssessments.sort(
                  (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
                )[0].completedAt
              : null,
          overallRisk: calculateOverallRisk(transformedAssessments),
        }

        setDashboardStats(stats)
      } else {
        setAssessments([])
        setDashboardStats({
          totalAssessments: 0,
          lastAssessmentDate: null,
          overallRisk: null,
        })
      }
    } catch (error) {
      console.error("Failed to load health overview data:", error)
      setDashboardStats(null)
      setAssessments([])
    } finally {
      setLoading(false)
    }
  }

  const calculateOverallRisk = (assessments: AssessmentResult[]): string | null => {
    if (assessments.length === 0) return null

    const riskLevels = assessments.map((a) => a.riskLevel)

    if (riskLevels.some((r) => r === "very-high" || r === "very_high")) return "very-high"
    if (riskLevels.some((r) => r === "high")) return "high"
    if (riskLevels.some((r) => r === "medium")) return "medium"
    return "low"
  }

  const assessmentCategories = useMemo(() => getAssessmentCategories(locale), [locale])

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "basic":
        return <Activity className="h-5 w-5" />
      case "heart":
        return <Heart className="h-5 w-5" />
      case "nutrition":
        return <Apple className="h-5 w-5" />
      case "mental":
        return <Brain className="h-5 w-5" />
      case "physical":
        return <Dumbbell className="h-5 w-5" />
      case "sleep":
        return <MoonIcon className="h-5 w-5" />
      default:
        return <BarChart className="h-5 w-5" />
    }
  }

  const getCategoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case "basic":
        return "from-blue-500 to-cyan-500"
      case "heart":
        return "from-red-500 to-pink-500"
      case "nutrition":
        return "from-green-500 to-emerald-500"
      case "mental":
        return "from-purple-500 to-violet-500"
      case "physical":
        return "from-orange-500 to-amber-500"
      case "sleep":
        return "from-indigo-500 to-blue-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getFormattedDate = (dateString: string | null) => {
    if (!dateString) return t("no_data")
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return t("invalid_date")
      }
      return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return t("invalid_date")
    }
  }

  const renderRiskBadge = (riskLevel: string) => {
    const colorClass = getRiskLevelBadgeClass(riskLevel)
    const label = getRiskLevelText(riskLevel, locale)
    let Icon = Info
    if (riskLevel === "low") Icon = CheckCircle
    if (riskLevel === "medium") Icon = Info
    if (riskLevel === "high") Icon = AlertCircle
    if (riskLevel === "very-high" || riskLevel === "very_high") Icon = XCircle

    return (
      <Badge className={`flex items-center gap-1 ${colorClass} px-2 py-1 rounded-full text-xs font-medium`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  // Handle clicking on an assessment card to view results
  const handleViewAssessmentResults = (assessment: AssessmentResult) => {
    onClose() // Close the modal first
    router.push(`/assessment/${assessment.categoryId}/results?id=${assessment.id}`)
  }

  // Handle close modal - ทำให้ง่ายที่สุด
  const handleCloseModal = () => {
    console.log('handleCloseModal called') // debug log
    onClose()
  }

  const getHealthScore = () => {
    if (!assessments || assessments.length === 0) return 0

    // Calculate average percentage from all assessments
    const totalPercentage = assessments.reduce((sum, assessment) => {
      const percentage = assessment.percentage || 0
      return sum + percentage
    }, 0)

    const averageScore = Math.round(totalPercentage / assessments.length)

    // Ensure the score is within 0-100 range
    return Math.max(0, Math.min(100, averageScore))
  }

  const healthScore = getHealthScore()

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        console.log('Dialog onOpenChange called', open) // debug log
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[900px] h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <BarChart className="h-8 w-8" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("health_overview_modal_title")}
            </span>
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {t("health_overview_modal_description")}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <span className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("loading_data")}...</span>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
            }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}</style>
            <div className="space-y-8">
              {/* Health Score Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-8 border border-blue-200 dark:border-gray-700">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-700 rounded-full -mr-16 -mt-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 dark:bg-purple-700 rounded-full -ml-12 -mb-12 opacity-20"></div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {locale === "th" ? "คะแนนสุขภาพรวม" : "Overall Health Score"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {locale === "th" ? "จากการประเมินทั้งหมด" : "Based on all assessments"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end gap-3">
                      <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {healthScore}
                      </span>
                      <span className="text-2xl text-gray-500 dark:text-gray-400 mb-2">/100</span>
                    </div>

                    <div className="space-y-2">
                      <Progress value={healthScore} className="h-3 bg-gray-200 dark:bg-gray-700" />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{locale === "th" ? "ต่ำ" : "Low"}</span>
                        <span>{locale === "th" ? "สูง" : "High"}</span>
                      </div>
                    </div>

                    <Badge
                      className={`${
                        healthScore >= 80
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : healthScore >= 60
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      } px-3 py-1 text-sm font-medium`}
                    >
                      {healthScore >= 80
                        ? locale === "th"
                          ? "สุขภาพดีเยี่ยม"
                          : "Excellent Health"
                        : healthScore >= 60
                          ? locale === "th"
                            ? "สุขภาพดี"
                            : "Good Health"
                          : locale === "th"
                            ? "ควรปรับปรุง"
                            : "Needs Improvement"}
                    </Badge>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center border-8 border-white dark:border-gray-800 shadow-2xl">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">{healthScore}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {locale === "th" ? "คะแนน" : "Score"}
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg">
                        <Activity className="h-6 w-6" />
                      </div>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {t("total_assessments")}
                      </div>
                      <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                        {dashboardStats?.totalAssessments || 0}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {locale === "th" ? "หมวดหมู่ที่ประเมินแล้ว" : "Categories assessed"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 border-purple-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-600 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {t("last_assessment")}
                      </div>
                      <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                        {getFormattedDate(dashboardStats?.lastAssessmentDate)}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {locale === "th" ? "การประเมินล่าสุด" : "Most recent"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border-emerald-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 dark:bg-emerald-600 rounded-full -mr-10 -mt-10 opacity-30"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-lg">
                        <Shield className="h-6 w-6" />
                      </div>
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {t("overall_risk_level")}
                      </div>
                      <div className="flex items-center gap-2">
                        {dashboardStats?.overallRisk ? (
                          renderRiskBadge(dashboardStats.overallRisk)
                        ) : (
                          <Badge variant="secondary">{t("no_data")}</Badge>
                        )}
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">
                        {locale === "th" ? "ระดับความเสี่ยงโดยรวม" : "Overall risk assessment"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment Categories */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t("your_assessments_title", { ns: "guest_health_overview" })}
                  </h3>
                </div>

                {assessments.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="p-4 rounded-full bg-gray-200 dark:bg-gray-600 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t("no_assessments_completed")}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === "th" ? "เริ่มประเมินสุขภาพเพื่อดูผลลัพธ์ที่นี่" : "Start health assessments to see results here"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assessments.map((assessment) => {
                      const categoryInfo = assessmentCategories.find((cat) => cat.id === assessment.categoryId)
                      const gradient = getCategoryGradient(assessment.categoryId)
                      const displayPercentage = assessment.percentage || 0

                      return (
                        <Card
                          key={assessment.id}
                          onClick={() => handleViewAssessmentResults(assessment)}
                          className="group relative overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 rounded-2xl"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 dark:to-transparent"></div>
                          <CardContent className="p-6 relative group-hover:scale-[1.02] transition-transform duration-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                                >
                                  {getCategoryIcon(assessment.categoryId)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {categoryInfo?.title || assessment.category}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {getFormattedDate(assessment.completedAt)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                {renderRiskBadge(assessment.riskLevel)}
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {displayPercentage}%
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {locale === "th" ? "คะแนน" : "Score"}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Progress
                                  value={displayPercentage}
                                  className="h-3 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600"
                                />
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {locale === "th" ? "คลิกเพื่อดูรายละเอียด" : "Click to view details"}
                                  </span>
                                  <span className="font-medium">{displayPercentage}%</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer with Close Button */}
        <div className="flex justify-end p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Button
            onClick={() => {
              console.log('Close button clicked') // debug log
              onClose()
            }}
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}