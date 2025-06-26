"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelectComboboxWithOther } from "@/components/ui/multi-select-combobox-with-other"
import { AlertCircle } from "lucide-react"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"

interface QuestionCardProps {
  question: AssessmentQuestion
  answer: AssessmentAnswer | undefined
  onAnswer: (questionId: string, answer: string | number | string[] | null, score: number, isValid: boolean) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const [localAnswer, setLocalAnswer] = useState<string | number | string[] | null>(answer?.answer || null)
  const [isValid, setIsValid] = useState<boolean>(answer?.isValid ?? !question.required)
  const [otherInput, setOtherInput] = useState<string>("")

  useEffect(() => {
    setLocalAnswer(answer?.answer || null)
    setIsValid(answer?.isValid ?? !question.required)
    if (question.type === "multi-select-combobox-with-other" && Array.isArray(answer?.answer)) {
      const otherOption = question.options?.find((opt) => opt.value === "other")
      if (otherOption) {
        const otherValue = answer.answer.find((val) => val.startsWith("other:"))
        if (otherValue) {
          setOtherInput(otherValue.replace("other:", ""))
        } else {
          setOtherInput("")
        }
      }
    }
  }, [answer, question])

  const calculateScore = (value: string | number | string[] | null): number => {
    if (question.scoreMapping) {
      if (typeof value === "string" || typeof value === "number") {
        return question.scoreMapping[String(value)] || 0
      } else if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + (question.scoreMapping?.[item] || 0), 0)
      }
    }
    return 0
  }

  const validateAnswer = (value: string | number | string[] | null): boolean => {
    if (!question.required) return true

    if (value === null || value === undefined) return false

    if (typeof value === "string") {
      return value.trim() !== ""
    }
    if (typeof value === "number") {
      return true // Numbers are always valid if present
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return false
  }

  const handleChange = (value: string | number | string[] | null) => {
    const newIsValid = validateAnswer(value)
    const newScore = calculateScore(value)
    setLocalAnswer(value)
    setIsValid(newIsValid)
    onAnswer(question.id, value, newScore, newIsValid)
  }

  const handleMultiSelectChange = (selectedValues: string[]) => {
    const otherOption = question.options?.find((opt) => opt.value === "other")
    let finalValues = selectedValues

    if (otherOption && selectedValues.includes("other")) {
      if (otherInput.trim() !== "") {
        finalValues = selectedValues.filter((val) => val !== "other").concat([`other:${otherInput.trim()}`])
      } else {
        finalValues = selectedValues.filter((val) => val !== "other")
      }
    }

    handleChange(finalValues)
  }

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setOtherInput(value)
    if (Array.isArray(localAnswer) && localAnswer.includes("other")) {
      handleMultiSelectChange(localAnswer.filter((val) => !val.startsWith("other:")).concat(["other"]))
    }
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            value={(localAnswer as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            className="text-center text-lg h-12 rounded-xl border-2 focus:border-blue-400 dark:text-white dark:placeholder:text-gray-300 dark:bg-input dark:border-border"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={(localAnswer as number) || ""}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={question.placeholder}
          />
        )
      case "textarea":
        return (
          <Textarea
            value={(localAnswer as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[100px] rounded-xl border-2 focus:border-blue-400 dark:text-white dark:placeholder:text-gray-300 dark:bg-input dark:border-border"
          />
        )
      case "multiple-choice":
        return (
          <RadioGroup
            onValueChange={handleChange}
            value={(localAnswer as string) || ""}
            className="flex flex-wrap justify-center gap-4" // Changed to flex-wrap with gap
          >
            {question.options?.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-secondary min-w-[120px] flex-grow"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "checkbox":
        return (
          <div className="flex flex-wrap gap-4">
            {" "}
            {/* Changed to flex-wrap with gap */}
            {question.options?.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-secondary min-w-[120px] flex-grow"
              >
                {" "}
                {/* Added styling for individual items */}
                <Checkbox
                  id={option.value}
                  checked={Array.isArray(localAnswer) && localAnswer.includes(option.value)}
                  onCheckedChange={(checked) => {
                    let newAnswers = Array.isArray(localAnswer) ? [...localAnswer] : []
                    if (checked) {
                      newAnswers.push(option.value)
                    } else {
                      newAnswers = newAnswers.filter((item) => item !== option.value)
                    }
                    handleChange(newAnswers)
                  }}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case "multi-select-combobox-with-other":
        const selectedValues = Array.isArray(localAnswer) ? localAnswer.filter((val) => !val.startsWith("other:")) : []
        const hasOtherSelected = Array.isArray(localAnswer) && localAnswer.some((val) => val.startsWith("other:"))

        return (
          <MultiSelectComboboxWithOther
            options={question.options || []}
            selected={selectedValues}
            onSelect={handleMultiSelectChange}
            otherInput={otherInput}
            onOtherInputChange={handleOtherInputChange}
            hasOtherSelected={hasOtherSelected}
            placeholder={question.placeholder}
          />
        )
      default:
        return <p>Unsupported question type.</p>
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl dark:bg-card/80 dark:border-border">
      <CardHeader>
        <CardTitle className="text-xl dark:text-white">
          <div className="flex items-center gap-2">
            {question.questionText}
            {question.required && <span className="text-red-500 text-sm font-bold">*</span>}
            {question.required && (
              <Badge variant="destructive" className="ml-2">
                <AlertCircle className="h-3 w-3 mr-1" /> จำเป็น
              </Badge>
            )}
          </div>
        </CardTitle>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-200 text-sm mt-2">{question.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderQuestionInput()}
        {question.required && !isValid && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> กรุณาตอบคำถามนี้
          </p>
        )}
      </CardContent>
    </Card>
  )
}
