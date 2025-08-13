"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Brain, AlertTriangle } from "lucide-react"
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

interface PHQAssessmentFormProps {
  categoryId: string
}

export function PHQAssessmentForm({ categoryId }: PHQAssessmentFormProps) {
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
  const [phqPhase, setPhqPhase] = useState<"phq2" | "phq9">("phq2")
  const [phq2Score, setPhq2Score] = useState(0)
  const [showPhq9, setShowPhq9] = useState(false)

  const assessmentCategories = getAssessmentCategories(locale)
  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  const userId = isGuestLoggedIn ? guestUser?.id : user?.id

  // Filter questions based on current phase
  const getQuestionsForPhase = () => {
    if (!category) return []

    if (phqPhase === "phq2") {
      // Only PHQ-2 questions (first 2 questions)
      return category.questions.filter((q) => q.id === "phq-1" || q.id === "phq-2")
    } else {
      // All PHQ-9 questions (all 9 questions)
      return category.questions
    }
  }

  const currentQuestions = getQuestionsForPhase()
  const currentQuestion = currentQuestions[currentQuestionIndex]
  const totalQuestions = currentQuestions.length

  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsLastQuestion(currentQuestionIndex === totalQuestions - 1)
    setProgress(((currentQuestionIndex + 1) / totalQuestions) * 100)
  }, [currentQuestionIndex, totalQuestions])

  useEffect(() => {
    if (userId) {
      const storedAnswers = sessionStorage.getItem(`assessment_answers_${userId}_${category?.id}`)
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers))
      }
      const storedIndex = sessionStorage.getItem(`assessment_index_${userId}_${category?.id}`)
      if (storedIndex) {
        setCurrentQuestionIndex(Number.parseInt(storedIndex, 10))
      }
      const storedPhase = sessionStorage.getItem(`assessment_phase_${userId}_${category?.id}`)
      if (storedPhase) {
        setPhqPhase(storedPhase as "phq2" | "phq9")
      }
      const storedShowPhq9 = sessionStorage.getItem(`assessment_show_phq9_${userId}_${category?.id}`)
      if (storedShowPhq9) {
        setShowPhq9(JSON.parse(storedShowPhq9))
      }
    }
  }, [userId, category?.id])

  useEffect(() => {
    if (userId && category?.id) {
      sessionStorage.setItem(`assessment_answers_${userId}_${category.id}`, JSON.stringify(answers))
      sessionStorage.setItem(`assessment_index_${userId}_${category.id}`, currentQuestionIndex.toString())
      sessionStorage.setItem(`assessment_phase_${userId}_${category.id}`, phqPhase)
      sessionStorage.setItem(`assessment_show_phq9_${userId}_${category.id}`, JSON.stringify(showPhq9))
    }
  }, [answers, currentQuestionIndex, phqPhase, showPhq9, userId, category?.id])

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
    }
    return true
  }

  const isCurrentQuestionAnswered = (): boolean => {
    const currentAnswer = getCurrentAnswer()
    if (!currentQuestion) return false

    if (currentQuestion.required) {
      if (
        !currentAnswer ||
        currentAnswer.answer === null ||
        currentAnswer.answer === undefined ||
        (typeof currentAnswer.answer === "string" && currentAnswer.answer.trim() === "") ||
        (Array.isArray(currentAnswer.answer) && currentAnswer.answer.length === 0)
      ) {
        return false
      }
    }

    return true
  }

  const calculatePhq2Score = () => {
    const phq1Answer = answers.find((a) => a.questionId === "phq-1")
    const phq2Answer = answers.find((a) => a.questionId === "phq-2")

    const score1 = phq1Answer ? Number(phq1Answer.answer) : 0
    const score2 = phq2Answer ? Number(phq2Answer.answer) : 0

    return score1 + score2
  }

  const handleNext = async () => {
    if (!validateCurrentQuestion()) {
      return
    }

    // Check if we're at the end of PHQ-2 phase
    if (phqPhase === "phq2" && currentQuestionIndex === 1) {
      // End of PHQ-2, check score
      const score = calculatePhq2Score()
      setPhq2Score(score)

      console.log("PHQ-2 Score:", score)

      if (score >= 3) {
        // Score indicates potential depression, continue to PHQ-9
        console.log("PHQ-2 score >= 3, proceeding to PHQ-9")
        setPhqPhase("phq9")
        setCurrentQuestionIndex(0) // Reset to start of PHQ-9
        setShowPhq9(true)
        toast({
          title: locale === "th" ? "ต้องการประเมินเพิ่มเติม" : "Additional Assessment Required",
          description:
            locale === "th"
              ? "คะแนนของคุณบ่งชี้ว่าอาจมีปัญหาสุขภาพจิต กรุณาทำแบบประเมิน PHQ-9 เพิ่มเติม"
              : "Your score indicates potential mental health concerns. Please complete the PHQ-9 assessment.",
        })
        return
      } else {
        // Score is low, proceed to results with PHQ-2 only
        console.log("PHQ-2 score < 3, proceeding to results")
        await handleSubmit()
        return
      }
    }

    // Normal progression through questions
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // End of current phase, submit
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) {
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
      console.log("🤖 PHQAssessmentForm: กำลังวิเคราะห์ด้วย AI...")

      const enrichedAnswers = answers.map((answer) => {
        const question = category.questions.find((q) => q.id === answer.questionId)
        return {
          questionId: answer.questionId,
          question: question?.question || "ไม่ระบุคำถาม",
          answer: answer.answer,
        }
      })

      const { data: aiAnalysis, error: aiError } = await AssessmentService.analyzeWithAI(category.id, enrichedAnswers)
      if (aiError) {
        throw new Error(aiError.message || "AI analysis failed.")
      }
      aiAnalysisResult = aiAnalysis
      console.log("✅ PHQAssessmentForm: การวิเคราะห์ AI เสร็จสิ้น")

      if (isGuestLoggedIn) {
        console.log("👤 PHQAssessmentForm: บันทึกแบบประเมินสำหรับ Guest User...")

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
        console.log("✅ PHQAssessmentForm: บันทึกแบบประเมิน Guest สำเร็จ")

        // Clear session storage
        sessionStorage.removeItem(`assessment_answers_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_index_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_phase_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_show_phq9_${userId}_${category.id}`)

        console.log("📊 PHQAssessmentForm: ไปหน้าผลลัพธ์")
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

        console.log("💾 PHQAssessmentForm: กำลังบันทึกลง Supabase...")
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

        console.log("✅ PHQAssessmentForm: บันทึกแบบประเมินสำเร็จ รหัส:", savedData.id)

        // Clear session storage
        sessionStorage.removeItem(`assessment_answers_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_index_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_phase_${userId}_${category.id}`)
        sessionStorage.removeItem(`assessment_show_phq9_${userId}_${category.id}`)

        console.log("📊 PHQAssessmentForm: ไปหน้าผลลัพธ์")
        router.push(`/assessment/${categoryId}/results?id=${savedData.id}`)
      }
    } catch (error) {
      console.error("❌ PHQAssessmentForm: การบันทึกล้มเหลว:", error)
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
    } else if (phqPhase === "phq9" && showPhq9) {
      // Go back to PHQ-2 phase
      setPhqPhase("phq2")
      setCurrentQuestionIndex(1) // Last question of PHQ-2
      setShowPhq9(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const getPhaseTitle = () => {
    if (phqPhase === "phq2") {
      return locale === "th" ? "PHQ-2 (คัดกรองเบื้องต้น)" : "PHQ-2 (Initial Screening)"
    } else {
      return locale === "th" ? "PHQ-9 (ประเมินเชิงลึก)" : "PHQ-9 (Detailed Assessment)"
    }
  }

  const getPhaseDescription = () => {
    if (phqPhase === "phq2") {
      return locale === "th"
        ? "แบบประเมินคัดกรองภาวะซึมเศร้าเบื้องต้น 2 คำถาม"
        : "Initial 2-question depression screening assessment"
    } else {
      return locale === "th" ? "แบบประเมินภาวะซึมเศร้าแบบละเอียด 9 คำถาม" : "Comprehensive 9-question depression assessment"
    }
  }

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
            <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
                          {getPhaseTitle()}
                          {isGuestLoggedIn && (
                            <Badge className="bg-purple-500/20 text-purple-100 border-purple-300/30 text-xs sm:text-sm">
                              {locale === "th" ? "ทดลองใช้งาน" : "Guest Mode"}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-purple-100 text-sm sm:text-base leading-relaxed">{getPhaseDescription()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30 text-xs sm:text-sm">
                      {t("card_assessment_required")}
                    </Badge>
                    {phqPhase === "phq9" && (
                      <Badge className="bg-red-500/20 text-red-100 border-red-300/30 text-xs sm:text-sm flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {locale === "th" ? "ประเมินเพิ่มเติม" : "Extended Assessment"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <Brain className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-2xl dark:bg-gray-900/95 dark:border-gray-800/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                    {locale === "en"
                      ? `Question ${currentQuestionIndex + 1} of ${totalQuestions}`
                      : `คำถามที่ ${currentQuestionIndex + 1} จาก ${totalQuestions}`}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {phqPhase === "phq2"
                      ? locale === "th"
                        ? "คัดกรองเบื้องต้น"
                        : "Initial Screening"
                      : locale === "th"
                        ? "ประเมินเชิงลึก"
                        : "Detailed Assessment"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  {Math.round(progress)}% {locale === "en" ? "Complete" : "เสร็จสิ้น"}
                </span>
                <div className="w-12 sm:w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out"
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
                disabled={(currentQuestionIndex === 0 && phqPhase === "phq2") || isSubmitting}
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
                            ? "bg-purple-500 scale-125"
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={isSubmitting || isAnalyzing || !isCurrentQuestionAnswered()}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isGuestLoggedIn
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500`}
              >
                {isSubmitting || isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">{t("common.processing")}</span>
                    <span className="sm:hidden">{t("common.processing_short")}</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <span className="hidden sm:inline">{t("common.view_results")}</span>
                    <span className="sm:hidden">{locale === "en" ? "View Results" : "ดูผล"}</span>
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
                {phqPhase === "phq2"
                  ? locale === "th"
                    ? `เหลืออีก ${totalQuestions - currentQuestionIndex - 1} คำถาม (คัดกรองเบื้องต้น)`
                    : `${totalQuestions - currentQuestionIndex - 1} questions remaining (Initial Screening)`
                  : locale === "th"
                    ? `เหลืออีก ${totalQuestions - currentQuestionIndex - 1} คำถาม (ประเมินเชิงลึก)`
                    : `${totalQuestions - currentQuestionIndex - 1} questions remaining (Detailed Assessment)`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
