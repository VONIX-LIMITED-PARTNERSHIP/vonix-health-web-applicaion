"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Calendar,
  TrendingUp,
  Share2,
  ArrowLeft,
  Download,
  RefreshCw,
  Shield,
  Award,
  Activity,
  FileText,
  Sparkles,
  Target,
} from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import {
  getRiskLevelText,
  getRiskLevelBadgeClass,
  getRiskLevelDescription,
  getBilingualText,
  getBilingualArray,
} from "@/utils/risk-level"
import { useRouter } from "next/navigation"
import type { AssessmentAnswer } from "@/types/assessment"

const categoryIcons = {
  basic: User,
  heart: Heart,
  nutrition: Apple,
  mental: Brain,
  physical: Dumbbell,
  sleep: Moon,
}

interface AssessmentResultsPageProps {
  params: {
    category: string
  }
}

export default function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: userLoading } = useAuth()
  const { locale } = useLanguage()
  const { t } = useTranslation(["common"])
  const supabase = createClientComponentClient()

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  const assessmentId = searchParams.get("id")
  const categoryId = params.category

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchAssessment = async () => {
      if (userLoading) {
        return
      }

      if (!user) {
        setError(t("unauthorized_access"))
        setLoading(false)
        router.push("/login")
        return
      }

      if (!assessmentId) {
        setError("Assessment ID not provided")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await AssessmentService.getAssessmentById(supabase, assessmentId, user.id)

        if (error) {
          setError(error)
        } else if (data) {
          setAssessment(data)
        } else {
          setError(t("assessment_not_found_or_unauthorized"))
        }
      } catch (err) {
        setError("Failed to load assessment results")
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [assessmentId, supabase, user, userLoading, router, t])

  const handleBack = () => {
    router.push("/")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t("assessment_results")} - ${assessment.category_title}`,
          text: `${locale === "th" ? "ผลการประเมินสุขภาพ" : "Health Assessment Results"} ${getRiskLevelText(assessment.risk_level, locale)}`,
          url: window.location.href,
        })
      } catch (err) {
        // Error sharing, e.g., user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(locale === "th" ? "คัดลอกลิงก์แล้ว" : "Link copied to clipboard")
    }
  }

  const handleDownloadPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${assessment.category_title} - ${t("assessment_results")}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .result-section { margin: 20px 0; }
          .risk-level { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .recommendations { margin: 20px 0; }
          .recommendations ul { list-style-type: disc; margin-left: 20px; }
          .disclaimer { margin-top: 30px; padding: 15px; background-color: #fff3cd; border: 1px solid #ffeaa7; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t("assessment_results")} - ${assessment.category_title}</h1>
          <p>${locale === "th" ? "วันที่ประเมิน" : "Assessment Date"}: ${formatDate(assessment.completed_at)}</p>
        </div>
        
        <div class="result-section">
          <h2>${locale === "th" ? "ระดับความเสี่ยง" : "Risk Level"}</h2>
          <div class="risk-level">${getRiskLevelText(assessment.risk_level, locale)}</div>
          <p>${getRiskLevelDescription(assessment.risk_level, locale)}</p>
        </div>
        
        ${
          assessment.risk_factors?.length > 0
            ? `
          <div class="result-section">
            <h2>${t("risk_factors")}</h2>
            <ul>
              ${assessment.risk_factors.map((factor: string) => `<li>${factor}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        ${
          assessment.recommendations?.length > 0
            ? `
          <div class="recommendations">
            <h2>${t("recommendations")}</h2>
            <ul>
              ${assessment.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div class="disclaimer">
          <strong>${locale === "th" ? "หมายเหตุสำคัญ:" : "Important Note:"}</strong>
          ${
            locale === "th"
              ? "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยหรือมีอาการที่น่ากังวล แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม"
              : "This assessment result is for informational purposes only and cannot replace medical diagnosis. If you have any concerns or worrying symptoms, it is recommended to consult a doctor or specialist for proper examination and treatment."
          }
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const getRiskLevelInfo = (riskLevel: string) => {
    const label = getRiskLevelText(riskLevel, locale)
    const description = getRiskLevelDescription(riskLevel, locale)

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
          percentage: 85,
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
          percentage: 60,
        }
      case "high":
      case "สูง":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          gradientFrom: "from-red-400",
          gradientTo: "to-rose-500",
          icon: AlertTriangle,
          label,
          description,
          percentage: 30,
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
          icon: AlertTriangle,
          label,
          description,
          percentage: 15,
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
          percentage: 50,
        }
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

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t("loading")}</p>
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("error_loading_analysis")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const IconComponent = categoryIcons[categoryId as keyof typeof categoryIcons] || User
  const riskInfo = getRiskLevelInfo(assessment.risk_level)
  const RiskIcon = riskInfo.icon

  // Safely get bilingual data
  const aiAnalysis = assessment.ai_analysis || null

  const getSafeRiskFactors = () => {
    if (aiAnalysis && aiAnalysis.riskFactors) {
      return getBilingualArray(aiAnalysis.riskFactors, locale)
    }
    if (Array.isArray(assessment.risk_factors)) {
      return assessment.risk_factors
    }
    return []
  }

  const getSafeRecommendations = () => {
    if (aiAnalysis && aiAnalysis.recommendations) {
      return getBilingualArray(aiAnalysis.recommendations, locale)
    }
    if (Array.isArray(assessment.recommendations)) {
      return assessment.recommendations
    }
    return []
  }

  const getSafeSummary = () => {
    if (aiAnalysis && aiAnalysis.summary) {
      return getBilingualText(aiAnalysis.summary, locale)
    }
    return null
  }

  const riskFactors = getSafeRiskFactors()
  const recommendations = getSafeRecommendations()
  const summary = getSafeSummary()

  const completedDate = new Date(assessment.completed_at)
  const formattedDate = formatDate(assessment.completed_at)

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
                    {t("assessment_results")} {assessment.category_title}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {locale === "th" ? "ผลการประเมินสุขภาพ" : "Health Assessment Results"}
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {locale === "th" ? "ปลอดภัย" : "Secure"}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-1">
                  <Award className="h-3 w-3 mr-1" />
                  {locale === "th" ? "มาตรฐาน" : "Standard"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 bg-transparent text-xs sm:text-sm px-3 py-2"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t("share_results")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm animate-pulse-slow">
                  <RiskIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                  {t("assessment_results")} {assessment.category_title}
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
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium mt-1 flex items-center justify-center gap-1">
                          {locale === "th" ? "คะแนนความเสี่ยง" : "Risk Score"}
                        </div>
                        <div className={`text-xs font-medium mt-1 ${riskInfo.color}`}>{riskInfo.label}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Risk Level Badge */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Badge
                      className={`${getRiskLevelBadgeClass(
                        assessment.risk_level,
                      )} text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-xl animate-bounce-subtle`}
                    >
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {riskInfo.label}
                    </Badge>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{assessment.answers?.length || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === "th" ? "คำถามทั้งหมด" : "Total Questions"}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 text-center">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{riskFactors.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === "th" ? "ปัจจัยเสี่ยง" : "Risk Factors"}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 text-center">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{recommendations.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === "th" ? "คำแนะนำ" : "Recommendations"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* AI Summary (if available) */}
            {summary && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-foreground">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    {t("ai_summary")}
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Enhanced Risk Factors and Recommendations */}
            {(riskFactors.length > 0 || recommendations.length > 0) && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Risk Factors */}
                {riskFactors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      {t("risk_factors")}
                    </h3>
                    <div className="space-y-3">
                      {riskFactors.map((factor, index) => (
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
                {recommendations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                        <Lightbulb className="h-6 w-6 text-green-600" />
                      </div>
                      {t("recommendations")}
                    </h3>
                    <div className="space-y-3">
                      {recommendations.map((recommendation, index) => (
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
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {t("questions_answered")}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {assessment.answers?.length || 0} {locale === "th" ? "ข้อ" : "questions"}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8">
              <Button
                onClick={() => router.push(`/assessment/${categoryId}`)}
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
            {showDetails && assessment.answers?.length > 0 && (
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
