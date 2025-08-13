"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Info, Wine } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useLanguage } from "@/contexts/language-context"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function AuditAssessmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { guestUser, isGuestLoggedIn } = useGuestAuth()
  const { locale } = useLanguage()
  const { toast } = useToast()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get AUDIT questions from assessment data
  const assessmentCategories = getAssessmentCategories(locale)
  const auditCategory = assessmentCategories.find((cat) => cat.id === "audit")
  const questions = auditCategory?.questions || []

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer && question.options) {
        const option = question.options.find((opt) => opt.value === answer)
        if (option && typeof option.score === "number") {
          totalScore += option.score
        }
      }
    })
    return totalScore
  }

  const getRiskLevel = (score: number) => {
    if (score <= 7) return "low"
    if (score <= 15) return "medium"
    if (score <= 19) return "high"
    return "very-high"
  }

  const getRiskLevelInfo = (riskLevel: string) => {
    const info = {
      low: {
        th: {
          label: "ความเสี่ยงต่ำ",
          description: "การดื่มสุราของคุณอยู่ในระดับที่ปลอดภัย",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        },
        en: {
          label: "Low Risk",
          description: "Your alcohol consumption is at a safe level",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        },
      },
      medium: {
        th: {
          label: "ความเสี่ยงปานกลาง",
          description: "ควรลดการดื่มสุราและปรับเปลี่ยนพฤติกรรม",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          icon: AlertTriangle,
        },
        en: {
          label: "Moderate Risk",
          description: "You should reduce alcohol consumption and modify behavior",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          icon: AlertTriangle,
        },
      },
      high: {
        th: {
          label: "ความเสี่ยงสูง",
          description: "ต้องการคำปรึกษาและการบำบัดเบื้องต้น",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          icon: AlertTriangle,
        },
        en: {
          label: "High Risk",
          description: "Requires counseling and brief therapy",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          icon: AlertTriangle,
        },
      },
      "very-high": {
        th: {
          label: "ความเสี่ยงสูงมาก",
          description: "ควรปรึกษาผู้เชี่ยวชาญเพื่อการรักษา",
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: AlertTriangle,
        },
        en: {
          label: "Very High Risk",
          description: "Should consult specialist for treatment",
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: AlertTriangle,
        },
      },
    }
    return info[riskLevel as keyof typeof info]?.[locale] || info.low[locale]
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: locale === "th" ? "กรุณาตอบคำถามให้ครบ" : "Please answer all questions",
        description: locale === "th" ? "คุณยังตอบคำถามไม่ครบทุกข้อ" : "You haven't answered all questions yet",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const score = calculateScore()
      const riskLevel = getRiskLevel(score)
      const riskLevelInfo = getRiskLevelInfo(riskLevel)

      const assessmentResult = {
        id: `audit_${Date.now()}`,
        category: "audit",
        categoryId: "audit",
        score,
        percentage: Math.round((score / 40) * 100),
        riskLevel,
        riskFactors: score > 7 ? ["การดื่มสุราเสี่ยง"] : [],
        recommendations: [
          riskLevel === "low"
            ? locale === "th"
              ? "รักษาพฤติกรรมการดื่มในระดับปัจจุบัน"
              : "Maintain current drinking behavior"
            : riskLevel === "medium"
              ? locale === "th"
                ? "ลดปริมาณการดื่มสุราและหาคำปรึกษา"
                : "Reduce alcohol consumption and seek advice"
              : riskLevel === "high"
                ? locale === "th"
                  ? "ปรึกษาผู้เชี่ยวชาญและเข้ารับการบำบัด"
                  : "Consult specialist and enter treatment"
                : locale === "th"
                  ? "ต้องการการรักษาเฉพาะทางอย่างเร่งด่วน"
                  : "Requires urgent specialized treatment",
        ],
        completedAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          value: answer,
          score: questions.find((q) => q.id === questionId)?.options?.find((opt) => opt.value === answer)?.score || 0,
        })),
      }

      if (isGuestLoggedIn && guestUser) {
        // Save as guest assessment
        GuestAssessmentService.saveAssessment({
          id: assessmentResult.id,
          guestId: guestUser.id,
          result: assessmentResult,
        })

        router.push(`/guest-assessment/results?category=audit&id=${assessmentResult.id}`)
      } else if (user) {
        // Save as user assessment
        const supabase = createClientComponentClient()
        await AssessmentService.saveAssessment(supabase, {
          userId: user.id,
          categoryId: "audit",
          answers: assessmentResult.answers,
          totalScore: score,
          maxScore: 40,
          percentage: assessmentResult.percentage,
          riskLevel: riskLevel as any,
          riskFactors: assessmentResult.riskFactors,
          recommendations: assessmentResult.recommendations,
        })

        router.push(`/assessment/audit/results`)
      } else {
        router.push("/guest-login")
      }
    } catch (error) {
      console.error("Error saving AUDIT assessment:", error)
      toast({
        title: locale === "th" ? "เกิดข้อผิดพลาด" : "Error occurred",
        description: locale === "th" ? "ไม่สามารถบันทึกผลการประเมินได้" : "Could not save assessment results",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {locale === "th" ? "ไม่พบแบบประเมิน AUDIT" : "AUDIT Assessment Not Found"}
          </h1>
          <Button onClick={() => router.push("/")} variant="outline">
            {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <Wine className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {locale === "th" ? "แบบประเมิน AUDIT" : "AUDIT Assessment"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {locale === "th"
                  ? "แบบประเมินพฤติกรรมการดื่มสุราและความเสี่ยงต่อสุขภาพ"
                  : "Alcohol Use Disorders Identification Test"}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === "th" ? "ความคืบหน้า" : "Progress"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white">
                  {locale === "th" ? `คำถามที่ ${currentQuestionIndex + 1}` : `Question ${currentQuestionIndex + 1}`}
                </CardTitle>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{currentQuestion.question}</p>
                {currentQuestion.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{currentQuestion.description}</p>
                )}
              </div>
              <Badge variant="outline" className="ml-4">
                {currentQuestionIndex + 1}/{questions.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700 dark:text-gray-300">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "th" ? "ก่อนหน้า" : "Previous"}
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.id] || isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {locale === "th" ? "กำลังบันทึก..." : "Saving..."}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {locale === "th" ? "เสร็จสิ้น" : "Complete"}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              {locale === "th" ? "ถัดไป" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">{locale === "th" ? "เกี่ยวกับ AUDIT" : "About AUDIT"}</p>
                <p>
                  {locale === "th"
                    ? "AUDIT เป็นแบบประเมินมาตรฐานที่พัฒนาโดยองค์การอนามัยโลก (WHO) เพื่อคัดกรองปัญหาการดื่มสุรา ใช้เวลาประมาณ 5-8 นาที และให้ผลลัพธ์ที่เชื่อถือได้"
                    : "AUDIT is a standardized screening tool developed by the World Health Organization (WHO) to identify alcohol-related problems. It takes about 5-8 minutes and provides reliable results."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
