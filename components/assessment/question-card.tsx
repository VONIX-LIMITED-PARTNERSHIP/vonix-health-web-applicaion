"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment" // ใช้ AssessmentQuestion
import { AlertCircle } from "lucide-react"
import { MultiSelectComboboxWithOther } from "@/components/ui/multi-select-combobox-with-other"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: AssessmentQuestion // ใช้ AssessmentQuestion type
  answer?: AssessmentAnswer
  onAnswer: (questionId: string, answer: string | number | string[] | null, score: number, isValid: boolean) => void // เพิ่ม isValid
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
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

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของ input
  const validateInput = (value: string | number | string[] | null): { valid: boolean; message: string | null } => {
    // ตรวจสอบว่าคำถามที่จำเป็นต้องมีคำตอบหรือไม่
    if (question.required) {
      if (
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return { valid: false, message: "กรุณาตอบคำถามนี้" }
      }
    }

    switch (question.type) {
      case "number":
        // ตรวจสอบค่าลบสำหรับ input ประเภท number
        if (typeof value === "number" && value < 0) {
          return { valid: false, message: "กรุณาใส่ตัวเลขที่ไม่เป็นค่าลบ" }
        }
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่ หากมีค่า
        if (value !== null && value !== undefined && typeof value !== "number") {
          return { valid: false, message: "กรุณาใส่ตัวเลขที่ถูกต้อง" }
        }
        return { valid: true, message: null }

      case "text":
        // ตรวจสอบอักขระพิเศษสำหรับ input ประเภท text
        if (typeof value === "string" && value.trim() !== "" && !textRegex.test(value)) {
          return { valid: false, message: "มีอักขระพิเศษที่ไม่ได้รับอนุญาต" }
        }
        return { valid: true, message: null }

      case "checkbox":
      case "multi-select-combobox-with-other": // ลบการตรวจสอบอักขระพิเศษสำหรับ multi-select-combobox-with-other
        // ตรวจสอบว่าคำถามที่จำเป็นต้องมีคำตอบหรือไม่ (ยังคงอยู่)
        if (question.required) {
          if (Array.isArray(value) && value.length === 0) {
            return { valid: false, message: "กรุณาตอบคำถามนี้" }
          }
        }
        // สำหรับ checkbox ยังคงตรวจสอบอักขระพิเศษ
        if (question.type === "checkbox" && Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string" && !textRegex.test(item)) {
              return { valid: false, message: "มีอักขระพิเศษที่ไม่ได้รับอนุญาตในตัวเลือก" }
            }
          }
        }
        return { valid: true, message: null }

      default:
        return { valid: true, message: null }
    }
  }

  // ใช้ useEffect เพื่อทำการตรวจสอบค่าเริ่มต้นและเมื่อคำถามหรือคำตอบเริ่มต้นเปลี่ยน
  useEffect(() => {
    const initialValue =
      answer?.answer !== undefined
        ? answer.answer
        : question.type === "checkbox" || question.type === "multi-select-combobox-with-other"
          ? []
          : question.type === "number" || question.type === "text"
            ? null
            : ""
    setCurrentAnswer(initialValue)
    const initialValidation = validateInput(initialValue)
    setError(initialValidation.message)
    onAnswer(question.id, initialValue, calculateScore(initialValue), initialValidation.valid)
  }, [question.id, answer?.answer]) // Dependency array เพื่อให้ทำงานเมื่อ question.id หรือ answer.answer เปลี่ยน

  const calculateScore = (value: string | number | string[] | null): number => {
    if (value === null || (Array.isArray(value) && value.length === 0)) return 0
    switch (question.type) {
      case "rating":
        return Number(value) * question.weight
      case "yes-no":
        return value === "ใช่" ? question.weight * 2 : question.weight
      case "multiple-choice":
        const index = question.options?.indexOf(String(value)) || 0
        return (index + 1) * question.weight
      case "checkbox":
      case "multi-select-combobox-with-other":
        const selectedCount = Array.isArray(value) ? value.length : 0
        return selectedCount * question.weight
      default:
        return question.weight
    }
  }

  const handleAnswerChange = (value: string | number | string[] | null) => {
    setCurrentAnswer(value)
    const validationResult = validateInput(value)
    setError(validationResult.message)
    const score = calculateScore(value)
    onAnswer(question.id, value, score, validationResult.valid)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple-choice":
      case "rating": // Rating ก็ใช้ RadioGroup เหมือนกัน
      case "yes-no":
        const yesNoOptions = question.options || ["ใช่", "ไม่ใช่"]
        return (
          <RadioGroup
            value={String(currentAnswer)}
            onValueChange={(value) => handleAnswerChange(value)}
            className="flex space-x-6 justify-center"
          >
            {yesNoOptions.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border border-gray-200 cursor-pointer transition-colors",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  "data-[state=checked]:bg-blue-50 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-950 dark:data-[state=checked]:border-blue-700",
                  question.type === "rating" && "justify-center",
                )}
                data-state={String(currentAnswer) === option ? "checked" : "unchecked"} // เพิ่ม data-state เพื่อให้ Tailwind รู้สถานะ
                onClick={() => handleAnswerChange(option)} // ทำให้ div ทั้งหมดคลิกได้
              >
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer dark:text-gray-100">
                  {option}
                </Label>
              </div>
            ))}
            {question.type === "rating" && (
              <div className="flex justify-between text-xs text-gray-500 px-2 mt-2">
                <span>น้อยที่สุด</span>
                <span>มากที่สุด</span>
              </div>
            )}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border border-gray-200 cursor-pointer transition-colors",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option) &&
                    "bg-blue-50 border-blue-500 dark:bg-blue-950 dark:border-blue-700", // เพิ่มเงื่อนไขสำหรับสถานะ checked
                )}
                onClick={() => {
                  // ทำให้ div ทั้งหมดคลิกได้
                  const newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : []
                  const isChecked = newAnswer.includes(option)
                  if (isChecked) {
                    const index = newAnswer.indexOf(option)
                    if (index > -1) {
                      newAnswer.splice(index, 1)
                    }
                  } else {
                    newAnswer.push(option)
                  }
                  handleAnswerChange(newAnswer)
                }}
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
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer dark:text-gray-100">
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
            value={currentAnswer === null ? "" : String(currentAnswer)}
            onChange={(e) => handleAnswerChange(e.target.value === "" ? null : Number(e.target.value))}
            placeholder="กรุณาใส่ตัวเลข"
            className="text-center text-lg h-12 rounded-xl border-2 focus:border-blue-400 dark:text-gray-100 dark:placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700"
          />
        )

      case "text":
        return (
          <Textarea
            value={currentAnswer === null ? "" : String(currentAnswer)}
            onChange={(e) => handleAnswerChange(e.target.value.trim() === "" ? null : e.target.value)}
            placeholder="กรุณาใส่คำตอบ"
            className="min-h-[100px] rounded-xl border-2 focus:border-blue-400 dark:text-gray-100 dark:placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700"
          />
        )

      case "multi-select-combobox-with-other":
        return (
          <MultiSelectComboboxWithOther
            options={question.options || []}
            value={Array.isArray(currentAnswer) ? currentAnswer : []}
            onChange={(newValues) => handleAnswerChange(newValues)}
            placeholder={question.description || "เลือกหรือพิมพ์เพื่อค้นหา"}
            otherInputPlaceholder="ระบุข้อมูลอื่นๆ ที่นี่"
          />
        )

      default:
        return null
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden dark:bg-gray-900/90 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-6 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-3 text-gray-800 dark:text-gray-100">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            {question.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{question.description}</p>
            )}
          </div>
          {question.required && (
            <div className="flex items-center text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3 mr-1" />
              จำเป็น
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {renderQuestionInput()}
        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
