"use client"

import { useLanguage } from "@/contexts/language-context"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export type RiskLevel = "low" | "medium" | "high" | "critical" | "unknown"

/* ------------------------------------------------------------------ */
/*  Metadata (labels, descriptions, colors)                           */
/* ------------------------------------------------------------------ */

interface RiskMetaItem {
  label: { en: string; th: string }
  description: { en: string; th: string }
  color: string // Tailwind color keyword (without intensity, e.g. "green")
}

const RISK_META: Record<RiskLevel, RiskMetaItem> = {
  low: {
    label: { en: "Low", th: "ต่ำ" },
    description: {
      en: "Your health risk is low. Keep up the good habits!",
      th: "ความเสี่ยงด้านสุขภาพของคุณอยู่ในระดับต่ำ รักษาสุขภาพให้ดีต่อไป!",
    },
    color: "green",
  },
  medium: {
    label: { en: "Medium", th: "ปานกลาง" },
    description: {
      en: "Some health risk factors detected. Consider improvements.",
      th: "พบปัจจัยเสี่ยงบางอย่าง ควรปรับพฤติกรรมเพื่อสุขภาพที่ดีขึ้น",
    },
    color: "yellow",
  },
  high: {
    label: { en: "High", th: "สูง" },
    description: {
      en: "High health risk detected. Action is recommended.",
      th: "ความเสี่ยงด้านสุขภาพสูง แนะนำให้ดำเนินการทันที",
    },
    color: "orange",
  },
  critical: {
    label: { en: "Critical", th: "วิกฤต" },
    description: {
      en: "Critical health risk detected. Please consult a doctor.",
      th: "ความเสี่ยงด้านสุขภาพวิกฤต โปรดปรึกษาแพทย์ทันที",
    },
    color: "red",
  },
  unknown: {
    label: { en: "Unknown", th: "ไม่ทราบ" },
    description: {
      en: "Health risk has not been assessed yet.",
      th: "ยังไม่ได้ประเมินความเสี่ยงด้านสุขภาพ",
    },
    color: "gray",
  },
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                  */
/* ------------------------------------------------------------------ */

function normalize(level: string | null | undefined): RiskLevel {
  const key = (level || "").toLowerCase() as RiskLevel
  return key in RISK_META ? (key as RiskLevel) : "unknown"
}

/* ------------------------------------------------------------------ */
/*  Exported helpers                                                  */
/* ------------------------------------------------------------------ */

/** Tailwind text/bg color (e.g. `"text-green-600"`). */
export function getRiskLevelColor(level: string | null | undefined): string {
  const meta = RISK_META[normalize(level)]
  return meta.color
}

/** Badge classes (bg + text) ready to use in shadcn/ui `Badge`. */
export function getRiskLevelBadgeClass(level: string | null | undefined): string {
  const color = getRiskLevelColor(level)
  return `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/20 dark:text-${color}-300`
}

/** English / Thai label based on locale. */
export function getRiskLevelLabel(level: string | null | undefined, locale = "en"): string {
  const meta = RISK_META[normalize(level)]
  return meta.label[locale === "th" ? "th" : "en"]
}

/** Convenience alias required by existing code. */
export const getRiskLevelText = getRiskLevelLabel

/** English / Thai description based on locale. */
export function getRiskLevelDescription(level: string | null | undefined, locale = "en"): string {
  const meta = RISK_META[normalize(level)]
  return meta.description[locale === "th" ? "th" : "en"]
}

/** Return `en` or `th` string depending on locale. */
export function getBilingualText(en: string, th: string, locale: string): string {
  return locale === "th" ? th : en
}

/** Return an English or Thai array depending on locale. */
export function getBilingualArray<T>(arrEn: T[], arrTh: T[], locale: string): T[] {
  return locale === "th" ? arrTh : arrEn
}

/* ------------------------------------------------------------------ */
/*  React hook                                                        */
/* ------------------------------------------------------------------ */

/**
 * Hook that returns pre-bound helpers using the current UI locale.
 * Usage:
 *   const { getRiskLevelLabel } = useRiskLevelTranslation()
 */
export function useRiskLevelTranslation() {
  const { locale } = useLanguage()

  return {
    getRiskLevelLabel: (lvl: string | null | undefined) => getRiskLevelLabel(lvl, locale),
    getRiskLevelText: (lvl: string | null | undefined) => getRiskLevelLabel(lvl, locale),
    getRiskLevelDescription: (lvl: string | null | undefined) => getRiskLevelDescription(lvl, locale),
  }
}
