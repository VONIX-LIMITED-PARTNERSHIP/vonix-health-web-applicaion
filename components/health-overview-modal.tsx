"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { getRiskLevelText, getRiskLevelBadgeClass } from "@/utils/risk-level"
import type { AssessmentResult, DashboardStats } from "@/types/assessment"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs" // Correct import path

interface HealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HealthOverviewModal({ isOpen, onClose }: HealthOverviewModalProps) {
  const { t } = useTranslation(["common", "health_overview"])
  const { locale } = useLanguage()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [userAssessments, setUserAssessments] = useState<AssessmentResult[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient() // Initialize Supabase client

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      const fetchHealthOverview = async () => {
        try {
          // Fetch dashboard stats
          const { data: statsData, error: statsError } = await supabase
            .from("profiles")
            .select("dashboard_stats")
            .single()

          if (statsError) {
            console.error("Error fetching dashboard stats:", statsError)
            setDashboardStats(null)
          } else {
            setDashboardStats(statsData?.dashboard_stats || null)
          }

          // Fetch user assessments
          const { data: assessmentsData, error: assessmentsError } = await supabase
            .from("assessments")
            .select("*")
            .order("completed_at", { ascending: false })

          if (assessmentsError) {
            console.error("Error fetching user assessments:", assessmentsError)
            setUserAssessments([])
          } else {
            // Map to AssessmentResult type, assuming column names match
            const mappedAssessments: AssessmentResult[] = assessmentsData.map((item: any) => ({
              id: item.id,
              category: item.category_id, // Assuming category_id from DB maps to category
              completedAt: item.completed_at,
              answers: item.answers,
              totalScore: item.total_score,
              maxScore: item.max_score,
              percentage: item.percentage,
              riskLevel: item.risk_level,
              riskFactors: item.ai_analysis?.riskFactors, // Assuming AI analysis is nested in DB
              recommendations: item.ai_analysis?.recommendations,
              summary: item.ai_analysis?.summary,
            }))
            setUserAssessments(mappedAssessments)
          }
        } catch (error) {
          console.error("Failed to load health overview data:", error)
          setDashboardStats(null)
          setUserAssessments([])
        } finally {
          setLoading(false)
        }
      }
      fetchHealthOverview()
    }
  }, [isOpen, supabase])

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

  const renderRiskBadge = (riskLevel: AssessmentResult["riskLevel"]) => {
    const colorClass = getRiskLevelBadgeClass(riskLevel)
    const label = getRiskLevelText(riskLevel, locale)
    let Icon = Info
    if (riskLevel === "low") Icon = CheckCircle
    if (riskLevel === "medium") Icon = Info
    if (riskLevel === "high") Icon = AlertCircle
    if (riskLevel === "very-high") Icon = XCircle

    return (
      <Badge className={`flex items-center gap-1 ${colorClass} px-2 py-1 rounded-full text-xs font-medium`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const handleViewResults = (assessment: AssessmentResult) => {
    onClose() // Close the modal
    router.push(`/assessment/${assessment.category}/results?id=${assessment.id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BarChart className="h-6 w-6 text-blue-600" />
            {t("health_overview_title", { ns: "health_overview" })}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {t("health_overview_description", { ns: "health_overview" })}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("loading_data")}...</span>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Activity className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("total_assessments")}</div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {dashboardStats?.totalAssessments || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 border-purple-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("last_assessment")}</div>
                  <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                    {getFormattedDate(dashboardStats?.lastAssessmentDate)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 border-red-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Shield className="h-6 w-6 text-red-600 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("overall_risk_level")}</div>
                  <div className="text-lg font-bold">
                    {dashboardStats?.overallRisk ? (
                      renderRiskBadge(dashboardStats.overallRisk)
                    ) : (
                      <Badge variant="secondary">{t("no_data")}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {t("your_assessments_title", { ns: "health_overview" })}
            </h3>
            {userAssessments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Info className="mx-auto h-10 w-10 mb-3" />
                <p>{t("no_assessments_completed")}</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {userAssessments.map((assessment) => {
                  const categoryInfo = assessmentCategories.find((cat) => cat.id === assessment.category)
                  return (
                    <Card
                      key={assessment.id}
                      className="shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleViewResults(assessment)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {getCategoryIcon(assessment.category)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {categoryInfo?.title || assessment.category}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {t("completed_on")}: {getFormattedDate(assessment.completedAt)}
                            </div>
                          </div>
                        </div>
                        {renderRiskBadge(assessment.riskLevel)}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {t("general_recommendations_title", { ns: "health_overview" })}
            </h3>
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>{t("no_recommendations_yet")}</p>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
