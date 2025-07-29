"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DemoBanner}from "@/components/demo-banner"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { AssessmentService } from "@/lib/assessment-service"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { isSupabaseConfigured, createClientComponentClient } from "@/lib/supabase"
import {
  Play,
  Stethoscope,
  User,
  Heart,
  Apple,
  Brain,
  MoonIcon,
  ChevronRight,
  Activity,
  Sparkles,
  Shield,
  Zap,
  Clock,
  Dumbbell,
  Loader2,
  BarChart,
  CheckCircle,
  TrendingUp,
  Award,
  Wind,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ConsultDoctorIntroModal } from "@/components/consult-doctor-intro-modal"
import { HealthOverviewModal } from "@/components/health-overview-modal"
import { GuestHealthOverviewModal } from "@/components/guest-health-overview-modal"
import { ConsultDoctorSummaryModal } from "@/components/consult-doctor-summary-modal"
import { useTranslation } from "@/hooks/use-translation"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { useLanguage } from "@/contexts/language-context"
import { getAssessmentCategories } from "@/data/assessment-questions"
import type { DashboardStats } from "@/types/assessment"

export default function HomePage() {
  const { user, profile, isAuthSessionLoading, isProfileLoading } = useAuth()
  const { guestUser, isGuestLoggedIn, loading: guestAuthLoading } = useGuestAuth()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [assessments, setAssessments] = useState<any[]>([])
  const [guestAssessments, setGuestAssessments] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [isConsultIntroModalOpen, setIsConsultIntroModalOpen] = useState(false)
  const [isConsultSummaryModalOpen, setIsConsultSummaryModalOpen] = useState(false)
  const [isHealthOverviewModalOpen, setIsHealthOverviewModalOpen] = useState(false)
  const [isGuestHealthOverviewModalOpen, setIsGuestHealthOverviewModalOpen] = useState(false)
  const [targetAssessmentId, setTargetAssessmentId] = useState<string | null>(null)

  const { t } = useTranslation(["common"])
  const { getRiskLevelLabel } = useRiskLevelTranslation()
  const { locale } = useLanguage()

  const router = useRouter()
  const { toast } = useToast()

  const isLoggedIn = (!isAuthSessionLoading && !isProfileLoading && user && profile) || isGuestLoggedIn

  const getHealthLevelColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-blue-600"
      case "high":
        return "text-orange-600"
      case "very-high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isGuestLoggedIn) {
      loadGuestAssessments()
    } else if (!isAuthSessionLoading && !isProfileLoading && user?.id && isSupabaseConfigured()) {
      loadUserAssessments()
    }
  }, [isGuestLoggedIn, isAuthSessionLoading, isProfileLoading, user?.id])

  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoadingStats(true)
      if (isGuestLoggedIn) {
        const stats = GuestAssessmentService.getDashboardStats()
        setDashboardStats(stats)
      } else if (user && profile) {
        // TODO: Fetch actual user dashboard stats from backend
        // For now, simulate with placeholder data
        setDashboardStats({
          totalAssessments: 5,
          lastAssessmentDate: "2024-07-01",
          riskLevels: {
            cardiac: "low",
            diabetes: "medium",
          },
          overallRisk: "low",
          recommendations: [], // ลบ recommendations ออกไปก่อน
        })
      } else {
        // Reset stats if no one is logged in
        setDashboardStats(null)
      }
      setLoadingStats(false)
    }

    if (!isAuthSessionLoading && !guestAuthLoading) {
      loadDashboardStats()
    }
  }, [user, profile, isAuthSessionLoading, isGuestLoggedIn, guestAuthLoading])

  useEffect(() => {
    if (mounted && searchParams.get("openHealthOverview")) {
      const categoryToOpen = searchParams.get("openHealthOverview")
      const assessmentId = searchParams.get("assessmentId")

      console.log("🎯 HomePage: เปิด Health Overview Modal จาก URL parameter")
      console.log("📋 HomePage: Category:", categoryToOpen, "Assessment ID:", assessmentId)

      if (isGuestLoggedIn) {
        setIsGuestHealthOverviewModalOpen(true)
      } else {
        setIsHealthOverviewModalOpen(true)
      }

      if (assessmentId) {
        setTargetAssessmentId(assessmentId)
      }

      const url = new URL(window.location.href)
      url.searchParams.delete("openHealthOverview")
      url.searchParams.delete("assessmentId")
      window.history.replaceState({}, "", url.toString())
    }
  }, [mounted, searchParams, isGuestLoggedIn])

  const loadGuestAssessments = () => {
    try {
      const guestData = GuestAssessmentService.getLatestAssessments()
      setGuestAssessments(guestData.map((item) => item.result)) // Map to AssessmentResult[]

      const stats = GuestAssessmentService.getDashboardStats() // Corrected call
      setDashboardStats(stats)
    } catch (error) {
      console.error("Error loading guest assessments:", error)
    }
  }

  const loadUserAssessments = async () => {
    if (!user?.id || !isSupabaseConfigured()) return

    const supabaseClient = createClientComponentClient()
    if (!supabaseClient) return

    setLoadingStats(true)
    try {
      const { data, error } = await AssessmentService.getUserAssessments(supabaseClient, user.id)

      if (error) {
        return
      }

      const allAssessments = data || []
      setAssessments(allAssessments)

      const latestAssessments = getLatestAssessments(allAssessments)
      calculateDashboardStats(latestAssessments)
    } catch (error) {
      // console.error("Error loading user assessments:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const getLatestAssessments = (assessmentData: any[]) => {
    const latestByCategory = new Map()

    assessmentData.forEach((assessment) => {
      const categoryId = assessment.category_id
      const currentLatest = latestByCategory.get(categoryId)

      if (!currentLatest || new Date(assessment.completed_at) > new Date(currentLatest.completed_at)) {
        latestByCategory.set(categoryId, assessment)
      }
    })

    return Array.from(latestByCategory.values())
  }

  const calculateDashboardStats = (latestAssessments: any[]) => {
    if (latestAssessments.length === 0) {
      setDashboardStats({
        totalAssessments: 0,
        lastAssessmentDate: "",
        riskLevels: {},
        overallRisk: "low",
        recommendations: [],
      })
      return
    }

    const totalScore = latestAssessments.reduce((sum, assessment) => sum + assessment.percentage, 0)
    const averageScore = Math.round(totalScore / latestAssessments.length)

    const allRiskFactors = latestAssessments.reduce((factors, assessment) => {
      return factors.concat(assessment.risk_factors || [])
    }, [])
    const uniqueRiskFactors = [...new Set(allRiskFactors)].length

    const requiredCategories = ["basic", "heart", "nutrition"]
    const completedRequired = requiredCategories.filter((category) =>
      latestAssessments.some((assessment) => assessment.category_id === category),
    ).length

    // Calculate health score based on risk levels (same logic as health overview modal)
    let healthScore = 100
    latestAssessments.forEach((assessment) => {
      switch (assessment.risk_level?.toLowerCase()) {
        case "high":
          healthScore -= 15
          break
        case "very-high":
        case "very_high":
          healthScore -= 25
          break
        case "medium":
          healthScore -= 8
          break
      }
    })
    healthScore = Math.max(0, healthScore)

    // Convert health score to risk level
    let overallRisk = "low"
    if (healthScore >= 80) {
      overallRisk = "low"
    } else if (healthScore >= 60) {
      overallRisk = "medium"
    } else if (healthScore >= 40) {
      overallRisk = "high"
    } else {
      overallRisk = "very-high"
    }

    setDashboardStats({
      totalAssessments: latestAssessments.length,
      lastAssessmentDate: latestAssessments[0]?.completed_at || "",
      riskLevels: {
        cardiac: latestAssessments.find((a) => a.category_id === "heart")?.risk_level || "",
        diabetes: latestAssessments.find((a) => a.category_id === "nutrition")?.risk_level || "",
      },
      overallRisk: overallRisk,
      recommendations: [], // Ensure recommendations is an empty array
    })
  }

  if (!mounted) {
    return null
  }

  const getUpdatedCategories = () => {
    const currentAssessments = isGuestLoggedIn ? guestAssessments : getLatestAssessments(assessments)

    // Get assessment categories based on current language
    const assessmentCategories = getAssessmentCategories(locale)

    const categoryMappings = [
      {
        id: "basic",
        icon: User,
        required: true,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "heart",
        icon: Heart,
        required: true,
        gradient: "from-red-500 to-pink-500",
        bgGradient: "from-red-50 to-pink-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "nutrition",
        icon: Apple,
        required: true,
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-green-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "mental",
        icon: Brain,
        required: true,
        gradient: "from-purple-500 to-violet-500",
        bgGradient: "from-purple-50 to-purple-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "physical",
        icon: Dumbbell,
        required: true,
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-50 to-orange-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "sleep",
        icon: MoonIcon,
        required: true,
        gradient: "from-indigo-500 to-blue-500",
        bgGradient: "from-indigo-50 to-indigo-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
    ]

    return categoryMappings.map((mapping) => {
      const assessmentCategory = assessmentCategories.find((cat) => cat.id === mapping.id)
      const userAssessment = currentAssessments.find((a) => a.category_id === mapping.id)

      const baseCategory = {
        ...mapping,
        title: assessmentCategory?.title || mapping.id,
        description: assessmentCategory?.description || "",
        status:
          mapping.id === "basic"
            ? locale === "th"
              ? "กรอกข้อมูล"
              : "Fill Information"
            : locale === "th"
              ? "เริ่มประเมิน"
              : "Start Assessment",
        progress: 0,
      }

      if (userAssessment) {
        return {
          ...baseCategory,
          status: t("completed"),
          progress: 100,
          lastCompleted: new Date(userAssessment.completed_at).toLocaleDateString(locale === "th" ? "th-TH" : "en-US"),
          riskLevel: userAssessment.risk_level,
          riskFactorsCount: userAssessment.risk_factors ? userAssessment.risk_factors.length : 0,
        }
      }

      // For non-completed assessments, set appropriate status
      if (!userAssessment && !baseCategory.required) {
        baseCategory.status = locale === "th" ? "ยังไม่ได้ประเมิน" : "Not Assessed Yet"
      }

      return baseCategory
    })
  }

  const handleStartAssessment = () => {
    if (!isLoggedIn) {
      router.push("/guest-login")
      return
    }

    const assessmentSection = document.getElementById("assessment-section")
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleConsultDoctorClick = () => {
    // This function will not be called if the button is disabled
    if (isLoggedIn) {
      setIsConsultIntroModalOpen(true)
    } else {
      router.push("/guest-login")
    }
  }

  const handleViewHealthOverviewClick = () => {
    if (isGuestLoggedIn) {
      setIsGuestHealthOverviewModalOpen(true)
    } else if (user && profile) {
      setIsHealthOverviewModalOpen(true)
    } else {
      router.push("/guest-login")
    }
  }

  const renderDashboardContent = () => {
    if (loadingStats || isAuthSessionLoading || isProfileLoading || guestAuthLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">{t("loading_dashboard")}...</span>
        </div>
      )
    }

    if (!isLoggedIn) {
      return (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("welcome_to_vonix")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{t("login_or_try_guest")}</p>
            <Button
              onClick={() => router.push("/guest-login")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              {t("try_now_as_guest")}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <Card className="mb-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200/50 dark:border-gray-700/50 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {t("your_health_overview")}
                  {isGuestLoggedIn && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 font-medium">
                      {locale === "th" ? "ทดลองใช้งาน" : "Guest Mode"}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t("assessment_progress")}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300
                dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
                onClick={handleViewHealthOverviewClick}
                disabled={!isLoggedIn}
              >
                <BarChart className="mr-2 h-4 w-4" />
                {t("health_overview")}
              </Button>
              <Button
                className="bg-gray-200 text-gray-500 cursor-not-allowed font-medium rounded-xl shadow-md transition-all duration-300
                dark:bg-gray-700 dark:text-gray-500"
                onClick={handleConsultDoctorClick}
                disabled
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                {t("consult_doctor")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200/50 dark:border-gray-600/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <div
                    className={`text-xl sm:text-2xl font-bold ${getHealthLevelColor(dashboardStats?.overallRisk || "")}`}
                  >
                    {dashboardStats?.overallRisk ? getRiskLevelLabel(dashboardStats.overallRisk) : t("no_data")}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {t("overall_health_score")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {dashboardStats?.lastAssessmentDate ? t("updated_at") : t("no_data")}
                </div>
              </div>
            </div>

            <div className="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-orange-200/50 dark:border-gray-600/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {dashboardStats?.totalAssessments || 0}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {t("risk_factors")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  {t("identified")}
                </div>
              </div>
            </div>

            <div className="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border border-green-200/50 dark:border-gray-600/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {dashboardStats?.totalAssessments || 0}/6
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {t("assessments")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t("completed")}
                </div>
              </div>
            </div>

            <div className="relative p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200/50 dark:border-gray-600/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/30 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">
                    {dashboardStats?.totalAssessments && dashboardStats.totalAssessments >= 3
                      ? t("report_ready")
                      : t("report_not_ready")}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {t("health_report")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dashboardStats?.totalAssessments && dashboardStats.totalAssessments >= 3
                    ? t("can_generate_report")
                    : t("must_complete_3_categories")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />
      <DemoBanner />

      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
            <div className="text-center max-w-5xl mx-auto">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200/50 text-blue-700 text-sm font-medium mb-8 shadow-lg">
                <Shield className="w-4 h-4 mr-2" />
                {t("smart_health_assessment_system")}
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-relaxed">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 inline-block py-2">
                  {t("assess_health_with_ai")}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                {t("easy_fast_accurate")}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                {t("ai_powered_description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={handleStartAssessment}
                >
                  <Play className="mr-3 h-6 w-6" />
                  {t("start_health_assessment")}
                </Button>
                {isLoggedIn && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 h-auto border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                    dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
                    onClick={handleConsultDoctorClick}
                    disabled
                  >
                    <Stethoscope className="mr-3 h-6 w-6" />
                    {t("consult_doctor_online")}
                  </Button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white">{t("smart_ai")}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("analyze_with_openai")}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white">{t("secure")}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("encrypted_data_pdpa")}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white">{t("fast_results")}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("results_in_minutes")}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          {isLoggedIn && (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">{renderDashboardContent()}</section>
          )}

          {/* Assessment Categories */}
          {isLoggedIn && (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20" id="assessment-section">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200">
                    {t("health_assessments")}
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t("choose_assessment_type")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getUpdatedCategories().map((category, index) => (
                  <Card
                    key={category.id}
                    className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 dark:to-transparent"></div>
                    <CardContent className="relative p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`p-4 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <category.icon className="h-8 w-8" />
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {category.required ? (
                            <Badge className="bg-red-500 text-white font-medium px-3 py-1 rounded-full shadow-sm">
                              {t("required")}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full shadow-sm dark:bg-blue-800 dark:text-blue-200"
                            >
                              {t("optional")}
                            </Badge>
                          )}
                          {category.progress > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              <div className="font-semibold text-green-600 dark:text-green-400 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t("completed")}
                              </div>
                              {category.id !== "basic" && category.riskLevel && (
                                <div
                                  className={`font-semibold text-sm mt-1 ${
                                    category.riskLevel === "low"
                                      ? "text-green-600 dark:text-green-400"
                                      : category.riskLevel === "medium"
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : category.riskLevel === "high"
                                          ? "text-orange-600 dark:text-orange-400"
                                          : category.riskLevel === "very-high"
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  ({getRiskLevelLabel(category.riskLevel)})
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-gray-800 transition-colors dark:text-white dark:group-hover:text-gray-100">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed dark:text-gray-300">{category.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-6 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {category.status}
                        {category.lastCompleted && <span className="ml-2 text-xs">({category.lastCompleted})</span>}
                      </div>

                      <Button
                        className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                          category.required
                            ? `bg-gradient-to-r ${category.gradient} hover:shadow-lg text-white`
                            : `bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 
                              dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-500`
                        }`}
                        asChild
                      >
                        <Link href={`/assessment/${category.id}`}>
                          {category.progress > 0 ? t("re_assess") : t("start_assessment")}
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Elemental Assessment Section */}
          {isLoggedIn && (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400">
                    {locale === "th" ? "แบบประเมินธาตุเจ้าเรือน" : "Elemental Body Type Assessment"}
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {locale === "th"
                    ? "ค้นหาธาตุเจ้าเรือนของคุณ วาตะ ปิตตะ หรือเสมหะ"
                    : "Discover your dominant element: Vata, Pitta, or Kapha"}
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Wind className="h-8 w-8" />
                      </div>
                      <Badge className="bg-teal-100 text-teal-700 font-medium px-3 py-1 rounded-full shadow-sm dark:bg-teal-800 dark:text-teal-200">
                        {locale === "th" ? "แบบประเมินพิเศษ" : "Special Assessment"}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-gray-800 transition-colors dark:text-white dark:group-hover:text-gray-100">
                      {locale === "th" ? "ประเมินธาตุเจ้าเรือน" : "Elemental Body Type Assessment"}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed dark:text-gray-300">
                      {locale === "th"
                        ? "ค้นพบธาตุเจ้าเรือนของคุณตามหลักการแพทย์แผนไทย เพื่อเข้าใจลักษณะนิสัยและวิธีการดูแลสุขภาพที่เหมาะสม"
                        : "Discover your dominant element according to traditional Thai medicine principles to understand your personality traits and appropriate health care methods"}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-6 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {locale === "th" ? "ใช้เวลาประมาณ 10-15 นาที" : "Takes about 10-15 minutes"}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                        <div className="text-2xl mb-1">🌬️</div>
                        <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          {locale === "th" ? "วาตะ (ลม)" : "Vata (Air)"}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30">
                        <div className="text-2xl mb-1">🔥</div>
                        <div className="text-xs font-semibold text-red-700 dark:text-red-300">
                          {locale === "th" ? "ปิตตะ (ไฟ)" : "Pitta (Fire)"}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30">
                        <div className="text-2xl mb-1">💧</div>
                        <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                          {locale === "th" ? "เสมหะ (น้ำ)" : "Kapha (Water)"}
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                      asChild
                    >
                      <Link href="/assessment/elemental">
                        {locale === "th" ? "เริ่มประเมินธาตุเจ้าเรือน" : "Start Elemental Assessment"}
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      <ConsultDoctorIntroModal
        isOpen={isConsultIntroModalOpen}
        onClose={() => setIsConsultIntroModalOpen(false)}
        onProceed={() => setIsConsultSummaryModalOpen(true)}
      />
      <ConsultDoctorSummaryModal
        isOpen={isConsultSummaryModalOpen}
        onClose={() => setIsConsultSummaryModalOpen(false)}
      />
      <HealthOverviewModal
        isOpen={isHealthOverviewModalOpen}
        onClose={() => setIsHealthOverviewModalOpen(false)}
        targetAssessmentId={targetAssessmentId}
        onTargetAssessmentIdChange={setTargetAssessmentId}
      />
      <GuestHealthOverviewModal
        isOpen={isGuestHealthOverviewModalOpen}
        onClose={() => setIsGuestHealthOverviewModalOpen(false)}
      />
    </div>
  )
}
