"use client"

import { HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"

export function ScoreInfoPopover() {
  const { t } = useTranslation()
  const { locale } = useLanguage()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ml-1"
          aria-label={locale === "th" ? "ข้อมูลเกี่ยวกับคะแนนความเสี่ยง" : "Risk score information"}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center" side="top">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              {locale === "th" ? "คะแนนความเสี่ยงคืออะไร?" : "What is Risk Score?"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {locale === "th" ? "การแปลผลคะแนนความเสี่ยงต่อสุขภาพ" : "Health risk score interpretation"}
            </p>
          </div>

          {/* Score Ranges - Lower is better */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">0-20%</span>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {locale === "th" ? "ความเสี่ยงต่ำมาก" : "Very Low Risk"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">21-40%</span>
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">
                {locale === "th" ? "ความเสี่ยงต่ำ" : "Low Risk"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">41-60%</span>
              </div>
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {locale === "th" ? "ความเสี่ยงปานกลาง" : "Medium Risk"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">61-80%</span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400">
                {locale === "th" ? "ความเสี่ยงสูง" : "High Risk"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">81-100%</span>
              </div>
              <span className="text-xs text-red-600 dark:text-red-400">
                {locale === "th" ? "ความเสี่ยงสูงมาก" : "Very High Risk"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="mb-2">
              <strong className="text-gray-800 dark:text-gray-200">{locale === "th" ? "หมายเหตุ" : "Note"}:</strong>
            </p>
            <p>
              {locale === "th"
                ? "คะแนนความเสี่ยงคำนวณจากคำตอบของคุณในแบบประเมิน โดยคะแนนที่ต่ำกว่าแสดงถึงความเสี่ยงที่น้อยกว่า และสุขภาพที่ดีกว่า"
                : "Risk score is calculated from your assessment answers. Lower scores indicate lower risk and better health status"}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
            <strong>{locale === "th" ? "ข้อควรระวัง" : "Disclaimer"}:</strong>{" "}
            {locale === "th"
              ? "คะแนนนี้เป็นเพียงข้อมูลเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีคะแนนสูงหรือมีข้อกังวล ควรปรึกษาแพทย์"
              : "This score is for informational purposes only and cannot replace medical diagnosis. If you have a high score or concerns, please consult a doctor"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
