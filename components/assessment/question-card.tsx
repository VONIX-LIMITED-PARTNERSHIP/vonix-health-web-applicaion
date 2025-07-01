"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface QuestionCardProps {
  question: AssessmentQuestion
  answer?: AssessmentAnswer
  onAnswer: (questionId: string, answer: string | number | string[] | null, score: number, isValid: boolean) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const { locale } = useLanguage()
  const [currentAnswer, setCurrentAnswer] = useState<string | number | string[] | null>(() => {
    if (answer?.answer !== undefined) {
      return answer.answer
    }
    if (question.type === "checkbox" || question.type === "multi-select-combobox-with-other") {
      return []
    }
    if (question.type === "number" || question.type === "text") {
      return null
    }
    return ""
  })
  const [error, setError] = useState<string | null>(null)

  // Regex สำหรับอักขระที่อนุญาต: ตัวอักษร (ทุกภาษา), ตัวเลข, ช่องว่าง, จุด, คอมม่า, ไฮเฟน, อัญประกาศเดี่ยว
  const textRegex = /^[\p{L}\p{N}\s.,'-]*$/u

  // Get localized content
  const getLocalizedContent = () => {
    return {
      question: locale === "en" ? question.questionEn || question.question : question.question,
      description: locale === "en" ? question.descriptionEn || question.description : question.description,
      options: locale === "en" ? question.optionsEn || question.options : question.options,
      placeholder: locale === "en" ? question.placeholderEn || "Enter your answer" : "กรุณาใส่คำตอบ",
      numberPlaceholder: locale === "en" ? "Enter number" : "กรุณาใส่ตัวเลข",
      requiredText: locale === "en" ? "Required" : "จำเป็น",
      pleaseAnswerText: locale === "en" ? "Please answer this question" : "กรุณาตอบคำถามนี้",
      invalidNumberText: locale === "en" ? "Please enter a valid number" : "กรุณาใส่ตัวเลขที่ถูกต้อง",
      negativeNumberText: locale === "en" ? "Please enter a non-negative number" : "กรุณาใส่ตัวเลขที่ไม่เป็นค่าลบ",
      invalidCharacterText: locale === "en" ? "Contains invalid special characters" : "มีอักขระพิเศษที่ไม่ได้รับอนุญาต",
      invalidText: locale === "en" ? "Invalid" : "ไม่ถูกต้อง",
    }
  }

  const localizedContent = getLocalizedContent()

  const calculateScore = (value: string | number | string[] | null): number => {
    if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
      return 0
    }

    if (question.type === "scale") {
      const numValue = typeof value === "number" ? value : Number.parseFloat(value as string)
      if (isNaN(numValue)) return 0

      // สำหรับ scale ให้คะแนนตามระดับ (1-10 -> 0-9 คะแนน)
      return Math.max(0, numValue - 1)
    }

    if (question.type === "number") {
      const numValue = typeof value === "number" ? value : Number.parseFloat(value as string)
      if (isNaN(numValue)) return 0

      // สำหรับน้ำหนักและส่วนสูง ไม่ให้คะแนนตรงนี้
      if (question.id === "basic-3" || question.id === "basic-4") {
        return 0
      }

      // สำหรับอายุ
      if (question.id === "basic-1") {
        if (numValue < 30) return 0
        if (numValue < 50) return 1
        if (numValue < 65) return 2
        return 3
      }

      return 0
    }

    if (question.type === "single") {
      const option = question.options?.find((opt) => (locale === "en" ? opt.valueEn || opt.value : opt.value) === value)
      return option?.score || 0
    }

    if (question.type === "multiple") {
      if (!Array.isArray(value)) return 0

      let totalScore = 0
      value.forEach((selectedValue) => {
        const option = question.options?.find(
          (opt) => (locale === "en" ? opt.valueEn || opt.value : opt.value) === selectedValue,
        )
        if (option) {
          totalScore += option.score
        }
      })
      return totalScore
    }

    return 0
  }

  const validateAnswer = (value: string | number | string[] | null): { isValid: boolean; error: string | null } => {
    if (question.required && (value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
      return { isValid: false, error: localizedContent.pleaseAnswerText }
    }

    if (question.type === "number" && value !== null && value !== "") {
      const numValue = typeof value === "number" ? value : Number.parseFloat(value as string)
      if (isNaN(numValue)) {
        return { isValid: false, error: localizedContent.invalidNumberText }
      }
      if (numValue < 0) {
        return { isValid: false, error: localizedContent.negativeNumberText }
      }
      if (question.min !== undefined && numValue < question.min) {
        return { isValid: false, error: `${locale === "en" ? "Minimum value is" : "ค่าต่ำสุดคือ"} ${question.min}` }
      }
      if (question.max !== undefined && numValue > question.max) {
        return { isValid: false, error: `${locale === "en" ? "Maximum value is" : "ค่าสูงสุดคือ"} ${question.max}` }
      }
    }

    if (question.type === "text" && typeof value === "string" && value.length > 0) {
      if (!textRegex.test(value)) {
        return { isValid: false, error: localizedContent.invalidCharacterText }
      }
    }

    return { isValid: true, error: null }
  }

  const handleAnswerChange = (newAnswer: string | number | string[] | null) => {
    setCurrentAnswer(newAnswer)

    const validation = validateAnswer(newAnswer)
    setError(validation.error)

    const score = calculateScore(newAnswer)
    onAnswer(question.id, newAnswer, score, validation.isValid)
  }

  useEffect(() => {
    if (answer?.answer !== undefined && answer.answer !== currentAnswer) {
      setCurrentAnswer(answer.answer)
    }
  }, [answer?.answer])

  const renderQuestionInput = () => {
    switch (question.type) {
      case "single":
        return (
          <RadioGroup
            value={(currentAnswer as string) || ""}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => {
              const optionValue = locale === "en" ? option.valueEn || option.value : option.value
              return (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={optionValue} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`} className="text-sm font-normal cursor-pointer">
                    {optionValue}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        )

      case "multiple":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const optionValue = locale === "en" ? option.valueEn || option.value : option.value
              const isChecked = Array.isArray(currentAnswer) && currentAnswer.includes(optionValue)

              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
                      let newAnswer: string[]

                      if (checked) {
                        newAnswer = [...currentArray, optionValue]
                      } else {
                        newAnswer = currentArray.filter((item) => item !== optionValue)
                      }

                      handleAnswerChange(newAnswer)
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`} className="text-sm font-normal cursor-pointer">
                    {optionValue}
                  </Label>
                </div>
              )
            })}
          </div>
        )

      case "number":
        return (
          <Input
            type="number"
            value={(currentAnswer as number) || ""}
            onChange={(e) => {
              const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
              handleAnswerChange(value)
            }}
            placeholder={localizedContent.numberPlaceholder}
            min={question.min}
            max={question.max}
            step={question.step}
            className={cn(error && "border-red-500")}
          />
        )

      case "text":
        return (
          <Textarea
            value={(currentAnswer as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={localizedContent.placeholder}
            className={cn("min-h-[100px]", error && "border-red-500")}
          />
        )

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.min || 1}</span>
              <span>{question.max || 10}</span>
            </div>
            <Input
              type="range"
              min={question.min || 1}
              max={question.max || 10}
              value={(currentAnswer as number) || question.min || 1}
              onChange={(e) => handleAnswerChange(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-lg font-semibold">{currentAnswer || question.min || 1}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={cn("w-full", error && "border-red-200")}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {localizedContent.question}
          {question.required && <span className="text-red-500 text-sm">*</span>}
        </CardTitle>
        {localizedContent.description && (
          <p className="text-sm text-muted-foreground mt-2">{localizedContent.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestionInput()}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
