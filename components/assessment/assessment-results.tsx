"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import type { Database } from "@/types/database"
import { useLanguage } from "@/contexts/language-context"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]

interface AssessmentResultsProps {
  assessment: AssessmentRow
}

export function AssessmentResults({ assessment }: AssessmentResultsProps) {
  const { locale } = useLanguage()

  // Get localized content based on current language
  const getLocalizedContent = () => {
    const isEnglish = locale === "en"

    return {
      categoryTitle: isEnglish ? assessment.category_title_en || assessment.category_title : assessment.category_title,
      riskFactors: isEnglish ? assessment.risk_factors_en || assessment.risk_factors : assessment.risk_factors,
      recommendations: isEnglish
        ? assessment.recommendations_en || assessment.recommendations
        : assessment.recommendations,
      summary: isEnglish ? assessment.summary_en || assessment.summary : assessment.summary,

      // UI Labels
      overallScoreLabel: isEnglish ? "Overall Score" : "คะแนนรวม",
      riskLevelLabel: isEnglish ? "Risk Level" : "ระดับความเสี่ยง",
      riskFactorsLabel: isEnglish ? "Risk Factors" : "ปัจจัยเสี่ยง",
      recommendationsLabel: isEnglish ? "Recommendations" : "คำแนะนำ",
      summaryLabel: isEnglish ? "Summary" : "สรุปผล",
      completedAtLabel: isEnglish ? "Completed" : "ทำแบบประเมินเมื่อ",
      languageLabel: isEnglish ? "Language" : "ภาษา",
      noRiskFactorsText: isEnglish ? "No significant risk factors identified" : "ไม่พบปัจจัยเสี่ยงที่สำคัญ",
      noRecommendationsText: isEnglish ? "Continue maintaining good health habits" : "ควรรักษาพฤติกรรมสุขภาพที่ดีต่อไป",
      noSummaryText: isEnglish ? "Assessment completed successfully" : "ประเมินสุขภาพเสร็จสิ้น",
    }
  }

  const localizedContent = getLocalizedContent()

  const getRiskLevelInfo = (riskLevel: string) => {
    const isEnglish = locale === "en"

    switch (riskLevel) {
      case "low":
        return {
          label: isEnglish ? "Low Risk" : "ความเสี่ยงต่ำ",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        }
      case "medium":
        return {
          label: isEnglish ? "Medium Risk" : "ความเสี่ยงปานกลาง",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: Info,
        }
      case "high":
        return {
          label: isEnglish ? "High Risk" : "ความเสี่ยงสูง",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
          icon: AlertTriangle,
        }
      case "very-high":
        return {
          label: isEnglish ? "Very High Risk" : "ความเสี่ยงสูงมาก",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: XCircle,
        }
      default:
        return {
          label: isEnglish ? "Unknown" : "ไม่ทราบ",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Info,
        }
    }
  }

  const riskInfo = getRiskLevelInfo(assessment.risk_level)
  const RiskIcon = riskInfo.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return locale === "en"
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{localizedContent.categoryTitle}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {localizedContent.languageLabel}: {locale === "en" ? "English" : "ไทย"}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {localizedContent.completedAtLabel}: {formatDate(assessment.completed_at)}
          </p>
        </CardHeader>
      </Card>

      {/* Score and Risk Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{localizedContent.overallScoreLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {assessment.total_score}/{assessment.max_score}
              </div>
              <Progress value={assessment.percentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {assessment.percentage}% {locale === "en" ? "of maximum score" : "จากคะแนนเต็ม"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={riskInfo.bgColor}>
          <CardHeader>
            <CardTitle className="text-lg">{localizedContent.riskLevelLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <RiskIcon className={`h-8 w-8 ${riskInfo.textColor}`} />
              <div>
                <div className={`text-xl font-bold ${riskInfo.textColor}`}>{riskInfo.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {localizedContent.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{localizedContent.summaryLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {localizedContent.summary || localizedContent.noSummaryText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {localizedContent.riskFactorsLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {localizedContent.riskFactors && localizedContent.riskFactors.length > 0 ? (
            <ul className="space-y-2">
              {localizedContent.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">{localizedContent.noRiskFactorsText}</p>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {localizedContent.recommendationsLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {localizedContent.recommendations && localizedContent.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {localizedContent.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">{localizedContent.noRecommendationsText}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
