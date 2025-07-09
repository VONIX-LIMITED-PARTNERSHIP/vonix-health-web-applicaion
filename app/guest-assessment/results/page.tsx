"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { useParams } from "next/navigation"
import type { AssessmentResult } from "@/types/assessment"

export default function GuestAssessmentResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { category } = useParams()
  const { guestUser } = useGuestAuth()
  const { t } = useTranslation(["common"])
  const { locale } = useLanguage()
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAssessmentResults = async () => {
      if (!guestUser) {
        router.push("/guest-login")
        return
      }

      if (!category) {
        setError(t("error_no_category_specified"))
        setLoading(false)
        return
      }

      try {
        // Use getAssessmentByCategory to retrieve the specific assessment
        const result = GuestAssessmentService.getAssessmentByCategory(category as string)
        if (result) {
          setAssessmentResult(result)
        } else {
          setError(t("error_loading_guest_assessment_results"))
        }
      } catch (err) {
        console.error("Error loading guest assessment results:", err)
        setError(t("error_loading_guest_assessment_results"))
      } finally {
        setLoading(false)
      }
    }

    loadAssessmentResults()
  }, [guestUser, category, t])

  if (!guestUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">{t("not_logged_in")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {locale === "th" ? "กรุณาเข้าสู่ระบบเพื่อดูผลการประเมิน" : "Please log in to view assessment results"}
            </p>
            <Button asChild>
              <Link href="/guest-login">{t("login")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">{t("loading_results")}...</span>
      </div>
    )
  }

  if (error) {
    return <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-red-500">{error}</div>
  }

  if (!assessmentResult) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-gray-500">
        {t("no_assessment_results_found")}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AssessmentResults assessment={assessmentResult} onBackToDashboard={() => router.push("/")} isGuest={true} />
    </div>
  )
}
