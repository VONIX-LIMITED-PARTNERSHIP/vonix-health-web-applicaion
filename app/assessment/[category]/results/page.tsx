"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { AssessmentService } from "@/lib/assessment-service"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"

export default function AssessmentResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)

  const categoryId = params.category as string
  const assessmentId = searchParams.get("id")

  useEffect(() => {
    async function loadAssessmentResults() {
      try {
        setLoading(true)
        setError(null)

        if (!user) {
          setError("กรุณาเข้าสู่ระบบ")
          return
        }

        const supabase = createClient()
        let fetchedAssessmentData = null

        console.log("🔍 Loading assessment results...")
        console.log("Category ID:", categoryId)
        console.log("Assessment ID:", assessmentId)
        console.log("User ID:", user.id)

        // Try to get specific assessment by ID first
        if (assessmentId) {
          console.log("📋 Fetching assessment by ID:", assessmentId)
          const { data, error } = await AssessmentService.getAssessmentById(supabase, assessmentId)
          if (error) {
            console.error("❌ Error fetching assessment by ID:", error)
          } else if (data) {
            fetchedAssessmentData = data
            console.log("✅ Found assessment by ID:", data)
          }
        }

        // If no specific assessment found, get latest for category
        if (!fetchedAssessmentData) {
          console.log("📋 Fetching latest assessment for category:", categoryId)
          const { data, error } = await AssessmentService.getLatestAssessmentForUserAndCategory(
            supabase,
            user.id,
            categoryId,
          )
          if (error) {
            console.error("❌ Error fetching latest assessment:", error)
            setError("ไม่สามารถดึงข้อมูลการประเมินได้")
            return
          } else if (data) {
            fetchedAssessmentData = data
            console.log("✅ Found latest assessment:", data)
          }
        }

        if (!fetchedAssessmentData) {
          setError("ไม่พบข้อมูลการประเมิน")
          return
        }

        // Set the raw assessment data from database
        setAssessmentData(fetchedAssessmentData)

        // Convert database data to AssessmentResult format
        const result: AssessmentResult = {
          categoryId: fetchedAssessmentData.category_id,
          totalScore: fetchedAssessmentData.total_score || 0,
          maxScore: fetchedAssessmentData.max_score || 100,
          percentage: fetchedAssessmentData.percentage || 0,
          riskLevel: fetchedAssessmentData.risk_level || "medium",
          riskFactors: fetchedAssessmentData.risk_factors_th || [],
          recommendations: fetchedAssessmentData.recommendations_th || [],
        }

        setAssessmentResult(result)
        setAnswers(fetchedAssessmentData.answers || [])

        // Create AI analysis object from database data for compatibility
        const aiAnalysisFromDb = {
          riskLevel: fetchedAssessmentData.risk_level,
          score: fetchedAssessmentData.total_score,
          riskFactors_th: fetchedAssessmentData.risk_factors_th || [],
          recommendations_th: fetchedAssessmentData.recommendations_th || [],
          summary_th: fetchedAssessmentData.summary_th || "",
          riskFactors_en: fetchedAssessmentData.risk_factors_en || [],
          recommendations_en: fetchedAssessmentData.recommendations_en || [],
          summary_en: fetchedAssessmentData.summary_en || "",
        }

        setAiAnalysis(aiAnalysisFromDb)

        console.log("✅ Assessment results loaded successfully")
        console.log("📊 Assessment Result:", result)
        console.log("🤖 AI Analysis:", aiAnalysisFromDb)
        console.log("💾 Raw Database Data:", fetchedAssessmentData)
      } catch (error) {
        console.error("❌ Error loading assessment results:", error)
        setError("เกิดข้อผิดพลาดในการโหลดผลการประเมิน")
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      loadAssessmentResults()
    }
  }, [categoryId, assessmentId, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="flex justify-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <Skeleton className="h-12 w-1/3 mx-auto" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>ไม่พบข้อมูลการประเมิน</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <AssessmentResults
      categoryId={categoryId}
      assessmentResult={assessmentResult}
      answers={answers}
      aiAnalysis={aiAnalysis}
      assessmentData={assessmentData}
    />
  )
}
