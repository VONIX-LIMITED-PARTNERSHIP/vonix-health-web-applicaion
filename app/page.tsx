"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Dumbbell,
  Moon,
  ChevronRight,
  FileText,
  Activity,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const assessmentCategories = [
  {
    id: "basic",
    title: "ข้อมูลพื้นฐานสำหรับแพทย์",
    description: "ข้อมูลสำคัญที่แพทย์ต้องการเพื่อการวินิจฉัยและรักษา",
    icon: User,
    required: true,
    status: "ครอกข้อมูล",
    progress: 0,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
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
    bgGradient: "from-green-50 to-emerald-50",
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
    bgGradient: "from-purple-50 to-violet-50",
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
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    id: "sleep",
    title: "ประเมินคุณภาพการนอน",
    description: "วิเคราะห์รูปแบบการนอนและคุณภาพการพักผ่อน",
    icon: Moon,
    required: false,
    status: "ยังไม่ได้ทำการประเมิน",
    progress: 0,
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
  },
]

const features = [
  {
    icon: Sparkles,
    title: "AI ที่ฉลาด",
    description: "วิเคราะห์ด้วย OpenAI",
  },
  {
    icon: Shield,
    title: "ปลอดภัย 100%",
    description: "เข้ารหัสข้อมูลและปฏิบัติตาม PDPA",
  },
  {
    icon: Zap,
    title: "รวดเร็วทันใจ",
    description: "ผลลัพธ์ภายใน 2-3 นาที",
  },
]

export default function HomePage() {
  const { user, profile, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [assessments, setAssessments] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    overallScore: 0,
    riskFactors: 0,
    completedAssessments: 0,
    reportReady: false,
  })
  const [loadingStats, setLoadingStats] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // ย้าย isLoggedIn มาไว้ที่นี่
  const isLoggedIn = !loading && user && profile

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoggedIn && user?.id && isSupabaseConfigured()) {
      loadUserAssessments()
    }
  }, [isLoggedIn, user?.id])

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

      // Calculate stats using the latest assessments only
      const latestAssessments = getLatestAssessments(allAssessments)
      calculateDashboardStats(latestAssessments)
    } catch (error) {
    } finally {
      setLoadingStats(false)
    }
  }

  // ฟังก์ชันกรองเอาเฉพาะการประเมินล่าสุดของแต่ละประเภท
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

    // คำนวณคะแนนรวมจากการประเมินล่าสุดเท่านั้น
    const totalScore = latestAssessments.reduce((sum, assessment) => sum + assessment.percentage, 0)
    const averageScore = Math.round(totalScore / latestAssessments.length)

    // นับปัจจัยเสี่ยงทั้งหมดจากการประเมินล่าสุด
    const allRiskFactors = latestAssessments.reduce((factors, assessment) => {
      return factors.concat(assessment.risk_factors || [])
    }, [])
    const uniqueRiskFactors = [...new Set(allRiskFactors)].length

    // ตรวจสอบว่ามีการประเมินครบ 3 ประเภทหลักหรือไม่
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
    return null // Prevent hydration mismatch
  }

  const getUpdatedCategories = () => {
    // ใช้การประเมินล่าสุดเท่านั้น
    const latestAssessments = getLatestAssessments(assessments)

    return assessmentCategories.map((category) => {
      const userAssessment = latestAssessments.find((a) => a.category_id === category.id)

      if (userAssessment) {
        return {
          ...category,
          status: "เสร็จสิ้นแล้ว",
          progress: 100,
          lastCompleted: new Date(userAssessment.completed_at).toLocaleDateString("th-TH"),
          score: userAssessment.percentage,
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

    // Scroll to assessment section
    const assessmentSection = document.getElementById("assessment-section")
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleConsultDoctor = () => {
    toast({
      title: "กำลังจะมาเร็วๆ นี้!",
      description: "ฟีเจอร์ปรึกษาแพทย์ออนไลน์กำลังอยู่ในระหว่างการพัฒนา",
      duration: 3000,
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
              ระบบประเมินสุขภาพอัจฉริยะ
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                ประเมินสุขภาพ
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                ด้วย AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-light">ง่าย รวดเร็ว แม่นยำ</p>
            <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
              ระบบประเมินสุขภาพอัจฉริยะที่ช่วยคุณดูแลสุขภาพได้ดีขึ้น ไม่ต้องมีความรู้ทางการแพทย์
              <br className="hidden md:block" />
              ใช้งานง่าย เข้าใจได้ทันที พร้อมคำแนะนำจากแพทย์ผู้เชี่ยวชาญ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={handleStartAssessment}
              >
                <Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">เริ่มประเมินสุขภาพ</span>
                <span className="sm:hidden">เริ่มประเมิน</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 h-auto border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleConsultDoctor}
              >
                <Stethoscope className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">ปรึกษาแพทย์ออนไลน์</span>
                <span className="sm:hidden">ปรึกษาแพทย์</span>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{feature.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</div>
                  </div>
                </div>
              ))}
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
                            ภาพรวมสุขภาพของคุณ
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">ข้อมูลการประเมินและความคืบหน้า (ล่าสุด)</p>
                        </div>
                        <Button
                          className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                          onClick={handleConsultDoctor}
                        >
                          <Stethoscope className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">ปรึกษาแพทย์</span>
                          <span className="sm:hidden">แพทย์</span>
                        </Button>
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
                            <div className="text-sm font-medium text-gray-700 mb-1">คะแนนสุขภาพรวม</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {dashboardStats.completedAssessments > 0 ? "อัปเดตล่าสุด" : "ยังไม่มีข้อมูล"}
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-3xl font-bold text-orange-600 mb-1">
                              {loadingStats ? "..." : dashboardStats.riskFactors}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">ปัจจัยเสี่ยง</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              ที่ระบุได้
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                              {loadingStats ? "..." : `${dashboardStats.completedAssessments}/6`}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">การประเมิน</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Award className="w-3 h-3 mr-1" />
                              เสร็จสิ้น
                            </div>
                          </div>
                        </div>

                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
                          <div className="relative">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                              {loadingStats ? "..." : dashboardStats.reportReady ? "พร้อม" : "ไม่พร้อม"}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">รายงานสุขภาพ</div>
                            <div className="text-xs text-gray-500 flex items-center mb-1">
                              <FileText className="w-3 h-3 mr-1" />
                              {dashboardStats.reportReady ? "สร้างรายงานได้" : "สร้างรายงาน"}
                            </div>
                            {!dashboardStats.reportReady && (
                              <div className="text-xs text-gray-400">ต้องทำแบบประเมิน 3 ประเภท</div>
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
                      แบบประเมินสุขภาพ
                    </span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    เลือกแบบประเมินที่ต้องการทำ เพื่อวิเคราะห์สุขภาพของคุณ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getUpdatedCategories().map((category, index) => (
                    <Card
                      key={category.id}
                      className={`group relative overflow-hidden bg-gradient-to-br ${category.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer rounded-3xl`}
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
                                จำเป็น
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full"
                              >
                                เสริม
                              </Badge>
                            )}
                            {category.progress > 0 && (
                              <div className="text-xs text-gray-500">
                                {category.progress}% เสร็จสิ้น
                                {category.score && <span className="ml-1">({category.score}%)</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                        <p className="text-sm text-gray-500 mb-6 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {category.status}
                          {category.lastCompleted && <span className="ml-2 text-xs">({category.lastCompleted})</span>}
                        </p>

                        <Button
                          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
                            category.required
                              ? `bg-gradient-to-r ${category.gradient} hover:shadow-lg text-white`
                              : "bg-white/80 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                          }`}
                          asChild
                        >
                          <Link href={`/assessment/${category.id}`}>
                            {category.progress > 0 ? "ประเมินใหม่" : "เริ่มประเมิน"}
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
    </div>
  )
}
