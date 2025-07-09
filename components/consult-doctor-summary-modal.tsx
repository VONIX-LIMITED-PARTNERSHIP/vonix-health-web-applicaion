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
  ChevronRight,
  AlertTriangle,
  XCircle,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured, createClientComponentClient } from "@/lib/supabase"
import { getRiskLevelText, getRiskLevelBadgeClass } from "@/utils/risk-level"

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
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const { user, loading: authLoading } = useAuth()

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
    const categoryTitles: Record<string, { th: string; en: string }> = {
      basic: { th: "ข้อมูลพื้นฐาน", en: "Basic Information" },
      heart: { th: "สุขภาพหัวใจ", en: "Heart Health" },
      mental: { th: "สุขภาพจิต", en: "Mental Health" },
      nutrition: { th: "โภชนาการ", en: "Nutrition" },
      sleep: { th: "สุขภาพการนอน", en: "Sleep Health" },
      physical: { th: "กิจกรรมทางกาย", en: "Physical Activity" },
      stress: { th: "ความเครียด", en: "Stress Management" },
    }
    return categoryTitles[categoryId]?.[locale as "th" | "en"] || t("not_available")
  }

  // Calculate overall health summary
  const getHealthSummary = () => {
    if (latestAssessments.length === 0) return null

    const nonBasicAssessments = latestAssessments.filter((a) => a.category_id !== "basic")
    if (nonBasicAssessments.length === 0) return null

    const riskCounts = {
      low: 0,
      medium: 0,
      high: 0,
      "very-high": 0,
    }

    nonBasicAssessments.forEach((assessment) => {
      const risk = assessment.risk_level?.toLowerCase()
      if (risk && riskCounts.hasOwnProperty(risk)) {
        riskCounts[risk as keyof typeof riskCounts]++
      }
    })

    const totalScore = nonBasicAssessments.reduce((sum, a) => sum + (a.percentage || 0), 0)
    const averageScore = Math.round(totalScore / nonBasicAssessments.length)

    return {
      totalAssessments: nonBasicAssessments.length,
      averageScore,
      riskCounts,
      overallRisk:
        riskCounts["very-high"] > 0
          ? "very-high"
          : riskCounts.high > 0
            ? "high"
            : riskCounts.medium > 0
              ? "medium"
              : "low",
    }
  }

  const healthSummary = getHealthSummary()

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
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col rounded-xl shadow-2xl p-6 bg-white dark:bg-gray-900">
        {/* ---------- Header ---------- */}
        <DialogHeader className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="relative flex items-center justify-center text-2xl font-bold">
            <Stethoscope className="mr-3 h-7 w-7 text-green-600" />
            {step === "summary" && (locale === "th" ? "สรุปข้อมูลสุขภาพ" : "Health Summary")}
            {step === "consent" && (locale === "th" ? "ยินยอมแชร์ข้อมูล" : "Data Sharing Consent")}
            {step === "confirmation" && (locale === "th" ? "ส่งข้อมูลสำเร็จ" : "Successfully Sent")}
          </DialogTitle>
          <DialogDescription>
            {step === "summary" &&
              (locale === "th" ? "ตรวจสอบข้อมูลสุขภาพก่อนส่งให้แพทย์" : "Review your health data before sending to doctor")}
            {step === "consent" &&
              (locale === "th" ? "ยืนยันการแชร์ข้อมูลสุขภาพกับแพทย์" : "Confirm sharing your health data with doctor")}
            {step === "confirmation" &&
              (locale === "th" ? "ข้อมูลของคุณถูกส่งให้แพทย์เรียบร้อยแล้ว" : "Your health data has been sent to the doctor")}
          </DialogDescription>
        </DialogHeader>

        {/* ---------- Body ---------- */}
        {step === "summary" && (
          <ScrollArea className="flex-1 pr-4 py-4">
            {loadingAssessments ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                <h3 className="text-xl font-semibold">{locale === "th" ? "กำลังโหลดข้อมูล..." : "Loading data..."}</h3>
                <p className="text-gray-500">{locale === "th" ? "กรุณารอสักครู่" : "Please wait"}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <XCircle className="h-16 w-16 text-red-600" />
                <div>
                  <h3 className="text-xl font-semibold">{locale === "th" ? "เกิดข้อผิดพลาด" : "Error"}</h3>
                  <p className="text-gray-500 mt-1">{error}</p>
                </div>
                <Button onClick={loadUserAssessments}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {locale === "th" ? "ลองใหม่" : "Try Again"}
                </Button>
              </div>
            ) : !user ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <Info className="h-16 w-16 text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold">{locale === "th" ? "ยังไม่ได้เข้าสู่ระบบ" : "Not Logged In"}</h3>
                  <p className="text-gray-500 mt-1">
                    {locale === "th" ? "กรุณาเข้าสู่ระบบเพื่อปรึกษาแพทย์" : "Please log in to consult a doctor"}
                  </p>
                </div>
                <Button onClick={handleCloseModal}>{locale === "th" ? "ปิด" : "Close"}</Button>
              </div>
            ) : latestAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <FileText className="h-16 w-16 text-gray-500" />
                <div>
                  <h3 className="text-xl font-semibold">
                    {locale === "th" ? "ยังไม่มีข้อมูลการประเมิน" : "No Assessment Data"}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {locale === "th" ? "กรุณาทำแบบประเมินก่อนปรึกษาแพทย์" : "Please complete assessments before consulting"}
                  </p>
                </div>
                <Button onClick={handleCloseModal}>{locale === "th" ? "ปิด" : "Close"}</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Health Overview Summary */}
                {healthSummary && (
                  <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {locale === "th" ? "สรุปภาพรวมสุขภาพ" : "Health Overview Summary"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{healthSummary.totalAssessments}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {locale === "th" ? "การประเมิน" : "Assessments"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{healthSummary.averageScore}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {locale === "th" ? "คะแนนเฉลี่ย" : "Average Score"}
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge className={getRiskLevelBadgeClass(healthSummary.overallRisk)} variant="outline">
                            {getRiskLevelText(healthSummary.overallRisk, locale)}
                          </Badge>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {locale === "th" ? "ความเสี่ยงรวม" : "Overall Risk"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {Object.values(healthSummary.riskCounts).reduce((a, b) => a + b, 0)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {locale === "th" ? "ปัจจัยเสี่ยง" : "Risk Factors"}
                          </div>
                        </div>
                      </div>

                      {/* Risk Distribution */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {healthSummary.riskCounts.low > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            {locale === "th" ? "ต่ำ" : "Low"}: {healthSummary.riskCounts.low}
                          </Badge>
                        )}
                        {healthSummary.riskCounts.medium > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          >
                            {locale === "th" ? "ปานกลาง" : "Medium"}: {healthSummary.riskCounts.medium}
                          </Badge>
                        )}
                        {healthSummary.riskCounts.high > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          >
                            {locale === "th" ? "สูง" : "High"}: {healthSummary.riskCounts.high}
                          </Badge>
                        )}
                        {healthSummary.riskCounts["very-high"] > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          >
                            {locale === "th" ? "สูงมาก" : "Very High"}: {healthSummary.riskCounts["very-high"]}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assessment Details */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {locale === "th" ? "รายละเอียดการประเมิน" : "Assessment Details"}
                  </h4>
                  <div className="space-y-3">
                    {latestAssessments.map((assessment) => {
                      const CategoryIcon = getCategoryIcon(assessment.category_id)
                      const isBasic = assessment.category_id === "basic"

                      return (
                        <Card
                          key={assessment.id}
                          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg hover:shadow-md transition-shadow"
                        >
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={`p-2 rounded-lg ${isBasic ? "bg-blue-100 dark:bg-blue-900/30" : "bg-purple-100 dark:bg-purple-900/30"}`}
                              >
                                <CategoryIcon className={`h-5 w-5 ${isBasic ? "text-blue-600" : "text-purple-600"}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                  {getCategoryTitle(assessment.category_id)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(assessment.completed_at).toLocaleDateString(
                                      locale === "th" ? "th-TH" : "en-US",
                                    )}
                                  </span>
                                  {!isBasic && (
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      {assessment.percentage}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isBasic ? (
                                <Badge className={getRiskLevelBadgeClass(assessment.risk_level)}>
                                  {getRiskLevelText(assessment.risk_level, locale)}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                >
                                  {locale === "th" ? "เสร็จสิ้น" : "Completed"}
                                </Badge>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Important Note */}
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {locale === "th" ? "ข้อมูลสำคัญ" : "Important Information"}
                        </h5>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {locale === "th"
                            ? "ข้อมูลนี้จะถูกส่งให้แพทย์เพื่อการปรึกษาเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์"
                            : "This information will be sent to the doctor for preliminary consultation, not medical diagnosis"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </ScrollArea>
        )}

        {step === "consent" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-4">
            <AlertTriangle className="h-20 w-20 text-orange-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {locale === "th" ? "ยืนยันการแชร์ข้อมูล" : "Confirm Data Sharing"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              {locale === "th"
                ? "คุณยินยอมให้เราแชร์ข้อมูลสุขภาพของคุณกับแพทย์เพื่อการปรึกษาหรือไม่?"
                : "Do you consent to sharing your health data with the doctor for consultation?"}
            </p>
          </div>
        )}

        {step === "confirmation" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {locale === "th" ? "ส่งข้อมูลสำเร็จ!" : "Successfully Sent!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              {locale === "th"
                ? "ข้อมูลสุขภาพของคุณถูกส่งให้แพทย์เรียบร้อยแล้ว แพทย์จะติดต่อกลับภายใน 24 ชั่วโมง"
                : "Your health data has been sent to the doctor. The doctor will contact you within 24 hours."}
            </p>
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
              {locale === "th" ? "ส่งให้แพทย์" : "Send to Doctor"}
            </Button>
          )}
          {step === "consent" && (
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-xl shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                {locale === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button
                onClick={handleConsent}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {locale === "th" ? "ยินยอม" : "Consent"}
              </Button>
            </div>
          )}
          {step === "confirmation" && (
            <Button
              onClick={handleCloseModal}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
            >
              {locale === "th" ? "ปิด" : "Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
