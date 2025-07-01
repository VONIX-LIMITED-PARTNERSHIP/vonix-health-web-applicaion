"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface AssessmentResultsProps {
  assessment: {
    id: string
    category_id: string
    category_title: string
    total_score: number
    max_score: number
    percentage: number
    risk_level: "low" | "medium" | "high" | "very-high"
    risk_factors: string[]
    recommendations: string[]
    summary: string
    risk_factors_en?: string[]
    recommendations_en?: string[]
    summary_en?: string
    completed_at: string
  }
  showTitle?: boolean
}

export function AssessmentResults({ assessment, showTitle = true }: AssessmentResultsProps) {
  const { t, language } = useTranslation()

  // Get localized data based on current language
  const getLocalizedData = () => {
    if (language === "en") {
      return {
        riskFactors: assessment.risk_factors_en || assessment.risk_factors || [],
        recommendations: assessment.recommendations_en || assessment.recommendations || [],
        summary: assessment.summary_en || assessment.summary || "",
      }
    } else {
      return {
        riskFactors: assessment.risk_factors || [],
        recommendations: assessment.recommendations || [],
        summary: assessment.summary || "",
      }
    }
  }

  const localizedData = getLocalizedData()

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "very-high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "very-high":
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getRiskLevelText = (level: string) => {
    const riskLevels = {
      th: {
        low: "ความเสี่ยงต่ำ",
        medium: "ความเสี่ยงปานกลาง",
        high: "ความเสี่ยงสูง",
        "very-high": "ความเสี่ยงสูงมาก",
      },
      en: {
        low: "Low Risk",
        medium: "Medium Risk",
        high: "High Risk",
        "very-high": "Very High Risk",
      },
    }
    return riskLevels[language][level as keyof (typeof riskLevels)[typeof language]] || level
  }

  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return "bg-green-500"
    if (percentage <= 50) return "bg-yellow-500"
    if (percentage <= 75) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("assessmentResults")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{assessment.category_title}</p>
        </div>
      )}

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskLevelIcon(assessment.risk_level)}
            {t("overallScore")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("score")}: {assessment.total_score}/{assessment.max_score}
            </span>
            <Badge className={getRiskLevelColor(assessment.risk_level)}>
              {getRiskLevelText(assessment.risk_level)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("riskPercentage")}</span>
              <span>{assessment.percentage}%</span>
            </div>
            <div className="relative">
              <Progress value={assessment.percentage} className="h-3" />
              <div
                className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor(
                  assessment.percentage,
                )}`}
                style={{ width: `${assessment.percentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {localizedData.summary && (
        <Card>
          <CardHeader>
            <CardTitle>{t("summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{localizedData.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {localizedData.riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t("riskFactors")}
            </CardTitle>
            <CardDescription>{t("identifiedRiskFactors")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {localizedData.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {localizedData.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t("recommendations")}
            </CardTitle>
            <CardDescription>{t("recommendedActions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {localizedData.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Assessment Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t("completedOn")}:{" "}
            {new Date(assessment.completed_at).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
