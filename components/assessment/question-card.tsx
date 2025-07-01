"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelectComboboxWithOther } from "@/components/ui/multi-select-combobox-with-other"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"

interface QuestionCardProps {
  question: AssessmentQuestion
  answer?: AssessmentAnswer
  onAnswerChange: (questionId: string, answer: any, score: number) => void
}

export function QuestionCard({ question, answer, onAnswerChange }: QuestionCardProps) {
  const handleRadioChange = (value: string) => {
    const option = question.options?.find((opt) => opt.value === value)
    if (option) {
      onAnswerChange(question.id, value, option.score)
    }
  }

  const handleInputChange = (value: string) => {
    // For input questions, we'll assign a default score of 0
    // The actual scoring will be done by AI analysis
    onAnswerChange(question.id, value, 0)
  }

  const handleMultiSelectChange = (values: string[]) => {
    // For multi-select questions, calculate score based on selected options
    let totalScore = 0
    if (question.options) {
      values.forEach((value) => {
        const option = question.options?.find((opt) => opt.value === value)
        if (option) {
          totalScore += option.score
        }
      })
    }
    onAnswerChange(question.id, values, totalScore)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "radio":
        return (
          <RadioGroup value={answer?.answer as string} onValueChange={handleRadioChange} className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "input":
        return (
          <Input
            type={question.inputType || "text"}
            value={(answer?.answer as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full"
          />
        )

      case "textarea":
        return (
          <Textarea
            value={(answer?.answer as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full min-h-[100px]"
          />
        )

      case "multiselect":
        return (
          <MultiSelectComboboxWithOther
            options={question.options || []}
            value={(answer?.answer as string[]) || []}
            onChange={handleMultiSelectChange}
            placeholder={question.placeholder || "เลือกตัวเลือก..."}
            allowOther={question.allowOther}
            otherLabel={question.otherLabel || "อื่นๆ"}
          />
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestionInput()}

        {question.note && (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <strong>หมายเหตุ:</strong> {question.note}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
