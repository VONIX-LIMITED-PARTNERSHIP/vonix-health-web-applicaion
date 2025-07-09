"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentResult, AssessmentCategory } from "@/types/assessment"
import { getRiskLevelTranslation } from "@/utils/risk-level"
import { format } from "date-fns"
import { th as thLocale } from "date-fns/locale"

interface GuestAssessmentResultsPageProps {
  searchParams: {
    category?: string
  }
}

export default function GuestAssessmentResultsPage({ searchParams }: GuestAssessmentResultsPageProps) {
  const router = useRouter()
  const { locale } = useLanguage()
  const { t } = useTranslation()
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryId = searchParams.category as AssessmentCategory | undefined

  useEffect(() => {
    const loadAssessmentResults = async () => {
      if (!categoryId) {
        setError(t("common.error_no_category_specified"))
        setLoading(false)
        return
      }

      try {
        const result = GuestAssessmentService.getAssessmentByCategory(categoryId)
        if (result) {
          setAssessmentResult(result)
        } else {
          setError(t("common.no_guest_assessment_data"))
        }
      } catch (err) {
        console.error("Error loading guest assessment results:", err)
        setError(t("common.error_loading_analysis"))
      } finally {
        setLoading(false)
      }
    }

    loadAssessmentResults()
  }, [categoryId, t])

  const assessmentCategories = getAssessmentCategories(locale)
  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  const handleBackToHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">{t("common.processing_results")}</p>
          <p className="text-sm text-muted-foreground">{t("common.ai_analyzing_description")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold text-destructive">{t("common.error")}</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={handleBackToHome}>{t("common.back_to_dashboard")}</Button>
        </div>
      </div>
    )
  }

  if (!assessmentResult || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold text-destructive">{t("common.error")}</h2>
          <p className="text-muted-foreground">{t("common.no_guest_assessment_data")}</p>
          <Button onClick={handleBackToHome}>{t("common.back_to_dashboard")}</Button>
        </div>
      </div>
    )
  }

  const formattedDate = assessmentResult.completedAt
    ? format(new Date(assessmentResult.completedAt), "PPP", { locale: locale === "th" ? thLocale : undefined })
    : t("common.not_available")

  const riskLevelTranslation = getRiskLevelTranslation(assessmentResult.riskLevel, locale)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6">
        <Button variant="ghost" onClick={handleBackToHome} className="mb-4 hover:bg-white/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back_to_dashboard")}
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80 dark:border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-2 dark:text-foreground">
              {t("common.assessment_results")}
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-muted-foreground">{t("common.this_data_not_saved")}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("common.assessment_date")}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formattedDate}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("common.overall_risk_level")}</p>
                <Badge
                  className={`text-lg font-bold px-4 py-2 rounded-full ${
                    assessmentResult.riskLevel === "low"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : assessmentResult.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : assessmentResult.riskLevel === "high"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : assessmentResult.riskLevel === "very-high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {riskLevelTranslation}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold dark:text-foreground">{t("common.ai_summary")}</h3>
              <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
                <CardContent className="p-4 text-gray-700 dark:text-gray-300">
                  {assessmentResult.aiAnalysis?.summary || t("common.no_significant_risk_factors")}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold dark:text-foreground">{t("common.recommendations")}</h3>
              <Card className="bg-gray-50 dark:bg-gray-900 border-0 shadow-sm">
                <CardContent className="p-4 text-gray-700 dark:text-gray-300">
                  {assessmentResult.aiAnalysis?.recommendations &&
                  assessmentResult.aiAnalysis.recommendations.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {assessmentResult.aiAnalysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("common.no_additional_recommendations")}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 pt-4">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{t("common.want_to_save_results")}</p>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {t("common.login_to_track_progress")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/guest-login")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-md"
                >
                  {t("common.login")} / {t("common.register")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
