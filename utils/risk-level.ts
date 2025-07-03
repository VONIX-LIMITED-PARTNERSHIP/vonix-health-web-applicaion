"use client"

import type { BilingualText, BilingualArray } from "@/types/assessment"

export type RiskLevel = "low" | "medium" | "high" | "very-high"

export const getRiskLevelText = (riskLevel: RiskLevel, locale: "th" | "en" = "th"): string => {
  const riskLevelTexts = {
    low: { th: "ความเสี่ยงต่ำ", en: "Low Risk" },
    medium: { th: "ความเสี่ยงปานกลาง", en: "Medium Risk" },
    high: { th: "ความเสี่ยงสูง", en: "High Risk" },
    "very-high": { th: "ความเสี่ยงสูงมาก", en: "Very High Risk" },
  }

  return riskLevelTexts[riskLevel][locale]
}

export const getRiskLevelColor = (riskLevel: RiskLevel): string => {
  const colors = {
    low: "text-green-600 dark:text-green-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    high: "text-orange-600 dark:text-orange-400",
    "very-high": "text-red-600 dark:text-red-400",
  }

  return colors[riskLevel]
}

export const getRiskLevelBadgeClass = (riskLevel: RiskLevel): string => {
  const badgeClasses = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "very-high": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  return badgeClasses[riskLevel]
}

export const getRiskLevelDescription = (riskLevel: RiskLevel, locale: "th" | "en" = "th"): string => {
  const descriptions = {
    low: {
      th: "สุขภาพของคุณอยู่ในเกณฑ์ดี ควรรักษาพฤติกรรมสุขภาพที่ดีต่อไป",
      en: "Your health is in good condition. Continue maintaining good health behaviors.",
    },
    medium: {
      th: "มีปัจจัยเสี่ยงบางอย่างที่ควรให้ความสนใจ แนะนำให้ปรับปรุงพฤติกรรมสุขภาพ",
      en: "There are some risk factors that need attention. We recommend improving your health behaviors.",
    },
    high: {
      th: "พบปัจจัยเสี่ยงที่สำคัญหลายอย่าง ควรปรึกษาแพทย์และปรับเปลี่ยนพฤติกรรมโดยเร็ว",
      en: "Several important risk factors found. You should consult a doctor and change behaviors quickly.",
    },
    "very-high": {
      th: "พบปัจจัยเสี่ยงสูงมาก ควรพบแพทย์โดยเร็วที่สุดเพื่อรับการตรวจและรักษา",
      en: "Very high risk factors found. You should see a doctor as soon as possible for examination and treatment.",
    },
  }

  return descriptions[riskLevel][locale]
}

// Helper functions for bilingual data
export const getBilingualText = (data: string | BilingualText, locale: "th" | "en" = "th"): string => {
  if (typeof data === "string") {
    return data // Backward compatibility for old data
  }
  return data[locale] || data.th || ""
}

export const getBilingualArray = (data: string[] | BilingualArray, locale: "th" | "en" = "th"): string[] => {
  if (Array.isArray(data)) {
    return data // Backward compatibility for old data
  }
  return data[locale] || data.th || []
}

// ---------------------------------------------
// React-hook version for components that expect it
// ---------------------------------------------
import { useLanguage } from "@/contexts/language-context"

/**
 * Legacy-compatible hook that returns helpers already
 * defined above, wired to the current locale from
 * LanguageProvider / LanguageContext.
 */
export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  const getRiskLevelLabel = (riskLevel: RiskLevel) => getRiskLevelText(riskLevel, locale)

  const getRiskLevelBadgeClassLocal = (riskLevel: RiskLevel) => getRiskLevelBadgeClass(riskLevel)

  const getRiskLevelDescriptionLocal = (riskLevel: RiskLevel) => getRiskLevelDescription(riskLevel, locale)

  return {
    getRiskLevelLabel,
    getRiskLevelBadgeClass: getRiskLevelBadgeClassLocal,
    getRiskLevelDescription: getRiskLevelDescriptionLocal,
    locale,
  }
}
