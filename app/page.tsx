"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
  Activity,
  Sparkles,
  Shield,
  Zap,
  Clock,
  FlaskConical,
  Dumbbell,
  Loader2,
  BarChart,
  PhoneCall,
  Search,
  Lock,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
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
import { cn } from "@/lib/utils"

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

  // State for animations
  const [animateAboutUs, setAnimateAboutUs] = useState(false)
  const [animateWhyChoose, setAnimateWhyChoose] = useState(false)

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
    // Trigger animations after a short delay
    const timer1 = setTimeout(() => setAnimateAboutUs(true), 200)
    const timer2 = setTimeout(() => setAnimateWhyChoose(true), 400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
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
          recommendations: ["Continue regular exercise.", "Monitor blood sugar levels.", "Schedule annual check-up."],
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
        overallRisk: "",
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

    setDashboardStats({
      totalAssessments: latestAssessments.length,
      lastAssessmentDate: latestAssessments[0]?.completed_at || "",
      riskLevels: {
        cardiac: latestAssessments.find((a) => a.category_id === "heart")?.risk_level || "",
        diabetes: latestAssessments.find((a) => a.category_id === "nutrition")?.risk_level || "",
      },
      overallRisk: getHealthLevelColor(getRiskLevelLabel(averageScore)), // Use getHealthLevelColor with a derived risk level
      recommendations: ["Continue regular exercise.", "Monitor blood sugar levels.", "Schedule annual check-up."],
    })
  }

  if (!mounted) {
    return null
  }

  const features = [
    {
      icon: Brain,
      title: t("ai_health_assessment"),
      description: t("ai_health_assessment_desc"),
      delay: 0,
    },
    {
      icon: Stethoscope,
      title: t("doctor_portal"),
      description: t("doctor_portal_desc"),
      delay: 100,
    },
    {
      icon: Lock, // Changed from custom SVG to Lucide Lock for Blockchain EHR
      title: t("blockchain_ehr"),
      description: t("blockchain_ehr_desc"),
      delay: 200,
    },
  ]

  const whyChooseUs = [
    {
      icon: Search,
      title: t("ai_powered_diagnostics"),
      description: t("ai_powered_diagnostics_desc"),
      delay: 0,
    },
    {
      icon: Shield,
      title: t("blockchain_security"),
      description: t("blockchain_security_desc"),
      delay: 100,
    },
    {
      icon: PhoneCall,
      title: t("telemedicine_ready"),
      description: t("telemedicine_ready_desc"),
      delay: 200,
    },
    {
      icon: FileText,
      title: t("secure_ehr_system"),
      description: t("secure_ehr_system_desc"),
      delay: 300,
    },
    {
      icon: Users,
      title: t("patient_centric_design"),
      description: t("patient_centric_design_desc"),
      delay: 400,
    },
    {
      icon: TrendingUp,
      title: t("real_time_analytics"),
      description: t("real_time_analytics_desc"),
      delay: 500,
    },
  ]

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
        required: false,
        gradient: "from-purple-500 to-violet-500",
        bgGradient: "from-purple-50 to-purple-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "physical",
        icon: Dumbbell,
        required: false,
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-50 to-orange-50",
        darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
      },
      {
        id: "sleep",
        icon: MoonIcon,
        required: false,
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
    if (isLoggedIn) {
      setIsConsultIntroModalOpen(true)
    } else {
      router.push("/guest-login")
    }
  }

  const handleViewHealthOverviewClick = () => {
    if (isGuestLoggedIn) {
      setIsGuestHealthOverviewModalOpen(true)
    } else if (user) {
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
      return null // Don't render anything for non-logged-in users
    }

    return (
      <Card className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-none md:rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl">
            <CardHeader className="pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Activity className="h-6 w-6" />
                    </div>
                    {t("your_health_overview")}
                    {isGuestLoggedIn && (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                        {locale === "th" ? "ทดลองใช้งาน" : "Guest Mode"}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{t("assessment_progress")}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                  <Button
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                    onClick={handleConsultDoctorClick}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("consult_doctor")}</span>
                    <span className="sm:hidden">{t("consult_doctor")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base
                    dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
                    onClick={handleViewHealthOverviewClick}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("health_overview")}</span>
                    <span className="sm:hidden">{t("health_overview")}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="relative">
                    <div
                      className={`text-3xl font-bold mb-1 ${getHealthLevelColor(dashboardStats?.overallRisk || "")}`}
                    >
                      {dashboardStats?.overallRisk ? getRiskLevelLabel(dashboardStats.overallRisk) : t("no_data")}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t("overall_health_score")}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {dashboardStats?.lastAssessmentDate ? t("updated_at") : t("no_data")}
                    </div>
                  </div>
                </div>

                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="relative">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {dashboardStats?.totalAssessments || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("risk_factors")}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {t("identified")}
                    </div>
                  </div>
                </div>

                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="relative">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {dashboardStats?.totalAssessments || 0}/6
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{t("assessments")}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {t("completed")}
                    </div>
                  </div>
                </div>

                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="relative">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {dashboardStats?.totalAssessments && dashboardStats.totalAssessments >= 3
                        ? t("report_ready")
                        : t("report_not_ready")}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t("health_report")}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1">
                      <Activity className="w-3 h-3 mr-1" />
                      {dashboardStats?.totalAssessments && dashboardStats.totalAssessments >= 3
                        ? t("can_generate_report")
                        : t("can_generate_report")}
                    </div>
                    {!(dashboardStats?.totalAssessments && dashboardStats.totalAssessments >= 3) && (
                      <div className="text-xs text-gray-400">{t("must_complete_3_categories")}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12 relative z-10">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 text-sm font-medium mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("smart_health_assessment_system")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {t("assess_health_with_ai")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-semibold">
              {t("easy_fast_accurate")}
            </p>
            <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
              {t("ai_powered_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={handleStartAssessment}
              >
                <Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">{t("start_health_assessment")}</span>
                <span className="sm:hidden">{t("start_health_assessment")}</span>
              </Button>
              {isLoggedIn && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto
                        border-2 border-gray-300 hover:border-blue-400
                        bg-white/80 dark:bg-gray-800/80
                        text-gray-700 dark:text-white
                        backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700
                        font-semibold rounded-2xl shadow-lg hover:shadow-xl
                        transition-all duration-300"
                    onClick={handleConsultDoctorClick}
                  >
                    <Stethoscope className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">{t("consult_doctor_online")}</span>
                    <span className="sm:hidden">{t("consult_doctor")}</span>
                  </Button>
                  <Button
                    size="lg"
                    className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    asChild
                  >
                    <Link href="/guest-assessment">
                      <FlaskConical className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="hidden sm:inline">{t("try_it_out")}</span>
                      <span className="sm:hidden">{t("try_it_out")}</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" id="features-section">
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{t("smart_ai")}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("analyze_with_openai")}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{t("secure")}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("encrypted_data_pdpa")}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{t("fast_results")}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t("results_in_minutes")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <section className="mb-24 -mx-6">{renderDashboardContent()}</section>

          {/* About Us Section Divider - Only for non-logged-in users */}
          {!isLoggedIn && (
            <>
              {/* About Us Divider Section */}
              <section className="mb-40 py-32 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 text-center">
                  <h2 className="text-8xl md:text-9xl font-black mb-12 leading-none">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                      VONIX
                    </span>
                  </h2>

                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-12 rounded-full"></div>
                </div>
              </section>

              {/* Core Features Section */}
              <section
                className="mb-24 relative p-8 md:p-16 rounded-3xl overflow-hidden
               bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
              >
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                  <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-20">
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed font-medium">
                      {t("about_us_intro")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                      <Card
                        key={index}
                        className={cn(
                          "group relative h-full animate-in fade-in-0 slide-in-from-bottom-8 scale-95 duration-700 ease-out fill-mode-forwards",
                          !animateAboutUs && "opacity-0 translate-y-8 scale-95",
                        )}
                        style={{ animationDelay: `${feature.delay}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 group p-10 text-center rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 h-full flex flex-col">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <feature.icon className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base flex-1">
                            {feature.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>

              {/* Why Choose Vonix Section */}
              <section
                className="mb-24 relative p-8 md:p-16 rounded-3xl overflow-hidden
                bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900"
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-1000"></div>
                  <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-3000"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-5000"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-20">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full text-cyan-600 dark:text-cyan-400 text-sm font-semibold mb-8 border border-cyan-200/50 dark:border-cyan-700/50 backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t("why_choose_vonix")}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {t("built_for_future_healthcare")}
                      </span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whyChooseUs.map((feature, index) => (
                      <Card
                        key={index}
                        className={cn(
                          "group relative h-full animate-in fade-in-0 slide-in-from-bottom-8 scale-95 duration-700 ease-out fill-mode-forwards",
                          !animateWhyChoose && "opacity-0 translate-y-8 scale-95",
                        )}
                        style={{ animationDelay: `${feature.delay}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:border-orange-300/50 dark:hover:border-orange-600/50 transition-all duration-500 group p-10 text-center rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 h-full flex flex-col">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <feature.icon className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base flex-1">
                            {feature.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            </>
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
