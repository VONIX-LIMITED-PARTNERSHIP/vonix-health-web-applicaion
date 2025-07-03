"use client"

import { useState } from "react"
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

  // Get bilingual data based on current language
  const getBilingualData = () => {
    if (!assessmentData) {
      return {
        riskFactors: assessmentResult.riskFactors || [],
        recommendations: assessmentResult.recommendations || [],
        summary: "",
        categoryTitle: getCategoryTitle(categoryId),
      }
    }

    const isEnglish = locale === "en"
    return {
      riskFactors: isEnglish
        ? assessmentData.risk_factors_en || assessmentData.risk_factors_th || []
        : assessmentData.risk_factors_th || [],
      recommendations: isEnglish
        ? assessmentData.recommendations_en || assessmentData.recommendations_th || []
        : assessmentData.recommendations_th || [],
      summary: isEnglish
        ? assessmentData.summary_en || assessmentData.summary_th || ""
        : assessmentData.summary_th || "",
      categoryTitle: isEnglish
        ? assessmentData.category_title_en || assessmentData.category_title_th
        : assessmentData.category_title_th || assessmentData.category_title_en,
    }
  }

  const bilingualData = getBilingualData()

  const getRiskLevelInfo = (riskLevel: string) => {
    const label = getRiskLevelLabel(riskLevel)
    const description = getRiskLevelDescription(riskLevel)

    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label,
          description,
        }
      case "medium":
      case "ปานกลาง":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
          label,
          description,
        }
      case "high":
      case "สูง":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label,
          description,
        }
      case "very-high":
      case "very_high":
      case "สูงมาก":
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
  }

  const riskInfo = getRiskLevelInfo(assessmentResult.riskLevel)
  const RiskIcon = riskInfo.icon

  // แปลงชื่อหมวดหมู่
  const getCategoryTitle = (categoryId: string) => {
    if (locale === "en") {
      switch (categoryId) {
        case "basic":
          return "Personal Information"
        case "mental":
          return "Mental Health"
        case "physical":
          return "Physical Health"
        case "lifestyle":
          return "Lifestyle"
        case "heart":
          return "Heart & Cardiovascular"
        case "nutrition":
          return "Lifestyle & Nutrition"
        case "sleep":
          return "Sleep Quality"
        default:
          return "Assessment"
      }
    } else {
      switch (categoryId) {
        case "basic":
          return "ข้อมูลส่วนตัว"
        case "mental":
          return "สุขภาพจิต"
        case "physical":
          return "สุขภาพกาย"
        case "lifestyle":
          return "วิถีชีวิต"
        case "heart":
          return "หัวใจและหลอดเลือด"
        case "nutrition":
          return "ไลฟ์สไตล์และโภชนาการ"
        case "sleep":
          return "คุณภาพการนอน"
        default:
          return "แบบประเมิน"
      }
    }
  }

  const getTranslatedText = (key: string) => {
    const translations = {
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
    }
    return translations[locale as keyof typeof translations]?.[key as keyof (typeof translations)["th"]] || key
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {getTranslatedText("backToHome")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              {getTranslatedText("shareResults")}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {getTranslatedText("downloadPDF")}
            </Button>
          </div>
        </div>

        {/* ผลการประเมินหลัก */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${riskInfo.bgColor} ${riskInfo.borderColor} border-2`}>
                <RiskIcon className={`h-12 w-12 ${riskInfo.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {getTranslatedText("assessmentResults")}
              {bilingualData.categoryTitle}
            </CardTitle>
            <p className="text-gray-600">{riskInfo.description}</p>
            {bilingualData.summary && (
              <p className="text-gray-700 mt-2 text-sm bg-gray-50 p-3 rounded-lg">{bilingualData.summary}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* คะแนนและระดับความเสี่ยง */}
            <div className="text-center space-y-6">
              <Badge variant="secondary" className={`${riskInfo.color} ${riskInfo.bgColor} text-xl px-6 py-3`}>
                {riskInfo.label}
              </Badge>

              {/* แสดงจำนวนปัจจัยเสี่ยงที่พบ */}
              {bilingualData.riskFactors && bilingualData.riskFactors.length > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{bilingualData.riskFactors.length}</div>
                  <div className="text-sm text-gray-600">{getTranslatedText("riskFactorsFound")}</div>
                </div>
              )}
            </div>

            <Separator />

            {/* ปัจจัยเสี่ยงและคำแนะนำ */}
            {(bilingualData.riskFactors?.length > 0 || bilingualData.recommendations?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* ปัจจัยเสี่ยง */}
                {bilingualData.riskFactors?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      {getTranslatedText("riskFactorsFound")}
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {bilingualData.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}

                {/* คำแนะนำ */}
                {bilingualData.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      {getTranslatedText("recommendations")}
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {bilingualData.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {/* ข้อมูลเพิ่มเติม */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {getTranslatedText("assessmentDate")}
                </span>
                <span className="font-medium">
                  {new Date().toLocaleDateString(locale === "en" ? "en-US" : "th-TH")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {getTranslatedText("numberOfQuestions")}
                </span>
                <span className="font-medium">
                  {answers.length} {getTranslatedText("questions")}
                </span>
              </div>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => router.push(`/assessment/${categoryId}`)} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                {getTranslatedText("retakeAssessment")}
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                {showDetails ? getTranslatedText("hideDetails") : getTranslatedText("viewDetails")}
              </Button>
            </div>

            {/* รายละเอียดคำตอบ */}
            {showDetails && answers.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator />
                <h3 className="font-semibold text-gray-800">{getTranslatedText("answerDetails")}</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {getTranslatedText("question")} {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getTranslatedText("answer")}:{" "}
                          {Array.isArray(answer.value) ? answer.value.join(", ") : answer.value}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            {getTranslatedText("score")}: {answer.score}
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

        {/* คำแนะนำเพิ่มเติม */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{getTranslatedText("note")}:</strong> {getTranslatedText("disclaimer")}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
