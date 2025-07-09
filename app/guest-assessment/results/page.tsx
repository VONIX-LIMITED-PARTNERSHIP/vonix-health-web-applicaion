"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertTriangle } from "lucide-react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getGuestAssessmentResults } from "@/lib/guest-assessment-service"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { ConsultDoctorIntroModal } from "@/components/consult-doctor-intro-modal"
import { HealthOverviewModal } from "@/components/health-overview-modal"
import { GuestHealthOverviewModal } from "@/components/guest-health-overview-modal"

export const dynamic = "force-dynamic"

export default async function GuestAssessmentResultsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { t } = useTranslation()

  if (session) {
    redirect("/dashboard")
  }

  const guestId = cookies().get("guest_id")?.value
  if (!guestId) {
    redirect("/guest-assessment")
  }

  const results = await getGuestAssessmentResults(guestId)

  if (!results) {
    redirect("/guest-assessment")
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const { guestUser } = useGuestAuth()
  const { locale } = useLanguage()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryId = searchParams.get("category")

  useEffect(() => {
    if (!guestUser) {
      router.push("/guest-login")
      return
    }

    if (!categoryId) {
      setError(locale === "th" ? "ไม่พบข้อมูลการประเมิน" : "Assessment data not found")
      setLoading(false)
      return
    }

    loadAssessmentResults()
  }, [guestUser, categoryId])

  const loadAssessmentResults = () => {
    try {
      const assessmentData = GuestAssessmentService.getAssessmentByCategory(categoryId!)

      if (!assessmentData) {
        setError(locale === "th" ? "ไม่พบผลการประเมิน" : "Assessment results not found")
        setLoading(false)
        return
      }

      setAssessment(assessmentData)
    } catch (err) {
      console.error("Error loading guest assessment results:", err)
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="w-full max-w-4xl rounded-lg bg-white/80 p-6 shadow-xl backdrop-blur-lg dark:bg-gray-800/80">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t("assessmentResults.title")}
        </h1>
        <Suspense fallback={<div>{t("assessmentResults.loading")}</div>}>
          <AssessmentResults results={results} />
        </Suspense>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ConsultDoctorIntroModal />
          <HealthOverviewModal />
          <GuestHealthOverviewModal />
        </div>
      </div>
    </div>
  )
}
