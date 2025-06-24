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

  const handleAnswer = (questionId: string, answer: string | number | string[] | null, score: number) => {
    const newAnswers = answers.filter((a) => a.questionId !== questionId)
    newAnswers.push({ questionId, answer, score })
    setAnswers(newAnswers)
  }

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion.id)
  }

  const canProceed = () => {
    if (!currentQuestion.required) {
      return true // ถ้าไม่จำเป็น สามารถไปต่อได้เสมอ
    }

    const answerEntry = getCurrentAnswer()

    if (!answerEntry || answerEntry.answer === null) {
      return false // ไม่มีคำตอบ หรือคำตอบเป็น null
    }

    // ตรวจสอบตามประเภทคำถาม
    switch (currentQuestion.type) {
      case "text":
      case "number":
        // สำหรับ text/number, ตรวจสอบว่าไม่ใช่ string ว่างเปล่า หรือ 0 ที่มาจาก string ว่างเปล่า
        return typeof answerEntry.answer === "string" ? answerEntry.answer.trim() !== "" : true
      case "checkbox":
      case "multi-select-combobox-with-other":
        // สำหรับ checkbox/multi-select, ตรวจสอบว่า array ไม่ว่างเปล่า
        return Array.isArray(answerEntry.answer) && answerEntry.answer.length > 0
      case "multiple-choice":
      case "yes-no":
      case "rating":
        // สำหรับประเภทอื่นๆ, ตรวจสอบว่ามีค่าที่ไม่ใช่ null/undefined/empty string
        return String(answerEntry.answer).trim() !== ""
      default:
        return true // สำหรับประเภทที่ไม่รู้จัก ให้ถือว่าผ่าน
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      if (categoryId === guestAssessmentCategory.id) {
        // สำหรับ guest assessment: บันทึกคำตอบชั่วคราวใน localStorage และไปที่หน้าผลลัพธ์ guest
        localStorage.setItem(`guest-assessment-temp-answers`, JSON.stringify(answers))
        router.push(`/guest-assessment/results`)
      } else {
        // สำหรับ assessment ปกติ: บันทึกคำตอบใน localStorage และไปที่หน้าผลลัพธ์ปกติ
        // AssessmentResults จะเป็นผู้รับผิดชอบในการบันทึกลง DB และลบ localStorage
        localStorage.setItem(`assessment-${categoryId}`, JSON.stringify(answers))
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
                disabled={!canProceed()}
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
