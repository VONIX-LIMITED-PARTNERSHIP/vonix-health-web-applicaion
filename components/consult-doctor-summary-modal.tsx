"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  FileText,
  Loader2,
  RefreshCw,
  Info,
  Stethoscope,
  ShieldCheck,
  HeartPulse,
  Brain,
  Utensils,
  Bed,
  Dumbbell,
  FlaskConical,
  Calendar,
  ChevronRight,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured, createClientComponentClient } from "@/lib/supabase"
import { useRiskLevelTranslation } from "@/utils/risk-level"

interface ConsultDoctorSummaryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "summary" | "consent" | "confirmation"

// Map assessment category → icon component
const iconMap: Record<string, React.ElementType> = {
  basic: ShieldCheck,
  heart: HeartPulse,
  mental: Brain,
  nutrition: Utensils,
  sleep: Bed,
  physical: Dumbbell,
  stress: FlaskConical,
}

export function ConsultDoctorSummaryModal({ isOpen, onOpenChange }: ConsultDoctorSummaryModalProps) {
  const { t } = useTranslation(["common"])
  const { user, loading: authLoading } = useAuth()
  const { getRiskLevelLabel, getRiskLevelBadgeClass } = useRiskLevelTranslation()

  const [step, setStep] = useState<Step>("summary")
  const [loadingAssessments, setLoadingAssessments] = useState(true)
  const [assessments, setAssessments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  /* ────────────────────────────────────────────────────────────────────
     Lifecycle & State Reset
  ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      setStep("summary") // Always start at summary when opened
      if (!authLoading && user?.id && isSupabaseConfigured()) {
        void loadUserAssessments()
      }
    } else {
      resetState()
    }
  }, [isOpen, authLoading, user?.id])

  const resetState = () => {
    setStep("summary")
    setLoadingAssessments(true)
    setAssessments([])
    setError(null)
  }

  /* ────────────────────────────────────────────────────────────────────
     Data Loader
  ──────────────────────────────────────────────────────────────────── */
  const loadUserAssessments = async () => {
    if (!user?.id || !isSupabaseConfigured()) {
      setError(t("login_to_view_health_overview"))
      setLoadingAssessments(false)
      return
    }

    setLoadingAssessments(true)
    setError(null)

    try {
      const supabaseClient = createClientComponentClient()
      if (!supabaseClient) {
        setError(t("error"))
        setLoadingAssessments(false)
        return
      }

      const { data, error: serviceError } = await AssessmentService.getUserAssessments(supabaseClient, user.id)

      if (serviceError) throw serviceError

      const allAssessments = data ?? []
      setAssessments(allAssessments)
    } catch (err: any) {
      console.error("Error loading user assessments for summary:", err)
      setError(err.message ?? t("error_loading_assessments"))
    } finally {
      setLoadingAssessments(false)
    }
  }

  const getLatestAssessments = (assessmentData: any[]) => {
    const latestByCategory = new Map<string, any>()

    assessmentData.forEach((assessment) => {
      const current = latestByCategory.get(assessment.category_id)
      if (!current || new Date(assessment.completed_at) > new Date(current.completed_at)) {
        latestByCategory.set(assessment.category_id, assessment)
      }
    })

    return Array.from(latestByCategory.values())
  }

  const latestAssessments = useMemo(() => getLatestAssessments(assessments), [assessments])

  const getCategoryIcon = (categoryId: string) => (iconMap[categoryId] ?? Info) as React.ElementType

  const getCategoryTitle = (categoryId: string) => {
    // Access the assessment_categories object from the translation
    const categories = t("assessment_categories") as Record<string, { title: string; description: string }>
    // Then access the specific category and its title
    return categories?.[categoryId]?.title || t("not_available")
  }

  /* ────────────────────────────────────────────────────────────────────
     Handlers
  ──────────────────────────────────────────────────────────────────── */
  const handleSendToDoctor = () => {
    setStep("consent")
  }

  const handleConsent = () => {
    // In a real app, you would send data to a backend service here.
    // For this mockup, we just transition to the confirmation step.
    setStep("confirmation")
  }

  const handleCloseModal = () => {
    onOpenChange(false)
  }

  /* ────────────────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────────────────── */
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col rounded-xl shadow-2xl p-6 bg-white dark:bg-gray-900">
        {/* ---------- Header ---------- */}
        <DialogHeader className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="relative flex items-center justify-center text-2xl font-bold">
            <Stethoscope className="mr-3 h-7 w-7 text-green-600" />
            {step === "summary" && t("consult_doctor_summary_title")}
            {step === "consent" && t("data_sharing_consent_title")}
            {step === "confirmation" && t("consultation_complete_title")}
          </DialogTitle>
          <DialogDescription>
            {step === "summary" && t("consult_doctor_summary_description")}
            {step === "consent" && t("data_sharing_consent_description")}
            {step === "confirmation" && t("consultation_complete_description")}
          </DialogDescription>
        </DialogHeader>

        {/* ---------- Body ---------- */}
        {step === "summary" && (
          <ScrollArea className="flex-1 pr-4 py-4">
            {loadingAssessments ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                <h3 className="text-xl font-semibold">{t("loading_assessments")}...</h3>
                <p className="text-gray-500">{t("please_wait")}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <XCircle className="h-16 w-16 text-red-600" />
                <div>
                  <h3 className="text-xl font-semibold">{t("error")}</h3>
                  <p className="text-gray-500 mt-1">{error}</p>
                </div>
                <Button onClick={loadUserAssessments}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("try_again")}
                </Button>
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <Info className="h-16 w-16 text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold">{t("not_logged_in")}</h3>
                  <p className="text-gray-500 mt-1">{t("login_to_consult")}</p>
                </div>
                <Button onClick={handleCloseModal}>{t("close")}</Button>
              </div>
            ) : latestAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <FileText className="h-16 w-16 text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold">{t("no_assessment_data")}</h3>
                  <p className="text-gray-500 mt-1">{t("start_assessment_to_consult")}</p>
                </div>
                <Button onClick={handleCloseModal}>{t("close")}</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{t("review_latest_assessments")}</p>
                {latestAssessments.map((assessment) => {
                  const CategoryIcon = getCategoryIcon(assessment.category_id)
                  return (
                    <Card
                      key={assessment.id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-md rounded-xl"
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="h-6 w-6 text-blue-500" />
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                              {getCategoryTitle(assessment.category_id)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(assessment.completed_at).toLocaleDateString("th-TH")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {assessment.category_id !== "basic" ? (
                            <Badge className={getRiskLevelBadgeClass(assessment.risk_level)}>
                              {getRiskLevelLabel(assessment.risk_level)}
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                              {t("personal_information")}
                            </Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        )}

        {step === "consent" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-4">
            <AlertTriangle className="h-20 w-20 text-orange-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("data_sharing_consent_heading")}</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">{t("data_sharing_consent_full_text")}</p>
          </div>
        )}

        {step === "confirmation" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("consultation_success_heading")}</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">{t("consultation_success_message")}</p>
          </div>
        )}

        {/* ---------- Footer ---------- */}
        <DialogFooter className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
          {step === "summary" && (
            <Button
              onClick={handleSendToDoctor}
              disabled={loadingAssessments || error !== null || latestAssessments.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg"
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              {t("send_to_doctor")}
            </Button>
          )}
          {step === "consent" && (
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-xl shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleConsent}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("consent")}
              </Button>
            </div>
          )}
          {step === "confirmation" && (
            <Button
              onClick={handleCloseModal}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
            >
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
