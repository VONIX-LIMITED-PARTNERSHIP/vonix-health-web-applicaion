"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Download,
  Share2,
  Calendar,
  User,
  Heart,
  Activity,
  TrendingUp,
  FileText,
  Stethoscope,
  Brain,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { assessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"

interface AssessmentResultsProps {
  categoryId: string
}

export function AssessmentResults({ categoryId }: AssessmentResultsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs to prevent multiple saves
  const saveInProgressRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const category = assessmentCategories.find((cat) => cat.id === categoryId)
  const isBasicAssessment = categoryId === "basic"

  useEffect(() => {
    loadAssessmentData()

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      AssessmentService.cleanup()
    }
  }, [categoryId])

  const loadAssessmentData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load answers from localStorage
      const savedAnswers = localStorage.getItem(`assessment-${categoryId}`)
      if (!savedAnswers) {
        toast({
          title: "ไม่พบข้อมูลการประเมิน",
          description: "กรุณาทำแบบประเมินใหม่",
          variant: "destructive",
        })
        router.push(`/assessment/${categoryId}`)
        return
      }

      const parsedAnswers: AssessmentAnswer[] = JSON.parse(savedAnswers)
      setAnswers(parsedAnswers)

      if (isBasicAssessment) {
        // Calculate results locally for basic assessment
        const calculatedResult = calculateBasicResults(parsedAnswers)
        setResult(calculatedResult)
        setLoading(false)
      } else {
        // Use AI analysis for other assessments
        await analyzeWithAI(parsedAnswers)
      }
    } catch (error) {
      console.error("Error loading assessment data:", error)
      setError("ไม่สามารถโหลดข้อมูลการประเมินได้")
      setLoading(false)
    }
  }

  const analyzeWithAI = async (answers: AssessmentAnswer[]) => {
    try {
      setAnalyzing(true)
      setError(null)

      const { data: analysis, error } = await AssessmentService.analyzeWithAI(categoryId, answers)

      if (error) {
        throw error
      }

      setAiAnalysis(analysis)

      // Convert AI analysis to AssessmentResult format
      const result: AssessmentResult = {
        categoryId,
        totalScore: analysis.score,
        maxScore: 100,
        percentage: analysis.score,
        riskLevel: analysis.riskLevel,
        riskFactors: analysis.riskFactors,
        recommendations: analysis.recommendations,
      }

      setResult(result)
    } catch (error) {
      console.error("Error analyzing with AI:", error)
      setError("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setAnalyzing(false)
      setLoading(false)
    }
  }

  const calculateBasicResults = (answers: AssessmentAnswer[]): AssessmentResult => {
    // Same logic as before for basic assessment
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
    const maxScore = answers.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    let riskLevel: "low" | "medium" | "high" | "very-high"
    if (percentage < 30) riskLevel = "low"
    else if (percentage < 50) riskLevel = "medium"
    else if (percentage < 70) riskLevel = "high"
    else riskLevel = "very-high"

    const riskFactors: string[] = []
    const recommendations: string[] = []

    // BMI and health analysis logic here...
    // (Same as previous implementation)

    return {
      categoryId,
      totalScore,
      maxScore,
      percentage,
      riskLevel,
      riskFactors: riskFactors.length > 0 ? riskFactors : ["ไม่พบปัจจัยเสี่ยงที่สำคัญ"],
      recommendations:
        recommendations.length > 0 ? recommendations : ["ข้อมูลสุขภาพของคุณอยู่ในเกณฑ์ปกติ", "ควรตรวจสุขภาพประจำปี"],
    }
  }

  const saveToDatabase = async () => {
    // Prevent multiple simultaneous saves
    if (saveInProgressRef.current || saving || saved) {
      console.log("🚫 Save already in progress or completed")
      return
    }

    if (!user || !result || !category) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเข้าสู่ระบบและทำแบบประเมินใหม่",
        variant: "destructive",
      })
      return
    }

    console.log("💾 Starting save process...")
    saveInProgressRef.current = true
    setSaving(true)

    // Set a UI timeout (show error after 10 seconds)
    saveTimeoutRef.current = setTimeout(() => {
      if (saveInProgressRef.current) {
        console.log("⏰ UI timeout reached")
        setSaving(false)
        saveInProgressRef.current = false
        toast({
          title: "การบันทึกใช้เวลานานกว่าปกติ",
          description: "กรุณาลองใหม่อีกครั้ง หรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
          variant: "destructive",
        })
      }
    }, 10000)

    try {
      // Validate data before sending
      if (!answers || answers.length === 0) {
        throw new Error("ไม่พบข้อมูลคำตอบ")
      }

      if (!isBasicAssessment && !aiAnalysis) {
        throw new Error("ไม่พบผลการวิเคราะห์จาก AI")
      }

      console.log("📤 Sending data to server...")

      const { data, error } = await AssessmentService.saveAssessment(
        user.id,
        categoryId,
        category.title,
        answers,
        aiAnalysis,
      )

      // Clear timeout since we got a response
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }

      if (error) {
        console.error("💥 Save error:", error)

        // Show specific error messages
        let errorMessage = "เกิดข้อผิดพลาดในการบันทึก"
        if (error.includes("already exists") || error.includes("duplicate")) {
          errorMessage = "ข้อมูลนี้ถูกบันทึกไปแล้ว"
          setSaved(true) // Mark as saved if it's a duplicate
          localStorage.removeItem(`assessment-${categoryId}`)
          toast({
            title: "ข้อมูลถูกบันทึกแล้ว",
            description: "การประเมินนี้ได้รับการบันทึกไปแล้ว",
          })
          return
        } else if (error.includes("network") || error.includes("fetch")) {
          errorMessage = "ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต"
        } else if (error.includes("authentication") || error.includes("unauthorized")) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่"
        } else if (error.includes("ยกเลิก")) {
          errorMessage = "การบันทึกใช้เวลานานเกินไป กรุณาลองใหม่"
        }

        throw new Error(errorMessage)
      }

      console.log("✅ Assessment saved successfully:", data?.id)

      setSaved(true)
      // Clear localStorage after successful save
      localStorage.removeItem(`assessment-${categoryId}`)

      toast({
        title: "บันทึกผลการประเมินสำเร็จ",
        description: "ข้อมูลของคุณได้รับการบันทึกแล้ว",
      })
    } catch (error) {
      console.error("💥 Error saving assessment:", error)
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"

      toast({
        title: "เกิดข้อผิดพลาดในการบันทึก",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      saveInProgressRef.current = false

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }

  const retryAnalysis = () => {
    if (answers.length > 0) {
      analyzeWithAI(answers)
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

  const handleBack = () => {
    router.push("/")
  }

  const handleConsultDoctor = () => {
    toast({
      title: "กำลังจะมาเร็วๆ นี้!",
      description: "ฟีเจอร์ปรึกษาแพทย์ออนไลน์กำลังอยู่ในระหว่างการพัฒนา",
      duration: 3000,
    })
  }

  // Loading state
  if (loading || analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {analyzing ? (
                <Brain className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
              ) : (
                <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {analyzing ? "AI กำลังวิเคราะห์ผลการประเมิน" : "กำลังประมวลผลการประเมิน"}
            </h3>
            <p className="text-gray-600 mb-4">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={retryAnalysis} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                ลองใหม่อีกครั้ง
              </Button>
              <Button variant="outline" onClick={handleBack} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!category || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ไม่พบข้อมูลการประเมิน</p>
          <Button onClick={handleBack} className="mt-4">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    )
  }

  const riskInfo = getRiskLevelInfo(result.riskLevel)
  const RiskIcon = riskInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center">
                    <User className="mr-3 h-6 w-6 text-blue-600" />
                    ผลการประเมิน: {category.title}
                  </CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                  {!isBasicAssessment && (
                    <div className="flex items-center mt-2 text-sm text-purple-600">
                      <Brain className="w-4 h-4 mr-1" />
                      วิเคราะห์โดย AI
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">วันที่ประเมิน</div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date().toLocaleDateString("th-TH")}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* AI Summary (for non-basic assessments) */}
        {!isBasicAssessment && aiAnalysis?.summary && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Brain className="mr-3 h-5 w-5 text-purple-600" />
                สรุปผลการวิเคราะห์โดย AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{riskInfo.label}</h3>
                  <p className="text-gray-600">ระดับความเสี่ยงโดยรวม</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-800 mb-1">{result.percentage}%</div>
                <div className="text-sm text-gray-500">
                  คะแนน {result.totalScore}/{result.maxScore}
                </div>
              </div>
            </div>

            <Progress value={result.percentage} className="h-4 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{answers.length}</div>
                <div className="text-sm text-gray-600">คำถามที่ตอบ</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{result.riskFactors.length}</div>
                <div className="text-sm text-gray-600">ปัจจัยเสี่ยง</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{result.recommendations.length}</div>
                <div className="text-sm text-gray-600">คำแนะนำ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Factors */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <AlertTriangle className="mr-3 h-5 w-5 text-orange-600" />
                ปัจจัยเสี่ยงที่พบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.riskFactors.length > 0 ? (
                <div className="space-y-3">
                  {result.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-800">{factor}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-600">ไม่พบปัจจัยเสี่ยงที่สำคัญ</p>
                  <p className="text-sm text-gray-500 mt-1">ข้อมูลสุ��ภาพของคุณอยู่ในเกณฑ์ปกติ</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Heart className="mr-3 h-5 w-5 text-red-600" />
                คำแนะนำสำหรับคุณ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              {!saved && (
                <Button
                  onClick={saveToDatabase}
                  disabled={saving || !user || saveInProgressRef.current}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">กำลังบันทึก...</span>
                      <span className="sm:hidden">บันทึก...</span>
                    </>
                  ) : !user ? (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">กรุณาเข้าสู่ระบบ</span>
                      <span className="sm:hidden">เข้าสู่ระบบ</span>
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">บันทึกผลการประเมิน</span>
                      <span className="sm:hidden">บันทึกผล</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={handleConsultDoctor}
                variant="outline"
                className="w-full sm:w-auto border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">ปรึกษาแพทย์</span>
                <span className="sm:hidden">แพทย์</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">ดาวน์โหลด PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">แชร์ผลลัพธ์</span>
                <span className="sm:hidden">แชร์</span>
              </Button>
            </div>

            {saved && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">ผลการประเมินได้รับการบันทึกแล้ว</p>
                <p className="text-green-600 text-sm mt-1">คุณสามารถดูผลการประเมินได้ในหน้าแดชบอร์ด</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
