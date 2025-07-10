"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getRiskLevelBadgeClass } from "@/utils/risk-level"
import type { AssessmentResult, BilingualArray, BilingualText } from "@/types/assessment"

export default function AssessmentResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the assessment ID from the URL
  const assessmentId = searchParams.get("id")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!assessmentId) {
      setError(locale === "th" ? "ไม่พบรหัสการประเมิน" : "Assessment ID not found")
      setLoading(false)
      return
    }

    loadAssessmentResults()
  }, [user, assessmentId, locale])

  const loadAssessmentResults = async () => {
    try {
      const { data, error: fetchError } = await AssessmentService.getAssessmentById(assessmentId!)

      if (fetchError) {
        setError(locale === "th" ? `เกิดข้อผิดพลาด: ${fetchError.message}` : `Error: ${fetchError.message}`)
        setLoading(false)
        return
      }

      if (!data) {
        setError(locale === "th" ? "ไม่พบผลการประเมิน" : "Assessment results not found")
        setLoading(false)
        return
      }

      setAssessment(data)
    } catch (err) {
      console.error("Error loading assessment results:", err)
      setError(locale === "th" ? "เกิดข้อผิดพลาดในการโหลดผลการประเมิน" : "Error loading assessment results")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelLabel = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return locale === "th" ? "ความเสี่ยงต่ำ" : "Low Risk"
      case "medium":
        return locale === "th" ? "ความเสี่ยงปานกลาง" : "Medium Risk"
      case "high":
        return locale === "th" ? "ความเสี่ยงสูง" : "High Risk"
      case "very-high":
      case "very_high":
        return locale === "th" ? "ความเสี่ยงสูงมาก" : "Very High Risk"
      default:
        return locale === "th" ? "ไม่ระบุ" : "Unspecified"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (locale === "th") {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">{t("not_logged_in")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {locale === "th" ? "กรุณาเข้าสู่ระบบเพื่อดูผลการประเมิน" : "Please log in to view assessment results"}
            </p>
            <Button asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-bold mb-2">{t("loading")}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === "th" ? "กำลังโหลดผลการประเมิน..." : "Loading assessment results..."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-bold mb-2">{t("error")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild>
              <Link href="/">{t("back")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 hover:bg-white/80">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Link>
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <FileText className="h-7 w-7 text-purple-600" />
                {t("assessment_results")}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">{assessment.category}</p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  {t("assessment_date")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{formatDate(assessment.completedAt)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t("assessment_by")} {user?.nickname || user?.email}
                </p>
              </CardContent>
            </Card>

            {/* Score */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
              <CardHeader>
                <CardTitle>{t("score")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {assessment.totalScore}/{assessment.maxScore}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {assessment.percentage}% {locale === "th" ? "จากคะแนนเต็ม" : "of total score"}
                </div>
                {/* The number of questions answered is not directly available in AssessmentResult */}
                {/* <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {assessment.answers.length} {t("questions_answered")}
                </div> */}
              </CardContent>
            </Card>

            {/* Risk Level */}
            {assessment.category !== "basic" && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
                <CardHeader>
                  <CardTitle>{t("overall_risk_level")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${getRiskLevelBadgeClass(assessment.riskLevel)} text-lg px-4 py-2`}>
                    {getRiskLevelLabel(assessment.riskLevel)}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Risk Factors */}
            {assessment.riskFactors && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    {t("risk_factors")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(locale === "th"
                      ? (assessment.riskFactors as BilingualArray).th
                      : (assessment.riskFactors as BilingualArray).en
                    ).map((factor: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {assessment.recommendations && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {t("recommendations")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(locale === "th"
                      ? (assessment.recommendations as BilingualArray).th
                      : (assessment.recommendations as BilingualArray).en
                    ).map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* AI Summary (if available) */}
            {assessment.summary && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {locale === "th" ? "สรุปผลการประเมิน" : "Assessment Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {locale === "th"
                      ? (assessment.summary as BilingualText).th
                      : (assessment.summary as BilingualText).en}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
              <CardHeader>
                <CardTitle>{locale === "th" ? "การดำเนินการ" : "Actions"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">{locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/assessment/${assessment.category}`}>
                    {locale === "th" ? "ทำแบบประเมินใหม่" : "Retake Assessment"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
