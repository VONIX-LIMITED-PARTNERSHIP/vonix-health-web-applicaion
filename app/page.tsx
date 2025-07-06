"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured, createClientComponentClient } from "@/lib/supabase"
import { User, Heart, Apple, Brain, MoonIcon, Sparkles, Shield, Zap, FlaskConical, Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ConsultDoctorIntroModal } from "@/components/consult-doctor-intro-modal"
import { HealthOverviewModal } from "@/components/health-overview-modal"
import { ConsultDoctorSummaryModal } from "@/components/consult-doctor-summary-modal"
import { useTranslation } from "@/hooks/use-translation"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { useLanguage } from "@/contexts/language-context"
import { getAssessmentCategories } from "@/data/assessment-questions"

export default function HomePage() {
  const { user, profile, loading } = useAuth()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [assessments, setAssessments] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    overallScore: 0,
    riskFactors: 0,
    completedAssessments: 0,
    reportReady: false,
  })
  const [loadingStats, setLoadingStats] = useState(false)
  const [isConsultIntroModalOpen, setIsConsultIntroModalOpen] = useState(false)
  const [isConsultSummaryModalOpen, setIsConsultSummaryModalOpen] = useState(false)
  const [isHealthOverviewModalOpen, setIsHealthOverviewModalOpen] = useState(false)
  const [targetAssessmentId, setTargetAssessmentId] = useState<string | null>(null)

  const { t } = useTranslation(["common"])
  const { getRiskLevelLabel } = useRiskLevelTranslation()
  const { locale } = useLanguage()

  const router = useRouter()
  const { toast } = useToast()

  const isLoggedIn = !loading && user && profile

  const getHealthLevel = (percentage: number): string => {
    if (percentage <= 20) return t("health_level_excellent")
    if (percentage <= 40) return t("health_level_good")
    if (percentage <= 60) return t("health_level_fair")
    if (percentage <= 80) return t("health_level_poor")
    return t("health_level_very_poor")
  }

  const getHealthLevelColor = (percentage: number): string => {
    if (percentage <= 20) return "text-green-600"
    if (percentage <= 40) return "text-blue-600"
    if (percentage <= 60) return "text-yellow-600"
    if (percentage <= 80) return "text-orange-600"
    return "text-red-600"
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoggedIn && user?.id && isSupabaseConfigured()) {
      loadUserAssessments()
    }
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    if (mounted && searchParams.get("openHealthOverview")) {
      const categoryToOpen = searchParams.get("openHealthOverview")
      const assessmentId = searchParams.get("assessmentId")

      console.log("🎯 HomePage: เปิด Health Overview Modal จาก URL parameter")
      console.log("📋 HomePage: Category:", categoryToOpen, "Assessment ID:", assessmentId)

      setIsHealthOverviewModalOpen(true)

      if (assessmentId) {
        setTargetAssessmentId(assessmentId)
      }

      const url = new URL(window.location.href)
      url.searchParams.delete("openHealthOverview")
      url.searchParams.delete("assessmentId")
      window.history.replaceState({}, "", url.toString())
    }
  }, [mounted, searchParams])

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
        overallScore: 0,
        riskFactors: 0,
        completedAssessments: 0,
        reportReady: false,
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
      overallScore: averageScore,
      riskFactors: uniqueRiskFactors,
      completedAssessments: latestAssessments.length,
      reportReady: completedRequired >= 3,
    })
  }

  if (!mounted) {
    return null
  }

  const getUpdatedCategories = () => {
    const latestAssessments = getLatestAssessments(assessments)

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
      const userAssessment = latestAssessments.find((a) => a.category_id === mapping.id)

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
    // This function will now only redirect to guest assessment, as other options are hidden
    router.push("/guest-assessment")
  }

  const handleConsultDoctor = () => {
    // This function is now effectively disabled as the button is hidden
    toast({
      title: t("feature_unavailable"),
      description: t("feature_unavailable_trial_mode"), // New translation key for clarity
      variant: "destructive",
    })
  }

  const handleProceedToSummary = () => {
    setIsConsultSummaryModalOpen(true)
  }

  const handleViewHealthOverview = () => {
    // This function is now effectively disabled as the button is hidden
    toast({
      title: t("feature_unavailable"),
      description: t("feature_unavailable_trial_mode"), // New translation key for clarity
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />

      <main className="relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
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
                asChild // Make it a link directly
              >
                <Link href="/guest-assessment">
                  <FlaskConical className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline">{t("try_it_out")}</span>
                  <span className="sm:hidden">{t("try_it_out")}</span>
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
        </div>
      </main>
      <ConsultDoctorIntroModal
        isOpen={isConsultIntroModalOpen}
        onOpenChange={setIsConsultIntroModalOpen}
        onProceed={handleProceedToSummary}
      />
      <ConsultDoctorSummaryModal isOpen={isConsultSummaryModalOpen} onOpenChange={setIsConsultSummaryModalOpen} />
      <HealthOverviewModal
        isOpen={isHealthOverviewModalOpen}
        onOpenChange={setIsHealthOverviewModalOpen}
        targetAssessmentId={targetAssessmentId}
        onTargetAssessmentIdChange={setTargetAssessmentId}
      />
    </div>
  )
}
