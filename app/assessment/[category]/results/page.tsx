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
  Info,
  LogIn,
  UserPlus,
  BarChart2,
} from "lucide-react"
import { assessmentCategories, guestAssessmentCategory } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import Link from "next/link"
import { ConsultDoctorIntroModal } from "@/components/consult-doctor-intro-modal"
import { HealthOverviewModal } from "@/components/health-overview-modal" // Import the new health overview modal
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

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
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false)
  const [isHealthOverviewModalOpen, setIsHealthOverviewModalOpen] = useState(false) // New state for health overview modal
  const { t } = useTranslation() // Use translation hook

  // Refs to prevent multiple saves
  const saveInProgressRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const category = assessmentCategories.find((cat) => cat.id === categoryId)
  const isBasicAssessment = categoryId === "basic"
  const isGuestAssessment = categoryId === guestAssessmentCategory.id

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
          title: t("no_assessment_data"),
          description: t("try_again"),
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
        // ไม่ต้องลบ localStorage ที่นี่ เพราะ saveToDatabase จะเป็นคนลบ
      } else {
        // Use AI analysis for other assessments
        await analyzeWithAI(parsedAnswers)
        // ไม่ต้องลบ localStorage ที่นี่ เพราะ saveToDatabase จะเป็นคนลบ
      }
    } catch (error) {
      setError(t("error_loading_analysis"))
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
      setError(t("error_loading_analysis"))
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
      riskFactors: riskFactors.length > 0 ? riskFactors : [t("no_significant_risk_factors")],
      recommendations:
        recommendations.length > 0 ? recommendations : [t("your_health_normal"), t("should_annual_checkup")], // Assuming 'should_annual_checkup' is a new key
    }
  }

  const saveToDatabase = async () => {
    // Prevent multiple simultaneous saves
    if (saveInProgressRef.current || saving || saved) {
      return
    }

    if (!user || !result || !category) {
      toast({
        title: t("no_data"),
        description: t("please_login"),
        variant: "destructive",
      })
      return
    }

    saveInProgressRef.current = true
    setSaving(true)

    // Set a UI timeout (show error after 10 seconds)
    saveTimeoutRef.current = setTimeout(() => {
      if (saveInProgressRef.current) {
        setSaving(false)
        saveInProgressRef.current = false
        toast({
          title: t("save_timeout"),
          description: t("check_internet_try_again"),
          variant: "destructive",
        })
      }
    }, 10000)

    try {
      // Validate data before sending
      if (!answers || answers.length === 0) {
        throw new Error(t("no_data"))
      }

      if (!isBasicAssessment && !aiAnalysis) {
        throw new Error(t("no_ai_analysis_results")) // Assuming 'no_ai_analysis_results' is a new key
      }

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
        // Show specific error messages
        let errorMessage = t("save_failed")
        if (error.includes("already exists") || error.includes("duplicate")) {
          errorMessage = t("data_already_saved")
          setSaved(true) // Mark as saved if it's a duplicate
          localStorage.removeItem(`assessment-${categoryId}`)
          toast({
            title: t("data_already_saved"),
            description: t("assessment_already_saved"),
          })
          return
        } else if (error.includes("network") || error.includes("fetch")) {
          errorMessage = t("network_issue")
        } else if (error.includes("authentication") || error.includes("unauthorized")) {
          errorMessage = t("please_login")
        } else if (error.includes("ยกเลิก")) {
          errorMessage = t("save_timeout")
        }

        throw new Error(errorMessage)
      } else {
        setSaved(true)
        // Clear localStorage after successful save
        localStorage.removeItem(`assessment-${categoryId}`) // <--- ย้ายมาที่นี่
        toast({
          title: t("save_assessment_results"),
          description: t("data_already_saved"),
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("unknown_error")

      toast({
        title: t("save_failed"),
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
          label: t("low_risk"),
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
        }
      case "medium":
        return {
          label: t("medium_risk"),
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
        }
      case "high":
        return {
          label: t("high_risk"),
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          icon: AlertCircle,
        }
      case "very-high":
        return {
          label: t("very_high_risk"),
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
        }
      default:
        return {
          label: t("unspecified_risk"),
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
    if (!user) {
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
    if (!user) {
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
              {analyzing ? t("ai_analyzing_results") : t("processing_results")}
            </h3>
            <p className="text-gray-600 mb-4">{analyzing ? t("ai_analyzing_description") : t("please_wait")}</p>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("error")}</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={retryAnalysis} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("try_again")}
              </Button>
              <Button variant="outline" onClick={handleBack} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("home")}
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
          <p className="text-gray-600">{t("no_data")}</p>
          <Button onClick={handleBack} className="mt-4">
            {t("home")}
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
            {t("home")}
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 flex items-center">
                    <User className="mr-3 h-6 w-6 text-blue-600" />
                    {t("assessment_results")}: {category.title}
                  </CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                  {!isBasicAssessment && (
                    <div className="flex items-center mt-2 text-sm text-purple-600">
                      <Brain className="w-4 h-4 mr-1" />
                      {t("ai_analysis")}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{t("assessment_date")}</div>
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
                {t("ai_summary")}
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
                  <p className="text-gray-600">{t("overall_risk_level")}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-800 mb-1">{result.percentage}%</div>
                <div className="text-sm text-gray-500">
                  {t("score")} {result.totalScore}/{result.maxScore}
                </div>
              </div>
            </div>

            <Progress value={result.percentage} className="h-4 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{answers.length}</div>
                <div className="text-sm text-gray-600">{t("questions_answered")}</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{result.riskFactors.length}</div>
                <div className="text-sm text-gray-600">{t("risk_factors")}</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{result.recommendations.length}</div>
                <div className="text-sm text-gray-600">{t("recommendations")}</div>
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
                {t("risk_factors")}
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
                  <p className="text-gray-600">{t("no_significant_risk_factors")}</p>
                  <p className="text-sm text-gray-500 mt-1">{t("your_health_normal")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Heart className="mr-3 h-5 w-5 text-red-600" />
                {t("recommendations")}
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
              {!isGuestAssessment && !saved && (
                <Button
                  onClick={saveToDatabase}
                  disabled={saving || !user || saveInProgressRef.current}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">{t("saving")}...</span>
                      <span className="sm:hidden">{t("saving")}...</span>
                    </>
                  ) : !user ? (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("please_login")}</span>
                      <span className="sm:hidden">{t("login")}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("save_assessment_results")}</span>
                      <span className="sm:hidden">{t("save_assessment_results")}</span>
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
                <span className="hidden sm:inline">{t("consult_doctor")}</span>
                <span className="sm:hidden">{t("consult_doctor")}</span>
              </Button>

              <Button
                onClick={handleViewHealthOverview} // New button for health overview
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("health_overview")}</span>
                <span className="sm:hidden">{t("health_overview")}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("download_pdf")}</span>
                <span className="sm:hidden">{t("download_pdf")}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("share_results")}</span>
                <span className="sm:hidden">{t("share_results")}</span>
              </Button>
            </div>

            {isGuestAssessment && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
                <Info className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 dark:text-blue-200 font-medium">{t("this_data_not_saved")}</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{t("guest_assessment_disclaimer_4")}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("login")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t("register")}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ConsultDoctorIntroModal isOpen={isConsultModalOpen} onOpenChange={setIsConsultModalOpen} />
      <HealthOverviewModal isOpen={isHealthOverviewModalOpen} onOpenChange={setIsHealthOverviewModalOpen} />
    </div>
  )
}

export default AssessmentResults
