"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { QuestionCard } from "./question-card"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"

interface AssessmentFormProps {
  categoryId: string
  questions: AssessmentQuestion[]
  isGuest?: boolean
}

export function AssessmentForm({ categoryId, questions, isGuest = false }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { t, locale } = useTranslation()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  console.log("🎯 AssessmentForm: Initialized with:")
  console.log("  - Category ID:", categoryId)
  console.log("  - Questions count:", questions.length)
  console.log("  - Is guest:", isGuest)
  console.log("  - Current locale:", locale)
  console.log("  - User ID:", user?.id)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  // Get current answer for the question
  const getCurrentAnswer = () => {
    return answers.find((answer) => answer.questionId === currentQuestion.id)
  }

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: any, score?: number) => {
    console.log("📝 AssessmentForm: Answer changed:", { questionId, value, score })

    setAnswers((prev) => {
      const existingIndex = prev.findIndex((answer) => answer.questionId === questionId)
      const newAnswer: AssessmentAnswer = {
        questionId,
        value,
        score: score || 0,
      }

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newAnswer
        return updated
      } else {
        return [...prev, newAnswer]
      }
    })
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentAnswer = getCurrentAnswer()
    return (
      currentAnswer && currentAnswer.value !== undefined && currentAnswer.value !== null && currentAnswer.value !== ""
    )
  }

  // Submit assessment
  const handleSubmit = async () => {
    console.log("🚀 AssessmentForm: Starting submission...")
    console.log("🚀 AssessmentForm: Total answers:", answers.length)
    console.log("🚀 AssessmentForm: Language:", locale)

    if (answers.length !== questions.length) {
      setError(t("assessment.error_loading_answers"))
      return
    }

    setIsSubmitting(true)
    setIsAnalyzing(true)
    setError(null)

    try {
      // Step 1: Analyze with AI
      console.log("🤖 AssessmentForm: Starting AI analysis...")
      const analysisResult = await AssessmentService.analyzeAssessment(
        answers,
        categoryId,
        locale, // Pass current locale to analysis
      )

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || "AI analysis failed")
      }

      console.log("✅ AssessmentForm: AI analysis completed")

      // Step 2: Save to database (only if user is logged in)
      if (!isGuest && user?.id) {
        console.log("💾 AssessmentForm: Saving to database...")
        const { createClientComponentClient } = await import("@/lib/supabase")
        const supabase = createClientComponentClient()

        const saveResult = await AssessmentService.saveAssessment(
          supabase,
          user.id,
          categoryId,
          answers,
          analysisResult.analysis,
          locale, // Pass current locale to save
        )

        if (saveResult.error) {
          console.error("❌ AssessmentForm: Save failed:", saveResult.error)
          throw new Error("Failed to save assessment")
        }

        console.log("✅ AssessmentForm: Assessment saved successfully")

        // Redirect to results page with assessment ID
        const assessmentId = saveResult.data?.id
        if (assessmentId) {
          router.push(`/assessment/${categoryId}/results?id=${assessmentId}`)
        } else {
          router.push(`/assessment/${categoryId}/results`)
        }
      } else {
        console.log("👤 AssessmentForm: Guest mode - redirecting to guest results")

        // For guest users, store results in sessionStorage and redirect
        const guestResults = {
          categoryId,
          answers,
          analysis: analysisResult.analysis,
          language: locale,
          timestamp: new Date().toISOString(),
        }

        sessionStorage.setItem("guestAssessmentResults", JSON.stringify(guestResults))
        router.push("/guest-assessment/results")
      }
    } catch (error) {
      console.error("❌ AssessmentForm: Submission error:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsSubmitting(false)
      setIsAnalyzing(false)
    }
  }

  // Loading state during analysis
  if (isAnalyzing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
              {t("common.ai_analyzing_results")}
            </CardTitle>
            <p className="text-gray-600 mb-4">{t("common.ai_analyzing_description")}</p>
            <p className="text-sm text-gray-500">{t("common.please_wait")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {t("common.question")} {currentQuestionIndex + 1} {t("common.of")} {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">{currentQuestion.question}</CardTitle>
            {currentQuestion.description && <p className="text-gray-600 text-sm mt-2">{currentQuestion.description}</p>}
          </CardHeader>
          <CardContent>
            <QuestionCard
              question={currentQuestion}
              value={getCurrentAnswer()?.value}
              onChange={(value, score) => handleAnswerChange(currentQuestion.id, value, score)}
            />
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion || isSubmitting}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.previous")}
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered() || isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.submitting")}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {t("common.submit")}
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isCurrentQuestionAnswered()} className="flex items-center gap-2">
              {t("common.next")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Guest Notice */}
        {isGuest && (
          <Alert className="mt-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700">{t("common.guest_assessment_intro")}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
