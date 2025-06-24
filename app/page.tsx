"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  Play,
  Stethoscope,
  User,
  Heart,
  Apple,
  Brain,
  MoonIcon,
  ChevronRight,
  FileText,
  Activity,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Award,
  FlaskConical,
  BarChart2,
  Dumbbell,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ConsultDoctorIntroModal } from "@/components/consult-doctor-intro-modal"
import { HealthOverviewModal } from "@/components/health-overview-modal"
import { useTranslation } from "@/hooks/use-translation"

const assessmentCategories = [
  {
    id: "basic",
    title: "ข้อมูลส่วนตัว",
    description: "ข้อมูลสำคัญที่แพทย์ต้องการเพื่อการวินิจฉัยและรักษา",
    icon: User,
    required: true,
    status: "กรอกข้อมูล",
    progress: 0,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
  {
    id: "heart",
    title: "ประเมินหัวใจและหลอดเลือด",
    description: "ตรวจสอบความเสี่ยงหัวใจ ความดันโลหิต และสุขภาพหลอดเลือด",
    icon: Heart,
    required: true,
    status: "เริ่มประเมิน",
    progress: 0,
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
  {
    id: "nutrition",
    title: "ประเมินไลฟ์สไตล์และโภชนาการ",
    description: "ตรวจสอบพฤติกรรมการกิน การออกกำลังกาย และการดูแลสุขภาพ",
    icon: Apple,
    required: true,
    status: "เริ่มประเมิน",
    progress: 0,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-green-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
  {
    id: "mental",
    title: "ประเมินสุขภาพจิต",
    description: "การตรวจสุขภาพจิต ความเครียด และสุขภาพทางอารมณ์",
    icon: Brain,
    required: false,
    status: "ยังไม่ได้ทำการประเมิน",
    progress: 0,
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-50 to-purple-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
  {
    id: "physical",
    title: "ประเมินสุขภาพกาย",
    description: "ตรวจสอบสุขภาพกาย ความแข็งแรง และความสามารถทางกาย",
    icon: Dumbbell,
    required: false,
    status: "ยังไม่ได้ทำการประเมิน",
    progress: 0,
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-orange-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
  {
    id: "sleep",
    title: "ประเมินคุณภาพการนอน",
    description: "วิเคราะห์รูปแบบการนอนและคุณภาพการพักผ่อน",
    icon: MoonIcon,
    required: false,
    status: "ยังไม่ได้ทำการประเมิน",
    progress: 0,
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-indigo-50",
    darkBgGradient: "dark:from-gray-800 dark:to-gray-700",
  },
]

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
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [isHealthOverviewModalOpen, setIsHealthOverviewModalOpen] = useState(false)
  const [targetAssessmentId, setTargetAssessmentId] = useState<string | null>(null)
  const { t } = useTranslation()

  const router = useRouter()
  const { toast } = useToast()

  const isLoggedIn = !loading && user && profile

  // ฟังก์ชันแปลงเปอร์เซ็นต์เป็นระดับคุณภาพ
  const getHealthLevel = (percentage: number): string => {
    if (percentage >= 81) return "ดีมาก"
    if (percentage >= 61) return "ดี"
    if (percentage >= 41) return "ปกติ"
    if (percentage >= 21) return "แย่"
    return "แย่มาก"
  }

  // ฟังก์ชันกำหนดสีตามระดับคุณภาพ
  const getHealthLevelColor = (percentage: number): string => {
    if (percentage >= 81) return "text-green-600"
    if (percentage >= 61) return "text-blue-600"
    if (percentage >= 41) return "text-yellow-600"
    if (percentage >= 21) return "text-orange-600"
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

  // ตรวจสอบ URL parameter เพื่อเปิด Health Overview Modal
  useEffect(() => {
    if (mounted && searchParams.get("openHealthOverview")) {
      const categoryToOpen = searchParams.get("openHealthOverview")
      const assessmentId = searchParams.get("assessmentId")

      console.log("🎯 HomePage: เปิด Health Overview Modal จาก URL parameter")
      console.log("📋 HomePage: Category:", categoryToOpen, "Assessment ID:", assessmentId)

      setIsHealthOverviewModalOpen(true)

      // ถ้ามี assessmentId ให้เก็บไว้เพื่อใช้ใน modal
      if (assessmentId) {
        setTargetAssessmentId(assessmentId)
      }

      // ลบ parameter ออกจาก URL หลังจากเปิด modal แล้ว
      const url = new URL(window.location.href)
      url.searchParams.delete("openHealthOverview")
      url.searchParams.delete("assessmentId")
      window.history.replaceState({}, "", url.toString())
    }
  }, [mounted, searchParams])

  const loadUserAssessments = async () => {
    if (!user?.id || !isSupabaseConfigured()) return

    setLoadingStats(true)
    try {
      const { data, error } = await AssessmentService.getUserAssessments(user.id)

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

    return assessmentCategories.map((category) => {
      const userAssessment = latestAssessments.find((a) => a.category_id === category.id)

      if (userAssessment) {
        return {
          ...category,
          status: "เสร็จสิ้น",
          progress: 100,
          lastCompleted: new Date(userAssessment.completed_at).toLocaleDateString("th-TH"),
          score: userAssessment.percentage,
          healthLevel: getHealthLevel(userAssessment.percentage),
          healthLevelColor: getHealthLevelColor(userAssessment.percentage),
        }
      }

      return category
    })
  }

  const handleStartAssessment = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    const assessmentSection = document.getElementById("assessment-section")
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleConsultDoctor = () => {
    if (!isLoggedIn) {
      toast({
        title: t("please_login"),
        description: t("login_to_consult"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    setIsConsultModalOpen(true)
  }

  const handleViewHealthOverview = () => {
    if (!isLoggedIn) {
      toast({
        title: t("please_login"),
        description: t("login_to_view_overview"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    setIsHealthOverviewModalOpen(true)
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
                onClick={handleStartAssessment}
              >
                <Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">{t("start_health_assessment")}</span>
                <span className="sm:hidden">{t("start_health_assessment")}</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleConsultDoctor}
              >
                <Stethoscope className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">{t("consult_doctor_online")}</span>
                <span className="sm:hidden">{t("consult_doctor")}</span>
              </Button>
              {!isLoggedIn && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto border-2 border-purple-300 hover:border-purple-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/guest-assessment">
                    <FlaskConical className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">{t("try_it_out")}</span>
                    <span className="sm:hidden">{t("try_it_out")}</span>
                  </Link>
                </Button>
              )}
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

          {isLoggedIn && isSupabaseConfigured() && (
            <>
              {/* Dashboard Stats */}
              <Card className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                  <div className="bg-white rounded-3xl">
                    <CardHeader className="pb-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              <Activity className="h-6 w-6" />
                            </div>
                            {t("your_health_overview")}
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">{t("assessment_progress")}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                          <Button
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                            onClick={handleConsultDoctor}
                          >
                            <Stethoscope className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">{t("consult_doctor")}</span>
                            <span className="sm:hidden">{t("consult_doctor")}</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base
                            dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200"
                            onClick={handleViewHealthOverview}
                          >
                            <BarChart2 className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">{t("health_overview")}</span>
                            <span className="sm:hidden">{t("health_overview")}</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {loadingStats ? "..." : `${dashboardStats.overallScore}%`}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{t("overall_health_score")}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {dashboardStats.completedAssessments > 0 ? t("updated_at") : t("no_data")}
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-3xl font-bold text-orange-600 mb-1">
                              {loadingStats ? "..." : dashboardStats.riskFactors}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{t("risk_factors")}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {t("identified")}
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                              {loadingStats ? "..." : `${dashboardStats.completedAssessments}/6`}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{t("assessments")}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Award className="w-3 h-3 mr-1" />
                              {t("completed")}
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                              {loadingStats
                                ? "..."
                                : dashboardStats.reportReady
                                  ? t("report_ready")
                                  : t("report_not_ready")}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{t("health_report")}</div>
                            <div className="text-xs text-gray-500 flex items-center mb-1">
                              <FileText className="w-3 h-3 mr-1" />
                              {dashboardStats.reportReady ? t("can_generate_report") : t("can_generate_report")}
                            </div>
                            {!dashboardStats.reportReady && (
                              <div className="text-xs text-gray-400">{t("must_complete_3_categories")}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>

              {/* Assessment Categories */}
              <div className="mb-16" id="assessment-section">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {t("health_assessments")}
                    </span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{t("choose_assessment_type")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getUpdatedCategories().map((category, index) => (
                    <Card
                      key={category.id}
                      className={`group relative overflow-hidden bg-gradient-to-br ${category.bgGradient} ${category.darkBgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer rounded-3xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                      <CardContent className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <category.icon className="h-8 w-8" />
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {category.required ? (
                              <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-full">
                                {t("required")}
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full
                                dark:bg-blue-900 dark:text-blue-200"
                              >
                                {t("optional")}
                              </Badge>
                            )}
                            {category.progress > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {category.progress}% {t("completed")}
                                {category.healthLevel && (
                                  <span className={`ml-2 font-semibold ${category.healthLevelColor}`}>
                                    ({category.healthLevel})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-gray-900 transition-colors dark:text-white dark:group-hover:text-gray-50">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed dark:text-gray-100">{category.description}</p>
                        <p className="text-sm text-gray-500 mb-6 flex items-center dark:text-gray-200">
                          <Clock className="w-4 h-4 mr-2" />
                          {category.status}
                          {category.lastCompleted && <span className="ml-2 text-xs">({category.lastCompleted})</span>}
                        </p>

                        <Button
                          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
                            category.required
                              ? `bg-gradient-to-r ${category.gradient} hover:shadow-lg text-white`
                              : "bg-white/80 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700 dark:hover:border-gray-600"
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
              </div>
            </>
          )}
        </div>
      </main>
      <ConsultDoctorIntroModal isOpen={isConsultModalOpen} onOpenChange={setIsConsultModalOpen} />
      <HealthOverviewModal
        isOpen={isHealthOverviewModalOpen}
        onOpenChange={setIsHealthOverviewModalOpen}
        targetAssessmentId={targetAssessmentId}
        onTargetAssessmentIdChange={setTargetAssessmentId}
      />
    </div>
  )
}
