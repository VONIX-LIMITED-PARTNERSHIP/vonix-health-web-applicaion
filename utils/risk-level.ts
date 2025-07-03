import { useTranslation } from "@/hooks/use-translation"

export type RiskLevel = "low" | "medium" | "high" | "very-high"

export interface BilingualText {
  th: string
  en: string
}

export interface BilingualArray {
  th: string[]
  en: string[]
}

// Get bilingual text based on current language
export function getBilingualText(bilingualText: BilingualText | string, language: "th" | "en"): string {
  if (typeof bilingualText === "string") {
    return bilingualText
  }
  return bilingualText[language] || bilingualText.th || bilingualText.en || ""
}

// Get bilingual array based on current language
export function getBilingualArray(bilingualArray: BilingualArray | string[], language: "th" | "en"): string[] {
  if (Array.isArray(bilingualArray)) {
    return bilingualArray
  }
  return bilingualArray[language] || bilingualArray.th || bilingualArray.en || []
}

// Risk level translations
export const riskLevelTranslations = {
  th: {
    low: "ความเสี่ยงต่ำ",
    medium: "ความเสี่ยงปานกลาง",
    high: "ความเสี่ยงสูง",
    "very-high": "ความเสี่ยงสูงมาก",
  },
  en: {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    "very-high": "Very High Risk",
  },
}

// Risk level descriptions
export const riskLevelDescriptions = {
  th: {
    low: "สุขภาพดี ควรรักษาระดับปัจจุบัน",
    medium: "สุขภาพปานกลาง ควรปรับปรุงบางด้าน",
    high: "มีความเสี่ยงสูง ควรปรึกษาแพทย์",
    "very-high": "มีความเสี่ยงสูงมาก ควรพบแพทย์โดยเร็ว",
  },
  en: {
    low: "Good health, maintain current level",
    medium: "Moderate health, some improvements needed",
    high: "High risk, consult a doctor",
    "very-high": "Very high risk, see a doctor immediately",
  },
}

// Get risk level text based on language
export function getRiskLevelText(riskLevel: RiskLevel, language: "th" | "en"): string {
  return riskLevelTranslations[language][riskLevel] || riskLevelTranslations.th[riskLevel]
}

// Get risk level description based on language
export function getRiskLevelDescription(riskLevel: RiskLevel, language: "th" | "en"): string {
  return riskLevelDescriptions[language][riskLevel] || riskLevelDescriptions.th[riskLevel]
}

// Get risk level badge CSS classes
export function getRiskLevelBadgeClass(riskLevel: RiskLevel): string {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

  switch (riskLevel) {
    case "low":
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
    case "medium":
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
    case "high":
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`
    case "very-high":
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
  }
}

// Get risk level color for charts/indicators
export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "low":
      return "#10b981" // green-500
    case "medium":
      return "#f59e0b" // amber-500
    case "high":
      return "#f97316" // orange-500
    case "very-high":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
}

// Hook for risk level translations (for backward compatibility)
export function useRiskLevelTranslation() {
  const { language } = useTranslation()

  return {
    getRiskLevelText: (riskLevel: RiskLevel) => getRiskLevelText(riskLevel, language),
    getRiskLevelDescription: (riskLevel: RiskLevel) => getRiskLevelDescription(riskLevel, language),
    getBilingualText: (text: BilingualText | string) => getBilingualText(text, language),
    getBilingualArray: (array: BilingualArray | string[]) => getBilingualArray(array, language),
  }
}

// Export all functions for direct use
