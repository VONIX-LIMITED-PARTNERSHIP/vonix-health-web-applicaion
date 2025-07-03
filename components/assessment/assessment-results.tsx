"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Calendar,
  FileText,
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { useLanguage } from "@/contexts/language-context"

interface AssessmentResultsProps {
  categoryId: string
  assessmentResult: AssessmentResult
  answers: AssessmentAnswer[]
  aiAnalysis?: any
  assessmentData?: any // Raw data from database
}

export function AssessmentResults({
  categoryId,
  assessmentResult,
  answers,
  aiAnalysis,
  assessmentData,
}: AssessmentResultsProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const { getRiskLevelLabel, getRiskLevelDescription } = useRiskLevelTranslation()
  const { locale } = useLanguage()

  // Debug logging
  useEffect(() => {
    console.log("🔍 AssessmentResults Debug Info:")
    console.log("categoryId:", categoryId)
    console.log("assessmentResult:", assessmentResult)
    console.log("aiAnalysis:", aiAnalysis)
    console.log("assessmentData:", assessmentData)
    console.log("locale:", locale)
  }, [categoryId, assessmentResult, aiAnalysis, assessmentData, locale])

  // Define category titles mapping
  const categoryTitles = useMemo(
    () => ({
      th: {
        basic: "ข้อมูลส่วนตัว",
        mental: "สุขภาพจิต",
        physical: "สุขภาพกาย",
        lifestyle: "วิถีชีวิต",
        heart: "หัวใจและหลอดเลือด",
        nutrition: "ไลฟ์สไตล์และโภชนาการ",
        sleep: "คุณภาพการนอน",
      },
      en: {
        basic: "Personal Information",
        mental: "Mental Health",
        physical: "Physical Health",
        lifestyle: "Lifestyle",
        heart: "Heart & Cardiovascular",
        nutrition: "Lifestyle & Nutrition",
        sleep: "Sleep Quality",
      },
    }),
    [],
  )

  // Define translations
  const translations = useMemo(
    () => ({
      th: {
        assessmentResults: "ผลการประเมิน",
        backToHome: "กลับหน้าหลัก",
        shareResults: "แชร์ผลลัพธ์",
        downloadPDF: "ดาวน์โหลด PDF",
        riskFactorsFound: "ปัจจัยเสี่ยงที่พบ",
        recommendations: "คำแนะนำ",
        assessmentDate: "วันที่ทำแบบประเมิน",
        numberOfQuestions: "จำนวนคำถาม",
        questions: "ข้อ",
        retakeAssessment: "ทำแบบประเมินใหม่",
        viewDetails: "ดูรายละเอียดคำตอบ",
        hideDetails: "ซ่อนรายละเอียด",
        answerDetails: "รายละเอียดคำตอบ",
        question: "คำถามที่",
        answer: "คำตอบ",
        score: "คะแนน",
        note: "หมายเหตุ",
        disclaimer:
          "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยหรือมีอาการที่น่ากังวล แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม",
      },
      en: {
        assessmentResults: "Assessment Results",
        backToHome: "Back to Home",
        shareResults: "Share Results",
        downloadPDF: "Download PDF",
        riskFactorsFound: "Risk Factors Found",
        recommendations: "Recommendations",
        assessmentDate: "Assessment Date",
        numberOfQuestions: "Number of Questions",
        questions: "questions",
        retakeAssessment: "Retake Assessment",
        viewDetails: "View Answer Details",
        hideDetails: "Hide Details",
        answerDetails: "Answer Details",
        question: "Question",
        answer: "Answer",
        score: "Score",
        note: "Note",
        disclaimer:
          "This assessment result is for preliminary information only and cannot replace medical diagnosis. If you have any concerns or worrying symptoms, it is recommended to consult a doctor or specialist for appropriate examination and treatment.",
      },
    }),
    [],
  )

  // Get current language translations
  const t = translations[locale as keyof typeof translations] || translations.th

  // Get category title in current language
  const categoryTitle =
    categoryTitles[locale as keyof typeof categoryTitles]?.[categoryId as keyof typeof categoryTitles.th] ||
    categoryTitles.th[categoryId as keyof typeof categoryTitles.th] ||
    "Assessment"

  // Get bilingual data based on current language and available sources
  const bilingualData = useMemo(() => {
    console.log("🔍 Processing bilingual data...")

    // Priority 1: Use assessmentData from database (new bilingual format)
    if (assessmentData) {
      console.log("📊 Using assessmentData from database")
      const isEnglish = locale === "en"

      // Get the appropriate language data
      const riskFactors = isEnglish
        ? assessmentData.risk_factors_en && assessmentData.risk_factors_en.length > 0
          ? assessmentData.risk_factors_en
          : assessmentData.risk_factors_th || []
        : assessmentData.risk_factors_th || assessmentData.risk_factors_en || []

      const recommendations = isEnglish
        ? assessmentData.recommendations_en && assessmentData.recommendations_en.length > 0
          ? assessmentData.recommendations_en
          : assessmentData.recommendations_th || []
        : assessmentData.recommendations_th || assessmentData.recommendations_en || []

      const summary = isEnglish
        ? assessmentData.summary_en || assessmentData.summary_th || ""
        : assessmentData.summary_th || assessmentData.summary_en || ""

      const result = {
        riskFactors,
        recommendations,
        summary,
        categoryTitle: isEnglish
          ? assessmentData.category_title_en || assessmentData.category_title_th || categoryTitle
          : assessmentData.category_title_th || assessmentData.category_title_en || categoryTitle,
      }

      console.log("📊 Database result:", result)
      return result
    }

    // Priority 2: Use aiAnalysis (new bilingual format)
    if (aiAnalysis) {
      console.log("🤖 Using aiAnalysis data")
      const isEnglish = locale === "en"
      const result = {
        riskFactors: isEnglish
          ? aiAnalysis.riskFactors_en || aiAnalysis.riskFactors_th || aiAnalysis.riskFactors || []
          : aiAnalysis.riskFactors_th || aiAnalysis.riskFactors || [],
        recommendations: isEnglish
          ? aiAnalysis.recommendations_en || aiAnalysis.recommendations_th || aiAnalysis.recommendations || []
          : aiAnalysis.recommendations_th || aiAnalysis.recommendations || [],
        summary: isEnglish
          ? aiAnalysis.summary_en || aiAnalysis.summary_th || aiAnalysis.summary || ""
          : aiAnalysis.summary_th || aiAnalysis.summary || "",
        categoryTitle,
      }
      console.log("🤖 AI Analysis result:", result)
      return result
    }

    // Priority 3: Fallback to assessmentResult (old format)
    console.log("📋 Using fallback assessmentResult")
    const result = {
      riskFactors: assessmentResult.riskFactors || [],
      recommendations: assessmentResult.recommendations || [],
      summary: "",
      categoryTitle,
    }
    console.log("📋 Fallback result:", result)
    return result
  }, [assessmentData, aiAnalysis, assessmentResult, categoryId, locale, categoryTitle])

  // Get risk level information
  const riskInfo = useMemo(() => {
    const label = getRiskLevelLabel(assessmentResult.riskLevel)
    const description = getRiskLevelDescription(assessmentResult.riskLevel)

    switch (assessmentResult.riskLevel?.toLowerCase()) {
      case "low":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label,
          description,
        }
      case "medium":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
          label,
          description,
        }
      case "high":
      case "very-high":
      case "very_high":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label,
          description,
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: FileText,
          label,
          description,
        }
    }
  }, [assessmentResult.riskLevel, getRiskLevelLabel, getRiskLevelDescription])

  const RiskIcon = riskInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              {t.shareResults}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t.downloadPDF}
            </Button>
          </div>
        </div>

        {/* Debug Information (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-yellow-700 space-y-1">
              <div>
                <strong>Risk Factors:</strong> {JSON.stringify(bilingualData.riskFactors)}
              </div>
              <div>
                <strong>Recommendations:</strong> {JSON.stringify(bilingualData.recommendations)}
              </div>
              <div>
                <strong>Summary:</strong> {bilingualData.summary}
              </div>
              <div>
                <strong>Locale:</strong> {locale}
              </div>
              <div>
                <strong>Has Assessment Data:</strong> {!!assessmentData}
              </div>
              <div>
                <strong>Has AI Analysis:</strong> {!!aiAnalysis}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Assessment Results */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${riskInfo.bgColor} ${riskInfo.borderColor} border-2`}>
                <RiskIcon className={`h-12 w-12 ${riskInfo.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t.assessmentResults}
              {bilingualData.categoryTitle}
            </CardTitle>
            <p className="text-gray-600">{riskInfo.description}</p>
            {bilingualData.summary && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm leading-relaxed">{bilingualData.summary}</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Risk Level Badge */}
            <div className="text-center space-y-6">
              <Badge variant="secondary" className={`${riskInfo.color} ${riskInfo.bgColor} text-xl px-6 py-3`}>
                {riskInfo.label}
              </Badge>

              {/* Risk Factors Count */}
              {bilingualData.riskFactors && bilingualData.riskFactors.length > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{bilingualData.riskFactors.length}</div>
                  <div className="text-sm text-gray-600">{t.riskFactorsFound}</div>
                </div>
              )}
            </div>

            <Separator />

            {/* Risk Factors and Recommendations - Always show sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  {t.riskFactorsFound}
                </h3>
                {bilingualData.riskFactors && bilingualData.riskFactors.length > 0 ? (
                  <ScrollArea className="h-32">
                    <ul className="space-y-2">
                      {bilingualData.riskFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">
                    {locale === "en" ? "No specific risk factors identified" : "ไม่พบปัจจัยเสี่ยงเฉพาะ"}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {t.recommendations}
                </h3>
                {bilingualData.recommendations && bilingualData.recommendations.length > 0 ? (
                  <ScrollArea className="h-32">
                    <ul className="space-y-2">
                      {bilingualData.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">
                    {locale === "en" ? "No specific recommendations available" : "ไม่มีคำแนะนำเฉพาะ"}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t.assessmentDate}
                </span>
                <span className="font-medium">
                  {assessmentData?.completed_at
                    ? new Date(assessmentData.completed_at).toLocaleDateString(locale === "en" ? "en-US" : "th-TH")
                    : new Date().toLocaleDateString(locale === "en" ? "en-US" : "th-TH")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t.numberOfQuestions}
                </span>
                <span className="font-medium">
                  {answers.length} {t.questions}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => router.push(`/assessment/${categoryId}`)} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.retakeAssessment}
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                {showDetails ? t.hideDetails : t.viewDetails}
              </Button>
            </div>

            {/* Answer Details */}
            {showDetails && answers.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator />
                <h3 className="font-semibold text-gray-800">{t.answerDetails}</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {t.question} {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.answer}:{" "}
                          {Array.isArray(answer.value)
                            ? answer.value.join(", ")
                            : String(answer.value || answer.answer)}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            {t.score}: {answer.score}
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

        {/* Disclaimer */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t.note}:</strong> {t.disclaimer}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
