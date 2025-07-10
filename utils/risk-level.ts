"use client"

export type RiskLevel = "low" | "moderate" | "high" | "critical" | "unknown"

export interface BilingualText {
  en: string
  th: string
}

export interface RiskLevelMeta {
  label: BilingualText
  description: BilingualText
  color: string
  badgeClass: string
}

const RISK_META: Record<RiskLevel, RiskLevelMeta> = {
  low: {
    label: { en: "Low Risk", th: "ความเสี่ยงต่ำ" },
    description: { en: "Your health indicators are within normal ranges.", th: "ตัวชี้วัดสุขภาพของคุณอยู่ในเกณฑ์ปกติ" },
    color: "#22c55e",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
  },
  moderate: {
    label: { en: "Moderate Risk", th: "ความเสี่ยงปานกลาง" },
    description: { en: "Some health indicators need attention.", th: "ตัวชี้วัดสุขภาพบางอย่างต้องการความใส่ใจ" },
    color: "#f59e0b",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  high: {
    label: { en: "High Risk", th: "ความเสี่ยงสูง" },
    description: {
      en: "Multiple health indicators require immediate attention.",
      th: "ตัวชี้วัดสุขภาพหลายอย่างต้องการความใส่ใจทันที",
    },
    color: "#ef4444",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
  },
  critical: {
    label: { en: "Critical Risk", th: "ความเสี่ยงวิกฤต" },
    description: { en: "Urgent medical consultation recommended.", th: "แนะนำให้ปรึกษาแพทย์อย่างเร่งด่วน" },
    color: "#dc2626",
    badgeClass: "bg-red-200 text-red-900 border-red-300",
  },
  unknown: {
    label: { en: "Unknown", th: "ไม่ทราบ" },
    description: { en: "Unable to determine risk level.", th: "ไม่สามารถระบุระดับความเสี่ยงได้" },
    color: "#6b7280",
    badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

function normalizeRiskLevel(level: string | null | undefined): RiskLevel {
  if (!level) return "unknown"
  const normalized = level.toLowerCase().trim()
  if (normalized === "low") return "low"
  if (normalized === "moderate" || normalized === "medium") return "moderate"
  if (normalized === "high") return "high"
  if (normalized === "critical" || normalized === "severe") return "critical"
  return "unknown"
}

export function getRiskLevelLabel(level: string | null | undefined, language: "en" | "th" = "en"): string {
  const normalizedLevel = normalizeRiskLevel(level)
  return RISK_META[normalizedLevel].label[language]
}

export function getRiskLevelDescription(level: string | null | undefined, language: "en" | "th" = "en"): string {
  const normalizedLevel = normalizeRiskLevel(level)
  return RISK_META[normalizedLevel].description[language]
}

export function getRiskLevelColor(level: string | null | undefined): string {
  const normalizedLevel = normalizeRiskLevel(level)
  return RISK_META[normalizedLevel].color
}

export function getRiskLevelBadgeClass(level: string | null | undefined): string {
  const normalizedLevel = normalizeRiskLevel(level)
  return RISK_META[normalizedLevel].badgeClass
}

// Alias for backward compatibility
export const getRiskLevelText = getRiskLevelLabel

export function getBilingualText(text: BilingualText, language: "en" | "th" = "en"): string {
  return text[language] || text.en || "N/A"
}

export function getBilingualArray<T extends { label: BilingualText }>(
  items: T[],
  language: "en" | "th" = "en",
): Array<T & { displayLabel: string }> {
  return items.map((item) => ({
    ...item,
    displayLabel: getBilingualText(item.label, language),
  }))
}

export function useRiskLevelTranslation(language: "en" | "th" = "en") {
  return {
    getRiskLevelLabel: (level: string | null | undefined) => getRiskLevelLabel(level, language),
    getRiskLevelDescription: (level: string | null | undefined) => getRiskLevelDescription(level, language),
    getRiskLevelText: (level: string | null | undefined) => getRiskLevelLabel(level, language),
    getRiskLevelColor,
    getRiskLevelBadgeClass,
    language,
  }
}
