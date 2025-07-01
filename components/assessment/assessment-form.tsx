"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuestionCard } from "./question-card"
import { AssessmentResults } from "./assessment-results"
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { AssessmentCategory, AssessmentAnswer } from "@/data/assessment-questions"
import type { Database } from "@/types/database"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]

interface AssessmentFormProps {
  category: AssessmentCategory
  isGuest?: boolean
}

export function AssessmentForm({ category, isGuest = false }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { locale } = useLanguage()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentRow | null>(null)

  // --- early guard ---------------------------------------------------------
  if (!category) {
    return <div className="text-center py-12">{locale === "en" ? "Assessment not found." : "ไม่พบแบบประเมิน"}</div>
  }
  // -------------------------------------------------------------------------

  // Get localized content
  const getLocalizedContent = () => {
    const isEnglish = locale === "en"

    return {
      categoryTitle: isEnglish ? category.titleEn || category.title : category.title,
      categoryDescription: isEnglish ? category.descriptionEn || category.description : category.description,

      // UI Labels
      questionLabel: isEnglish ? "Question" : "คำถาม",
      ofLabel: isEnglish ? "of" : "จาก",
      previousLabel: isEnglish ? "Previous" : "ก่อนหน้า",
      nextLabel: isEnglish ? "Next" : "ถัดไป",
      submitLabel: isEnglish ? "Submit Assessment" : "ส่งแบบประเมิน",
      completedLabel: isEnglish ? "Assessment Completed!" : "ประเมินเสร็จสิ้น!",
      backToHomeLabel: isEnglish ? "Back to Home" : "กลับหน้าหลัก",
      backToDashboardLabel: isEnglish ? "Back to Dashboard" : "กลับแดชบอร์ด",
      analyzingLabel: isEnglish ? "Analyzing your responses..." : "กำลังวิเคราะห์คำตอบของคุณ...",
      pleaseAnswerLabel: isEnglish ? "Please answer this question to continue" : "กรุณาตอบคำถามนี้เพื่อดำเนินการต่อ",
      submissionErrorLabel: isEnglish
        ? "Failed to submit assessment. Please try again."
        : "ไม่สามารถส่งแบบประเมินได้ กรุณาลองใหม่อีกครั้ง",
      analysisErrorLabel: isEnglish
        ? "Failed to analyze assessment. Please try again."
        : "ไม่สามารถวิเคราะห์แบบประเมินได้ กรุณาลองใหม่อีกครั้ง",
    }
  }

  const localizedContent = getLocalizedContent()
  const currentQuestion = category.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / category.questions.length) * 100

  const handleAnswer = (
    questionId: string,
    answer: string | number | string[] | null,
    score: number,
    isValid: boolean,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        score,
        isValid,
      },
    }))
  }

  const canProceed = () => {
    const currentAnswer = answers[currentQuestion.id]
    return currentAnswer && currentAnswer.isValid
  }

  const handleNext = () => {
    if (!canProceed()) {
      toast.error(localizedContent.pleaseAnswerLabel)
      return
    }

    if (currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((total, answer) => total + answer.score, 0)
  }

  const calculateMaxScore = () => {
    return category.questions.reduce((total, question) => {
      if (question.type === "single" && question.options) {
        return total + Math.max(...question.options.map((opt) => opt.score))
      }
      if (question.type === "multiple" && question.options) {
        return total + question.options.reduce((sum, opt) => sum + opt.score, 0)
      }
      if (question.type === "scale") {
        return total + (question.max || 10) - 1
      }
      return total + 5 // Default max score for other types
    }, 0)
  }

  const getRiskLevel = (percentage: number): "low" | "medium" | "high" | "very-high" => {
    if (percentage <= 25) return "low"
    if (percentage <= 50) return "medium"
    if (percentage <= 75) return "high"
    return "very-high"
  }

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast.error(localizedContent.pleaseAnswerLabel)
      return
    }

    setIsSubmitting(true)

    try {
      const totalScore = calculateTotalScore()
      const maxScore = calculateMaxScore()
      const percentage = Math.round((totalScore / maxScore) * 100)
      const riskLevel = getRiskLevel(percentage)

      // Prepare answers array
      const answersArray = Object.values(answers)

      // Call AI analysis API
      const analysisResponse = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: category.id,
          categoryTitle: localizedContent.categoryTitle,
          answers: answersArray,
          language: locale,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze assessment")
      }

      const analysisData = await analysisResponse.json()

      if (!analysisData.success) {
        throw new Error(analysisData.error || "Analysis failed")
      }

      const analysis = analysisData.analysis

      // For guest users, just show results without saving
      if (isGuest) {
        const guestResult: AssessmentRow = {
          id: "guest-" + Date.now(),
          user_id: "guest",
          category_id: category.id,
          category_title: localizedContent.categoryTitle,
          category_title_en: category.titleEn || null,
          answers: answersArray as any,
          total_score: totalScore,
          max_score: maxScore,
          percentage,
          risk_level: riskLevel,
          language: locale,
          risk_factors: analysis.riskFactors,
          recommendations: analysis.recommendations,
          summary: analysis.summary,
          risk_factors_en: analysis.riskFactorsEn,
          recommendations_en: analysis.recommendationsEn,
          summary_en: analysis.summaryEn,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setAssessmentResult(guestResult)
        setIsCompleted(true)
        return
      }

      // For logged-in users, save to database
      if (!user) {
        throw new Error("User not authenticated")
      }

      const saveResponse = await fetch("/api/assessment/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          categoryId: category.id,
          categoryTitle: localizedContent.categoryTitle,
          categoryTitleEn: category.titleEn,
          answers: answersArray,
          totalScore,
          maxScore,
          percentage,
          riskLevel,
          language: locale,

          // Thai language results
          riskFactors: analysis.riskFactors,
          recommendations: analysis.recommendations,
          summary: analysis.summary,

          // English language results
          riskFactorsEn: analysis.riskFactorsEn,
          recommendationsEn: analysis.recommendationsEn,
          summaryEn: analysis.summaryEn,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save assessment")
      }

      const saveData = await saveResponse.json()

      if (!saveData.success) {
        throw new Error(saveData.error || "Save failed")
      }

      setAssessmentResult(saveData.data)
      setIsCompleted(true)

      toast.success(localizedContent.completedLabel)
    } catch (error) {
      console.error("Assessment submission error:", error)
      toast.error(
        error instanceof Error && error.message.includes("analyze")
          ? localizedContent.analysisErrorLabel
          : localizedContent.submissionErrorLabel,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted && assessmentResult) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">{localizedContent.completedLabel}</h2>
                <p className="text-sm text-green-600">
                  {locale === "en"
                    ? "Your health assessment has been completed and analyzed."
                    : "การประเมินสุขภาพของคุณเสร็จสิ้นและได้รับการวิเคราะห์แล้ว"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <AssessmentResults assessment={assessmentResult} />

        <div className="flex justify-center">
          <Button onClick={() => router.push(isGuest ? "/" : "/dashboard")} className="min-w-[200px]">
            {isGuest ? localizedContent.backToHomeLabel : localizedContent.backToDashboardLabel}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{localizedContent.categoryTitle}</CardTitle>
          <p className="text-muted-foreground">{localizedContent.categoryDescription}</p>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {localizedContent.questionLabel} {currentQuestionIndex + 1} {localizedContent.ofLabel}{" "}
                {category.questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <QuestionCard question={currentQuestion} answer={answers[currentQuestion.id]} onAnswer={handleAnswer} />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {localizedContent.previousLabel}
        </Button>

        {currentQuestionIndex === category.questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {localizedContent.analyzingLabel}
              </>
            ) : (
              localizedContent.submitLabel
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()}>
            {localizedContent.nextLabel}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
