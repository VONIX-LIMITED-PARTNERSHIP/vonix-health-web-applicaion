"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Activity,
  Heart,
  BarChart,
  User,
  Apple,
  Brain,
  Dumbbell,
  Moon,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import type { DashboardStats, AssessmentResult } from "@/types/assessment"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"

interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
}

const categoryIcons = {
  basic: User,
  heart: Heart,
  nutrition: Apple,
  mental: Brain,
  physical: Dumbbell,
  sleep: Moon,
}

const categoryNames = {
  basic: { th: "ข้อมูลพื้นฐาน", en: "Basic Information" },
  heart: { th: "สุขภาพหัวใจ", en: "Heart Health" },
  nutrition: { th: "โภชนาการ", en: "Nutrition" },
  mental: { th: "สุขภาพจิต", en: "Mental Health" },
  physical: { th: "กิจกรรมทางกาย", en: "Physical Activity" },
  sleep: { th: "สุขภาพการนอน", en: "Sleep Health" },
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

  const getRiskLevelText = (risk: string) => {
    switch (risk?.toLowerCase()) {
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
        return locale === "th" ? "ไม่ระบุ" : "Not Specified"
    }
  }

  const getRiskBadgeClass = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "very-high":
      case "very_high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "high":
      case "very-high":
      case "very_high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return locale === "th" ? "ไม่ระบุวันที่" : "Date not specified"
      }

      if (locale === "th") {
        return date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return locale === "th" ? "ไม่ระบุวันที่" : "Date not specified"
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categoryNames[categoryId as keyof typeof categoryNames]
    return category ? category[locale as "th" | "en"] : categoryId
  }

  const getOverallRiskLevel = () => {
    if (!latestAssessments || latestAssessments.length === 0) {
      return locale === "th" ? "ยังไม่ได้ประเมิน" : "Not Assessed"
    }

    const riskLevels = latestAssessments.map((assessment) => assessment.result.riskLevel).filter(Boolean)

    if (riskLevels.length === 0) {
      return locale === "th" ? "ยังไม่ได้ประเมิน" : "Not Assessed"
    }

    // Find the highest risk level
    if (
      riskLevels.some(
        (level) => level?.toLowerCase().includes("very-high") || level?.toLowerCase().includes("very_high"),
      )
    ) {
      return "very-high"
    }
    if (riskLevels.some((level) => level?.toLowerCase() === "high")) {
      return "high"
    }
    if (riskLevels.some((level) => level?.toLowerCase() === "medium")) {
      return "medium"
    }
    return "low"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600" />
                {locale === "th" ? "ภาพรวมสุขภาพ (ทดลองใช้งาน)" : "Health Overview (Guest Mode)"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                {locale === "th" ? "สรุปผลการประเมินสุขภาพของคุณ" : "Summary of your health assessment results"}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">{locale === "th" ? "กำลังโหลดข้อมูล..." : "Loading data..."}</span>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              {/* Overall Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Assessments */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {locale === "th" ? "การประเมินทั้งหมด" : "Total Assessments"}
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {dashboardStats?.totalAssessments || latestAssessments.length || 0}
                        </p>
                      </div>
                      <BarChart className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Last Assessment Date */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          {locale === "th" ? "ประเมินล่าสุด" : "Last Assessment"}
                        </p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {latestAssessments.length > 0
                            ? formatDate(latestAssessments[0].result.timestamp)
                            : locale === "th"
                              ? "ยังไม่มีข้อมูล"
                              : "No data"}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Risk Level */}
                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                          {locale === "th" ? "ระดับความเสี่ยงรวม" : "Overall Risk Level"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRiskIcon(getOverallRiskLevel())}
                          <p className="text-lg font-bold text-red-900 dark:text-red-100">
                            {getRiskLevelText(getOverallRiskLevel())}
                          </p>
                        </div>
                      </div>
                      <Heart className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Assessment Results */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  {locale === "th" ? "ผลการประเมินแต่ละด้าน" : "Assessment Results by Category"}
                </h3>

                {latestAssessments.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {locale === "th" ? "ยังไม่มีข้อมูลการประเมิน" : "No Assessment Data"}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-500">
                      {locale === "th" ? "เริ่มทำแบบประเมินเพื่อดูผลลัพธ์ที่นี่" : "Start taking assessments to see results here"}
                    </p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {latestAssessments.map((assessment, index) => {
                      const IconComponent = categoryIcons[assessment.category as keyof typeof categoryIcons] || Activity
                      const categoryName = getCategoryName(assessment.category)

                      return (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                  <IconComponent className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{categoryName}</CardTitle>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(assessment.result.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getRiskIcon(assessment.result.riskLevel || "")}
                                <Badge className={getRiskBadgeClass(assessment.result.riskLevel || "")}>
                                  {getRiskLevelText(assessment.result.riskLevel || "")}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {/* Summary */}
                            {assessment.result.summary && (
                              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  {locale === "th" ? "สรุปผล" : "Summary"}
                                </h5>
                                <p className="text-sm text-blue-700 dark:text-blue-300">{assessment.result.summary}</p>
                              </div>
                            )}

                            {/* Recommendations */}
                            {assessment.result.recommendations && assessment.result.recommendations.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {locale === "th" ? "คำแนะนำ" : "Recommendations"}
                                </h5>
                                <ul className="space-y-1">
                                  {assessment.result.recommendations.slice(0, 3).map((rec, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                                    >
                                      <span className="text-green-500 mt-0.5">•</span>
                                      {rec}
                                    </li>
                                  ))}
                                  {assessment.result.recommendations.length > 3 && (
                                    <li className="text-xs text-gray-500 dark:text-gray-500 ml-4">
                                      +{assessment.result.recommendations.length - 3}{" "}
                                      {locale === "th" ? "รายการเพิ่มเติม" : "more items"}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* No data message */}
                            {!assessment.result.summary &&
                              (!assessment.result.recommendations ||
                                assessment.result.recommendations.length === 0) && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                  {locale === "th" ? "ไม่มีข้อมูลเพิ่มเติม" : "No additional information available"}
                                </p>
                              )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              <Separator />

              {/* General Recommendations */}
              {dashboardStats?.recommendations && dashboardStats.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {locale === "th" ? "คำแนะนำทั่วไป" : "General Recommendations"}
                  </h3>
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {dashboardStats.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Guest Mode Notice */}
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        {locale === "th" ? "โหมดทดลองใช้งาน" : "Guest Mode"}
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {locale === "th"
                          ? "ข้อมูลนี้เป็นการทดลองใช้งานเท่านั้น และจะไม่ถูกบันทึกในระบบ หากต้องการบันทึกผลและใช้งานฟีเจอร์เต็มรูปแบบ กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ"
                          : "This data is for trial purposes only and will not be saved. To save results and access full features, please register or log in."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="px-6">
            {locale === "th" ? "ปิด" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
