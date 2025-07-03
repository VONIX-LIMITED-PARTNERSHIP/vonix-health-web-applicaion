"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  Share2,
  Download,
  Calendar,
  Hash,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"

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
  const { language, t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("🎨 AssessmentResults: Component rendered with data:")
    console.log("📂 Category ID:", categoryId)
    console.log("📊 Assessment Result:", assessmentResult)
    console.log("🤖 AI Analysis:", aiAnalysis)
    console.log("💾 Assessment Data:", assessmentData)
    console.log("🌐 Current Language:", language)
  }, [categoryId, assessmentResult, aiAnalysis, assessmentData, language])

  // Category titles mapping
  const categoryTitles = {
    lifestyle: { th: "ไลฟ์สไตล์และโภชนาการ", en: "Lifestyle and Nutrition" },
    mental: { th: "สุขภาพจิต", en: "Mental Health" },
    physical: { th: "สุขภาพกาย", en: "Physical Health" },
    sleep: { th: "คุณภาพการนอน", en: "Sleep Quality" },
  }

  // Translations
  const translations = useMemo(
    () => ({
      th: {
        title: "ผลการประเมิน",
        riskLevel: "ระดับความเสี่ยง",
        riskFactors: "ปัจจัยเสี่ยงที่พบ",
        recommendations: "คำแนะนำ",
        summary: "สรุปผลการประเมิน",
        assessmentDate: "วันที่ทำแบบประเมิน",
        totalQuestions: "จำนวนคำถาม",
        retakeAssessment: "ทำแบบประเมินใหม่",
        viewAnswers: "ดูรายละเอียดคำตอบ",
        shareResults: "แชร์ผลลัพธ์",
        downloadPDF: "ดาวน์โหลด PDF",
        noRiskFactors: "ไม่พบปัจจัยเสี่ยงเฉพาะ",
        noRecommendations: "ไม่มีคำแนะนำเพิ่มเติม",
        riskLevels: {
          low: "ความเสี่ยงต่ำ",
          medium: "ความเสี่ยงปานกลาง",
          high: "ความเสี่ยงสูง",
          very_high: "ความเสี่ยงสูงมาก",
        },
      },
      en: {
        title: "Assessment Results",
        riskLevel: "Risk Level",
        riskFactors: "Risk Factors Found",
        recommendations: "Recommendations",
        summary: "Assessment Summary",
        assessmentDate: "Assessment Date",
        totalQuestions: "Total Questions",
        retakeAssessment: "Retake Assessment",
        viewAnswers: "View Answer Details",
        shareResults: "Share Results",
        downloadPDF: "Download PDF",
        noRiskFactors: "No specific risk factors found",
        noRecommendations: "No additional recommendations",
        riskLevels: {
          low: "Low Risk",
          medium: "Medium Risk",
          high: "High Risk",
          very_high: "Very High Risk",
        },
      },
    }),
    [],
  )

  const getCategoryTitle = (categoryId: string) => {
    const category = categoryTitles[categoryId as keyof typeof categoryTitles]
    return category ? category[language] : categoryTitles.lifestyle[language]
  }

  // Get bilingual data based on current language and available data
  const bilingualData = useMemo(() => {
    console.log("🔄 Getting bilingual data for language:", language)

    // Priority: assessmentData (from database) > aiAnalysis > assessmentResult
    if (assessmentData) {
      const data = {
        riskFactors: language === "th" ? assessmentData.risk_factors_th || [] : assessmentData.risk_factors_en || [],
        recommendations:
          language === "th" ? assessmentData.recommendations_th || [] : assessmentData.recommendations_en || [],
        summary: language === "th" ? assessmentData.summary_th || "" : assessmentData.summary_en || "",
        categoryTitle:
          language === "th"
            ? assessmentData.category_title_th || getCategoryTitle(categoryId)
            : assessmentData.category_title_en || getCategoryTitle(categoryId),
      }
      console.log("✅ Using assessmentData:", data)
      return data
    }

    if (aiAnalysis) {
      const data = {
        riskFactors:
          language === "th"
            ? aiAnalysis.riskFactors_th || aiAnalysis.riskFactors || []
            : aiAnalysis.riskFactors_en || aiAnalysis.riskFactors || [],
        recommendations:
          language === "th"
            ? aiAnalysis.recommendations_th || aiAnalysis.recommendations || []
            : aiAnalysis.recommendations_en || aiAnalysis.recommendations || [],
        summary:
          language === "th"
            ? aiAnalysis.summary_th || aiAnalysis.summary || ""
            : aiAnalysis.summary_en || aiAnalysis.summary || "",
        categoryTitle: getCategoryTitle(categoryId),
      }
      console.log("✅ Using aiAnalysis:", data)
      return data
    }

    // Fallback to assessmentResult
    const data = {
      riskFactors: assessmentResult.riskFactors || [],
      recommendations: assessmentResult.recommendations || [],
      summary: "",
      categoryTitle: getCategoryTitle(categoryId),
    }
    console.log("✅ Using assessmentResult fallback:", data)
    return data
  }, [assessmentData, aiAnalysis, assessmentResult, language, categoryId])

  const riskInfo = useMemo(() => {
    const riskLevel = assessmentResult.riskLevel
    const configs = {
      low: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeVariant: "default" as const,
      },
      medium: {
        icon: AlertTriangle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badgeVariant: "secondary" as const,
      },
      high: {
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        badgeVariant: "destructive" as const,
      },
      very_high: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeVariant: "destructive" as const,
      },
    }
    return configs[riskLevel] || configs.medium
  }, [assessmentResult.riskLevel])

  const t_current = translations[language]
  const RiskIcon = riskInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">🔧 Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>
                <strong>Language:</strong> {language}
              </div>
              <div>
                <strong>Category:</strong> {categoryId}
              </div>
              <div>
                <strong>Risk Factors ({language}):</strong> {bilingualData.riskFactors.length} items
              </div>
              <div>
                <strong>Recommendations ({language}):</strong> {bilingualData.recommendations.length} items
              </div>
              <div>
                <strong>Has Assessment Data:</strong> {!!assessmentData ? "Yes" : "No"}
              </div>
              <div>
                <strong>Has AI Analysis:</strong> {!!aiAnalysis ? "Yes" : "No"}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {t_current.shareResults}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t_current.downloadPDF}
                </Button>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {t_current.title}
              {bilingualData.categoryTitle}
            </CardTitle>
            <p className="text-gray-600">
              {language === "th" ? "แนะนำให้ปรึกษาแพทย์เพิ่มเติม" : "Recommend consulting with a doctor"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Risk Level Display */}
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${riskInfo.bgColor} ${riskInfo.borderColor} border-2 mb-4`}
              >
                <RiskIcon className={`h-12 w-12 ${riskInfo.color}`} />
              </div>
              <Badge variant={riskInfo.badgeVariant} className="text-lg px-4 py-2">
                {t_current.riskLevels[assessmentResult.riskLevel]}
              </Badge>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{t_current.assessmentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span>{t_current.totalQuestions}</span>
              </div>
            </div>

            <Separator />

            {/* Summary Section */}
            {bilingualData.summary && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t_current.summary}
                  </h3>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-gray-700 leading-relaxed">{bilingualData.summary}</p>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
              </>
            )}

            {/* Risk Factors and Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {t_current.riskFactors}
                </h3>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    {bilingualData.riskFactors.length > 0 ? (
                      <ul className="space-y-2">
                        {bilingualData.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">{t_current.noRiskFactors}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {t_current.recommendations}
                </h3>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    {bilingualData.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {bilingualData.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 italic">{t_current.noRecommendations}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => router.push(`/assessment/${categoryId}`)} className="flex-1" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t_current.retakeAssessment}
              </Button>
              <Button onClick={() => setShowDetails(!showDetails)} className="flex-1" variant="default">
                <FileText className="h-4 w-4 mr-2" />
                {t_current.viewAnswers}
              </Button>
            </div>

            {/* Answer Details */}
            {showDetails && answers.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator />
                <h3 className="font-semibold text-gray-800">{t_current.viewAnswers}</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {t_current.viewAnswers} {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t_current.viewAnswers}:{" "}
                          {Array.isArray(answer.value)
                            ? answer.value.join(", ")
                            : String(answer.value || answer.answer)}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            {t_current.viewAnswers}: {answer.score}
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

        {/* Warning Notice */}
        <Card className="bg-gray-900 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                <strong>{language === "th" ? "หมายเหตุ:" : "Note:"}</strong>{" "}
                {language === "th"
                  ? "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยเกี่ยวกับสุขภาพ กรุณาปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านสุขภาพ"
                  : "This assessment result is for preliminary information only and cannot replace medical diagnosis. If you have health concerns, please consult with a doctor or health professional."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
