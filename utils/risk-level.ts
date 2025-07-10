/**
 * Central helpers for mapping risk-level strings to display text, colors, etc.
 * Every function is pure so it can be re-used in Server or Client Components.
 */

export type RiskLevel = "low" | "medium" | "high" | "critical" | "unknown"

interface RiskMeta {
  label: { en: string; th: string }
  description: { en: string; th: string }
  color: string // tailwind color e.g. bg-green-500
  badgeClass: string // ready-to-use badge classes
}

const RISK_META: Record<RiskLevel, RiskMeta> = {
  low: {
    label: { en: "Low", th: "ต่ำ" },
    description: {
      en: "Your current health risk is low.",
      th: "ความเสี่ยงด้านสุขภาพของคุณอยู่ในระดับต่ำ",
    },
    color: "green-500",
    badgeClass: "bg-green-500 text-white",
  },
  medium: {
    label: { en: "Medium", th: "ปานกลาง" },
    description: {
      en: "You have a moderate health risk.",
      th: "คุณมีความเสี่ยงปานกลางด้านสุขภาพ",
    },
    color: "yellow-500",
    badgeClass: "bg-yellow-500 text-black",
  },
  high: {
    label: { en: "High", th: "สูง" },
    description: {
      en: "Your health risk is high.",
      th: "คุณมีความเสี่ยงด้านสุขภาพสูง",
    },
    color: "orange-500",
    badgeClass: "bg-orange-500 text-white",
  },
  critical: {
    label: { en: "Critical", th: "วิกฤต" },
    description: {
      en: "Immediate attention required!",
      th: "ต้องการการดูแลทันที!",
    },
    color: "red-600",
    badgeClass: "bg-red-600 text-white",
  },
  unknown: {
    label: { en: "Unknown", th: "ไม่ทราบ" },
    description: {
      en: "Risk data is unavailable.",
      th: "ไม่พบข้อมูลความเสี่ยง",
    },
    color: "gray-400",
    badgeClass: "bg-gray-400 text-black",
  },
}

/* ────────────────────────────  Normalisation  ─────────────────────────────── */

function normalise(level?: string | null): RiskLevel {
  if (!level) return "unknown"
  const key = level.toLowerCase() as RiskLevel
  return (Object.keys(RISK_META) as RiskLevel[]).includes(key) ? key : "unknown"
}

/* ────────────────────────────  Basic helpers  ─────────────────────────────── */

export function getRiskLevelLabel(level?: string | null, lang: "en" | "th" = "en") {
  return RISK_META[normalise(level)].label[lang]
}

// Alias kept for backwards-compat
export const getRiskLevelText = getRiskLevelLabel

export function getRiskLevelDescription(level?: string | null, lang: "en" | "th" = "en") {
  return RISK_META[normalise(level)].description[lang]
}

export function getRiskLevelColor(level?: string | null) {
  return RISK_META[normalise(level)].color
}

export function getRiskLevelBadgeClass(level?: string | null) {
  return RISK_META[normalise(level)].badgeClass
}

/* ────────────────────────────  i18n helpers  ──────────────────────────────── */

export function getBilingualText(enText: string, thText: string, lang: "en" | "th") {
  return lang === "th" ? thText : enText
}

export function getBilingualArray<T extends { en: string; th: string }>(items: T[], lang: "en" | "th") {
  return items.map((i) => (lang === "th" ? i.th : i.en))
}

/**
 * React-ish helper returning memoised label / description getters
 * but can safely be called outside React.
 */
export function useRiskLevelTranslation(lang: "en" | "th" = "en") {
  return {
    getRiskLevelLabel: (lvl?: string | null) => getRiskLevelLabel(lvl, lang),
    getRiskLevelText: (lvl?: string | null) => getRiskLevelLabel(lvl, lang),
    getRiskLevelDescription: (lvl?: string | null) => getRiskLevelDescription(lvl, lang),
  }
}
