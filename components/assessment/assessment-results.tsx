"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
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
  Globe,
  Heart,
  Brain,
  Activity,
  Moon,
  Apple,
} from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { useLanguage } from "@/contexts/language-context"

interface AssessmentResultsProps {
  categoryId: string
  assessmentResult: AssessmentResult
  answers: AssessmentAnswer[]
  aiAnalysis?: any
  assessmentData?: any
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
  const { locale, setLocale } = useLanguage()

  // Category icons mapping
  const categoryIcons = {
    heart: Heart,
    mental: Brain,
    physical: Activity,
    sleep: Moon,
    lifestyle: Apple,
    nutrition: Apple,
    basic: FileText,
  }

  const CategoryIcon = categoryIcons[categoryId as keyof typeof categoryIcons] || FileText

  // Category titles mapping
  const categoryTitles = useMemo(
    () => ({
      th: {
        basic: "ข้อมูลส่วนตัว",
        mental: "สุขภาพจิต",
        physical: "สุขภาพกาย",
        lifestyle: "ไลฟ์สไตล์และโภชนาการ",
        heart: "หัวใจและหลอดเลือด",
        nutrition: "โภชนาการ",
        sleep: "คุณภาพการนอน",
      },
      en: {
        basic: "Personal Information",
        mental: "Mental Health",
        physical: "Physical Health",
        lifestyle: "Lifestyle & Nutrition",
        heart: "Heart & Cardiovascular",
        nutrition: "Nutrition",
        sleep: "Sleep Quality",
      },
    }),
    [],
  )

  // Translations
  const translations = useMemo(
    () => ({
      th: {
        assessmentResults: "ผลการประเมิน",
        backToHome: "กลับหน้าหลัก",
        shareResults: "แชร์ผลลัพธ์",
        downloadPDF: "ดาวน์โหลด PDF",
        riskFactorsFound: "ปัจจัยเสี่ยงที่พบ",
        recommendations: "คำแนะนำ",
        summary: "สรุปผลการประเมิน",
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
        noRiskFactors: "ไม่พบปัจจัยเสี่ยงเฉพาะ",
        noRecommendations: "ไม่มีคำแนะนำเฉพาะ",
        riskFactorsCount: "ปัจจัยเสี่ยงที่พบ",
        language: "ภาษา",
      },
      en: {
        assessmentResults: "Assessment Results",
        backToHome: "Back to Home",
        shareResults: "Share Results",
        downloadPDF: "Download PDF",
        riskFactorsFound: "Risk Factors Found",
        recommendations: "Recommendations",
        summary: "Assessment Summary",
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
        noRiskFactors: "No specific risk factors identified",
        noRecommendations: "No specific recommendations available",
        riskFactorsCount: "Risk Factors Found",
        language: "Language",
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
    console.log("🔍 Processing bilingual data for locale:", locale)

    // Priority 1: Use assessmentData from database (new bilingual format)
    if (assessmentData) {
      console.log("📊 Using assessmentData from database")
      const isEnglish = locale === "en"
      const result = {
        riskFactors: isEnglish
          ? assessmentData.risk_factors_en || assessmentData.risk_factors_th || assessmentData.risk_factors || []
          : assessmentData.risk_factors_th || assessmentData.risk_factors || [],
        recommendations: isEnglish
          ? assessmentData.recommendations_en ||
            assessmentData.recommendations_th ||
            assessmentData.recommendations ||
            []
          : assessmentData.recommendations_th || assessmentData.recommendations || [],
        summary: isEnglish
          ? assessmentData.summary_en || assessmentData.summary_th || ""
          : assessmentData.summary_th || assessmentData.summary_en || "",
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
          gradientFrom: "from-green-400",
          gradientTo: "to-green-600",
          icon: CheckCircle,
          label,
          description,
        }
      case "medium":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          gradientFrom: "from-yellow-400",
          gradientTo: "to-yellow-600",
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
          gradientFrom: "from-red-400",
          gradientTo: "to-red-600",
          icon: XCircle,
          label,
          description,
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          gradientFrom: "from-gray-400",
          gradientTo: "to-gray-600",
          icon: FileText,
          label,
          description,
        }
    }
  }, [assessmentResult.riskLevel, getRiskLevelLabel, getRiskLevelDescription])

  const RiskIcon = riskInfo.icon

  const toggleLanguage = () => {
    setLocale(locale === "th" ? "en" : "th")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-transparent"
            >
              <Globe className="h-4 w-4" />
              {locale === "th" ? "EN" : "TH"}
            </Button>
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

        {/* Main Assessment Results */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${riskInfo.gradientFrom} ${riskInfo.gradientTo} p-6 text-white`}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
                <CategoryIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white mb-2">{t.assessmentResults}</CardTitle>
            <p className="text-center text-white/90 text-lg">{bilingualData.categoryTitle}</p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Risk Level Display */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className={`p-4 rounded-full ${riskInfo.bgColor} ${riskInfo.borderColor} border-2`}>
                  <RiskIcon className={`h-12 w-12 ${riskInfo.color}`} />
                </div>
              </div>
              <Badge variant="secondary" className={`${riskInfo.color} ${riskInfo.bgColor} text-xl px-6 py-3`}>
                {riskInfo.label}
              </Badge>
              <p className="text-gray-600 dark:text-gray-300">{riskInfo.description}</p>

              {/* Risk Factors Count */}
              {bilingualData.riskFactors && bilingualData.riskFactors.length > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span className="text-orange-700 dark:text-orange-300 font-medium">
                    {bilingualData.riskFactors.length} {t.riskFactorsCount}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Summary Section */}
            {bilingualData.summary && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {t.summary}
                  </h3>
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{bilingualData.summary}</p>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
              </>
            )}

            {/* Risk Factors and Recommendations Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {t.riskFactorsFound}
                </h3>
                <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    {bilingualData.riskFactors && bilingualData.riskFactors.length > 0 ? (
                      <ScrollArea className="h-32">
                        <ul className="space-y-2">
                          {bilingualData.riskFactors.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic text-sm">{t.noRiskFactors}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {t.recommendations}
                </h3>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    {bilingualData.recommendations && bilingualData.recommendations.length > 0 ? (
                      <ScrollArea className="h-32">
                        <ul className="space-y-2">
                          {bilingualData.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic text-sm">{t.noRecommendations}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Information */}
            <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t.assessmentDate}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {assessmentData?.completed_at
                      ? new Date(assessmentData.completed_at).toLocaleDateString(locale === "en" ? "en-US" : "th-TH")
                      : new Date().toLocaleDateString(locale === "en" ? "en-US" : "th-TH")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t.numberOfQuestions}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {answers.length} {t.questions}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push(`/assessment/${categoryId}`)}
                className={`flex-1 bg-gradient-to-r ${riskInfo.gradientFrom} ${riskInfo.gradientTo} hover:opacity-90 text-white`}
              >
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
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.answerDetails}</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <Card key={answer.questionId} className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                            {t.question} {index + 1}: {answer.questionId}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t.answer}:{" "}
                            {Array.isArray(answer.value)
                              ? answer.value.join(", ")
                              : String(answer.value || answer.answer)}
                          </div>
                          {answer.score !== undefined && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {t.score}: {answer.score}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>{t.note}:</strong> {t.disclaimer}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
