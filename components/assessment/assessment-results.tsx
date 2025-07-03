"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, FileText, AlertTriangle, CheckCircle, Share2, Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"

interface AssessmentResultsProps {
  assessmentData: any
}

export function AssessmentResults({ assessmentData }: AssessmentResultsProps) {
  const router = useRouter()
  const { locale } = useLanguage()
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  // Debug information
  console.log("🔍 AssessmentResults: Received data:", assessmentData)

  // Memoized category titles mapping
  const categoryTitles = {
    lifestyle: { th: "ไลฟ์สไตล์และโภชนาการ", en: "Lifestyle and Nutrition" },
    mental: { th: "สุขภาพจิต", en: "Mental Health" },
    physical: { th: "สุขภาพกาย", en: "Physical Health" },
    sleep: { th: "คุณภาพการนอน", en: "Sleep Quality" },
    basic: { th: "ข้อมูลสุขภาพพื้นฐาน", en: "Basic Health Information" },
  }

  // Memoized translations
  const translations = useMemo(
    () => ({
      riskLevels: {
        low: { th: "ความเสี่ยงต่ำ", en: "Low Risk" },
        medium: { th: "ความเสี่ยงปานกลาง", en: "Medium Risk" },
        high: { th: "ความเสี่ยงสูง", en: "High Risk" },
        very_high: { th: "ความเสี่ยงสูงมาก", en: "Very High Risk" },
      },
      labels: {
        riskFactors: { th: "ปัจจัยเสี่ยงที่พบ", en: "Risk Factors Found" },
        recommendations: { th: "คำแนะนำ", en: "Recommendations" },
        summary: { th: "สรุปผลการประเมิน", en: "Assessment Summary" },
        basicInfo: { th: "ข้อมูลพื้นฐาน", en: "Basic Information" },
        assessmentDate: { th: "วันที่ทำแบบประเมิน", en: "Assessment Date" },
        totalQuestions: { th: "จำนวนคำถาม", en: "Total Questions" },
        score: { th: "คะแนน", en: "Score" },
        noRiskFactors: { th: "ไม่พบปัจจัยเสี่ยงเฉพาะ", en: "No specific risk factors found" },
        noRecommendations: { th: "ไม่มีคำแนะนำเฉพาะ", en: "No specific recommendations" },
        retakeAssessment: { th: "ทำแบบประเมินใหม่", en: "Retake Assessment" },
        viewAnswers: { th: "ดูรายละเอียดคำตอบ", en: "View Answer Details" },
        shareResults: { th: "แชร์ผลลัพธ์", en: "Share Results" },
        downloadPdf: { th: "ดาวน์โหลด PDF", en: "Download PDF" },
      },
    }),
    [],
  )

  // Get category title function
  const getCategoryTitle = (categoryId: string) => {
    const category = categoryTitles[categoryId as keyof typeof categoryTitles]
    return category ? category[locale] : categoryId
  }

  // Memoized bilingual data extraction
  const bilingualData = useMemo(() => {
    if (!assessmentData) return null

    console.log("🔍 Processing bilingual data...")
    console.log("  - Risk factors TH:", assessmentData.risk_factors_th)
    console.log("  - Risk factors EN:", assessmentData.risk_factors_en)
    console.log("  - Recommendations TH:", assessmentData.recommendations_th)
    console.log("  - Recommendations EN:", assessmentData.recommendations_en)

    // Use bilingual data from database
    const riskFactors = locale === "th" ? assessmentData.risk_factors_th : assessmentData.risk_factors_en
    const recommendations = locale === "th" ? assessmentData.recommendations_th : assessmentData.recommendations_en
    const summary = locale === "th" ? assessmentData.summary_th : assessmentData.summary_en

    return {
      categoryTitle: getCategoryTitle(assessmentData.category_id),
      riskLevel: assessmentData.risk_level,
      riskFactors: Array.isArray(riskFactors) ? riskFactors : [],
      recommendations: Array.isArray(recommendations) ? recommendations : [],
      summary: summary || "",
      totalScore: assessmentData.total_score || 0,
      maxScore: assessmentData.max_score || 100,
      percentage: assessmentData.percentage || 0,
      completedAt: assessmentData.completed_at || assessmentData.created_at,
      answersCount: Array.isArray(assessmentData.answers) ? assessmentData.answers.length : 0,
    }
  }, [assessmentData, locale])

  // Memoized risk info
  const riskInfo = useMemo(() => {
    if (!bilingualData) return null

    const riskLevel = bilingualData.riskLevel
    const riskConfig = {
      low: { color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
      medium: { color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
      high: { color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
      very_high: { color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
    }

    return {
      ...riskConfig[riskLevel as keyof typeof riskConfig],
      label: translations.riskLevels[riskLevel as keyof typeof translations.riskLevels]?.[locale] || riskLevel,
    }
  }, [bilingualData, translations, locale])

  if (!bilingualData || !riskInfo) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                {locale === "th" ? "ไม่พบข้อมูลผลลัพธ์" : "No Results Data Found"}
              </h1>
              <p className="text-gray-600">
                {locale === "th" ? "ไม่สามารถโหลดข้อมูลผลลัพธ์ได้" : "Unable to load results data"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleRetakeAssessment = () => {
    router.push(`/assessment/${assessmentData.category_id}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: bilingualData.categoryTitle,
          text: `${translations.labels.score[locale]}: ${bilingualData.percentage}%`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const handleDownloadPdf = () => {
    // TODO: Implement PDF download functionality
    console.log("Download PDF functionality to be implemented")
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-white/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            {translations.labels.shareResults[locale]}
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf} className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            {translations.labels.downloadPdf[locale]}
          </Button>
        </div>
      </div>

      {/* Results Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80 dark:border-border mb-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl mb-4 dark:text-foreground">{bilingualData.categoryTitle}</CardTitle>

          {/* Risk Level Display */}
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${riskInfo.color} mb-4`}>
            {bilingualData.riskLevel === "low" ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </div>

          <div className={`inline-block px-6 py-2 rounded-full ${riskInfo.bgColor}`}>
            <span className={`font-semibold ${riskInfo.textColor}`}>{riskInfo.label}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Summary Section */}
          {bilingualData.summary && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-foreground">
                <FileText className="mr-2 h-5 w-5" />
                {translations.labels.summary[locale]}
              </h3>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{bilingualData.summary}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Separator />

          {/* Risk Factors Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-foreground">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              {translations.labels.riskFactors[locale]}
            </h3>
            {bilingualData.riskFactors.length > 0 ? (
              <ul className="space-y-3">
                {bilingualData.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">{translations.labels.noRiskFactors[locale]}</p>
            )}
          </div>

          <Separator />

          {/* Recommendations Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-foreground">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              {translations.labels.recommendations[locale]}
            </h3>
            {bilingualData.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {bilingualData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">{translations.labels.noRecommendations[locale]}</p>
            )}
          </div>

          <Separator />

          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-foreground">
              <Calendar className="mr-2 h-5 w-5" />
              {translations.labels.basicInfo[locale]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bilingualData.percentage}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{translations.labels.score[locale]}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {bilingualData.answersCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {translations.labels.totalQuestions[locale]}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {new Date(bilingualData.completedAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {translations.labels.assessmentDate[locale]}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleRetakeAssessment}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {translations.labels.retakeAssessment[locale]}
        </Button>
        <Button variant="outline" className="px-8 py-3 bg-transparent" onClick={() => setShowDetails(!showDetails)}>
          {translations.labels.viewAnswers[locale]}
        </Button>
      </div>

      {/* Answer Details */}
      {showDetails && assessmentData.answers && assessmentData.answers.length > 0 && (
        <div className="mt-6 space-y-4">
          <Separator />
          <h3 className="font-semibold text-gray-800">{translations.labels.viewAnswers[locale]}</h3>
          <div className="h-64 overflow-auto">
            <div className="space-y-3">
              {assessmentData.answers.map((answer: any, index: number) => (
                <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {translations.labels.viewAnswers[locale]} {index + 1}: {answer.questionId}
                  </div>
                  <div className="text-sm text-gray-600">
                    {translations.labels.viewAnswers[locale]}:{" "}
                    {Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value || answer.answer)}
                  </div>
                  {answer.score !== undefined && (
                    <div className="text-xs text-gray-500 mt-1">
                      {translations.labels.score[locale]}: {answer.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Development Debug Information */}
      {process.env.NODE_ENV === "development" && (
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-yellow-700 overflow-auto">
              {JSON.stringify(
                {
                  assessmentData: {
                    id: assessmentData.id,
                    category_id: assessmentData.category_id,
                    risk_level: assessmentData.risk_level,
                    risk_factors_th: assessmentData.risk_factors_th,
                    risk_factors_en: assessmentData.risk_factors_en,
                    recommendations_th: assessmentData.recommendations_th,
                    recommendations_en: assessmentData.recommendations_en,
                    summary_th: assessmentData.summary_th,
                    summary_en: assessmentData.summary_en,
                  },
                  bilingualData,
                  locale,
                },
                null,
                2,
              )}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Warning Notice */}
      <Card className="mt-8 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>{locale === "th" ? "หมายเหตุ:" : "Note:"}</strong>{" "}
              {locale === "th"
                ? "ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยเกี่ยวกับสุขภาพ กรุณาปรึกษาแพทย์หรือผู้เชี่ยวชาญ"
                : "This assessment result is for informational purposes only and cannot replace medical diagnosis. If you have health concerns, please consult with a doctor or healthcare professional."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
