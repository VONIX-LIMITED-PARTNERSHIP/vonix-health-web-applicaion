"use client"

import { useLanguage } from "@/contexts/language-context"
import type { BilingualText, BilingualArray } from "@/types/assessment"

export type RiskLevel = "low" | "medium" | "high" | "very-high"

export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "low":
      return "text-green-600 dark:text-green-400"
    case "medium":
      return "text-yellow-600 dark:text-yellow-400"
    case "high":
      return "text-orange-600 dark:text-orange-400"
    case "very-high":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

export function getRiskLevelBadgeClass(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "very-high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function getRiskLevelText(riskLevel: RiskLevel, locale = "th"): string {
  const translations = {
    low: {
      th: "ความเสี่ยงต่ำ",
      en: "Low Risk",
    },
    medium: {
      th: "ความเสี่ยงปานกลาง",
      en: "Medium Risk",
    },
    high: {
      th: "ความเสี่ยงสูง",
      en: "High Risk",
    },
    "very-high": {
      th: "ความเสี่ยงสูงมาก",
      en: "Very High Risk",
    },
  }

  return translations[riskLevel]?.[locale as keyof typeof translations.low] || translations[riskLevel]?.th || riskLevel
}

export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  const getRiskLevelLabel = (riskLevel: RiskLevel): string => {
    return getRiskLevelText(riskLevel, locale)
  }

  const getRiskLevelColorClass = (riskLevel: RiskLevel): string => {
    return getRiskLevelColor(riskLevel)
  }

  const getRiskLevelBadgeColorClass = (riskLevel: RiskLevel): string => {
    return getRiskLevelBadgeClass(riskLevel)
  }

  return {
    getRiskLevelLabel,
    getRiskLevelColorClass,
    getRiskLevelBadgeColorClass,
  }
}

// Helper functions for bilingual data
export function getBilingualText(data: BilingualText | string, locale = "th"): string {
  if (typeof data === "string") {
    return data
  }
  return data[locale as keyof BilingualText] || data.th || ""
}

export function getBilingualArray(data: BilingualArray | string[], locale = "th"): string[] {
  if (Array.isArray(data)) {
    return data
  }
  return data[locale as keyof BilingualArray] || data.th || []
}
