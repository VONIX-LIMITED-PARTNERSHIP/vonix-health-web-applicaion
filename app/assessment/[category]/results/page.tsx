"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { guestAssessmentCategory } from "@/data/assessment-questions" // Import guestAssessmentCategory

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: isUserLoading } = useAuth()
  const categoryId = params.category as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])

  useEffect(() => {
    if (isUserLoading) return // Wait for user loading to complete

    const loadAndSaveAssessment = async () => {
      setLoading(true)
      setError(null)

      try {
        // Determine the correct localStorage key based on categoryId
        const localStorageKey =
          categoryId === guestAssessmentCategory.id ? `guest-assessment-temp-answers` : `assessment-${categoryId}`

        console.log("ResultsPage: Attempting to retrieve answers from localStorage with key:", localStorageKey)
        const storedAnswersString = localStorage.getItem(localStorageKey)
        console.log("ResultsPage: Retrieved string from localStorage:", storedAnswersString)

        if (!storedAnswersString) {
          throw new Error("assessment.no_answers_found: ไม่พบคำตอบใน Local Storage (Key: " + localStorageKey + ")")
        }
        const parsedAnswers: AssessmentAnswer[] = JSON.parse(storedAnswersString)
        console.log("ResultsPage: Parsed answers from localStorage:", parsedAnswers)

        setAnswers(parsedAnswers) // Store answers in state for AssessmentResults component

        if (parsedAnswers.length === 0) {
          throw new Error("assessment.no_answers_found: อาร์เรย์คำตอบที่ดึงมาว่างเปล่า (Key: " + localStorageKey + ")")
        }

        // 2. Get category details using the new static method
        const category = AssessmentService.getCategory(categoryId)
        if (!category) {
          throw new Error("Category not found for ID: " + categoryId)
        }

        // 3. Analyze with AI if not basic category
        let analysisData = null
        if (categoryId !== "basic") {
          const { data: aiData, error: aiError } = await AssessmentService.analyzeWithAI(categoryId, parsedAnswers)
          if (aiError) {
            console.error("ResultsPage: AI Analysis Error:", aiError)
            // Continue without AI analysis if it fails, or handle specifically
            // For now, we'll let saveAssessment handle the missing AI analysis if needed
          } else {
            analysisData = aiData
            setAiAnalysis(aiData) // Store AI analysis in state
          }
        }

        // 4. Save assessment to database
        if (!user?.id) {
          throw new Error("User not authenticated. Please log in to save your assessment.")
        }

        console.log("ResultsPage: Preparing to call saveAssessment with:", {
          userId: user.id,
          categoryId,
          categoryTitle: category.title,
          answers: parsedAnswers,
        })
        const { data: savedData, error: saveError } = await AssessmentService.saveAssessment(
          user.id,
          categoryId,
          category.title,
          parsedAnswers,
          analysisData,
        )
        console.log("ResultsPage: saveAssessment returned:", { savedData, saveError })

        if (saveError) {
          throw new Error(saveError)
        }

        setAssessmentResult(savedData)

        // 5. Clear answers from localStorage after successful save
        localStorage.removeItem(localStorageKey)
        console.log("ResultsPage: Cleared localStorage key:", localStorageKey)
      } catch (err: any) {
        console.error("ResultsPage: Error loading or saving assessment:", err)
        setError(err.message || "เกิดข้อผิดพลาดในการประมวลผลแบบประเมิน")
      } finally {
        setLoading(false)
      }
    }

    loadAndSaveAssessment()

    // Cleanup function for active requests if component unmounts
    return () => {
      AssessmentService.cleanup()
    }
  }, [categoryId, user?.id, isUserLoading]) // Re-run when categoryId or user changes

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              กำลังประมวลผลผลลัพธ์...
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">กรุณารอสักครู่ ระบบกำลังวิเคราะห์ข้อมูลของคุณ</p>
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
            <p className="text-red-500 mt-2">{error}</p>
            <Button onClick={() => router.push("/")} className="mt-6">
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessmentResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">ไม่พบผลลัพธ์</CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">ไม่สามารถโหลดผลการประเมินได้ กรุณาลองใหม่อีกครั้ง</p>
            <Button onClick={() => router.push("/")} className="mt-6">
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AssessmentResults
      categoryId={categoryId}
      assessmentResult={assessmentResult}
      answers={answers}
      aiAnalysis={aiAnalysis}
    />
  )
}
