"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react"
import { QuestionCard } from "./question-card"
import { assessmentCategories, guestAssessmentCategory } from "@/data/assessment-questions"
import type { AssessmentAnswer } from "@/types/assessment"

interface AssessmentFormProps {
  categoryId: string
}

export function AssessmentForm({ categoryId }: AssessmentFormProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])

  const category = assessmentCategories.find((cat) => cat.id === categoryId)

  if (!category) {
    return <div>ไม่พบแบบประเมินที่ระบุ</div>
  }

  const currentQuestion = category.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / category.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === category.questions.length - 1

  // อัปเดต handleAnswer ให้รับ isValid ด้วย
  const handleAnswer = (
    questionId: string,
    answer: string | number | string[] | null,
    score: number,
    isValid: boolean,
  ) => {
    setAnswers((prevAnswers) => {
      const newAnswers = prevAnswers.filter((a) => a.questionId !== questionId)
      newAnswers.push({ questionId, answer, score, isValid })
      console.log(`AssessmentForm: Answer updated for ${questionId}:`, { answer, score, isValid }) // Debug log
      return newAnswers
    })
  }

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion.id)
  }

  // ปรับปรุง canProceed ให้ตรวจสอบ isValid และค่าของคำตอบอย่างละเอียด
  const canProceed = () => {
    const answerEntry = getCurrentAnswer()
    if (currentQuestion.required) {
      // ต้องมีคำตอบและคำตอบนั้นต้องถูกต้อง (isValid === true)
      // และต้องไม่เป็นค่าว่างเปล่า (null, undefined, empty string, empty array)
      const hasAnswer = answerEntry?.answer !== null && answerEntry?.answer !== undefined
      const isAnswerNotEmpty =
        hasAnswer &&
        (Array.isArray(answerEntry.answer) ? answerEntry.answer.length > 0 : String(answerEntry.answer).trim() !== "")

      console.log(`AssessmentForm: canProceed check for ${currentQuestion.id}:`, {
        answerEntry,
        hasAnswer,
        isAnswerNotEmpty,
        isValid: answerEntry?.isValid,
        result: answerEntry?.isValid === true && isAnswerNotEmpty,
      }) // Debug log

      return answerEntry?.isValid === true && isAnswerNotEmpty
    }
    // ถ้าคำถามไม่จำเป็นต้องตอบ สามารถไปต่อได้เสมอ
    return true
  }

  const handleNext = () => {
    // ตรวจสอบให้แน่ใจว่าคำตอบของคำถามปัจจุบันถูกรวมอยู่ใน `answers` ก่อนดำเนินการต่อ
    // แม้ว่า `handleAnswer` จะใช้ functional update แต่การเรียกใช้ `answers` โดยตรง
    // ใน `handleNext` อาจจะยังไม่เห็นการอัปเดตล่าสุดทันทีในบางกรณี
    // ดังนั้นเราจะสร้างอาร์เรย์คำตอบสุดท้ายที่แน่นอนที่สุด
    const currentAnswerForSubmission = getCurrentAnswer()
    let finalAnswersToSave: AssessmentAnswer[] = []

    if (currentAnswerForSubmission) {
      // กรองคำตอบเก่าของคำถามปัจจุบันออก แล้วเพิ่มคำตอบล่าสุดเข้าไป
      finalAnswersToSave = answers.filter((a) => a.questionId !== currentQuestion.id)
      finalAnswersToSave.push(currentAnswerForSubmission)
    } else {
      // ถ้าไม่มีคำตอบสำหรับคำถามปัจจุบัน (อาจเป็นคำถามที่ไม่จำเป็นต้องตอบ)
      // ให้ใช้อาร์เรย์ answers ที่มีอยู่
      finalAnswersToSave = [...answers]
    }

    console.log("AssessmentForm: Answers array before saving to localStorage:", finalAnswersToSave) // Debug log

    if (isLastQuestion) {
      if (finalAnswersToSave.length === 0 && category.questions.length > 0) {
        console.warn(
          "AssessmentForm: Attempting to save an empty answers array for a non-empty assessment category. This might indicate missing required answers.",
        )
        // เรายังคงดำเนินการต่อไปยังหน้าผลลัพธ์ เพื่อให้หน้าผลลัพธ์จัดการข้อผิดพลาดนี้
      }

      const localStorageKey =
        categoryId === guestAssessmentCategory.id ? `guest-assessment-temp-answers` : `assessment-${categoryId}`

      localStorage.setItem(localStorageKey, JSON.stringify(finalAnswersToSave))
      console.log(`AssessmentForm: Saved answers to localStorage with key: ${localStorageKey}.`) // Debug log

      if (categoryId === guestAssessmentCategory.id) {
        router.push(`/guest-assessment/results`)
      } else {
        router.push(`/assessment/${categoryId}/results`)
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
                disabled={currentQuestionIndex === 0}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">ก่อนหน้า</span>
                <span className="sm:hidden">ก่อน</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()} // ปุ่มจะถูกปิดใช้งานหากคำตอบปัจจุบันไม่ถูกต้อง
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm sm:text-base"
              >
                {isLastQuestion ? (
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
