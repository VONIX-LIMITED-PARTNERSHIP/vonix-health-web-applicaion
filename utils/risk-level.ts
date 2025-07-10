"use client"

import { useTranslation } from "@/hooks/use-translation"
import { useMemo } from "react"

/* ------------------------------------------------------------------ */
/*  Top-level translation helpers (needed by other modules)           */
/* ------------------------------------------------------------------ */

export function getRiskLevelText(
  riskLevel: "low" | "medium" | "high" | "very-high" | string,
  locale: "th" | "en" = "th",
): string {
  switch (riskLevel) {
    case "low":
      return locale === "th" ? "ความเสี่ยงต่ำ" : "Low Risk"
    case "medium":
      return locale === "th" ? "ความเสี่ยงปานกลาง" : "Medium Risk"
    case "high":
      return locale === "th" ? "ความเสี่ยงสูง" : "High Risk"
    case "very-high":
      return locale === "th" ? "ความเสี่ยงสูงมาก" : "Very High Risk"
    default:
      return locale === "th" ? "ไม่ระบุ" : "Unspecified"
  }
}

export function getRiskLevelDescription(
  riskLevel: "low" | "medium" | "high" | "very-high" | string,
  locale: "th" | "en" = "th",
): string {
  switch (riskLevel) {
    case "low":
      return locale === "th"
        ? "สุขภาพของคุณอยู่ในเกณฑ์ดี ควรรักษาพฤติกรรมสุขภาพที่ดีต่อไป"
        : "Your health is in good condition. Continue maintaining healthy behaviors."
    case "medium":
      return locale === "th"
        ? "มีปัจจัยเสี่ยงบางอย่าง ควรปรับปรุงพฤติกรรมสุขภาพและติดตามอาการ"
        : "Some risk factors present. Consider improving health behaviors and monitoring symptoms."
    case "high":
      return locale === "th"
        ? "มีความเสี่ยงสูงต่อปัญหาสุขภาพ ควรปรึกษาแพทย์และปรับเปลี่ยนพฤติกรรม"
        : "High risk for health problems. Consult a doctor and make lifestyle changes."
    case "very-high":
      return locale === "th"
        ? "มีความเสี่ยงสูงมาก ควรพบแพทย์โดยเร็วเพื่อรับการตรวจสอบและรักษา"
        : "Very high risk. See a doctor immediately for examination and treatment."
    default:
      return ""
  }
}

export type RiskLevel = "low" | "medium" | "high" | "very-high" | "unknown"

/**
 * Hook to get translated risk level text and descriptions.
 * @returns An object with a function to get translated risk level text and descriptions.
 */
export function useRiskLevelTranslation() {
  const { t, locale } = useTranslation(["common", "risk_level"])

  return useMemo(
    () => ({
      getRiskLevelLabel: (riskLevel: string) => getRiskLevelText(riskLevel, locale),
      getRiskLevelDescription: (riskLevel: string) => getRiskLevelDescription(riskLevel, locale),
    }),
    [locale],
  )
}

/**
 * Returns the Tailwind CSS classes for a risk level badge.
 * Includes dynamic text color for light/dark mode.
 */
export const getRiskLevelBadgeClass = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
    case "very-high":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }
}

/**
 * Helper to get bilingual text from an object, falling back to English if locale not found.
 * Assumes the object has 'th' and 'en' properties.
 */
export const getBilingualText = (obj: any, locale: string): string => {
  if (!obj) return ""
  if (locale === "th" && obj.th) return obj.th
  if (obj.en) return obj.en
  return "" // Fallback if neither is found
}

/**
 * Helper to get bilingual array from an object, falling back to English if locale not found.
 * Assumes the object has 'th' and 'en' properties, each containing an array of strings.
 */
export const getBilingualArray = (obj: any, locale: string): string[] => {
  if (!obj) return []
  if (locale === "th" && Array.isArray(obj.th)) return obj.th
  if (Array.isArray(obj.en)) return obj.en
  return [] // Fallback if neither is found or not an array
}
