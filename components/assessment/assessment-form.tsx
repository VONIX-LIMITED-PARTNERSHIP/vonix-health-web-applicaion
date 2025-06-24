"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Loader2 } from "lucide-react"
import { QuestionCard } from "./question-card"
import { assessmentCategories } from "@/data/assessment-questions"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import type { AssessmentAnswer } from "@/types/assessment"

interface AssessmentFormProps {
  categoryId: string
}

export function AssessmentForm({ categoryId }: AssessmentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  if (!category) {
    return <div>ไม่พบแบบประเมินที่ระบุ</div>
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
      // บันทึกข้อมูลลง Supabase ทันที
      if (!user?.id) {
        alert("กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน")
        return
      }

      setIsSubmitting(true)
      console.log("🚀 AssessmentForm: Starting assessment submission...")

      try {
        // วิเคราะห์ด้วย AI หากไม่ใช่ basic category
        let aiAnalysis = null
        if (categoryId !== "basic") {
          console.log("🤖 AssessmentForm: Analyzing with AI...")
          const { data: aiData, error: aiError } = await AssessmentService.analyzeWithAI(categoryId, finalAnswersToSave)
          if (aiError) {
            console.error("❌ AssessmentForm: AI Analysis failed:", aiError)
          } else {
            aiAnalysis = aiData
            console.log("✅ AssessmentForm: AI Analysis completed")
          }
        }

        // บันทึกลง Supabase
        console.log("💾 AssessmentForm: Saving to Supabase...")
        const { data: savedData, error: saveError } = await AssessmentService.saveAssessment(
          user.id,
          categoryId,
          category.title,
          finalAnswersToSave,
          aiAnalysis,
        )

        if (saveError) {
          throw new Error(saveError)
        }

        console.log("✅ AssessmentForm: Assessment saved successfully with ID:", savedData.id)

        // ไปหน้าผลลัพธ์พร้อม assessmentId
        router.push(`/assessment/${categoryId}/results?id=${savedData.id}`)
      } catch (error) {
        console.error("❌ AssessmentForm: Submission failed:", error)
        alert("เกิดข้อผิดพลาดในการบันทึกแบบประเมิน กรุณาลองใหม่อีกครั้ง")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2 dark:text-gray-100">{category.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {category.required && <Badge className="bg-red-500 text-white">จำเป็น</Badge>}
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{category.estimatedTime} นาที</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                คำถามที่ {currentQuestionIndex + 1} จาก {category.questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}% เสร็จสิ้น
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
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">ก่อนหน้า</span>
                <span className="sm:hidden">ก่อน</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">กำลังบันทึก...</span>
                    <span className="sm:hidden">บันทึก...</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <span className="hidden sm:inline">ดูผลการประเมิน</span>
                    <span className="sm:hidden">ดูผล</span>
                    <CheckCircle className="ml-1 sm:ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">ถัดไป</span>
                    <span className="sm:hidden">ถัดไป</span>
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
