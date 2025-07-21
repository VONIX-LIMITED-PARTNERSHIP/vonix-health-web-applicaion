"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment"
import { AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react"
import { MultiSelectComboboxWithOther } from "@/components/ui/multi-select-combobox-with-other"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

interface QuestionCardProps {
  question: AssessmentQuestion
  answer?: AssessmentAnswer
  onAnswer: (questionId: string, answer: string | number | string[] | null, score: number, isValid: boolean) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const { t } = useTranslation(["common", "assessment"])
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
  const [isValid, setIsValid] = useState<boolean>(false)

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
        return { valid: false, message: "" }
      }
    }

    switch (question.type) {
      case "number":
        // ตรวจสอบค่าลบสำหรับ input ประเภท number
        if (typeof value === "number" && value < 0) {
          return { valid: false, message: t("no_negative_numbers") }
        }
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่ หากมีค่า
        if (value !== null && value !== undefined && typeof value !== "number") {
          return { valid: false, message: t("enter_valid_number") }
        }
        return { valid: true, message: null }

      case "text":
        // ตรวจสอบอักขระพิเศษสำหรับ input ประเภท text
        if (typeof value === "string" && value.trim() !== "" && !textRegex.test(value)) {
          return { valid: false, message: t("invalid_characters") }
        }
        return { valid: true, message: null }

      case "checkbox":
      case "multi-select-combobox-with-other":
        // ตรวจสอบว่าคำถามที่จำเป็นต้องมีคำตอบหรือไม่ (ยังคงอยู่)
        if (question.required) {
          if (Array.isArray(value) && value.length === 0) {
            return { valid: false, message: t("please_answer_question") }
          }
        }
        // สำหรับ checkbox ยังคงตรวจสอบอักขระพิเศษ
        if (question.type === "checkbox" && Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string" && !textRegex.test(item)) {
              return { valid: false, message: t("invalid_characters_in_options") }
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
    setIsValid(initialValidation.valid)
    onAnswer(question.id, initialValue, 0, initialValidation.valid)
  }, [question.id, answer?.answer])

  const handleAnswerChange = (value: string | number | string[] | null) => {
    setCurrentAnswer(value)
    const validationResult = validateInput(value)
    setError(validationResult.message)
    setIsValid(validationResult.valid)
    onAnswer(question.id, value, 0, validationResult.valid)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple-choice":
      case "rating":
      case "yes-no":
        const yesNoOptions = question.options || ["ใช่", "ไม่ใช่"]
        return (
          <div className="space-y-4">
            <RadioGroup
              value={String(currentAnswer)}
              onValueChange={(value) => handleAnswerChange(value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {yesNoOptions.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-center space-x-3 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                    "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600",
                    "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",
                    String(currentAnswer) === option
                      ? "bg-blue-50 border-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-400"
                      : "bg-white border-gray-200 dark:bg-gray-800/30 dark:border-gray-700",
                    "group",
                  )}
                  onClick={() => handleAnswerChange(option)}
                >
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} className="border-2 w-5 h-5" />
                  <Label
                    htmlFor={`${question.id}-${index}`}
                    className="flex-1 cursor-pointer text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  >
                    {option}
                  </Label>
                  {String(currentAnswer) === option && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              ))}
            </RadioGroup>

            {question.type === "rating" && (
              <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2 mt-4">
                <span>{t("minimum")}</span>
                <span>{t("maximum")}</span>
              </div>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "relative flex items-center space-x-3 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600",
                  "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",
                  Array.isArray(currentAnswer) && currentAnswer.includes(option)
                    ? "bg-blue-50 border-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-400"
                    : "bg-white border-gray-200 dark:bg-gray-800/30 dark:border-gray-700",
                  "group",
                )}
                onClick={() => {
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
                  className="w-5 h-5 border-2"
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="flex-1 cursor-pointer text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                >
                  {option}
                </Label>
                {Array.isArray(currentAnswer) && currentAnswer.includes(option) && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                )}
              </div>
            ))}
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={currentAnswer === null ? "" : String(currentAnswer)}
              onChange={(e) => handleAnswerChange(e.target.value === "" ? null : Number(e.target.value))}
              placeholder={t("enter_number_placeholder")}
              className={cn(
                "text-center text-base sm:text-lg h-12 sm:h-14 rounded-xl border-2 transition-all duration-200",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-100",
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
                isValid && currentAnswer !== null ? "border-green-500" : "",
              )}
            />
          </div>
        )

      case "text":
        return (
          <div className="space-y-2">
            <Textarea
              value={currentAnswer === null ? "" : String(currentAnswer)}
              onChange={(e) => handleAnswerChange(e.target.value.trim() === "" ? null : e.target.value)}
              placeholder={t("enter_answer_placeholder")}
              className={cn(
                "min-h-[100px] sm:min-h-[120px] rounded-xl border-2 transition-all duration-200 resize-none",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-100",
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
                isValid && currentAnswer !== null ? "border-green-500" : "",
              )}
            />
          </div>
        )

      case "multi-select-combobox-with-other":
        return (
          <div className="space-y-2">
            <MultiSelectComboboxWithOther
              options={question.options || []}
              value={Array.isArray(currentAnswer) ? currentAnswer : []}
              onChange={(newValues) => handleAnswerChange(newValues)}
              placeholder={question.description || t("select_or_search")}
              otherInputPlaceholder="ระบุข้อมูลอื่นๆ ที่นี่"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden dark:bg-gray-900/95 dark:border-gray-800/50">
      <CardHeader className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))] dark:bg-grid-slate-700/25" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 mt-1">
                  <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100 leading-tight">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </CardTitle>
                  {question.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      {question.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {question.required && (
                <div className="flex items-center text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span>{t("required")}</span>
                </div>
              )}

              {isValid && currentAnswer !== null && (
                <div className="flex items-center text-green-600 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span>{t("correct")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          {renderQuestionInput()}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
