"use client"

import { useLanguage } from "@/contexts/language-context"

// Risk level translations
const riskLevelTranslations = {
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

// Risk level descriptions
const riskLevelDescriptions = {
  low: {
    th: "สุขภาพของคุณอยู่ในเกณฑ์ดี ควรรักษาพฤติกรรมสุขภาพที่ดีต่อไป",
    en: "Your health is in good condition. Continue maintaining healthy behaviors.",
  },
  medium: {
    th: "มีปัจจัยเสี่ยงบางอย่าง ควรปรับปรุงพฤติกรรมสุขภาพและติดตามอาการ",
    en: "Some risk factors present. Consider improving health behaviors and monitoring symptoms.",
  },
  high: {
    th: "มีความเสี่ยงสูงต่อปัญหาสุขภาพ ควรปรึกษาแพทย์และปรับเปลี่ยนพฤติกรรม",
    en: "High risk for health problems. Consult a doctor and make lifestyle changes.",
  },
  "very-high": {
    th: "มีความเสี่ยงสูงมาก ควรพบแพทย์โดยเร็วเพื่อรับการตรวจสอบและรักษา",
    en: "Very high risk. See a doctor immediately for examination and treatment.",
  },
}

// Helper functions for getting risk level information
export function getRiskLevelText(riskLevel: string, locale = "th"): string {
  const level = riskLevel as keyof typeof riskLevelTranslations
  return riskLevelTranslations[level]?.[locale as "th" | "en"] || riskLevel
}

export function getRiskLevelDescription(riskLevel: string, locale = "th"): string {
  const level = riskLevel as keyof typeof riskLevelDescriptions
  return riskLevelDescriptions[level]?.[locale as "th" | "en"] || ""
}

export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case "low":
      return "text-green-600"
    case "medium":
      return "text-yellow-600"
    case "high":
      return "text-orange-600"
    case "very-high":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export function getRiskLevelBadgeClass(riskLevel: string): string {
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

// Bilingual data helpers
export function getBilingualText(bilingualText: any, locale = "th"): string {
  if (typeof bilingualText === "string") {
    return bilingualText
  }
  if (typeof bilingualText === "object" && bilingualText !== null) {
    return bilingualText[locale as "th" | "en"] || bilingualText.th || bilingualText.en || ""
  }
  return ""
}

export function getBilingualArray(bilingualArray: any, locale = "th"): string[] {
  if (Array.isArray(bilingualArray)) {
    return bilingualArray
  }
  if (typeof bilingualArray === "object" && bilingualArray !== null) {
    const result = bilingualArray[locale as "th" | "en"] || bilingualArray.th || bilingualArray.en
    return Array.isArray(result) ? result : []
  }
  return []
}

// Hook for risk level translations (for backward compatibility)
export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  const getRiskLevelLabel = (riskLevel: string) => {
    return getRiskLevelText(riskLevel, locale)
  }

  const getRiskLevelDescription = (riskLevel: string) => {
    return getRiskLevelDescription(riskLevel, locale)
  }

  return {
    getRiskLevelLabel,
    getRiskLevelDescription,
  }
}
