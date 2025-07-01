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
  Globe,
} from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { useLanguage } from "@/contexts/language-context"
import type { Database } from "@/types/database"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]

interface AssessmentResultsProps {
  categoryId: string
  assessmentResult?: AssessmentResult
  assessmentData?: AssessmentRow
  answers: AssessmentAnswer[]
  aiAnalysis?: any
}

export function AssessmentResults({
  categoryId,
  assessmentResult,
  assessmentData,
  answers,
  aiAnalysis,
}: AssessmentResultsProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const { getRiskLevelLabel, getRiskLevelDescription } = useRiskLevelTranslation()
  const { language } = useLanguage()

  // Use assessmentData if available (from database), otherwise use assessmentResult
  const data = assessmentData || assessmentResult

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {language === "th" ? "ไม่พบข้อมูลผลการประเมิน" : "Assessment results not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Get localized content based on current language
  const getLocalizedContent = () => {
    if (assessmentData) {
      // From database - has bilingual fields
      return {
        riskFactors:
          language === "th"
            ? assessmentData.risk_factors || []
            : assessmentData.risk_factors_en || assessmentData.risk_factors || [],
        recommendations:
          language === "th"
            ? assessmentData.recommendations || []
            : assessmentData.recommendations_en || assessmentData.recommendations || [],
        summary: language === "th" ? assessmentData.summary : assessmentData.summary_en || assessmentData.summary,
        categoryTitle:
          language === "th"
            ? assessmentData.category_title
            : assessmentData.category_title_en || assessmentData.category_title,
      }
    } else if (assessmentResult) {
      // From local calculation - single language
      return {
        riskFactors: assessmentResult.riskFactors || [],
        recommendations: assessmentResult.recommendations || [],
        summary: null,
        categoryTitle: getCategoryTitle(categoryId),
      }
    }
    return {
      riskFactors: [],
      recommendations: [],
      summary: null,
      categoryTitle: getCategoryTitle(categoryId),
    }
  }

  const localizedContent = getLocalizedContent()

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

  const riskInfo = getRiskLevelInfo(data.riskLevel || data.risk_level)
  const RiskIcon = riskInfo.icon

  // แปลงชื่อหมวดหมู่
  const getCategoryTitle = (categoryId: string) => {
    const titles = {
      basic: { th: "ข้อมูลส่วนตัว", en: "Basic Information" },
      mental: { th: "สุขภาพจิต", en: "Mental Health" },
      physical: { th: "สุขภาพกาย", en: "Physical Health" },
      heart: { th: "สุขภาพหัวใจ", en: "Heart Health" },
      nutrition: { th: "โภชนาการ", en: "Nutrition" },
      sleep: { th: "การนอนหลับ", en: "Sleep Quality" },
    }
    return titles[categoryId as keyof typeof titles]?.[language] || (language === "th" ? "แบบประเมิน" : "Assessment")
  }

  const getText = (th: string, en: string) => (language === "th" ? th : en)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {getText("กลับหน้าหลัก", "Back to Home")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              {getText("แชร์ผลลัพธ์", "Share Results")}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {getText("ดาวน์โหลด PDF", "Download PDF")}
            </Button>
          </div>
        </div>

        {/* Language indicator */}
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            {language === "th" ? "ภาษาไทย" : "English"}
          </Badge>
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
              {getText("ผลการประเมิน", "Assessment Results")}
              {localizedContent.categoryTitle}
            </CardTitle>
            <p className="text-gray-600">{riskInfo.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* คะแนนและระดับความเสี่ยง */}
            <div className="text-center space-y-6">
              <Badge variant="secondary" className={`${riskInfo.color} ${riskInfo.bgColor} text-xl px-6 py-3`}>
                {riskInfo.label}
              </Badge>

              {/* แสดงจำนวนปัจจัยเสี่ยงที่พบ */}
              {localizedContent.riskFactors && localizedContent.riskFactors.length > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{localizedContent.riskFactors.length}</div>
                  <div className="text-sm text-gray-600">{getText("ปัจจัยเสี่ยงที่พบ", "Risk Factors Found")}</div>
                </div>
              )}
            </div>

            <Separator />

            {/* Summary */}
            {localizedContent.summary && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">{getText("สรุปผลการประเมิน", "Assessment Summary")}</h3>
                <p className="text-blue-800">{localizedContent.summary}</p>
              </div>
            )}

            {/* ปัจจัยเสี่ยงและคำแนะนำ */}
            {(localizedContent.riskFactors?.length > 0 || localizedContent.recommendations?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* ปัจจัยเสี่ยง */}
                {localizedContent.riskFactors?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      {getText("ปัจจัยเสี่ยงที่พบ", "Risk Factors")}
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {localizedContent.riskFactors.map((factor, index) => (
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
                {localizedContent.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      {getText("คำแนะนำ", "Recommendations")}
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {localizedContent.recommendations.map((recommendation, index) => (
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
                  {getText("วันที่ทำแบบประเมิน", "Assessment Date")}
                </span>
                <span className="font-medium">
                  {assessmentData
                    ? new Date(assessmentData.completed_at).toLocaleDateString(language === "th" ? "th-TH" : "en-US")
                    : new Date().toLocaleDateString(language === "th" ? "th-TH" : "en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {getText("จำนวนคำถาม", "Number of Questions")}
                </span>
                <span className="font-medium">
                  {answers.length} {getText("ข้อ", "questions")}
                </span>
              </div>
              {assessmentData && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {getText("ภาษาที่ใช้ประเมิน", "Assessment Language")}
                  </span>
                  <span className="font-medium">{assessmentData.language === "th" ? "ไทย" : "English"}</span>
                </div>
              )}
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => router.push(`/assessment/${categoryId}`)} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                {getText("ทำแบบประเมินใหม่", "Take Assessment Again")}
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                {showDetails
                  ? getText("ซ่อนรายละเอียด", "Hide Details")
                  : getText("ดูรายละเอียดคำตอบ", "View Answer Details")}
              </Button>
            </div>

            {/* รายละเอียดคำตอบ */}
            {showDetails && answers.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator />
                <h3 className="font-semibold text-gray-800">{getText("รายละเอียดคำตอบ", "Answer Details")}</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {getText("คำถามที่", "Question")} {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getText("คำตอบ", "Answer")}:{" "}
                          {Array.isArray(answer.value || answer.answer)
                            ? (answer.value || answer.answer).join(", ")
                            : answer.value || answer.answer}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            {getText("คะแนน", "Score")}: {answer.score}
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
            <strong>{getText("หมายเหตุ", "Note")}:</strong>{" "}
            {getText(
              "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยหรือมีอาการที่น่ากังวล แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม",
              "This assessment result is for informational purposes only and cannot replace medical diagnosis. If you have concerns or worrying symptoms, please consult with a doctor or healthcare professional for proper examination and treatment.",
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
