"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
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
  Lightbulb,
  Calendar,
  TrendingUp,
  Share2,
  ArrowLeft,
} from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import {
  getRiskLevelText,
  getRiskLevelColor,
  getRiskLevelBadgeClass,
  getRiskLevelDescription,
  getBilingualText,
  getBilingualArray,
} from "@/utils/risk-level"
import { useRouter } from "next/navigation"

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
  const { user } = useAuth()
  const { locale } = useLanguage()
  const { t } = useTranslation(["common"])
  const supabase = createClientComponentClient()

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const assessmentId = searchParams.get("id")
  const categoryId = params.category

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assessmentId) {
        setError("Assessment ID not provided")
        setLoading(false)
        return
      }

      try {
        console.log("🔍 ResultsPage: กำลังโหลดข้อมูลแบบประเมิน รหัส:", assessmentId)

        const { data, error } = await AssessmentService.getAssessmentById(supabase, assessmentId)

        if (error) {
          console.error("❌ ResultsPage: เกิดข้อผิดพลาดในการโหลดข้อมูล:", error)
          setError(error)
        } else if (data) {
          console.log("✅ ResultsPage: โหลดข้อมูลแบบประเมินสำเร็จ รหัส:", data.id)

          // Log detailed assessment data for debugging
          console.log("📊 ResultsPage: โหลดข้อมูลแบบประเมินสำเร็จ:")
          console.log("  - รหัส:", data.id)
          console.log("  - หมวดหมู่:", data.category_id)
          console.log("  - ชื่อ:", data.category_title)
          console.log("  - คะแนน:", data.percentage + "%")
          console.log("  - ระดับความเสี่ยง:", data.risk_level)
          console.log("  - จำนวนคำตอบ:", Array.isArray(data.answers) ? data.answers.length : "ไม่ทราบ")
          console.log("  - เสร็จสิ้นเมื่อ:", data.completed_at)
          console.log("  - มี AI Analysis:", data.ai_analysis ? "ใช่" : "ไม่")

          setAssessment(data)
        } else {
          console.warn("⚠️ ResultsPage: ไม่พบข้อมูลแบบประเมิน")
          setError("Assessment not found")
        }
      } catch (err) {
        console.error("❌ ResultsPage: เกิดข้อผิดพลาดที่ไม่คาดคิด:", err)
        setError("Failed to load assessment results")
      } finally {
        console.log("📊 ResultsPage: เสร็จสิ้นการโหลดผลการประเมิน")
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [assessmentId, supabase])

  const handleBack = () => {
    router.push("/")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.common.assessment_results} - ${assessment.category_title}`,
          text: `${locale === "th" ? "ผลการประเมินสุขภาพ" : "Health Assessment Results"} ${getRiskLevelText(assessment.risk_level, locale)}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert(locale === "th" ? "คัดลอกลิงก์แล้ว" : "Link copied to clipboard")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t.common.error_loading_analysis}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.common.back}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const IconComponent = categoryIcons[categoryId as keyof typeof categoryIcons] || User
  const riskLevelText = getRiskLevelText(assessment.risk_level, locale)
  const riskLevelColor = getRiskLevelColor(assessment.risk_level)
  const riskLevelBadgeClass = getRiskLevelBadgeClass(assessment.risk_level)
  const riskLevelDescription = getRiskLevelDescription(assessment.risk_level, locale)

  // Safely get bilingual data - check if ai_analysis exists and has the expected structure
  const aiAnalysis = assessment.ai_analysis || null

  // Helper function to safely get bilingual arrays
  const getSafeRiskFactors = () => {
    if (aiAnalysis && aiAnalysis.riskFactors) {
      return getBilingualArray(aiAnalysis.riskFactors, locale)
    }
    // Fallback to legacy risk_factors array
    if (Array.isArray(assessment.risk_factors)) {
      return assessment.risk_factors
    }
    return []
  }

  const getSafeRecommendations = () => {
    if (aiAnalysis && aiAnalysis.recommendations) {
      return getBilingualArray(aiAnalysis.recommendations, locale)
    }
    // Fallback to legacy recommendations array
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
  const formattedDate =
    locale === "en"
      ? completedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : completedDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.back}
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.common.assessment_results}</h1>
              <p className="text-gray-600 dark:text-gray-400">{assessment.category_title}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                {t.common.share_results}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Results Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80 dark:border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl dark:text-foreground">{assessment.category_title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
                  </div>
                </div>
              </div>
              <Badge className={`px-4 py-2 text-sm font-medium ${riskLevelBadgeClass}`}>{riskLevelText}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center py-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessment.percentage / 100)}`}
                      className={riskLevelColor}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${riskLevelColor}`}>{assessment.percentage}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.common.score}</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto">{riskLevelDescription}</p>
            </div>

            <Separator />

            {/* Summary (if available from AI analysis) */}
            {summary && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-foreground">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    {t.common.ai_summary}
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Risk Factors */}
            {riskFactors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-foreground">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                  {t.common.risk_factors}
                </h3>
                <div className="grid gap-2">
                  {riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-foreground">
                  <Lightbulb className="mr-2 h-5 w-5 text-green-600" />
                  {t.common.recommendations}
                </h3>
                <div className="grid gap-2">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.back}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            {t.common.share_results}
          </Button>
        </div>
      </div>
    </div>
  )
}
