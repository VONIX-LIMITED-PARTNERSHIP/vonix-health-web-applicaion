"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question, AssessmentAnswer } from "@/types/assessment"
import { AlertCircle } from "lucide-react"

interface QuestionCardProps {
  question: Question
  answer?: AssessmentAnswer
  onAnswer: (questionId: string, answer: string | number | string[], score: number) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const [currentAnswer, setCurrentAnswer] = useState<string | number | string[]>(
    answer?.answer || (question.type === "checkbox" ? [] : ""),
  )

  useEffect(() => {
    if (answer) {
      setCurrentAnswer(answer.answer)
    }
  }, [answer])

  const calculateScore = (value: string | number | string[]): number => {
    switch (question.type) {
      case "rating":
        return Number(value) * question.weight
      case "yes-no":
        return value === "ใช่" ? question.weight * 2 : question.weight
      case "multiple-choice":
        // Score based on option index (higher index = higher risk)
        const index = question.options?.indexOf(String(value)) || 0
        return (index + 1) * question.weight
      case "checkbox":
        const selectedCount = Array.isArray(value) ? value.length : 0
        return selectedCount * question.weight
      default:
        return question.weight
    }
  }

  const handleAnswerChange = (value: string | number | string[]) => {
    setCurrentAnswer(value)
    const score = calculateScore(value)
    onAnswer(question.id, value, score)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={String(currentAnswer)}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
              >
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "rating":
        return (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={String(currentAnswer) === option ? "default" : "outline"}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-12 h-12 rounded-full ${
                    String(currentAnswer) === option
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>น้อยที่สุด</span>
              <span>มากที่สุด</span>
            </div>
          </div>
        )

      case "yes-no":
        return (
          <RadioGroup
            value={String(currentAnswer)}
            onValueChange={(value) => handleAnswerChange(value)}
            className="flex space-x-6 justify-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ใช่" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`} className="cursor-pointer font-medium">
                ใช่
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ไม่ใช่" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`} className="cursor-pointer font-medium">
                ไม่ใช่
              </Label>
            </div>
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
              >
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                  onCheckedChange={(checked) => {
                    const newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : []
                    if (checked) {
                      if (!newAnswer.includes(option)) {
                        newAnswer.push(option)
                      }
                    } else {
                      const index = newAnswer.indexOf(option)
                      if (index > -1) {
                        newAnswer.splice(index, 1)
                      }
                    }
                    handleAnswerChange(newAnswer)
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "number":
        return (
          <Input
            type="number"
            value={String(currentAnswer)}
            onChange={(e) => handleAnswerChange(Number(e.target.value))}
            placeholder="กรุณาใส่ตัวเลข"
            className="text-center text-lg h-12 rounded-xl border-2 focus:border-blue-400"
          />
        )

      case "text":
        return (
          <Textarea
            value={String(currentAnswer)}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="กรุณาใส่คำตอบ"
            className="min-h-[100px] rounded-xl border-2 focus:border-blue-400"
          />
        )

      default:
        return null
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-3 text-gray-800">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            {question.description && <p className="text-gray-600 text-sm leading-relaxed">{question.description}</p>}
          </div>
          {question.required && (
            <div className="flex items-center text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3 mr-1" />
              จำเป็น
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">{renderQuestionInput()}</CardContent>
    </Card>
  )
}
