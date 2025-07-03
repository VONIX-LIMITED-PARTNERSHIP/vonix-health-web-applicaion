"use client"

import { useLanguage } from "@/contexts/language-context"

export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  const getRiskLevelLabel = (riskLevel: string) => {
    const labels = {
      th: {
        low: "ความเสี่ยงต่ำ",
        medium: "ความเสี่ยงปานกลาง",
        high: "ความเสี่ยงสูง",
        "very-high": "ความเสี่ยงสูงมาก",
        very_high: "ความเสี่ยงสูงมาก",
      },
      en: {
        low: "Low Risk",
        medium: "Medium Risk",
        high: "High Risk",
        "very-high": "Very High Risk",
        very_high: "Very High Risk",
      },
    }
    return (
      labels[locale][riskLevel as keyof typeof labels.th] || labels.th[riskLevel as keyof typeof labels.th] || riskLevel
    )
  }

  const getRiskLevelDescription = (riskLevel: string) => {
    const descriptions = {
      th: {
        low: "สุขภาพดี ควรรักษาพฤติกรรมที่ดีต่อไป",
        medium: "ควรปรับปรุงพฤติกรรมและติดตามสุขภาพ",
        high: "ควรปรึกษาแพทย์และปรับเปลี่ยนพฤติกรรมทันที",
        "very-high": "ควรพบแพทย์เร่งด่วนและปรับเปลี่ยนพฤติกรรมทันที",
        very_high: "ควรพบแพทย์เร่งด่วนและปรับเปลี่ยนพฤติกรรมทันที",
      },
      en: {
        low: "Good health, continue maintaining good habits",
        medium: "Should improve habits and monitor health",
        high: "Should consult a doctor and change habits immediately",
        "very-high": "Should see a doctor urgently and change habits immediately",
        very_high: "Should see a doctor urgently and change habits immediately",
      },
    }
    return (
      descriptions[locale][riskLevel as keyof typeof descriptions.th] ||
      descriptions.th[riskLevel as keyof typeof descriptions.th] ||
      ""
    )
  }

  const getRiskLevelBadgeClass = (riskLevel: string): string => {
    const badgeClasses = {
      th: {
        low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
        medium: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
        high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
        "very-high": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
        very_high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
      },
      en: {
        low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
        medium: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
        high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
        "very-high": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
        very_high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
      },
    }
    return (
      badgeClasses[locale][riskLevel as keyof typeof badgeClasses.th] ??
      badgeClasses.th[riskLevel as keyof typeof badgeClasses.th] ??
      "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
    )
  }

  return {
    getRiskLevelLabel,
    getRiskLevelBadgeClass,
    getRiskLevelDescription,
  }
}
