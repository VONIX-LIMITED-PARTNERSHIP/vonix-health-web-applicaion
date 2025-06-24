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
      console.log("📊 ResultsPage: Starting to load assessment results...")
      console.log("📊 ResultsPage: Category ID:", categoryId)
      console.log("📊 ResultsPage: Assessment ID:", assessmentId)
      console.log("📊 ResultsPage: User ID:", user?.id)

      setLoading(true)
      setError(null)

      try {
        if (!user?.id) {
          throw new Error("กรุณาเข้าสู่ระบบเพื่อดูผลการประเมิน")
        }

        let resultData = null

        if (assessmentId) {
          // ดึงข้อมูลจาก assessmentId ที่ระบุ
          console.log("🔍 ResultsPage: Fetching specific assessment by ID...")
          const { data, error: fetchError } = await AssessmentService.getAssessmentById(assessmentId)

          if (fetchError) {
            console.error("❌ ResultsPage: Failed to fetch assessment by ID:", fetchError)
            throw new Error(fetchError)
          }

          if (!data) {
            console.warn("⚠️ ResultsPage: No assessment found with ID:", assessmentId)
            throw new Error("ไม่พบข้อมูลแบบประเมินที่ระบุ")
          }

          resultData = data
          console.log("✅ ResultsPage: Successfully loaded assessment by ID:", data.id)
        } else {
          // ดึงข้อมูลแบบประเมินล่าสุดของ user และ category นี้
          console.log("🔍 ResultsPage: Fetching latest assessment for user and category...")
          const { data, error: fetchError } = await AssessmentService.getLatestAssessmentForUserAndCategory(
            user.id,
            categoryId,
          )

          if (fetchError) {
            console.error("❌ ResultsPage: Failed to fetch latest assessment:", fetchError)
            throw new Error(fetchError)
          }

          if (!data) {
            console.warn("⚠️ ResultsPage: No latest assessment found for user and category")
            throw new Error("ไม่พบข้อมูลแบบประเมินล่าสุด กรุณาทำแบบประเมินใหม่")
          }

          resultData = data
          console.log("✅ ResultsPage: Successfully loaded latest assessment:", data.id)
        }

        // ตรวจสอบว่าข้อมูลที่ได้มาตรงกับ category ที่ต้องการหรือไม่
        if (resultData.category_id !== categoryId) {
          console.error("❌ ResultsPage: Category mismatch:", {
            expected: categoryId,
            actual: resultData.category_id,
          })
          throw new Error("ข้อมูลแบบประเมินไม่ตรงกับหมวดหมู่ที่ต้องการ")
        }

        console.log("📊 ResultsPage: Assessment data loaded successfully:")
        console.log("  - ID:", resultData.id)
        console.log("  - Category:", resultData.category_id)
        console.log("  - Title:", resultData.category_title)
        console.log("  - Score:", resultData.percentage + "%")
        console.log("  - Risk Level:", resultData.risk_level)
        console.log("  - Answers Count:", resultData.answers?.length || 0)
        console.log("  - Completed At:", resultData.completed_at)

        setAssessmentData(resultData)
      } catch (err: any) {
        console.error("❌ ResultsPage: Error loading assessment results:", err.message)
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดผลการประเมิน")
      } finally {
        setLoading(false)
        console.log("📊 ResultsPage: Finished loading assessment results")
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
