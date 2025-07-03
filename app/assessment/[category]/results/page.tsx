"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Calendar, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { getRiskLevelColor, getRiskLevelLabel } from "@/utils/risk-level"
import { User, Heart, Apple, Brain, Dumbbell, Moon } from "@/components/icons" // Importing the missing icons

const categoryIcons = {
  "basic-info": User,
  "heart-health": Heart,
  nutrition: Apple,
  "mental-health": Brain,
  "physical-activity": Dumbbell,
  "sleep-health": Moon,
}

export default function AssessmentResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { t } = useTranslation(["common", "assessment", "risk_level"])
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const category = params.category as string
  const assessmentId = searchParams.get("id")

  useEffect(() => {
    if (!assessmentId) {
      setError("Assessment ID not found")
      setLoading(false)
      return
    }

    fetchAssessmentResults()
  }, [assessmentId])

  const fetchAssessmentResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/assessment/results?id=${assessmentId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch assessment results")
      }

      const data = await response.json()
      setAssessment(data)
    } catch (err) {
      console.error("Error fetching assessment results:", err)
      setError("Failed to load assessment results")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTitle = (category: string) => {
    const categoryMap: Record<string, string> = {
      "basic-info": t.assessment.basic_info,
      "heart-health": t.assessment.heart_health,
      nutrition: t.assessment.nutrition,
      "mental-health": t.assessment.mental_health,
      "physical-activity": t.assessment.physical_activity,
      "sleep-health": t.assessment.sleep_health,
    }
    return categoryMap[category] || category
  }

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log("Download PDF clicked")
  }

  const handleShareResults = () => {
    // TODO: Implement share functionality
    console.log("Share results clicked")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t.common.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Target className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">{t.common.error}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error || t.common.error_loading_analysis}</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.common.back}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const riskLevel = assessment.ai_analysis?.overall_risk_level || "low"
  const riskColor = getRiskLevelColor(riskLevel)
  const riskLabel = getRiskLevelLabel(riskLevel, t)

  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || User

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.common.back}
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                {t.common.download_pdf}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareResults}>
                <Share2 className="mr-2 h-4 w-4" />
                {t.common.share_results}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.assessment.results_title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{getCategoryTitle(category)}</p>
          </div>
        </div>

        {/* Assessment Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.common.summary_overview}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{assessment.score || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.common.overall_score}</p>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className={`${riskColor} text-white mb-2`}>
                  {riskLabel}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.common.overall_risk_level}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(assessment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.common.assessment_date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        {assessment.ai_analysis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.common.ai_summary}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.ai_analysis.summary && (
                  <div>
                    <h4 className="font-semibold mb-2">{t.assessment.summary}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{assessment.ai_analysis.summary}</p>
                  </div>
                )}

                {assessment.ai_analysis.risk_factors && assessment.ai_analysis.risk_factors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t.assessment.risk_factors}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {assessment.ai_analysis.risk_factors.map((factor, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {assessment.ai_analysis.recommendations && assessment.ai_analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t.assessment.recommendations}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {assessment.ai_analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        <AssessmentResults assessment={assessment} />

        {/* Actions */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg">{t.assessment.back_to_dashboard}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
