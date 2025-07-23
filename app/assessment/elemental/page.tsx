"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { elementalQuestions, calculateElementalResult } from "@/data/elemental-questions"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/header"

export default function ElementalAssessmentPage() {
  const router = useRouter()
  const { t, locale } = useTranslation(["common", "assessment"])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [elementalQuestions[currentQuestion].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < elementalQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate result
      const result = calculateElementalResult(answers)

      // Store result in sessionStorage for results page
      sessionStorage.setItem("elementalResult", JSON.stringify(result))
      sessionStorage.setItem("elementalAnswers", JSON.stringify(answers))

      // Navigate to results
      router.push("/assessment/elemental/results")
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / elementalQuestions.length) * 100
  const currentQ = elementalQuestions[currentQuestion]
  const currentAnswer = answers[currentQ.id]
  const isAnswered = !!currentAnswer
  const isThaiLanguage = locale === "th"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isThaiLanguage ? "ย้อนกลับ" : "Back"}
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🧘‍♀️ {isThaiLanguage ? "แบบประเมินธาตุเจ้าเรือน" : "Elemental Body Type Assessment"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isThaiLanguage
                ? "ค้นหาธาตุเจ้าเรือนของคุณ: วาตะ ปิตตะ หรือเสมหะ"
                : "Discover your elemental body type: Vata, Pitta, or Kapha"}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                {isThaiLanguage ? "คำถามที่" : "Question"} {currentQuestion + 1} {isThaiLanguage ? "จาก" : "of"}{" "}
                {elementalQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-center dark:text-gray-100">
                {isThaiLanguage ? currentQ.question.th : currentQ.question.en}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswerChange} className="space-y-4">
                {currentQ.options.map((option, index) => {
                  const optionText = isThaiLanguage ? option.text.th : option.text.en
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600"
                    >
                      <RadioGroupItem value={optionText} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base dark:text-gray-200">
                        {optionText}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              ← {isThaiLanguage ? "ก่อนหน้า" : "Previous"}
            </Button>

            <Button onClick={handleNext} disabled={!isAnswered || isSubmitting} className="min-w-[120px]">
              {isSubmitting
                ? isThaiLanguage
                  ? "กำลังประมวลผล..."
                  : "Processing..."
                : currentQuestion === elementalQuestions.length - 1
                  ? isThaiLanguage
                    ? "ดูผลลัพธ์ →"
                    : "View Results →"
                  : isThaiLanguage
                    ? "ถัดไป →"
                    : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
