"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { getBilingualText } from "@/utils/risk-level"
import type { AssessmentQuestion, AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useGuestAuth } from "@/hooks/use-guest-auth"

interface AssessmentFormProps {
  category: string
  questions: AssessmentQuestion[]
  isGuest?: boolean
  onAssessmentComplete?: (result: AssessmentResult) => void
}

export function AssessmentForm({ category, questions, isGuest = false, onAssessmentComplete }: AssessmentFormProps) {
  const router = useRouter()
  const { t } = useTranslation(["common", "assessment"])
  const { locale } = useLanguage()
  const { guestUser } = useGuestAuth()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({})
  const [otherInput, setOtherInput] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (currentQuestion) {
      const currentAnswer = answers[currentQuestion.id]
      if (currentAnswer && currentAnswer.type === "other" && currentAnswer.value) {
        setOtherInput(currentAnswer.value)
      } else {
        setOtherInput("")
      }
    }
  }, [currentQuestion, answers])

  const handleAnswerChange = useCallback((questionId: string, answer: AssessmentAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
    if (answer.type !== "other") {
      setOtherInput("")
    }
  }, [])

  const handleOtherInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setOtherInput(e.target.value)
      if (currentQuestion) {
        handleAnswerChange(currentQuestion.id, {
          id: "other",
          type: "other",
          value: e.target.value,
        })
      }
    },
    [currentQuestion, handleAnswerChange],
  )

  const handleNext = useCallback(() => {
    if (!currentQuestion) return

    const currentAnswer = answers[currentQuestion.id]
    if (!currentAnswer || (currentAnswer.type === "other" && !currentAnswer.value)) {
      setError(t("assessment.please_select_answer"))
      return
    }

    setError(null)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }, [currentQuestion, currentQuestionIndex, questions.length, answers, t])

  const handlePrevious = useCallback(() => {
    setError(null)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }, [currentQuestionIndex])

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion) return

    const currentAnswer = answers[currentQuestion.id]
    if (!currentAnswer || (currentAnswer.type === "other" && !currentAnswer.value)) {
      setError(t("assessment.please_select_answer"))
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      if (isGuest) {
        if (!guestUser) {
          router.push("/guest-login")
          return
        }
        const result = GuestAssessmentService.submitGuestAssessment(guestUser.id, category, Object.values(answers))
        if (onAssessmentComplete) {
          onAssessmentComplete(result)
        }
        router.push(`/guest-assessment/results?category=${category}`)
      } else {
        // TODO: Implement authenticated assessment submission
        console.log("Authenticated assessment submission not yet implemented.")
        // Simulate success for now
        const simulatedResult: AssessmentResult = {
          id: "simulated-id",
          userId: "simulated-user",
          category: category,
          completedAt: new Date().toISOString(),
          answers: Object.values(answers),
          score: 85, // Example score
          riskLevel: "low", // Example risk level
          aiAnalysis: {
            summary: "This is a simulated AI summary for your assessment.",
            recommendations: ["Simulated recommendation 1", "Simulated recommendation 2"],
          },
        }
        if (onAssessmentComplete) {
          onAssessmentComplete(simulatedResult)
        }
        router.push(`/assessment/${category}/results`)
      }
    } catch (err) {
      console.error("Assessment submission failed:", err)
      setError(t("assessment.assessment_failed"))
    } finally {
      setIsSubmitting(false)
    }
  }, [currentQuestion, answers, isGuest, guestUser, category, onAssessmentComplete, router, t])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">{t("common.loading")}...</span>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-red-500">
        {t("assessment.error_loading_answers")}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {getBilingualText(currentQuestion.question, locale)}
          </CardTitle>
          <div className="text-center text-sm text-gray-500">
            {t("assessment.question")} {currentQuestionIndex + 1} {t("assessment.of")} {questions.length}
          </div>
          <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={answers[currentQuestion.id]?.id || ""}
            onValueChange={(value) => {
              const selectedAnswer = currentQuestion.answers.find((ans) => ans.id === value)
              if (selectedAnswer) {
                handleAnswerChange(currentQuestion.id, selectedAnswer)
              } else if (value === "other") {
                handleAnswerChange(currentQuestion.id, { id: "other", type: "other", value: otherInput })
              }
            }}
          >
            {currentQuestion.answers.map((answer) => (
              <div key={answer.id} className="flex items-center space-x-2">
                <RadioGroupItem value={answer.id} id={`answer-${answer.id}`} />
                <Label htmlFor={`answer-${answer.id}`} className="text-base cursor-pointer">
                  {getBilingualText(answer.text, locale)}
                </Label>
              </div>
            ))}
            {currentQuestion.hasOtherOption && (
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="answer-other" />
                  <Label htmlFor="answer-other" className="text-base cursor-pointer">
                    {t("assessment.other_specify")}
                  </Label>
                </div>
                {(answers[currentQuestion.id]?.id === "other" || otherInput) && (
                  <Input
                    type="text"
                    value={otherInput}
                    onChange={handleOtherInputChange}
                    placeholder={t("assessment.other_specify")}
                    className="ml-7 mt-2"
                  />
                )}
              </div>
            )}
          </RadioGroup>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.previous")}
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.submitting")}
                </>
              ) : (
                t("assessment.submit_assessment")
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {t("common.next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
