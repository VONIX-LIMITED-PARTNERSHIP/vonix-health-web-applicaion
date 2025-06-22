"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  FileText,
  Clock,
  Info,
  Loader2,
  XCircle,
  RefreshCw,
  Calendar,
  ChevronRight,
  ArrowLeft,
  HeartPulse,
  Brain,
  Utensils,
  ShieldCheck,
  Bed,
  Dumbbell,
  FlaskConical,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentService } from "@/lib/assessment-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import { assessmentCategories as allAssessmentCategories } from "@/data/assessment-questions"
import Link from "next/link"

interface HealthOverviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Mapping for category icons
const iconMap: { [key: string]: React.ElementType } = {
  basic: ShieldCheck,
  heart: HeartPulse,
  mental: Brain,
  nutrition: Utensils,
  sleep: Bed,
  physical: Dumbbell,
  stress: FlaskConical,
  // Add other category icons here if needed
}

export function HealthOverviewModal({ isOpen, onOpenChange }: HealthOverviewModalProps) {
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

  // State for detailed assessment view
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null)
  const [detailedAssessmentData, setDetailedAssessmentData] = useState<any | null>(null)
  const [loadingDetailedAssessment, setLoadingDetailedAssessment] = useState(false)
  const [detailedAssessmentError, setDetailedAssessmentError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && !authLoading && user?.id && isSupabaseConfigured()) {
      loadUserAssessments()
    } else if (!isOpen) {
      // Reset all states when modal closes
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
  }, [isOpen, authLoading, user?.id])

  const loadUserAssessments = async () => {
    if (!user?.id || !isSupabaseConfigured()) {
      setError("กรุณาเข้าสู่ระบบเพื่อดูภาพรวมสุขภาพ")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("การโหลดข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง")), 15000),
      )

      const result = await Promise.race([
        AssessmentService.getUserAssessments(user.id).then((res) => ({ type: "success", data: res })),
        timeoutPromise.then((res) => ({ type: "timeout", data: res })),
      ])

      if (result.type === "timeout") {
        throw new Error("การโหลดข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง")
      }

      const { data, error: serviceError } = result.data

      if (serviceError) {
        throw serviceError
      }

      const allAssessments = data || []
      setAssessments(allAssessments)

      const latestAssessments = getLatestAssessments(allAssessments)
      calculateDashboardStats(latestAssessments)
    } catch (err: any) {
      console.error("Error loading user assessments:", err)
      setError(err.message || "ไม่สามารถโหลดข้อมูลการประเมินได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  const loadDetailedAssessment = async (assessmentId: string) => {
    setLoadingDetailedAssessment(true)
    setDetailedAssessmentError(null)
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("การโหลดรายละเอียดใช้เวลานานเกินไป")), 15000),
      )

      const result = await Promise.race([
        AssessmentService.getAssessmentById(assessmentId).then((res) => ({ type: "success", data: res })),
        timeoutPromise.then((res) => ({ type: "timeout", data: res })),
      ])

      if (result.type === "timeout") {
        throw new Error("การโหลดรายละเอียดใช้เวลานานเกินไป")
      }

      const { data, error: serviceError } = result.data

      if (serviceError) {
        throw serviceError
      }

      setDetailedAssessmentData(data)
      setSelectedAssessmentId(assessmentId)
    } catch (err: any) {
      console.error("Error loading detailed assessment:", err)
      setDetailedAssessmentError(err.message || "ไม่สามารถโหลดรายละเอียดการประเมินได้")
    } finally {
      setLoadingDetailedAssessment(false)
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

  const getCategoryIcon = (categoryId: string) => {
    const category = allAssessmentCategories.find((cat) => cat.id === categoryId)
    const IconComponent = category && iconMap[category.id] ? iconMap[category.id] : Info
    return IconComponent
  }

  const getCategoryTitle = (categoryId: string) => {
    const category = allAssessmentCategories.find((cat) => cat.id === categoryId)
    return category ? category.title : "ไม่ระบุประเภท"
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return <Badge className="bg-green-500 text-white dark:bg-green-700">ความเสี่ยงต่ำ</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-white dark:bg-yellow-700">ความเสี่ยงปานกลาง</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white dark:bg-orange-700">ความเสี่ยงสูง</Badge>
      case "very-high":
        return <Badge className="bg-red-500 text-white dark:bg-red-700">ความเสี่ยงสูงมาก</Badge>
      default:
        return <Badge variant="secondary">ไม่ระบุ</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] h-[90vh] flex flex-col rounded-xl shadow-2xl p-6
      bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <DialogHeader className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center">
            {selectedAssessmentId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedAssessmentId(null)
                  setDetailedAssessmentData(null)
                }}
                className="absolute left-4 top-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">กลับ</span>
              </Button>
            )}
            <Activity className="mr-3 h-7 w-7 text-blue-600" />
            ภาพรวมสุขภาพของคุณ
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
            {selectedAssessmentId ? "รายละเอียดการประเมิน" : "ข้อมูลการประเมินสุขภาพทั้งหมดของคุณ (ล่าสุด)"}
          </DialogDescription>
        </DialogHeader>

        {selectedAssessmentId ? (
          // Detailed Assessment View
          loadingDetailedAssessment ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">กำลังโหลดรายละเอียด...</h3>
              <p className="text-gray-600 dark:text-gray-300">กรุณารอสักครู่</p>
            </div>
          ) : detailedAssessmentError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">เกิดข้อผิดพลาด</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{detailedAssessmentError}</p>
              <Button onClick={() => loadDetailedAssessment(selectedAssessmentId!)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          ) : detailedAssessmentData ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="py-4 space-y-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                      <Activity className="h-5 w-5 text-blue-600" />
                      {getCategoryTitle(detailedAssessmentData.category_id)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">คะแนน:</span>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {detailedAssessmentData.percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">ระดับความเสี่ยง:</span>
                      {getRiskLevelBadge(detailedAssessmentData.risk_level)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">วันที่ประเมิน:</span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {new Date(detailedAssessmentData.completed_at).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {detailedAssessmentData.risk_factors && detailedAssessmentData.risk_factors.length > 0 && (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        ปัจจัยเสี่ยง
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                        {detailedAssessmentData.risk_factors.map((factor: string, index: number) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {detailedAssessmentData.recommendations && detailedAssessmentData.recommendations.length > 0 && (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        คำแนะนำ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
                        {detailedAssessmentData.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          ) : null
        ) : // Overview List View
        loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">กำลังโหลดข้อมูล...</h3>
            <p className="text-gray-600 dark:text-gray-300">กรุณารอสักครู่</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button onClick={loadUserAssessments}>
              <RefreshCw className="mr-2 h-4 w-4" />
              ลองใหม่อีกครั้ง
            </Button>
          </div>
        ) : !user ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Info className="h-16 w-16 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">คุณยังไม่ได้เข้าสู่ระบบ</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">กรุณาเข้าสู่ระบบเพื่อดูภาพรวมสุขภาพของคุณ</p>
            <Button asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <FileText className="h-16 w-16 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">ยังไม่มีข้อมูลการประเมิน</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              คุณยังไม่เคยทำแบบประเมินใดๆ กรุณาเริ่มทำแบบประเมินเพื่อดูภาพรวมสุขภาพของคุณ
            </p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link href="/">เริ่มประเมินสุขภาพ</Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4 space-y-6">
              {/* Overall Stats */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                    <Activity className="h-5 w-5 text-blue-600" />
                    สรุปภาพรวม
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{dashboardStats.overallScore}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">คะแนนสุขภาพรวม</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{dashboardStats.riskFactors}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">ปัจจัยเสี่ยงที่พบ</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">{dashboardStats.completedAssessments}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">การประเมินที่เสร็จสิ้น</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardStats.reportReady ? "พร้อม" : "ไม่พร้อม"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">รายงานสุขภาพ</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Assessments List */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    การประเมินล่าสุด
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getLatestAssessments(assessments).map((assessment) => {
                    const CategoryIcon = getCategoryIcon(assessment.category_id)
                    return (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200
                        dark:bg-gray-950 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-6 w-6 text-blue-500" />
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                              {getCategoryTitle(assessment.category_id)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(assessment.completed_at).toLocaleDateString("th-TH")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700
                          dark:bg-blue-900 dark:text-blue-200"
                          >
                            {assessment.percentage}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => loadDetailedAssessment(assessment.id)} // Changed to load detailed view
                          >
                            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <span className="sr-only">ดูรายละเอียด</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* All Assessments (Optional, if needed) */}
              {assessments.length > getLatestAssessments(assessments).length && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      ประวัติการประเมินทั้งหมด
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assessments
                      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                      .map((assessment) => {
                        const CategoryIcon = getCategoryIcon(assessment.category_id)
                        return (
                          <div
                            key={assessment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200
                            dark:bg-gray-950 dark:border-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <CategoryIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              <span className="dark:text-gray-200">{getCategoryTitle(assessment.category_id)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-700 dark:text-gray-200">
                                {new Date(assessment.completed_at).toLocaleDateString("th-TH")}
                              </span>
                              <Badge variant="secondary" className="dark:bg-secondary dark:text-secondary-foreground">
                                {assessment.percentage}%
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg
            dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
