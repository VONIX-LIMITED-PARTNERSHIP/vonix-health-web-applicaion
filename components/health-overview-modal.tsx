"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bed,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Dumbbell,
  FileText,
  FlaskConical,
  HeartPulse,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Utensils,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import { assessmentCategories as allAssessmentCategories } from "@/data/assessment-questions"

interface HealthOverviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

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

export function HealthOverviewModal({ isOpen, onOpenChange }: HealthOverviewModalProps) {
  const { t } = useTranslation()
  const { user, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessments, setAssessments] = useState<any[]>([])

  const [dashboardStats, setDashboardStats] = useState({
    overallScore: 0,
    riskFactors: 0,
    completedAssessments: 0,
    reportReady: false,
  })

  // Detailed-view state
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null)
  const [detailedAssessmentData, setDetailedAssessmentData] = useState<any | null>(null)
  const [loadingDetailedAssessment, setLoadingDetailedAssessment] = useState(false)
  const [detailedAssessmentError, setDetailedAssessmentError] = useState<string | null>(null)

  /* ────────────────────────────────────────────────────────────────────
     Lifecycle
  ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen && !authLoading && user?.id && isSupabaseConfigured()) {
      void loadUserAssessments()
    } else if (!isOpen) {
      resetState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, authLoading, user?.id])

  const resetState = () => {
    setAssessments([])
    setDashboardStats({
      overallScore: 0,
      riskFactors: 0,
      completedAssessments: 0,
      reportReady: false,
    })
    setLoading(true)
    setError(null)
    setSelectedAssessmentId(null)
    setDetailedAssessmentData(null)
    setLoadingDetailedAssessment(false)
    setDetailedAssessmentError(null)
  }

  /* ────────────────────────────────────────────────────────────────────
     Data loaders
  ──────────────────────────────────────────────────────────────────── */
  const loadUserAssessments = async () => {
    if (!user?.id || !isSupabaseConfigured()) {
      setError(t("login_to_view_health_overview"))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(t("save_timeout"))), 15_000),
      )

      const result = await Promise.race([
        AssessmentService.getUserAssessments(user.id).then((res) => ({ type: "success", data: res })),
        timeoutPromise.then((res) => ({ type: "timeout", data: res })),
      ])

      if (result.type === "timeout") throw new Error(t("save_timeout"))

      const { data, error: serviceError } = result.data
      if (serviceError) throw serviceError

      const allAssessments = data ?? []
      setAssessments(allAssessments)

      const latestAssessments = getLatestAssessments(allAssessments)
      calculateDashboardStats(latestAssessments)
    } catch (err: any) {
      console.error("Error loading user assessments:", err)
      setError(err.message ?? t("error_loading_analysis"))
    } finally {
      setLoading(false)
    }
  }

  const loadDetailedAssessment = async (assessmentId: string) => {
    setLoadingDetailedAssessment(true)
    setDetailedAssessmentError(null)

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(t("loading_details"))), 15_000),
      )

      const result = await Promise.race([
        AssessmentService.getAssessmentById(assessmentId).then((res) => ({ type: "success", data: res })),
        timeoutPromise.then((res) => ({ type: "timeout", data: res })),
      ])

      if (result.type === "timeout") throw new Error(t("loading_details"))

      const { data, error: serviceError } = result.data
      if (serviceError) throw serviceError

      setDetailedAssessmentData(data)
      setSelectedAssessmentId(assessmentId)
    } catch (err: any) {
      console.error("Error loading detailed assessment:", err)
      setDetailedAssessmentError(err.message ?? t("error_loading_details"))
    } finally {
      setLoadingDetailedAssessment(false)
    }
  }

  /* ────────────────────────────────────────────────────────────────────
     Helpers
  ──────────────────────────────────────────────────────────────────── */
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

  const calculateDashboardStats = (latestAssessments: any[]) => {
    if (!latestAssessments.length) {
      setDashboardStats({
        overallScore: 0,
        riskFactors: 0,
        completedAssessments: 0,
        reportReady: false,
      })
      return
    }

    const totalScore = latestAssessments.reduce((sum, a) => sum + a.percentage, 0)
    const avgScore = Math.round(totalScore / latestAssessments.length)

    const allRiskFactors = latestAssessments.flatMap((a) => a.risk_factors ?? [])
    const uniqueRiskFactors = new Set(allRiskFactors).size

    const required = ["basic", "heart", "nutrition"]
    const completedRequired = required.filter((cat) => latestAssessments.some((a) => a.category_id === cat)).length

    setDashboardStats({
      overallScore: avgScore,
      riskFactors: uniqueRiskFactors,
      completedAssessments: latestAssessments.length,
      reportReady: completedRequired >= required.length,
    })
  }

  const getCategoryIcon = (categoryId: string) => (iconMap[categoryId] ?? Info) as React.ElementType

  const getCategoryTitle = (categoryId: string) =>
    allAssessmentCategories.find((c) => c.id === categoryId)?.title ?? t("not_available")

  const getRiskLevelBadge = (level: string) => {
    const badgeMap: Record<string, { color: string; label: string }> = {
      low: { color: "bg-green-500 dark:bg-green-700", label: t("low_risk") },
      medium: { color: "bg-yellow-500 dark:bg-yellow-700", label: t("medium_risk") },
      high: { color: "bg-orange-500 dark:bg-orange-700", label: t("high_risk") },
      "very-high": { color: "bg-red-500 dark:bg-red-700", label: t("very_high_risk") },
    }
    const { color, label } = badgeMap[level] ?? { color: "bg-gray-200", label: t("unspecified_risk") }
    return <Badge className={`${color} text-white`}>{label}</Badge>
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
            {selectedAssessmentId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedAssessmentId(null)
                  setDetailedAssessmentData(null)
                }}
                className="absolute left-4 top-0 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">{t("back")}</span>
              </Button>
            )}
            <Activity className="mr-3 h-7 w-7 text-blue-600" />
            {t("health_overview_modal_title")}
          </DialogTitle>
          <DialogDescription>
            {selectedAssessmentId ? t("detailed_assessment_description") : t("health_overview_modal_description")}
          </DialogDescription>
        </DialogHeader>

        {/* ---------- Body ---------- */}
        {selectedAssessmentId ? (
          /* ===== Detailed view ===== */
          loadingDetailedAssessment ? (
            <LoaderSection text={t("loading_details")} />
          ) : detailedAssessmentError ? (
            <ErrorSection
              message={detailedAssessmentError}
              onRetry={() => selectedAssessmentId && loadDetailedAssessment(selectedAssessmentId)}
            />
          ) : detailedAssessmentData ? (
            <DetailedAssessmentView data={detailedAssessmentData} />
          ) : null
        ) : /* ===== Overview list ===== */
        loading ? (
          <LoaderSection text={t("loading")} />
        ) : error ? (
          <ErrorSection message={error} onRetry={loadUserAssessments} />
        ) : !user ? (
          <NotLoggedInSection />
        ) : !assessments.length ? (
          <NoAssessmentSection />
        ) : (
          <OverviewSection />
        )}
      </DialogContent>
    </Dialog>
  )

  /* ────────────  Sub-components used above  ──────────── */

  function LoaderSection({ text }: { text: string }) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        <h3 className="text-xl font-semibold">{text}...</h3>
        <p className="text-gray-500">{t("please_wait")}</p>
      </div>
    )
  }

  function ErrorSection({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <XCircle className="h-16 w-16 text-red-600" />
        <div>
          <h3 className="text-xl font-semibold">{t("error")}</h3>
          <p className="text-gray-500 mt-1">{message}</p>
        </div>
        <Button onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("try_again")}
        </Button>
      </div>
    )
  }

  function NotLoggedInSection() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <Info className="h-16 w-16 text-gray-500" />
        <div>
          <h3 className="text-xl font-semibold">{t("not_logged_in")}</h3>
          <p className="text-gray-500 mt-1">{t("login_to_view_health_overview")}</p>
        </div>
        <Button asChild>
          <Link href="/login">{t("login")}</Link>
        </Button>
      </div>
    )
  }

  function NoAssessmentSection() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <FileText className="h-16 w-16 text-gray-500" />
        <div>
          <h3 className="text-xl font-semibold">{t("no_assessment_data")}</h3>
          <p className="text-gray-500 mt-1">{t("start_assessment_to_view")}</p>
        </div>
        <Button asChild onClick={() => onOpenChange(false)}>
          <Link href="/">{t("start_health_assessment")}</Link>
        </Button>
      </div>
    )
  }

  function DetailedAssessmentView({ data }: { data: any }) {
    return (
      <ScrollArea className="flex-1 pr-4">
        <div className="py-4 space-y-6">
          {/* ---------- Summary card ---------- */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {getCategoryTitle(data.category_id)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatRow label={t("score_label")}>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {data.percentage}%
                </Badge>
              </StatRow>
              <StatRow label={t("risk_level_label")}>{getRiskLevelBadge(data.risk_level)}</StatRow>
              <StatRow label={t("assessment_date_label")}>
                {new Date(data.completed_at).toLocaleDateString("th-TH")}
              </StatRow>
            </CardContent>
          </Card>

          {/* ---------- Risk factors ---------- */}
          {data.risk_factors?.length > 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  {t("risk_factors")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                  {data.risk_factors.map((factor: string, idx: number) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* ---------- Recommendations ---------- */}
          {data.recommendations?.length > 0 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {t("recommendations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                  {data.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    )
  }

  function StatRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-300">{label}:</span>
        {children}
      </div>
    )
  }

  function OverviewSection() {
    return (
      <ScrollArea className="flex-1 pr-4">
        <div className="py-4 space-y-6">
          {/* ---------- Dashboard stats ---------- */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {t("summary_overview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <Metric
                  value={`${dashboardStats.overallScore}%`}
                  label={t("overall_health_score")}
                  color="text-blue-600"
                />
                <Metric value={dashboardStats.riskFactors} label={t("risk_factors_found")} color="text-orange-600" />
                <Metric
                  value={dashboardStats.completedAssessments}
                  label={t("assessments_completed")}
                  color="text-green-600"
                />
                <Metric
                  value={dashboardStats.reportReady ? t("report_ready") : t("report_not_ready")}
                  label={t("health_report_status")}
                  color="text-purple-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* ---------- Latest assessments ---------- */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {t("latest_assessments")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getLatestAssessments(assessments).map((assessment) => {
                const CategoryIcon = getCategoryIcon(assessment.category_id)
                return (
                  <AssessmentRow
                    key={assessment.id}
                    assessment={assessment}
                    Icon={CategoryIcon}
                    onClick={() => loadDetailedAssessment(assessment.id)}
                  />
                )
              })}
            </CardContent>
          </Card>

          {/* ---------- Full history (only if more than latest) ---------- */}
          {assessments.length > getLatestAssessments(assessments).length && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {t("all_assessment_history")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessments
                  .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                  .map((assessment) => {
                    const CategoryIcon = getCategoryIcon(assessment.category_id)
                    return (
                      <AssessmentRow
                        key={assessment.id}
                        assessment={assessment}
                        Icon={CategoryIcon}
                        onClick={() => loadDetailedAssessment(assessment.id)}
                      />
                    )
                  })}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    )
  }

  function Metric({
    value,
    label,
    color,
  }: {
    value: React.ReactNode
    label: string
    color: string
  }) {
    return (
      <div>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      </div>
    )
  }

  function AssessmentRow({
    assessment,
    Icon,
    onClick,
  }: {
    assessment: any
    Icon: React.ElementType
    onClick: () => void
  }) {
    return (
      <div
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-blue-500" />
          <div>
            <div className="font-semibold">{getCategoryTitle(assessment.category_id)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(assessment.completed_at).toLocaleDateString("th-TH")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            {assessment.percentage}%
          </Badge>
          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    )
  }
}
