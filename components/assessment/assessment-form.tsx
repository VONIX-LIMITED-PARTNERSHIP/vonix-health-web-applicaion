"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Loader2, Shield, Award, FileCheck } from "lucide-react"
import { QuestionCard } from "./question-card"
import { getAssessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import type { AssessmentAnswer, AssessmentResult, AssessmentCategory, RiskLevel } from "@/types/assessment"
import { createClientComponentClient } from "@/lib/supabase"

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
      setIsSubmitting(true)
      console.log("🚀 AssessmentForm: เริ่มบันทึกแบบประเมิน...")

      try {
        if (isGuestLoggedIn) {
          // Handle guest assessment
          console.log("👤 AssessmentForm: บันทึกแบบประเมินสำหรับ Guest User...")

          let aiAnalysis = null
          let riskFactors: string[] = []
          let recommendations: string[] = []

          if (categoryId !== "basic") {
            console.log("🤖 AssessmentForm: กำลังวิเคราะห์ด้วย AI สำหรับ Guest...")
            const { data: aiData, error: aiError } = await AssessmentService.analyzeWithAI(
              categoryId,
              finalAnswersToSave,
            )
            if (aiError) {
              console.error("❌ AssessmentForm: การวิเคราะห์ AI ล้มเหลว:", aiError)
              // Fallback to basic calculation
              if (finalAnswersToSave.reduce((sum, answer) => sum + (answer.score || 0), 0) >= 60) {
                recommendations.push(locale === "th" ? "ควรปรึกษาแพทย์" : "Should consult a doctor")
              }
            } else {
              aiAnalysis = aiData
              console.log("✅ AssessmentForm: การวิเคราะห์ AI เสร็จสิ้น")

              // Use AI analysis results
              if (aiAnalysis.riskFactors) {
                riskFactors = locale === "th" ? aiAnalysis.riskFactors.th : aiAnalysis.riskFactors.en
              }
              if (aiAnalysis.recommendations) {
                recommendations = locale === "th" ? aiAnalysis.recommendations.th : aiAnalysis.recommendations.en
              }
            }
          } else {
            // Basic assessment recommendations
            if (finalAnswersToSave.reduce((sum, answer) => sum + (answer.score || 0), 0) >= 60) {
              recommendations.push(locale === "th" ? "ควรปรึกษาแพทย์" : "Should consult a doctor")
            }
          }

          // Calculate basic scoring
          const totalScore = finalAnswersToSave.reduce((sum, answer) => sum + (answer.score || 0), 0)
          const maxScore = category.questions.length * 5 // Assuming max score per question is 5
          const percentage = Math.round((totalScore / maxScore) * 100)

          // Use AI analysis score if available, otherwise use calculated percentage
          const finalScore = aiAnalysis ? aiAnalysis.score : percentage
          const finalRiskLevel: RiskLevel = aiAnalysis
            ? aiAnalysis.riskLevel
            : percentage >= 80
              ? "very-high"
              : percentage >= 60
                ? "high"
                : percentage >= 40
                  ? "medium"
                  : "low"

          const guestResult: AssessmentResult = {
            id: `guest_${categoryId}_${Date.now()}`,
            category: categoryId as AssessmentCategory,
            score: finalScore,
            riskLevel: finalRiskLevel,
            completedAt: new Date().toISOString(),
            answers: finalAnswersToSave,
            aiAnalysis: aiAnalysis,
          }

          GuestAssessmentService.saveAssessment(categoryId as AssessmentCategory, guestResult)
          console.log("✅ AssessmentForm: บันทึกแบบประเมิน Guest สำเร็จ")

          if (categoryId === "basic") {
            console.log("🏠 AssessmentForm: แบบประเมิน basic เสร็จสิ้น กลับหน้าหลักพร้อมเปิด popup ข้อมูลส่วนตัว")
            router.push(`/?openHealthOverview=basic&assessmentId=${guestResult.id}`)
          } else {
            console.log("📊 AssessmentForm: ไปหน้าผลลัพธ์")
            router.push(`/guest-assessment/results?category=${categoryId}`)
          }
        } else {
          // Handle regular user assessment
          if (!user?.id) {
            alert(t("assessment.not_logged_in"))
            return
          }

          let aiAnalysis = null
          if (categoryId !== "basic") {
            console.log("🤖 AssessmentForm: กำลังวิเคราะห์ด้วย AI...")
            const { data: aiData, error: aiError } = await AssessmentService.analyzeWithAI(
              categoryId,
              finalAnswersToSave,
            )
            if (aiError) {
              console.error("❌ AssessmentForm: การวิเคราะห์ AI ล้มเหลว:", aiError)
            } else {
              aiAnalysis = aiData
              console.log("✅ AssessmentForm: การวิเคราะห์ AI เสร็จสิ้น")
            }
          }

          console.log("💾 AssessmentForm: กำลังบันทึกลง Supabase...")
          const { data: savedData, error: saveError } = await AssessmentService.saveAssessment(
            supabase,
            user.id,
            categoryId,
            category.title,
            finalAnswersToSave,
            aiAnalysis,
          )

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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Professional Header with Trust Indicators */}
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
              {/* Background Pattern */}
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

                    {/* Trust Indicators */}
                    
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

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <FileCheck className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Progress Section */}
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
                      ? `Question ${currentQuestionIndex + 1} of ${category.questions.length}`
                      : `คำถามที่ ${currentQuestionIndex + 1} จาก ${category.questions.length}`}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {locale === "th" ? "กรุณาตอบคำถามให้ครบถ้วน" : "Please answer all questions completely"}
                  </p>
                </div>
              </div>

            
            </div>

            <Progress value={progress} className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <div className="mb-6 sm:mb-8">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            answer={getCurrentAnswer()}
            onAnswer={handleAnswer}
          />
        </div>

        {/* Enhanced Navigation */}
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
                  {Array.from({ length: category.questions.length }, (_, i) => (
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
                disabled={!canProceed() || isSubmitting}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isGuestLoggedIn
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">{locale === "en" ? "Processing..." : "กำลังประมวลผล..."}</span>
                    <span className="sm:hidden">{locale === "en" ? "Processing..." : "ประมวลผล..."}</span>
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

            {/* Progress Indicator Text */}
            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {locale === "th"
                  ? `เหลืออีก ${category.questions.length - currentQuestionIndex - 1} คำถาม`
                  : `${category.questions.length - currentQuestionIndex - 1} questions remaining`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
