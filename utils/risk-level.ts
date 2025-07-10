"use client"

/**
 * Utilities for translating and styling health-risk levels.
 */

import { useLanguage } from "@/contexts/language-context"

/* -------------------------------------------------------------------------- */
/* Types & static tables                                                      */
/* -------------------------------------------------------------------------- */

export type RiskLevel = "low" | "medium" | "high" | "very-high" | "unknown"

type Lang = "en" | "th"

interface RiskMeta {
  label: { en: string; th: string }
  description: { en: string; th: string }
  color: string // Tailwind text-color class
}

const RISK_META: Record<RiskLevel, RiskMeta> = {
  low: {
    label: { en: "Low", th: "ต่ำ" },
    description: {
      en: "Your risk is low. Keep up the healthy lifestyle.",
      th: "ความเสี่ยงของคุณต่ำ รักษาวิถีชีวิตที่ดีต่อไป",
    },
    color: "text-green-600",
  },
  medium: {
    label: { en: "Medium", th: "ปานกลาง" },
    description: {
      en: "Your risk is moderate. Some improvements are advised.",
      th: "ความเสี่ยงปานกลาง ควรปรับปรุงพฤติกรรมบางอย่าง",
    },
    color: "text-yellow-600",
  },
  high: {
    label: { en: "High", th: "สูง" },
    description: {
      en: "Your risk is high. Consult a health professional.",
      th: "ความเสี่ยงสูง ควรปรึกษาผู้เชี่ยวชาญด้านสุขภาพ",
    },
    color: "text-orange-600",
  },
  "very-high": {
    label: { en: "Very High", th: "สูงมาก" },
    description: {
      en: "Your risk is very high! Seek medical advice urgently.",
      th: "ความเสี่ยงสูงมาก! ควรพบแพทย์โดยด่วน",
    },
    color: "text-red-600",
  },
  unknown: {
    label: { en: "Unknown", th: "ไม่ทราบ" },
    description: {
      en: "Risk level could not be determined.",
      th: "ไม่สามารถระบุระดับความเสี่ยงได้",
    },
    color: "text-gray-500",
  },
}

/* -------------------------------------------------------------------------- */
/* Pure helpers                                                               */
/* -------------------------------------------------------------------------- */

/** Normalises any input string into a `RiskLevel` key or "unknown". */
function normalise(level?: string | null): RiskLevel {
  const key = level?.toLowerCase?.() as RiskLevel | undefined
  return key && key in RISK_META ? key : "unknown"
}

/** e.g. "Low" / "ต่ำ" */
export function getRiskLevelLabel(level?: string, lang: Lang = "en"): string {
  return RISK_META[normalise(level)].label[lang]
}

/** Localised sentence-length explanation */
export function getRiskLevelDescription(level?: string, lang: Lang = "en"): string {
  return RISK_META[normalise(level)].description[lang]
}

/** Alias kept for backwards compatibility */
export const getRiskLevelText = getRiskLevelLabel

/** Tailwind text-color class (e.g. "text-red-600") */
export function getRiskLevelColor(level?: string): string {
  return RISK_META[normalise(level)].color
}

/** Tailwind classes for a coloured badge background/foreground */
export function getRiskLevelBadgeClass(level?: string): string {
  switch (normalise(level)) {
    case "low":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
    case "very-high":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }
}

/* Generic bilingual helpers some pages call directly */
export function getBilingualText(en: string, th: string, lang: Lang = "en") {
  return lang === "th" ? th : en
}
export function getBilingualArray<T>(enArr: T[], thArr: T[], lang: Lang = "en") {
  return lang === "th" ? thArr : enArr
}

/* -------------------------------------------------------------------------- */
/* React-aware hook                                                           */
/* -------------------------------------------------------------------------- */

export function useRiskLevelTranslation() {
  const { locale } = useLanguage()
  const lang: Lang = locale === "th" ? "th" : "en"

  return {
    getRiskLevelLabel: (level?: string) => getRiskLevelLabel(level, lang),
    getRiskLevelDescription: (level?: string) => getRiskLevelDescription(level, lang),
    // handy extras
    getRiskLevelColor,
    getRiskLevelBadgeClass,
  }
}
