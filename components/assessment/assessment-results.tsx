"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, XCircle } from "lucide-react"
import { assessmentCategories } from "@/data/assessment-questions"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { useTranslation } from "@/hooks/use-translation"
import { Badge } from "@/components/ui/badge"

interface AssessmentResultsProps {
  categoryId: string
}

// Define guestAssessmentCategory or import it
const guestAssessmentCategory = { id: "guest" } // Replace with actual definition if needed

export function AssessmentResults({ categoryId }: AssessmentResultsProps) {
  const { t } = useTranslation(["common", "assessment"])
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const category = assessmentCategories.find((cat) => cat.id === categoryId)
  const isBasicAssessment = categoryId === "basic"
  const isGuestAssessment = categoryId === guestAssessmentCategory.id

  useEffect(() => {
    if (isAuthLoading) return

    const loadAndSaveAssessment = async () => {
      setLoading(true)
      setError(null)
      let answers: AssessmentAnswer[] = []
      let storedAnswers: string | null = null

      try {
        storedAnswers = localStorage.getItem(`assessment-${categoryId}`)
        if (storedAnswers) {
          answers = JSON.parse(storedAnswers)
        }
      } catch (parseError) {
        setError(t("assessment.error_loading_answers"))
        setLoading(false)
        return
      }

      if (!answers || answers.length === 0) {
        setError(t("assessment.no_answers_found"))
        setLoading(false)
        return
      }

      if (!user) {
        setError(t("assessment.not_logged_in"))
        setLoading(false)
        return
      }

      let analysisData = null
      // Only call AI for non-basic categories
      if (categoryId !== "basic") {
        try {
          const { data, error: aiError } = await AssessmentService.analyzeWithAI(categoryId, answers)
          if (aiError) {
            throw new Error(aiError)
          }
          analysisData = data
          setAiAnalysis(data)
        } catch (aiAnalysisError: any) {
          setError(t("assessment.ai_analysis_failed", { message: aiAnalysisError.message }))
          setLoading(false)
          return
        }
      }

      setIsSaving(true)
      try {
        const { data: savedAssessment, error: saveError } = await AssessmentService.saveAssessment(
          user.id,
          categoryId,
          category?.title || "Unknown Category",
          answers,
          analysisData, // Pass AI analysis data
        )

        if (saveError) {
          throw new Error(saveError)
        }

        setAssessmentResult(savedAssessment)
        localStorage.removeItem(`assessment-${categoryId}`) // Clear answers after successful save
      } catch (saveError: any) {
        setError(t("assessment.save_failed", { message: saveError.message }))
      } finally {
        setIsSaving(false)
        setLoading(false)
      }
    }

    if (user) {
      loadAndSaveAssessment()
    } else if (!isAuthLoading) {
      // If not loading auth and no user, redirect to login or show message
      setError(t("assessment.not_logged_in_redirect"))
      // router.push("/login") // Or handle redirect
      setLoading(false)
    }
  }, [categoryId, user, isAuthLoading, router, t, category?.title])

  const handleGoHome = () => {
    router.push("/")
  }

  const handleRetakeAssessment = () => {
    router.push(`/assessment/${categoryId}`)
  }

  if (loading || isAuthLoading || isSaving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-700">{t("common.loading_results")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl mb-2">{t("common.error")}</CardTitle>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={handleGoHome} className="bg-blue-600 hover:bg-blue-700 text-white">
            {t("common.back_to_home")}
          </Button>
        </Card>
      </div>
    )
  }

  // Render results based on assessmentResult and aiAnalysis
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">{t("assessment.your_assessment_results")}</CardTitle>
            <p className="text-center text-gray-600">{category?.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            {aiAnalysis?.summary && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.summary")}</h3>
                <p className="text-gray-700">{aiAnalysis.summary}</p>
              </div>
            )}

            {/* Risk Level */}
            {aiAnalysis?.riskLevel && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.risk_level")}</h3>
                <Badge
                  className={`text-white px-3 py-1 rounded-full text-lg ${
                    aiAnalysis.riskLevel === "low"
                      ? "bg-green-500"
                      : aiAnalysis.riskLevel === "medium"
                        ? "bg-yellow-500"
                        : aiAnalysis.riskLevel === "high"
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }`}
                >
                  {t(`assessment.risk_levels.${aiAnalysis.riskLevel}`)}
                </Badge>
              </div>
            )}

            {/* Score */}
            {aiAnalysis?.score !== undefined && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.score")}</h3>
                <p className="text-gray-700 text-2xl font-bold">{aiAnalysis.score} / 100</p>
              </div>
            )}

            {/* Risk Factors */}
            {aiAnalysis?.riskFactors && aiAnalysis.riskFactors.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.risk_factors")}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {aiAnalysis.riskFactors.map((factor: string, index: number) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {aiAnalysis?.recommendations && aiAnalysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.recommendations")}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {aiAnalysis.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Basic Assessment Specifics (if not AI analyzed) */}
            {categoryId === "basic" && assessmentResult && (
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("assessment.basic_health_data_summary")}</h3>
                <p className="text-gray-700">
                  {t("assessment.total_score")}: {assessmentResult.totalScore} / {assessmentResult.maxScore} (
                  {assessmentResult.percentage}%)
                </p>
                <p className="text-gray-700">
                  {t("assessment.risk_level")}: {t(`assessment.risk_levels.${assessmentResult.riskLevel}`)}
                </p>
                {assessmentResult.riskFactors && assessmentResult.riskFactors.length > 0 && (
                  <>
                    <h4 className="font-semibold mt-4">{t("assessment.identified_risk_factors")}:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {assessmentResult.riskFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </>
                )}
                {assessmentResult.recommendations && assessmentResult.recommendations.length > 0 && (
                  <>
                    <h4 className="font-semibold mt-4">{t("assessment.general_recommendations")}:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {assessmentResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={handleGoHome} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {t("common.back_to_home")}
              </Button>
              <Button onClick={handleRetakeAssessment} variant="outline" className="flex-1">
                {t("assessment.retake_assessment")}
              </Button>
              {/* Add Download Data button here later */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
