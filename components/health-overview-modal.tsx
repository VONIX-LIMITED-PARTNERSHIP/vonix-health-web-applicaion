"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Apple,
  Brain,
  Dumbbell,
  Moon,
  User,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  X,
} from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import { getRiskLevelText, getRiskLevelBadgeClass } from "@/utils/risk-level"

const categoryIcons = {
  basic: User,
  heart: Heart,
  nutrition: Apple,
  mental: Brain,
  physical: Dumbbell,
  sleep: Moon,
}

interface HealthOverviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AssessmentData {
  id: string
  category_id: string
  category_title: string
  percentage: number
  risk_level: string
  completed_at: string
  answers: any[]
  ai_analysis?: any
}

interface HealthStats {
  overallScore: number
  riskFactorsCount: number
  assessmentsCompleted: number
  canGenerateReport: boolean
}

export function HealthOverviewModal({ open, onOpenChange }: HealthOverviewModalProps) {
  const { user } = useAuth()
  const { locale } = useLanguage()
  const { t } = useTranslation(["common"])
  const supabase = createClientComponentClient()

  const [assessments, setAssessments] = useState<AssessmentData[]>([])
  const [healthStats, setHealthStats] = useState<HealthStats>({
    overallScore: 0,
    riskFactorsCount: 0,
    assessmentsCompleted: 0,
    canGenerateReport: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get only the latest assessment for each category
  const getLatestAssessmentsByCategory = (allAssessments: AssessmentData[]): AssessmentData[] => {
    const categoryMap = new Map<string, AssessmentData>()

    // Group by category and keep only the latest one
    allAssessments.forEach((assessment) => {
      const existing = categoryMap.get(assessment.category_id)
      if (!existing || new Date(assessment.completed_at) > new Date(existing.completed_at)) {
        categoryMap.set(assessment.category_id, assessment)
      }
    })

    // Convert back to array and sort by completion date (latest first)
    return Array.from(categoryMap.values()).sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
    )
  }

  const fetchHealthOverview = async () => {
    if (!user) {
      setError("User not logged in")
      setLoading(false)
      return
    }

    try {
      console.log("🔍 HealthOverview: กำลังโหลดข้อมูลภาพรวมสุขภาพ")

      // Fetch all assessments for the user
      const { data: allAssessments, error: fetchError } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })

      if (fetchError) {
        console.error("❌ HealthOverview: เกิดข้อผิดพลาดในการโหลดข้อมูล:", fetchError)
        setError("Failed to load health overview")
        return
      }

      if (!allAssessments || allAssessments.length === 0) {
        console.log("📊 HealthOverview: ไม่พบข้อมูลการประเมิน")
        setAssessments([])
        setHealthStats({
          overallScore: 0,
          riskFactorsCount: 0,
          assessmentsCompleted: 0,
          canGenerateReport: false,
        })
        return
      }

      // Get only the latest assessment for each category
      const latestAssessments = getLatestAssessmentsByCategory(allAssessments)

      console.log(`📊 HealthOverview: พบการประเมินทั้งหมด ${allAssessments.length} รายการ`)
      console.log(`📊 HealthOverview: การประเมินล่าสุดแต่ละประเภท ${latestAssessments.length} รายการ`)

      setAssessments(latestAssessments)

      // Calculate health statistics from latest assessments only
      const totalScore = latestAssessments.reduce((sum, assessment) => sum + assessment.percentage, 0)
      const averageScore = latestAssessments.length > 0 ? Math.round(totalScore / latestAssessments.length) : 0

      // Count risk factors from AI analysis
      let totalRiskFactors = 0
      latestAssessments.forEach((assessment) => {
        if (assessment.ai_analysis?.riskFactors) {
          if (Array.isArray(assessment.ai_analysis.riskFactors.th)) {
            totalRiskFactors += assessment.ai_analysis.riskFactors.th.length
          } else if (Array.isArray(assessment.ai_analysis.riskFactors.en)) {
            totalRiskFactors += assessment.ai_analysis.riskFactors.en.length
          }
        }
      })

      const stats: HealthStats = {
        overallScore: averageScore,
        riskFactorsCount: totalRiskFactors,
        assessmentsCompleted: latestAssessments.length,
        canGenerateReport: latestAssessments.length >= 3,
      }

      setHealthStats(stats)

      console.log("✅ HealthOverview: โหลดข้อมูลภาพรวมสุขภาพสำเร็จ")
      console.log("📊 สถิติ:", stats)
    } catch (err) {
      console.error("❌ HealthOverview: เกิดข้อผิดพลาดที่ไม่คาดคิด:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && user) {
      fetchHealthOverview()
    }
  }, [open, user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return locale === "en"
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
  }

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("not_logged_in")}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t("login_to_view_health_overview")}</p>
            <Button onClick={() => onOpenChange(false)}>{t("close")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{t("health_overview_modal_title")}</DialogTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{t("health_overview_modal_description")}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t("loading_details")}</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("error_loading_details")}</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("no_assessment_data")}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t("start_assessment_to_view")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  {t("summary_overview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{healthStats.overallScore}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("overall_score")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{healthStats.riskFactorsCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("risk_factors_found")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{healthStats.assessmentsCompleted}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("assessments_completed")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {healthStats.canGenerateReport ? (
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                      ) : (
                        <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("health_report_status")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Latest Assessments */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                {t("latest_assessments")}
              </h3>
              <div className="grid gap-4">
                {assessments.map((assessment) => {
                  const IconComponent = categoryIcons[assessment.category_id as keyof typeof categoryIcons] || User
                  const riskLevelText = getRiskLevelText(assessment.risk_level, locale)
                  const riskLevelBadgeClass = getRiskLevelBadgeClass(assessment.risk_level)

                  return (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">{assessment.category_title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(assessment.completed_at)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{assessment.percentage}%</div>
                            <Badge className={`text-xs ${riskLevelBadgeClass}`}>{riskLevelText}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button onClick={() => onOpenChange(false)} className="px-8">
                {t("close")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
