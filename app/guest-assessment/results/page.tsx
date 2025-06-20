"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Calendar,
  Heart,
  Activity,
  TrendingUp,
  FileText,
  FlaskConical,
  LogIn,
  UserPlus,
  Loader2,
  Info,
  Brain,
} from "lucide-react"
import { guestAssessmentCategory } from "@/data/assessment-questions"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"

export default function GuestAssessmentResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false) // New state for AI analysis
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null) // To store raw AI analysis
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAndAnalyzeGuestAssessmentData()
  }, [])

  const loadAndAnalyzeGuestAssessmentData = async () => {
    try {
      setLoading(true)
      setAnalyzing(true) // Start analyzing state
      setError(null)

      const savedAnswers = localStorage.getItem(`guest-assessment-temp-answers`)
      if (!savedAnswers) {
        setError("ไม่พบข้อมูลแบบประเมินทดลอง กรุณาลองทำใหม่")
        setLoading(false)
        setAnalyzing(false)
        return
      }

      const parsedAnswers: AssessmentAnswer[] = JSON.parse(savedAnswers)

      // Call API to analyze results
      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: guestAssessmentCategory.id,
          categoryTitle: guestAssessmentCategory.title, // Pass category title for AI prompt
          answers: parsedAnswers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการวิเคราะห์ผลลัพธ์")
      }

      const { analysis } = await response.json() // Destructure analysis from response
      setAiAnalysis(analysis) // Store raw AI analysis

      // Map AI analysis to AssessmentResult format for display
      const mappedResult: AssessmentResult = {
        categoryId: guestAssessmentCategory.id,
        totalScore: analysis.score, // AI score is the main score
        maxScore: 100, // AI score is out of 100
        percentage: analysis.score, // AI score is also the percentage
        riskLevel: analysis.riskLevel,
        riskFactors: analysis.riskFactors,
        recommendations: analysis.recommendations,
        summary: analysis.summary, // Include summary in mapped result
        totalQuestions: parsedAnswers.length, // Number of questions answered
      }
      setResult(mappedResult)

      // Clear temporary answers from localStorage after successful analysis
      localStorage.removeItem(`guest-assessment-temp-answers`)
    } catch (err: any) {
      console.error("Error loading or analyzing guest assessment data:", err)
      setError(err.message || "ไม่สามารถโหลดหรือวิเคราะห์ผลการประเมินได้")
    } finally {
      setLoading(false)
      setAnalyzing(false) // End analyzing state
    }
  }

  const getRiskLevelInfo = (level: string) => {
    switch (level) {
      case "low":
        return {
          label: "ความเสี่ยงต่ำ",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
        }
      case "medium":
        return {
          label: "ความเสี่ยงปานกลาง",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
        }
      case "high":
        return {
          label: "ความเสี่ยงสูง",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          icon: AlertCircle,
        }
      case "very-high":
        return {
          label: "ความเสี่ยงสูงมาก",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
        }
      default:
        return {
          label: "ไม่ทราบ",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: AlertCircle,
        }
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  // Loading state
  if (loading || analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {analyzing ? (
                <Brain className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
              ) : (
                <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {analyzing ? "AI กำลังวิเคราะห์ผลการประเมิน" : "กำลังประมวลผลผลการประเมิน"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {analyzing ? "ระบบ AI กำลังวิเคราะห์คำตอบของคุณเพื่อให้คำแนะนำที่เหมาะสม" : "กรุณารอสักครู่..."}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={handleBackToHome} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">ไม่พบข้อมูลผลการประเมิน</p>
          <Button onClick={handleBackToHome} className="mt-4">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    )
  }

  const riskInfo = getRiskLevelInfo(result.riskLevel)
  const RiskIcon = riskInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="mb-4 hover:bg-white/80 dark:hover:bg-gray-700/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center">
                    <FlaskConical className="mr-3 h-6 w-6 text-purple-600" />
                    ผลการประเมิน: {guestAssessmentCategory.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{guestAssessmentCategory.description}</p>
                  <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <Info className="w-4 h-4 mr-1" />
                    ข้อมูลนี้ไม่ถูกบันทึก
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">วันที่ประเมิน</div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date().toLocaleDateString("th-TH")}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* AI Summary */}
        {aiAnalysis?.summary && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-xl rounded-2xl dark:from-purple-950 dark:to-blue-950 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-200">
                <Brain className="mr-3 h-5 w-5 text-purple-600" />
                สรุปผลการวิเคราะห์โดย AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{aiAnalysis.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <Card className={`mb-8 border-2 ${riskInfo.borderColor} ${riskInfo.bgColor} shadow-xl rounded-2xl`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl ${riskInfo.bgColor} border ${riskInfo.borderColor}`}>
                  <RiskIcon className={`h-8 w-8 ${riskInfo.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{riskInfo.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400">ระดับความเสี่ยงโดยรวม</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-1">{result.percentage}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  คะแนน {result.totalScore}/{result.maxScore}
                </div>
              </div>
            </div>

            <Progress value={result.percentage} className="h-4 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.totalQuestions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">คำถามที่ตอบ</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.riskFactors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ปัจจัยเสี่ยง</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {result.recommendations.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">คำแนะนำ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Factors */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-200">
                <AlertTriangle className="mr-3 h-5 w-5 text-orange-600" />
                ปัจจัยเสี่ยงที่พบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.riskFactors && result.riskFactors.length > 0 ? (
                <div className="space-y-3">
                  {result.riskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800"
                    >
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-200">{factor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">ไม่พบปัจจัยเสี่ยงที่สำคัญ</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">ข้อมูลสุขภาพของคุณอยู่ในเกณฑ์ปกติ</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-200">
                <Heart className="mr-3 h-5 w-5 text-red-600" />
                คำแนะนำสำหรับคุณ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.recommendations && result.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 dark:text-gray-200">{recommendation}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">ไม่มีคำแนะนำเพิ่มเติม</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">สุขภาพของคุณอยู่ในเกณฑ์ดีเยี่ยม</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action for Login/Register */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              ต้องการบันทึกผลและใช้งานฟีเจอร์เต็มรูปแบบหรือไม่?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              เข้าสู่ระบบเพื่อติดตามความคืบหน้าสุขภาพของคุณ, ดูรายงานฉบับเต็ม, และปรึกษาแพทย์ออนไลน์
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  สมัครสมาชิก
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
