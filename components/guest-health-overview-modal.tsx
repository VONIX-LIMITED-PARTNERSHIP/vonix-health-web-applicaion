"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, XCircle, Heart, Activity, Target, Sparkles, Award } from "lucide-react"
import {
  getRiskLevelBadgeClass,
  getRiskLevelColor,
  getRiskLevelText,
  getRiskLevelDescription,
} from "@/utils/risk-level"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import type { AssessmentAnswer } from "@/types/assessment"

interface GuestHealthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentData: {
    category_id: string
    risk_level: string
    completed_at: string
    answers: AssessmentAnswer[]
    ai_analysis?: {
      summary?: { en: string; th: string }
      riskFactors?: { en: string[]; th: string[] }
      recommendations?: { en: string[]; th: string[] }
    }
  } | null
}

export function GuestHealthOverviewModal({ isOpen, onClose, assessmentData }: GuestHealthOverviewModalProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { locale } = useLanguage()
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!assessmentData) {
    return null // Or render a loading/error state
  }

  const riskInfo = {
    label: getRiskLevelText(assessmentData.risk_level, locale === "th" ? "th" : "en"),
    description: getRiskLevelDescription(assessmentData.risk_level, locale === "th" ? "th" : "en"),
    colorClass: getRiskLevelColor(assessmentData.risk_level),
    badgeClass: getRiskLevelBadgeClass(assessmentData.risk_level),
    icon:
      assessmentData.risk_level === "low"
        ? CheckCircle
        : assessmentData.risk_level === "medium"
          ? AlertTriangle
          : XCircle,
    percentage:
      100 - (assessmentData.answers.filter((a) => a.score === 0).length / assessmentData.answers.length) * 100 || 50, // Simple placeholder for score
  }

  const RiskIcon = riskInfo.icon

  const getCategoryTitle = (catId: string) => {
    switch (catId) {
      case "basic":
        return locale === "th" ? "ข้อมูลส่วนตัว" : "Basic Information"
      case "mental":
        return locale === "th" ? "สุขภาพจิต" : "Mental Health"
      case "physical":
        return locale === "th" ? "สุขภาพกาย" : "Physical Health"
      case "lifestyle":
        return locale === "th" ? "วิถีชีวิต" : "Lifestyle"
      default:
        return locale === "th" ? "แบบประเมิน" : "Assessment"
    }
  }

  const categoryTitle = getCategoryTitle(assessmentData.category_id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm animate-pulse-slow">
                <RiskIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold mb-1">
              {t("assessment_results")} {categoryTitle}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-md">{riskInfo.description}</DialogDescription>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Visualization */}
          <div className="text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradientModal)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (isAnimating ? 0 : riskInfo.percentage / 100))}`}
                    className="transition-all duration-2000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradientModal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" /> {/* indigo-500 */}
                      <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${riskInfo.colorClass} animate-count-up`}>
                      {isAnimating ? 0 : Math.round(riskInfo.percentage)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {locale === "th" ? "คะแนนสุขภาพ" : "Health Score"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {assessmentData.category_id !== "basic" && (
              <div className="flex justify-center">
                <Badge
                  className={`${riskInfo.badgeClass} text-lg px-6 py-3 rounded-full font-semibold shadow-md animate-bounce-subtle`}
                >
                  <Award className="h-4 w-4 mr-2" />
                  {riskInfo.label}
                </Badge>
              </div>
            )}
          </div>

          {/* AI Summary (if available) */}
          {assessmentData.ai_analysis?.summary && (
            <Card className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="p-0">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {locale === "th" ? "สรุปผลการประเมิน" : "Assessment Summary"}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {locale === "th" ? assessmentData.ai_analysis.summary.th : assessmentData.ai_analysis.summary.en}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
              <Activity className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-600">{assessmentData.answers.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t("questions_answered")}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center">
              <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-600">
                {assessmentData.ai_analysis?.riskFactors?.[locale === "th" ? "th" : "en"]?.length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t("risk_factors")}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 text-center">
              <Sparkles className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-600">
                {assessmentData.ai_analysis?.recommendations?.[locale === "th" ? "th" : "en"]?.length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{t("recommendations")}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              onClose()
              router.push(`/guest-assessment/results?category=${assessmentData.category_id}`)
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            {t("view_full_results")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg font-semibold transition-all duration-200 bg-transparent"
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </Dialog>
  )
}
