"use client"

/** Health-risk categories used throughout the app. */
export type RiskLevel = "low" | "medium" | "high" | "very-high" | "unknown"

/** English / Thai pair for a given risk-level value. */
export interface BilingualText {
  en: string
  th: string
}

/** Row model for UI components like <Select>, <RadioGroup>, etc. */
export interface BilingualRiskLevel extends BilingualText {
  value: RiskLevel
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const RISK_LABELS: Record<RiskLevel, BilingualText> = {
  low: { en: "Low Risk", th: "ความเสี่ยงต่ำ" },
  medium: { en: "Medium Risk", th: "ความเสี่ยงปานกลาง" },
  high: { en: "High Risk", th: "ความเสี่ยงสูง" },
  "very-high": { en: "Very High Risk", th: "ความเสี่ยงสูงมาก" },
  unknown: { en: "Unknown", th: "ไม่ทราบ" },
}

/**
 * Return a locale-specific label for a risk level.
 * Defaults to English if the caller passes an unsupported locale.
 */
export function getRiskLevelText(riskLevel: RiskLevel | string, locale: "en" | "th" = "en"): string {
  const level = (riskLevel as RiskLevel) in RISK_LABELS ? (riskLevel as RiskLevel) : "unknown"
  return RISK_LABELS[level][locale] ?? RISK_LABELS[level].en
}

/**
 * Return both EN & TH labels for a single risk level.
 */
export function getBilingualText(riskLevel: RiskLevel | string): BilingualText {
  const level = (riskLevel as RiskLevel) in RISK_LABELS ? (riskLevel as RiskLevel) : "unknown"
  return RISK_LABELS[level]
}

/**
 * Convenience array of all risk levels with EN / TH labels.
 * Handy for form options and table rows.
 */
export function getBilingualArray(): BilingualRiskLevel[] {
  return (Object.keys(RISK_LABELS) as RiskLevel[]).map((value) => ({
    value,
    ...RISK_LABELS[value],
  }))
}

/**
 * Tailwind classes for colouring a shadcn/ui <Badge>.
 */
export function getRiskLevelBadgeClass(riskLevel: RiskLevel | string): string {
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
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
  }
}

/**
 * Plain HEX colour for charts / inline styles.
 */
export function getRiskLevelColor(riskLevel: RiskLevel | string): string {
  switch (riskLevel) {
    case "low":
      return "#22c55e" // emerald-500
    case "medium":
      return "#eab308" // yellow-500
    case "high":
      return "#f97316" // orange-500
    case "very-high":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
}

import { useLanguage } from "@/contexts/language-context"

/**
 * React hook that returns a helper for translating risk‐level
 * enums/strings into the current UI language.
 *
 * Usage:
 *   const { getRiskLevelLabel } = useRiskLevelTranslation()
 *   const label = getRiskLevelLabel("high")   // → "High Risk" or "ความเสี่ยงสูง"
 */
export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  const getRiskLevelLabel = (riskLevel: RiskLevel | string) =>
    getRiskLevelText(riskLevel, locale === "th" ? "th" : "en")

  return { getRiskLevelLabel }
}
