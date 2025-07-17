"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Heart,
  Sparkles,
  Award,
  Activity,
  Download,
  Share2,
  RefreshCw,
  Shield,
  CheckCircle,
} from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getRiskLevelBadgeClass } from "@/utils/risk-level"
import type { AssessmentAnswer } from "@/types/assessment"
import { getRiskLevelDescription } from "@/utils/risk-level" // Import getRiskLevelDescription

export default function GuestAssessmentResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { guestUser } = useGuestAuth()
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  const categoryId = searchParams.get("category")

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!guestUser) {
      router.push("/guest-login")
      return
    }

    if (!categoryId) {
      setError(locale === "th" ? "ไม่พบข้อมูลการประเมิน" : "Assessment data not found")
      setLoading(false)
      return
    }

    loadAssessmentResults()
  }, [guestUser, categoryId, locale, router])

  const loadAssessmentResults = () => {
    try {
      const assessmentData = GuestAssessmentService.getAssessmentByCategory(categoryId!)

      if (!assessmentData) {
        setError(locale === "th" ? "ไม่พบผลการประเมิน" : "Assessment results not found")
        setLoading(false)
        return
      }

      setAssessment(assessmentData)
    } catch (err) {
      console.error("Error loading guest assessment results:", err)
      setError(locale === "th" ? "เกิดข้อผิดพลาดในการโหลดผลการประเมิน" : "Error loading assessment results")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelInfo = (riskLevel: string) => {
    const label = getRiskLevelLabel(riskLevel)
    const description = getRiskLevelDescription(riskLevel)

    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          gradientFrom: "from-emerald-400",
          gradientTo: "to-green-500",
          icon: CheckCircle,
          label,
          description,
          percentage: 85, // Placeholder for visual score
        }
      case "medium":
      case "ปานกลาง":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          gradientFrom: "from-amber-400",
          gradientTo: "to-orange-500",
          icon: AlertTriangle,
          label,
          description,
          percentage: 60, // Placeholder for visual score
        }
      case "high":
      case "สูง":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          gradientFrom: "from-red-400",
          gradientTo: "to-rose-500",
          icon: XCircle,
          label,
          description,
          percentage: 30, // Placeholder for visual score
        }
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return {
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          gradientFrom: "from-red-500",
          gradientTo: "to-red-700",
          icon: XCircle,
          label,
          description,
          percentage: 15, // Placeholder for visual score
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          gradientFrom: "from-gray-400",
          gradientTo: "to-gray-500",
          icon: FileText,
          label,
          description,
          percentage: 50, // Placeholder for visual score
        }
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

  const getCategoryTitle = (catId: string) => {
    switch (catId) {
      case "basic":
        return locale === "th" ? "ข้อมูลส่วนตัว" : "Basic Information"
      case "mental":
        return locale === "th" ? "สุขภาพจิต" : "Mental Health"
      case "physical":
        return locale === "th" ? "สุขภาพกาย" : "Physical Health"
      case "lifestyle":
        return locale === "th" ? "วิถีชีวิต" : "Lifestyle"
      default:
        return locale === "th" ? "แบบประเมิน" : "Assessment"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (locale === "th") {
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!guestUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">{t("not_logged_in")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {locale === "th" ? "กรุณาเข้าสู่ระบบเพื่อดูผลการประเมิน" : "Please log in to view assessment results"}
            </p>
            <Button asChild>
              <Link href="/guest-login">{t("login")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-bold mb-2">{t("loading")}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === "th" ? "กำลังโหลดผลการประเมิน..." : "Loading assessment results..."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-bold mb-2">{t("error")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild>
              <Link href="/">{t("back")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const riskInfo = getRiskLevelInfo(assessment.risk_level)
  const RiskIcon = riskInfo.icon
  const categoryTitle = getCategoryTitle(assessment.category_id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Professional Header with Trust Indicators */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-8 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {t("assessment_results")} {categoryTitle}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {locale === "th" ? "ผลการประเมินสุขภาพแบบทดลอง" : "Trial Health Assessment Results"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Responsive Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 bg-transparent text-xs sm:text-sm px-3 py-2"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t("share_results")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 bg-transparent text-xs sm:text-sm px-3 py-2"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t("download_pdf")}
            </Button>
          </div>
        </div>

        {/* Main Results Card with Enhanced Design */}
        <Card className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl dark:shadow-black/50 rounded-3xl overflow-hidden animate-fade-in-up animation-delay-200">
          {/* Gradient Header */}
          <div
            className={`bg-gradient-to-r ${riskInfo.gradientFrom} ${riskInfo.gradientTo} p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm animate-pulse-slow">
                  <RiskIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                  {t("assessment_results")} {categoryTitle}
                </h1>
                <p className="text-white/90 text-lg">{riskInfo.description}</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Heart className="h-6 w-6" />
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {/* Professional Guest Mode Notice */}
            <Alert className="mb-8 border-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    {locale === "th" ? "โหมดทดลองใช้งาน" : "Trial Mode"}
                  </h4>
                  <AlertDescription className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
                    {locale === "th"
                      ? "ข้อมูลนี้เป็นการทดลองใช้งานและจะไม่ถูกบันทึกถาวร หากต้องการบันทึกข้อมูลและใช้งานฟีเจอร์เต็มรูปแบบ กรุณาสมัครสมาชิก"
                      : "This is trial mode data and will not be permanently saved. To save your data and access full features, please register for an account."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {/* Professional Score Visualization */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-600">
              <div className="text-center space-y-6">
                {/* Enhanced Circular Progress */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-600"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (isAnimating ? 0 : assessment.percentage / 100))}`}
                        className="transition-all duration-2000 ease-out drop-shadow-lg"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className={riskInfo.gradientFrom.replace("from-", "stop-")} />
                          <stop offset="100%" className={riskInfo.gradientTo.replace("to-", "stop-")} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-3xl sm:text-4xl font-bold ${riskInfo.color} animate-count-up`}>
                          {isAnimating ? 0 : assessment.percentage}%
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium mt-1">
                          {locale === "th" ? "คะแนนสุขภาพ" : "Health Score"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Risk Level Badge */}
                {assessment.category_id !== "basic" && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <Badge
                        className={`${getRiskLevelBadgeClass(
                          assessment.risk_level,
                        )} text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-xl animate-bounce-subtle`}
                      >
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {getRiskLevelLabel(assessment.risk_level)}
                      </Badge>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Enhanced Risk Factors and Recommendations */}
            {(assessment.ai_analysis?.riskFactors?.th?.length > 0 ||
              assessment.ai_analysis?.recommendations?.th?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Risk Factors */}
                {assessment.ai_analysis?.riskFactors?.th?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      {t("risk_factors")}
                    </h3>
                    <div className="space-y-3">
                      {(locale === "th"
                        ? assessment.ai_analysis.riskFactors.th
                        : assessment.ai_analysis.riskFactors.en
                      ).map((factor: string, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/80 dark:to-gray-700/80 dark:border dark:border-orange-500/40 rounded-xl p-4 border-l-4 border-orange-400 animate-slide-in-left"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{factor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {assessment.ai_analysis?.recommendations?.th?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      {t("recommendations")}
                    </h3>
                    <div className="space-y-3">
                      {(locale === "th"
                        ? assessment.ai_analysis.recommendations.th
                        : assessment.ai_analysis.recommendations.en
                      ).map((recommendation: string, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800/80 dark:to-gray-700/80 dark:border dark:border-green-500/40 rounded-xl p-4 border-l-4 border-green-400 animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Summary (if available) */}
            {assessment.ai_analysis?.summary && (
              <Card className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {locale === "th" ? "สรุปผลการประเมิน" : "Assessment Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-700 dark:text-gray-200">
                    {locale === "th" ? assessment.ai_analysis.summary.th : assessment.ai_analysis.summary.en}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Assessment Info Card */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800/90 dark:to-gray-700/90 dark:border dark:border-gray-600 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {locale === "th" ? "ข้อมูลการประเมิน" : "Assessment Information"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("assessment_date")}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {formatDate(assessment.completed_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {t("questions_answered")}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {assessment.answers.length} {locale === "th" ? "ข้อ" : "questions"}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8">
              <Button
                onClick={() => router.push(`/guest-assessment?category=${assessment.category_id}`)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t("retake_assessment")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 sm:py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {showDetails ? t("hide_answer_details") : t("view_answer_details")}
              </Button>
            </div>

            {/* Detailed Answers */}
            {showDetails && assessment.answers.length > 0 && (
              <div className="mt-8 space-y-4 animate-fade-in">
                <Separator />
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                  {locale === "th" ? "รายละเอียดคำตอบ" : "Answer Details"}
                </h3>
                <ScrollArea className="h-80">
                  <div className="space-y-4 pr-4">
                    {assessment.answers.map((answer: AssessmentAnswer, index: number) => (
                      <div
                        key={answer.questionId}
                        className="bg-white dark:bg-gray-800/90 dark:border-gray-600 rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                          {locale === "th" ? "คำถามที่" : "Question"} {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {locale === "th" ? "คำตอบ" : "Answer"}:{" "}
                          {Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {locale === "th" ? "คะแนน" : "Score"}: {answer.score}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Disclaimer */}
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800 rounded-2xl animate-fade-in-up animation-delay-400">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            <strong className="text-amber-700 dark:text-amber-400">
              {locale === "th" ? "หมายเหตุสำคัญ:" : "Important Note:"}
            </strong>{" "}
            {locale === "th"
              ? "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยหรือมีอาการที่น่ากังวล แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม"
              : "This assessment result is for informational purposes only and cannot replace medical diagnosis. If you have any concerns or worrying symptoms, it is recommended to consult a doctor or specialist for proper examination and treatment."}
          </AlertDescription>
        </Alert>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .transition-all {
          transition-property: all;
        }
        
        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </div>
  )
}
