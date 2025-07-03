"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Loader2 } from "lucide-react"
import { QuestionCard } from "./question-card"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentAnswer } from "@/types/assessment"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

interface AssessmentFormProps {
  categoryId: string
}

export function AssessmentForm({ categoryId }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { locale } = useLanguage()
  const { t } = useTranslation()
  const supabase = createClientComponentClient<Database>()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get assessment categories based on current language
  const assessmentCategories = getAssessmentCategories(locale)
  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  if (!category) {
    return <div>{t("assessment.error_loading_answers")}</div>
  }

  const currentQuestion = category.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / category.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === category.questions.length - 1

  const handleAnswer = (
    questionId: string,
    answer: string | number | string[] | null,
    score: number,
    isValid: boolean,
  ) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.filter((a) => a.questionId !== questionId)
      newAnswers.push({ questionId, answer, score, isValid })
      return newAnswers
    })
  }

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion.id)
  }

  const canProceed = () => {
    const answerEntry = getCurrentAnswer()
    if (currentQuestion.required) {
      const hasAnswer = answerEntry?.answer !== null && answerEntry?.answer !== undefined
      const isAnswerNotEmpty =
        hasAnswer &&
        (Array.isArray(answerEntry.answer) ? answerEntry.answer.length > 0 : String(answerEntry.answer).trim() !== "")

      return answerEntry?.isValid === true && isAnswerNotEmpty
    }
    return true
  }

  const handleNext = async () => {
    const currentAnswerForSubmission = getCurrentAnswer()
    let finalAnswersToSave: AssessmentAnswer[] = []

    if (currentAnswerForSubmission) {
      finalAnswersToSave = answers.filter((a) => a.questionId !== currentQuestion.id)
      finalAnswersToSave.push(currentAnswerForSubmission)
    } else {
      finalAnswersToSave = [...answers]
    }

    if (isLastQuestion) {
      if (!user?.id) {
        alert(t("assessment.not_logged_in"))
        return
      }

      setIsSubmitting(true)
      console.log("🚀 AssessmentForm: เริ่มบันทึกแบบประเมิน...")

      try {
        // Calculate total score
        const totalScore = finalAnswersToSave.reduce((sum, answer) => sum + answer.score, 0)
        const maxScore = category.questions.length * 5 // Assuming max score per question is 5

        // Prepare answers for API
        const formattedAnswers = finalAnswersToSave.map((answer) => {
          const question = category.questions.find((q) => q.id === answer.questionId)
          return {
            questionId: answer.questionId,
            question: question?.question || "Unknown question",
            value: answer.answer,
            score: answer.score,
          }
        })

        console.log("🤖 AssessmentForm: กำลังวิเคราะห์ด้วย AI...")
        console.log("📊 Assessment data:", {
          categoryId,
          totalScore,
          maxScore,
          answersCount: formattedAnswers.length,
        })

        // Call the new service method
        const { data: savedData, error: saveError } = await AssessmentService.analyzeAndSaveAssessment(supabase, {
          userId: user.id,
          categoryId,
          answers: formattedAnswers,
          totalScore,
          maxScore,
        })

        if (saveError) {
          throw new Error(saveError)
        }

        console.log("✅ AssessmentForm: บันทึกแบบประเมินสำเร็จ รหัส:", savedData.id)

        if (categoryId === "basic") {
          console.log("🏠 AssessmentForm: แบบประเมิน basic เสร็จสิ้น กลับหน้าหลักพร้อมเปิด popup ข้อมูลส่วนตัว")
          router.push(`/?openHealthOverview=basic&assessmentId=${savedData.id}`)
        } else {
          console.log("📊 AssessmentForm: ไปหน้าผลลัพธ์")
          router.push(`/assessment/${categoryId}/results?id=${savedData.id}`)
        }
      } catch (error) {
        console.error("❌ AssessmentForm: การบันทึกล้มเหลว:", error)
        alert(t("assessment.save_failed").replace("{{message}}", String(error)))
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const getSubmitButtonText = () => {
    if (categoryId === "basic") {
      return {
        full: locale === "en" ? "Save Data and View Overview" : "บันทึกข้อมูลและดูภาพรวม",
        short: locale === "en" ? "Save" : "บันทึก",
      }
    } else {
      return {
        full: t("common.view_results"),
        short: locale === "en" ? "View Results" : "ดูผล",
      }
    }
  }

  const submitButtonText = getSubmitButtonText()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80 dark:border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 dark:text-foreground">{category.title}</CardTitle>
                  <p className="text-gray-600 dark:text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {category.required && <Badge className="bg-red-500 text-white">{t("common.required")}</Badge>}
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {category.estimatedTime} {t("common.estimated_time")}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-card/80 dark:border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {locale === "en"
                  ? `Question ${currentQuestionIndex + 1} of ${category.questions.length}`
                  : `คำถามที่ ${currentQuestionIndex + 1} จาก ${category.questions.length}`}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}% {locale === "en" ? "Complete" : "เสร็จสิ้น"}
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
          </CardContent>
        </Card>

        {/* Question */}
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          answer={getCurrentAnswer()}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-card/80 dark:border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-transparent"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("common.previous")}</span>
                <span className="sm:hidden">{locale === "en" ? "Prev" : "ก่อน"}</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">{locale === "en" ? "Saving..." : "กำลังบันทึก..."}</span>
                    <span className="sm:hidden">{locale === "en" ? "Saving..." : "บันทึก..."}</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <span className="hidden sm:inline">{submitButtonText.full}</span>
                    <span className="sm:hidden">{submitButtonText.short}</span>
                    <CheckCircle className="ml-1 sm:ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t("common.next")}</span>
                    <span className="sm:hidden">{t("common.next")}</span>
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
