"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Info, TrendingUp, FileText } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import {
  getRiskLevelText,
  getRiskLevelDescription,
  getRiskLevelBadgeClass,
  getRiskLevelColor,
  getBilingualText,
  getBilingualArray,
} from "@/utils/risk-level"
import type { SavedAssessment } from "@/types/assessment"

interface AssessmentResultsProps {
  assessment: SavedAssessment
  onRetakeAssessment?: () => void
  onConsultDoctor?: () => void
}

export function AssessmentResults({ assessment, onRetakeAssessment, onConsultDoctor }: AssessmentResultsProps) {
  const { t, language } = useTranslation()

  // Get bilingual data from AI analysis if available, otherwise use legacy data
  const getDisplayRiskFactors = (): string[] => {
    if (assessment.ai_analysis?.riskFactors) {
      return getBilingualArray(assessment.ai_analysis.riskFactors, language)
    }
    return assessment.risk_factors || []
  }

  const getDisplayRecommendations = (): string[] => {
    if (assessment.ai_analysis?.recommendations) {
      return getBilingualArray(assessment.ai_analysis.recommendations, language)
    }
    return assessment.recommendations || []
  }

  const getDisplaySummary = (): string => {
    if (assessment.ai_analysis?.summary) {
      return getBilingualText(assessment.ai_analysis.summary, language)
    }
    return getRiskLevelDescription(assessment.risk_level, language)
  }

  const riskFactors = getDisplayRiskFactors()
  const recommendations = getDisplayRecommendations()
  const summary = getDisplaySummary()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (language === "th") {
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

  const getRiskIcon = () => {
    switch (assessment.risk_level) {
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "very-high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {getRiskIcon()}
                {t.assessmentResults.title}
              </CardTitle>
              <CardDescription>
                {assessment.category_title} • {formatDate(assessment.completed_at)}
              </CardDescription>
            </div>
            <Badge className={getRiskLevelBadgeClass(assessment.risk_level)}>
              {getRiskLevelText(assessment.risk_level, language)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Score Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t.assessmentResults.score}</span>
                <span className="font-medium">
                  {assessment.total_score}/{assessment.max_score} ({assessment.percentage}%)
                </span>
              </div>
              <Progress
                value={assessment.percentage}
                className="h-2"
                style={
                  {
                    "--progress-background": getRiskLevelColor(assessment.risk_level),
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t.assessmentResults.summary}
              </h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.assessmentResults.riskFactors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {riskFactors.map((factor, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {factor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {t.assessmentResults.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Buttons */}
      <div className="flex justify-between">
        {onRetakeAssessment && (
          <Button onClick={onRetakeAssessment} variant="outline">
            {t.assessmentResults.retakeAssessment}
          </Button>
        )}
        {onConsultDoctor && (
          <Button onClick={onConsultDoctor} variant="default">
            {t.assessmentResults.consultDoctor}
          </Button>
        )}
      </div>
    </div>
  )
}
