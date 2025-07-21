"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, FileCheck } from "lucide-react"
import { QuestionCard } from "./question-card"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentAnswer, AssessmentResult, AssessmentCategory, AIAnalysisResult } from "@/types/assessment"
import { createClientComponentClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AssessmentFormProps {
  categoryId: string
}

export function AssessmentForm({ categoryId }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { guestUser, isGuestLoggedIn } = useGuestAuth()
  const { locale } = useLanguage()
  const { t } = useTranslation()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const assessmentCategories = getAssessmentCategories(locale)
  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  const userId = isGuestLoggedIn ? guestUser?.id : user?.id

  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const [progress, setProgress] = useState(0)

  const currentQuestion = category?.questions[currentQuestionIndex]
  const totalQuestions = category?.questions.length || 0

  useEffect(() => {
    setIsLastQuestion(currentQuestionIndex === totalQuestions - 1)
    setProgress(((currentQuestionIndex + 1) / totalQuestions) * 100)
  }, [currentQuestionIndex, totalQuestions])

  useEffect(() => {
    if (userId) {
      const storedAnswers = sessionStorage.getItem(`assessment_answers_${userId}_${category.id}`)
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers))
      }
      const storedIndex = sessionStorage.getItem(`assessment_index_${userId}_${category.id}`)
      if (storedIndex) {
        setCurrentQuestionIndex(Number.parseInt(storedIndex, 10))
      }
    }
  }, [userId, category.id])

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem(`assessment_answers_${userId}_${category.id}`, JSON.stringify(answers))
      sessionStorage.setItem(`assessment_index_${userId}_${category.id}`, currentQuestionIndex.toString())
    }
  }, [answers, currentQuestionIndex, userId, category.id])

  if (!category) {
    return <div>{t("assessment.error_loading_answers")}</div>
  }

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
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[questionId]
      return newErrors
    })
  }

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion?.id)
  }

  const validateCurrentQuestion = (): boolean => {
    const currentAnswer = getCurrentAnswer()
    if (currentQuestion?.required) {
      if (
        !currentAnswer ||
        currentAnswer.answer === null ||
        currentAnswer.answer === undefined ||
        (typeof currentAnswer.answer === "string" && currentAnswer.answer.trim() === "") ||
        (Array.isArray(currentAnswer.answer) && currentAnswer.answer.length === 0)
      ) {
        setFormErrors((prev) => ({ ...prev, [currentQuestion.id]: t("common.field_required") }))
        toast({
          title: t("common.error"),
          description: t("assessment.please_answer_current_question"),
          variant: "destructive",
        })
        return false
      }
      if (currentQuestion.type === "number") {
        const numAnswer = Number(currentAnswer.answer)
        if (isNaN(numAnswer)) {
          setFormErrors((prev) => ({ ...prev, [currentQuestion.id]: t("common.enter_valid_number") }))
          toast({
            title: t("common.error"),
            description: t("common.enter_valid_number"),
            variant: "destructive",
          })
          return false
        }
        if (currentQuestion.min !== undefined && numAnswer < currentQuestion.min) {
          setFormErrors((prev) => ({
            ...prev,
            [currentQuestion.id]: t("common.value_at_least", { min: currentQuestion.min }),
          }))
          toast({
            title: t("common.error"),
            description: t("common.value_at_least", { min: currentQuestion.min }),
            variant: "destructive",
          })
          return false
        }
        if (currentQuestion.max !== undefined && numAnswer > currentQuestion.max) {
          setFormErrors((prev) => ({
            ...prev,
            [currentQuestion.id]: t("common.value_at_most", { max: currentQuestion.max }),
          }))
          toast({
            title: t("common.error"),
            description: t("common.value_at_most", { max: currentQuestion.max }),
            variant: "destructive",
          })
          return false
        }
      }
      if (currentQuestion.type === "multi-choice" && Array.isArray(currentAnswer.answer)) {
        const otherOption = currentQuestion.options?.find((opt) => opt.value === "อื่นๆ" || opt.value === "Other")
        if (otherOption && currentAnswer.answer.includes(otherOption.value) && currentAnswer.answer.length === 1) {
          setFormErrors((prev) => ({ ...prev, [currentQuestion.id]: t("common.select_more_or_provide_details") }))
          toast({
            title: t("common.error"),
            description: t("common.select_more_or_provide_details"),
            variant: "destructive",
          })
          return false
        }
      }
    }
    return true
  }

  const handleNext = async () => {
    if (!validateCurrentQuestion()) {
      return
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) {
      return
    }

    const allAnswersValid = category.questions.every((q) => {
      const answer = answers.find((a) => a.questionId === q.id)
      return answer && (typeof answer.answer !== "string" || answer.answer.trim() !== "")
    })

    if (!allAnswersValid) {
      toast({
        title: t("common.error"),
        description: t("assessment.please_answer_all_questions"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setIsAnalyzing(true)

    if (!userId) {
      toast({
        title: t("common.error"),
        description: t("assessment.not_authenticated_login_guest"),
        variant: "destructive",
      })
      setIsSubmitting(false)
      setIsAnalyzing(false)
      return
    }

    let aiAnalysisResult: AIAnalysisResult | null = null

    try {
      console.log("🤖 AssessmentForm: กำลังวิเคราะห์ด้วย AI...")

      const enrichedAnswers = answers.map((answer) => {
        const question = category.questions.find((q) => q.id === answer.questionId)
        return {
          questionId: answer.questionId,
          question: question?.question || "ไม่ระบุคำถาม",
          answer: answer.answer,
          // Remove score from here since AI will calculate it
        }
      })

      const { data: aiAnalysis, error: aiError } = await AssessmentService.analyzeWithAI(category.id, enrichedAnswers)
      if (aiError) {
        throw new Error(aiError.message || "AI analysis failed.")
      }
      aiAnalysisResult = aiAnalysis
      console.log("✅ AssessmentForm: การวิเคราะห์ AI เสร็จสิ้น")

      if (isGuestLoggedIn) {
        console.log("👤 AssessmentForm: บันทึกแบบประเมินสำหรับ Guest User...")

        const guestResult: AssessmentResult = {
          id: `guest_${categoryId}_${Date.now()}`,
          category: categoryId as AssessmentCategory,
          score: aiAnalysisResult.score,
          percentage: aiAnalysisResult.score,
          riskLevel: aiAnalysisResult.riskLevel,
          completedAt: new Date().toISOString(),
          answers: answers,
          aiAnalysis: aiAnalysisResult,
          riskFactors: aiAnalysisResult.riskFactors[locale === "th" ? "th" : "en"],
          recommendations: aiAnalysisResult.recommendations[locale === "th" ? "th" : "en"],
          summary: aiAnalysisResult.summary[locale === "th" ? "th" : "en"],
        }

        GuestAssessmentService.saveAssessment(categoryId as AssessmentCategory, guestResult)
        console.log("✅ AssessmentForm: บันทึกแบบประเมิน Guest สำเร็จ")

        sessionStorage.removeItem(`assessment_answers_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_index_${userId}_${category.id}`)

        console.log("📊 AssessmentForm: ไปหน้าผลลัพธ์")
        router.push(`/guest-assessment/results?category=${categoryId}&id=${guestResult.id}`)
      } else {
        if (!user?.id) {
          toast({
            title: t("common.error"),
            description: t("assessment.not_logged_in"),
            variant: "destructive",
          })
          return
        }

        console.log("💾 AssessmentForm: กำลังบันทึกลง Supabase...")
        const { data: savedData, error: saveError } = await AssessmentService.saveAssessment(
          supabase,
          user.id,
          categoryId,
          category.title,
          answers,
          aiAnalysisResult,
        )

        if (saveError) {
          throw new Error(saveError)
        }

        console.log("✅ AssessmentForm: บันทึกแบบประเมินสำเร็จ รหัส:", savedData.id)

        sessionStorage.removeItem(`assessment_answers_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_index_${userId}_${category.id}`)

        console.log("📊 AssessmentForm: ไปหน้าผลลัพธ์")
        router.push(`/assessment/${categoryId}/results?id=${savedData.id}`)
      }
    } catch (error) {
      console.error("❌ AssessmentForm: การบันทึกล้มเหลว:", error)
      toast({
        title: t("common.error"),
        description: (error as Error).message || t("assessment.save_failed_generic"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsAnalyzing(false)
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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 sm:mb-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("assessment_back")}
          </Button>

          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden dark:bg-gray-900/95 dark:border-gray-800/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
                          {category.title}
                          {isGuestLoggedIn && (
                            <Badge className="bg-purple-500/20 text-purple-100 border-purple-300/30 text-xs sm:text-sm">
                              {locale === "th" ? "ทดลองใช้งาน" : "Guest Mode"}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-blue-100 text-sm sm:text-base leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    {category.required && (
                      <Badge className="bg-red-500/20 text-red-100 border-red-300/30 text-xs sm:text-sm">
                        {t("card_assessment_required")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <FileCheck className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-2xl dark:bg-gray-900/95 dark:border-gray-800/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                    {locale === "en"
                      ? `Question ${currentQuestionIndex + 1} of ${totalQuestions}`
                      : `คำถามที่ ${currentQuestionIndex + 1} จาก ${totalQuestions}`}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {locale === "th" ? "กรุณาตอบคำถามให้ครบถ้วน" : "Please answer all questions completely"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {Math.round(progress)}% {locale === "en" ? "Complete" : "เสร็จสิ้น"}
                </span>
                <div className="w-12 sm:w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 sm:mb-8">
          <QuestionCard
            key={currentQuestion?.id}
            question={currentQuestion}
            answer={getCurrentAnswer()}
            onAnswer={handleAnswer}
            error={formErrors[currentQuestion?.id]}
          />
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-2xl dark:bg-gray-900/95 dark:border-gray-800/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-3 text-sm sm:text-base bg-white/80 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:border-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("card_assessment_previous")}</span>
                <span className="sm:hidden">{locale === "en" ? "Previous" : "ก่อนหน้า"}</span>
              </Button>

              <div className="flex-1 sm:flex-none flex justify-center">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i < currentQuestionIndex
                          ? "bg-green-500"
                          : i === currentQuestionIndex
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={isSubmitting || isAnalyzing}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isGuestLoggedIn
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting || isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">{t("common.processing")}</span>
                    <span className="sm:hidden">{t("common.processing_short")}</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <span className="hidden sm:inline">{submitButtonText.full}</span>
                    <span className="sm:hidden">{submitButtonText.short}</span>
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t("card_assessment_next")}</span>
                    <span className="sm:hidden">{locale === "en" ? "Next" : "ถัดไป"}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {locale === "th"
                  ? `เหลืออีก ${totalQuestions - currentQuestionIndex - 1} คำถาม`
                  : `${totalQuestions - currentQuestionIndex - 1} questions remaining`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
