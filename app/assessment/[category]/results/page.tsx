"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { guestAssessmentCategory } from "@/data/assessment-questions"

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

  const hasRunEffect = useRef(false)

  useEffect(() => {
    console.log(
      "ResultsPage: useEffect triggered. isUserLoading:",
      isUserLoading,
      "hasRunEffect.current:",
      hasRunEffect.current,
    )

    if (hasRunEffect.current || isUserLoading) {
      if (hasRunEffect.current) {
        console.log("ResultsPage: Skipping useEffect run as it has already executed.")
      }
      return
    }

    hasRunEffect.current = true

    const loadAndSaveOrFetchAssessment = async () => {
      setLoading(true)
      setError(null)
      console.log("ResultsPage: Starting loadAndSaveOrFetchAssessment function.")

      try {
        if (!user?.id) {
          // If user is not logged in, we cannot save or fetch user-specific assessments.
          // For guest assessments, we would handle it differently (e.g., only from localStorage)
          // For now, if it's not a guest assessment and no user, throw error.
          if (categoryId !== guestAssessmentCategory.id) {
            throw new Error("User not authenticated. Please log in to view your assessment results.")
          }
        }

        let currentAssessmentData: any = null
        let currentAnswers: AssessmentAnswer[] = []
        let currentAiAnalysis: any = null

        // 1. Try to save the assessment if answers are in localStorage (meaning it's a fresh submission)
        const localStorageKey =
          categoryId === guestAssessmentCategory.id ? `guest-assessment-temp-answers` : `assessment-${categoryId}`
        const storedAnswersString = localStorage.getItem(localStorageKey)

        if (storedAnswersString) {
          console.log("ResultsPage: Found answers in localStorage, attempting to save.")
          const parsedAnswers: AssessmentAnswer[] = JSON.parse(storedAnswersString)

          if (parsedAnswers.length === 0) {
            console.warn("ResultsPage: Parsed answers from localStorage are empty. Will attempt to fetch from DB.")
            localStorage.removeItem(localStorageKey) // Clear empty data
          } else {
            currentAnswers = parsedAnswers
            setAnswers(parsedAnswers) // Set answers state for AssessmentResults component

            const category = AssessmentService.getCategory(categoryId)
            if (!category) {
              throw new Error("Category not found for ID: " + categoryId)
            }

            if (categoryId !== "basic") {
              console.log("ResultsPage: Calling analyzeWithAI for fresh submission...")
              const { data: aiData, error: aiError } = await AssessmentService.analyzeWithAI(categoryId, parsedAnswers)
              if (aiError) {
                console.error("ResultsPage: AI Analysis Error for fresh submission:", aiError)
              } else {
                currentAiAnalysis = aiData
                setAiAnalysis(aiData)
              }
            }

            if (user?.id) {
              // Only save if user is logged in
              console.log("ResultsPage: Calling saveAssessment for fresh submission...")
              const { data: savedData, error: saveError } = await AssessmentService.saveAssessment(
                user.id,
                categoryId,
                category.title,
                parsedAnswers,
                currentAiAnalysis,
              )

              if (saveError) {
                throw new Error(saveError)
              }
              currentAssessmentData = savedData
              console.log("ResultsPage: Fresh assessment saved successfully:", currentAssessmentData.id)
              localStorage.removeItem(localStorageKey) // Clear after successful save
              console.log("ResultsPage: Cleared localStorage key:", localStorageKey)
            } else {
              // For guest assessment, if no user, the data is just in localStorage for now.
              // We don't save guest data to DB unless explicitly handled.
              // For this scenario, we'll just use the parsedAnswers and currentAiAnalysis
              // and skip DB save. The AssessmentResults component will use these.
              console.log("ResultsPage: Guest assessment, not saving to DB. Using localStorage data.")
              // We need to simulate a result structure for AssessmentResults component
              currentAssessmentData = AssessmentService.calculateBasicAssessmentResult(parsedAnswers) // Basic calculation for guest
              if (currentAiAnalysis) {
                currentAssessmentData = { ...currentAssessmentData, ...currentAiAnalysis } // Merge AI if available
              }
              // Do NOT clear localStorage for guest if not saved to DB, as it's the only source.
              // However, the prompt implies we should fetch from DB, so guest flow might need adjustment.
              // For now, if it's a guest and no user, we'll just use the parsed answers.
            }
          }
        }

        // 2. If no fresh submission (or if localStorage was empty/cleared), try to fetch latest from Supabase
        if (!currentAssessmentData && user?.id) {
          console.log("ResultsPage: No fresh submission data, attempting to fetch latest from Supabase.")
          const { data: fetchedData, error: fetchError } =
            await AssessmentService.getLatestAssessmentForUserAndCategory(user.id, categoryId)

          if (fetchError) {
            throw new Error(fetchError)
          }
          if (!fetchedData) {
            throw new Error("assessment.no_data_found: ไม่พบข้อมูลแบบประเมินล่าสุดในฐานข้อมูล")
          }
          currentAssessmentData = fetchedData
          currentAnswers = fetchedData.answers || [] // Ensure answers are retrieved
          currentAiAnalysis = {
            // Reconstruct AI analysis if available
            score: fetchedData.percentage,
            riskLevel: fetchedData.risk_level,
            riskFactors: fetchedData.risk_factors,
            recommendations: fetchedData.recommendations,
          }
          setAnswers(currentAnswers)
          setAiAnalysis(currentAiAnalysis)
          console.log("ResultsPage: Fetched latest assessment from Supabase:", currentAssessmentData.id)
        } else if (!currentAssessmentData && categoryId === guestAssessmentCategory.id && !user?.id) {
          // This case handles direct navigation/refresh for guest users where localStorage might be gone
          // For now, we'll throw an error as we don't persist guest data without user.
          throw new Error("assessment.no_data_found: ไม่พบข้อมูลแบบประเมินสำหรับผู้เยี่ยมชม (อาจถูกล้างไปแล้ว)")
        }

        if (!currentAssessmentData) {
          throw new Error("assessment.no_data_found: ไม่สามารถโหลดข้อมูลแบบประเมินได้")
        }

        setAssessmentResult(currentAssessmentData)
        console.log("ResultsPage: Assessment result set in state.")
      } catch (err: any) {
        console.error("ResultsPage: Caught error in loadAndSaveOrFetchAssessment:", err)
        setError(err.message || "เกิดข้อผิดพลาดในการประมวลผลแบบประเมิน")
      } finally {
        setLoading(false)
        console.log("ResultsPage: loadAndSaveOrFetchAssessment finished. Loading set to false.")
      }
    }

    loadAndSaveOrFetchAssessment()

    return () => {
      console.log("ResultsPage: useEffect cleanup function running.")
      AssessmentService.cleanup()
    }
  }, [categoryId, user?.id, isUserLoading])

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
