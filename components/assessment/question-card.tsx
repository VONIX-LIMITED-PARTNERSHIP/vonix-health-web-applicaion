"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { MultiSelectComboboxWithOther } from "@/components/ui/multi-select-combobox-with-other"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"

interface QuestionCardProps {
  question: AssessmentQuestion
  answer?: AssessmentAnswer
  onAnswer: (questionId: string, answer: any, score: number, isValid: boolean) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const [currentAnswer, setCurrentAnswer] = useState<any>(answer?.answer || null)
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (answer?.answer !== undefined) {
      setCurrentAnswer(answer.answer)
    }
  }, [answer])

  const validateAnswer = (value: any): { isValid: boolean; message: string } => {
    if (question.required) {
      if (value === null || value === undefined || value === "") {
        return { isValid: false, message: "กรุณาตอบคำถามนี้" }
      }

      if (Array.isArray(value) && value.length === 0) {
        return { isValid: false, message: "กรุณาเลือกอย่างน้อย 1 ตัวเลือก" }
      }
    }

    // Validate based on question type
    switch (question.type) {
      case "number":
        if (value !== null && value !== "" && isNaN(Number(value))) {
          return { isValid: false, message: "กรุณาใส่ตัวเลขเท่านั้น" }
        }
        break
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { isValid: false, message: "กรุณาใส่อีเมลที่ถูกต้อง" }
        }
        break
    }

    return { isValid: true, message: "" }
  }

  const calculateScore = (value: any): number => {
    if (!question.scoring) return 0

    switch (question.type) {
      case "radio":
        const option = question.options?.find((opt) => opt.value === value)
        return option?.score || 0

      case "multiselect":
        if (!Array.isArray(value)) return 0
        return value.reduce((total, val) => {
          const option = question.options?.find((opt) => opt.value === val)
          return total + (option?.score || 0)
        }, 0)

      case "number":
        const numValue = Number(value)
        if (isNaN(numValue)) return 0

        // Simple scoring based on ranges (can be customized per question)
        if (question.scoring.ranges) {
          for (const range of question.scoring.ranges) {
            if (numValue >= range.min && numValue <= range.max) {
              return range.score
            }
          }
        }
        return 0

      default:
        return 0
    }
  }

  const handleAnswerChange = (value: any) => {
    setCurrentAnswer(value)

    const validation = validateAnswer(value)
    setIsValid(validation.isValid)
    setErrorMessage(validation.message)

    const score = calculateScore(value)
    onAnswer(question.id, value, score, validation.isValid)
  }

  const renderInput = () => {
    switch (question.type) {
      case "radio":
        return (
          <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswerChange} className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "multiselect":
        return (
          <MultiSelectComboboxWithOther
            options={question.options || []}
            value={currentAnswer || []}
            onChange={handleAnswerChange}
            placeholder="เลือกตัวเลือก..."
            allowOther={question.allowOther}
          />
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(currentAnswer || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = currentAnswer || []
                    const newValue = checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value)
                    handleAnswerChange(newValue)
                  }}
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case "textarea":
        return (
          <Textarea
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="resize-none"
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
          />
        )

      case "email":
        return (
          <Input
            type="email"
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={question.placeholder}
          />
        )

      default:
        return (
          <Input
            type="text"
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={question.placeholder}
          />
        )
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80 dark:border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 dark:text-foreground">{question.text}</CardTitle>
            {question.description && (
              <p className="text-sm text-gray-600 dark:text-muted-foreground">{question.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {question.required && (
              <Badge variant="destructive" className="text-xs">
                จำเป็น
              </Badge>
            )}
            {question.scoring && (
              <Badge variant="outline" className="text-xs">
                คะแนน
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderInput()}

          {!isValid && errorMessage && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {question.hint && <p className="text-xs text-gray-500 dark:text-gray-400">💡 {question.hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
