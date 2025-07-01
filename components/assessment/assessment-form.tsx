"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { AssessmentService } from "@/lib/assessment-service"
import { createClient } from "@/lib/supabase"
import { QuestionCard } from "./question-card"
import type { AssessmentAnswer, AssessmentQuestion } from "@/types/assessment"

interface AssessmentFormProps {
  categoryId: string
  questions: AssessmentQuestion[]
  title: string
  description: string
  isGuest?: boolean
}

export function AssessmentForm({ categoryId, questions, title, description, isGuest = false }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useTranslation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  // Get current answer for the question
  const currentAnswer = answers.find((answer) => answer.questionId === currentQuestion?.id)

  const handleAnswerChange = (questionId: string, answer: any, score: number) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId)
      const newAnswer: AssessmentAnswer = { questionId, answer, score }

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newAnswer
        return updated
      } else {
        return [...prev, newAnswer]
      }
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user && !isGuest) {
      toast.error(t("pleaseLoginFirst"))
      router.push("/login")
      return
    }

    if (answers.length !== questions.length) {
      toast.error(t("pleaseAnswerAllQuestions"))
      return
    }

    setIsSubmitting(true)
    setIsAnalyzing(true)

    try {
      const supabaseClient = createClient()

      // For guest users, redirect to results page with answers
      if (isGuest) {
        const queryParams = new URLSearchParams({
          answers: JSON.stringify(answers),
          categoryId,
          categoryTitle: title,
        })
        router.push(`/guest-assessment/results?${queryParams.toString()}`)
        return
      }

      // For authenticated users, analyze and save
      console.log("🚀 Starting assessment submission process...")

      // Step 1: Analyze with AI (bilingual)
      console.log("🤖 Analyzing with AI...")
      const { data: bilingualAnalysis, error: analysisError } = await AssessmentService.analyzeWithAI(
        categoryId,
        answers,
      )

      if (analysisError) {
        console.error("❌ AI Analysis failed:", analysisError)
        throw new Error(analysisError.message || "Failed to analyze assessment")
      }

      if (!bilingualAnalysis) {
        throw new Error("No analysis data received")
      }

      console.log("✅ AI Analysis completed successfully")
      console.log("🔍 Analysis data:", {
        hasThai: !!bilingualAnalysis.th,
        hasEnglish: !!bilingualAnalysis.en,
        thaiRiskLevel: bilingualAnalysis.th?.riskLevel,
        englishRiskLevel: bilingualAnalysis.en?.riskLevel,
      })

      // Step 2: Save to database with bilingual results
      console.log("💾 Saving assessment to database...")
      const { data: savedAssessment, error: saveError } = await AssessmentService.saveAssessment(
        supabaseClient,
        user.id,
        categoryId,
        title,
        answers,
        bilingualAnalysis, // Pass bilingual analysis
      )

      if (saveError) {
        console.error("❌ Save failed:", saveError)
        throw new Error(saveError)
      }

      if (!savedAssessment) {
        throw new Error("No assessment data returned after save")
      }

      console.log("✅ Assessment saved successfully with ID:", savedAssessment.id)

      toast.success(t("assessmentCompleted"))

      // Redirect to results page
      router.push(`/assessment/${categoryId}/results?id=${savedAssessment.id}`)
    } catch (error) {
      console.error("❌ Assessment submission failed:", error)
      let errorMessage = t("assessmentSubmissionFailed")

      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = t("networkError")
        } else if (error.message.includes("authentication")) {
          errorMessage = t("authenticationError")
        } else {
          errorMessage = error.message
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
      setIsAnalyzing(false)
    }
  }

  const canProceed = currentAnswer !== undefined

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {t("question")} {currentQuestionIndex + 1} {t("of")} {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      {currentQuestion && (
        <QuestionCard question={currentQuestion} answer={currentAnswer} onAnswerChange={handleAnswerChange} />
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion || isSubmitting}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("previous")}
            </Button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {answers.length}/{questions.length} {t("answered")}
            </div>

            {isLastQuestion ? (
              <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isAnalyzing ? t("analyzing") : t("submitting")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {t("submit")}
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed || isSubmitting} className="flex items-center gap-2">
                {t("next")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">{t("analyzingYourAnswers")}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{t("aiAnalysisInProgress")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
