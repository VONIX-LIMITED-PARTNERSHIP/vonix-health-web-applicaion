"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { elementalQuestions, calculateElementalResult, calculateBirthElement } from "@/data/elemental-questions"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/header"

export default function ElementalAssessmentPage() {
  const router = useRouter()
  const { t, locale } = useTranslation(["common", "assessment"])
  const [step, setStep] = useState<"birthmonth" | "assessment">("birthmonth")
  const [birthMonth, setBirthMonth] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isThaiLanguage = locale === "th"

  // Month ranges for birth element selection - แสดงแค่ช่วงเดือน
  const monthRanges = [
    {
      months: isThaiLanguage ? "มกราคม - มีนาคม" : "January - March",
      monthsShort: isThaiLanguage ? "ม.ค. - มี.ค." : "Jan - Mar",
      value: 2, // February as representative
    },
    {
      months: isThaiLanguage ? "เมษายน - มิถุนายน" : "April - June",
      monthsShort: isThaiLanguage ? "เม.ย. - มิ.ย." : "Apr - Jun",
      value: 5, // May as representative
    },
    {
      months: isThaiLanguage ? "กรกฎาคม - กันยายน" : "July - September",
      monthsShort: isThaiLanguage ? "ก.ค. - ก.ย." : "Jul - Sep",
      value: 8, // August as representative
    },
    {
      months: isThaiLanguage ? "ตุลาคม - ธันวาคม" : "October - December",
      monthsShort: isThaiLanguage ? "ต.ค. - ธ.ค." : "Oct - Dec",
      value: 11, // November as representative
    },
  ]

  const handleBirthMonthSubmit = () => {
    if (birthMonth !== null) {
      setStep("assessment")
    }
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const questionsPerStep = 2
  const totalSteps = Math.ceil(elementalQuestions.length / questionsPerStep)

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (birthMonth === null) return

    setIsSubmitting(true)

    try {
      // Calculate current element result
      const currentElementResult = calculateElementalResult(answers)

      // Calculate birth element
      const birthElement = calculateBirthElement(birthMonth)

      // Store results in sessionStorage for results page
      const result = {
        birthMonth,
        birthElement,
        currentElement: currentElementResult.dominant,
        isBalanced: birthElement === currentElementResult.dominant,
        elementalScores: currentElementResult,
      }

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

  if (step === "birthmonth") {
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
                  ? "ค้นหาธาตุเจ้าเรือนของคุณและเปรียบเทียบกับธาตุปัจจุบัน"
                  : "Discover your birth element and compare with your current elemental state"}
              </p>
            </div>

            {/* Birth Month Selection Card */}
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-center dark:text-gray-100">
                  📅 {isThaiLanguage ? "กรุณาเลือกช่วงเดือนเกิดของคุณ" : "Please select your birth month range"}
                </CardTitle>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                  {isThaiLanguage
                    ? "ธาตุเจ้าเรือนจะถูกคำนวณจากช่วงเดือนเกิดของคุณ"
                    : "Your birth element will be calculated from your birth month range"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={birthMonth?.toString() || ""}
                  onValueChange={(value) => setBirthMonth(Number.parseInt(value))}
                  className="space-y-4"
                >
                  {monthRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600 cursor-pointer"
                      onClick={() => setBirthMonth(range.value)}
                    >
                      <RadioGroupItem value={range.value.toString()} id={`range-${index}`} />
                      <Label
                        htmlFor={`range-${index}`}
                        className="text-lg font-medium cursor-pointer dark:text-gray-200 flex-1"
                      >
                        {range.months}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="text-center">
              <Button
                onClick={handleBirthMonthSubmit}
                disabled={birthMonth === null}
                size="lg"
                className="min-w-[200px]"
              >
                {isThaiLanguage ? "เริ่มแบบประเมิน →" : "Start Assessment →"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Assessment step
  const startIndex = currentStep * questionsPerStep
  const currentQuestions = elementalQuestions.slice(startIndex, startIndex + questionsPerStep)

  // Check if all questions in current step are answered
  const isStepAnswered = currentQuestions.every((q) => answers[q.id])

  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setStep("birthmonth")}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isThaiLanguage ? "ย้อนกลับ" : "Back"}
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🧘‍♀️ {isThaiLanguage ? "แบบประเมินธาตุปัจจุบัน" : "Current Element Assessment"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isThaiLanguage ? "ประเมินพฤติกรรมและลักษณะปัจจุบันของคุณ" : "Assess your current behavior and characteristics"}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                {isThaiLanguage ? "ขั้นตอนที่" : "Step"} {currentStep + 1} {isThaiLanguage ? "จาก" : "of"} {totalSteps} (
                {startIndex + 1}-{Math.min(startIndex + questionsPerStep, elementalQuestions.length)}{" "}
                {isThaiLanguage ? "จาก" : "of"} {elementalQuestions.length})
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Cards */}
          <div className="space-y-6 mb-8">
            {currentQuestions.map((question, questionIndex) => {
              const currentAnswer = answers[question.id]
              return (
                <Card key={question.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-left dark:text-gray-100">
                      <span className="text-purple-600 dark:text-purple-400 font-bold mr-2">
                        {startIndex + questionIndex + 1}.
                      </span>
                      {isThaiLanguage ? question.question.th : question.question.en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={currentAnswer || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                      className="space-y-3"
                    >
                      {question.options.map((option, optionIndex) => {
                        const optionText = isThaiLanguage ? option.text.th : option.text.en
                        return (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:border-gray-600"
                          >
                            <RadioGroupItem value={optionText} id={`${question.id}-option-${optionIndex}`} />
                            <Label
                              htmlFor={`${question.id}-option-${optionIndex}`}
                              className="flex-1 cursor-pointer text-sm dark:text-gray-200"
                            >
                              {optionText}
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              ← {isThaiLanguage ? "ก่อนหน้า" : "Previous"}
            </Button>

            <Button onClick={handleNext} disabled={!isStepAnswered || isSubmitting} className="min-w-[120px]">
              {isSubmitting
                ? isThaiLanguage
                  ? "กำลังประมวลผล..."
                  : "Processing..."
                : currentStep === totalSteps - 1
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
