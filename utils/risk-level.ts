"use client"

import { useTranslation } from "@/hooks/use-translation"

// Risk level translation utility
export function useRiskLevelTranslation() {
  const { t, locale } = useTranslation()

  const getRiskLevelLabel = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return locale === "en" ? "Low Risk" : "ความเสี่ยงต่ำ"
      case "medium":
      case "ปานกลาง":
        return locale === "en" ? "Medium Risk" : "ความเสี่ยงปานกลาง"
      case "high":
      case "สูง":
        return locale === "en" ? "High Risk" : "ความเสี่ยงสูง"
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return locale === "en" ? "Very High Risk" : "ความเสี่ยงสูงมาก"
      default:
        return locale === "en" ? "Unknown" : "ไม่ระบุ"
    }
  }

  const getRiskLevelBadgeClass = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
      case "medium":
      case "ปานกลาง":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
      case "high":
      case "สูง":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRiskLevelDescription = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return locale === "en" ? "Your assessment results are in good range" : "ผลการประเมินของคุณอยู่ในเกณฑ์ดี"
      case "medium":
      case "ปานกลาง":
        return locale === "en" ? "Should pay attention and monitor symptoms" : "ควรให้ความสำคัญและติดตามอาการ"
      case "high":
      case "สูง":
        return locale === "en"
          ? "Recommend consulting a doctor for further examination"
          : "แนะนำให้ปรึกษาแพทย์เพื่อการตรวจสอบเพิ่มเติม"
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return locale === "en" ? "Recommend consulting a doctor urgently" : "แนะนำให้ปรึกษาแพทย์โดยด่วน"
      default:
        return locale === "en" ? "Assessment results" : "ผลการประเมิน"
    }
  }

  return {
    getRiskLevelLabel,
    getRiskLevelBadgeClass,
    getRiskLevelDescription,
    locale,
  }
}
