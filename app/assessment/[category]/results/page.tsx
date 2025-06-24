"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: isUserLoading } = useAuth()
  const categoryId = params.category as string
  const assessmentId = searchParams.get("id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)

  useEffect(() => {
    if (isUserLoading) return

    const loadAssessmentResults = async () => {
      console.log("📊 ResultsPage: เริ่มโหลดผลการประเมิน...")
      console.log("📊 ResultsPage: หมวดหมู่:", categoryId)
      console.log("📊 ResultsPage: รหัสแบบประเมิน:", assessmentId)
      console.log("📊 ResultsPage: รหัสผู้ใช้:", user?.id)

      setLoading(true)
      setError(null)

      try {
        if (!user?.id) {
          throw new Error("กรุณาเข้าสู่ระบบเพื่อดูผลการประเมิน")
        }

        let resultData = null

        if (assessmentId) {
          // ดึงข้อมูลจาก assessmentId ที่ระบุ
          console.log("🔍 ResultsPage: กำลังดึงข้อมูลแบบประเมินตามรหัสที่ระบุ...")
          const { data, error: fetchError } = await AssessmentService.getAssessmentById(assessmentId)

          if (fetchError) {
            console.error("❌ ResultsPage: ไม่สามารถดึงข้อมูลแบบประเมินได้:", fetchError)
            throw new Error(fetchError)
          }

          if (!data) {
            console.warn("⚠️ ResultsPage: ไม่พบแบบประเมินที่มีรหัส:", assessmentId)
            throw new Error("ไม่พบข้อมูลแบบประเมินที่ระบุ")
          }

          resultData = data
          console.log("✅ ResultsPage: โหลดข้อมูลแบบประเมินสำเร็จ รหัส:", data.id)
        } else {
          // ดึงข้อมูลแบบประเมินล่าสุดของ user และ category นี้
          console.log("🔍 ResultsPage: กำลังดึงข้อมูลแบบประเมินล่าสุด...")
          const { data, error: fetchError } = await AssessmentService.getLatestAssessmentForUserAndCategory(
            user.id,
            categoryId,
          )

          if (fetchError) {
            console.error("❌ ResultsPage: ไม่สามารถดึงข้อมูลแบบประเมินล่าสุดได้:", fetchError)
            throw new Error(fetchError)
          }

          if (!data) {
            console.warn("⚠️ ResultsPage: ไม่พบแบบประเมินล่าสุดสำหรับผู้ใช้และหมวดหมู่นี้")
            throw new Error("ไม่พบข้อมูลแบบประเมินล่าสุด กรุณาทำแบบประเมินใหม่")
          }

          resultData = data
          console.log("✅ ResultsPage: โหลดข้อมูลแบบประเมินล่าสุดสำเร็จ รหัส:", data.id)
        }

        // ตรวจสอบว่าข้อมูลที่ได้มาตรงกับ category ที่ต้องการหรือไม่
        if (resultData.category_id !== categoryId) {
          console.error("❌ ResultsPage: หมวดหมู่ไม่ตรงกัน:", {
            expected: categoryId,
            actual: resultData.category_id,
          })
          throw new Error("ข้อมูลแบบประเมินไม่ตรงกับหมวดหมู่ที่ต้องการ")
        }

        console.log("📊 ResultsPage: โหลดข้อมูลแบบประเมินสำเร็จ:")
        console.log("  - รหัส:", resultData.id)
        console.log("  - หมวดหมู่:", resultData.category_id)
        console.log("  - ชื่อ:", resultData.category_title)
        console.log("  - คะแนน:", resultData.percentage + "%")
        console.log("  - ระดับความเสี่ยง:", resultData.risk_level)
        console.log("  - จำนวนคำตอบ:", resultData.answers?.length || 0)
        console.log("  - เสร็จสิ้นเมื่อ:", resultData.completed_at)

        setAssessmentData(resultData)
      } catch (err: any) {
        console.error("❌ ResultsPage: เกิดข้อผิดพลาดในการโหลดผลการประเมิน:", err.message)
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดผลการประเมิน")
      } finally {
        setLoading(false)
        console.log("📊 ResultsPage: เสร็จสิ้นการโหลดผลการประเมิน")
      }
    }

    loadAssessmentResults()
  }, [categoryId, assessmentId, user?.id, isUserLoading])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              กำลังโหลดผลการประเมิน...
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">กรุณารอสักครู่</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">เกิดข้อผิดพลาด</CardTitle>
            <p className="text-red-500 mt-2 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")} variant="outline">
                กลับหน้าหลัก
              </Button>
              <Button onClick={() => router.push(`/assessment/${categoryId}`)}>ทำแบบประเมินใหม่</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">ไม่พบข้อมูล</CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">ไม่พบผลการประเมินที่ต้องการ</p>
            <Button onClick={() => router.push(`/assessment/${categoryId}`)}>ทำแบบประเมินใหม่</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // แปลงข้อมูลจาก Supabase format เป็น format ที่ AssessmentResults component ต้องการ
  const assessmentResult = {
    categoryId: assessmentData.category_id,
    totalScore: assessmentData.total_score,
    maxScore: assessmentData.max_score,
    percentage: assessmentData.percentage,
    riskLevel: assessmentData.risk_level,
    riskFactors: assessmentData.risk_factors || [],
    recommendations: assessmentData.recommendations || [],
  }

  const aiAnalysis = {
    score: assessmentData.percentage,
    riskLevel: assessmentData.risk_level,
    riskFactors: assessmentData.risk_factors || [],
    recommendations: assessmentData.recommendations || [],
  }

  return (
    <AssessmentResults
      categoryId={categoryId}
      assessmentResult={assessmentResult}
      answers={assessmentData.answers || []}
      aiAnalysis={aiAnalysis}
    />
  )
}
