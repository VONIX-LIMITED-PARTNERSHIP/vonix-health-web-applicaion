import { useTranslation } from "@/hooks/use-translation"

// ฟังก์ชัน helper สำหรับแปลระดับความเสี่ยง
export function useRiskLevelTranslation() {
  const { t } = useTranslation()

  const getRiskLevelLabel = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return t("risk_level_low")
      case "medium":
      case "ปานกลาง":
        return t("risk_level_medium")
      case "high":
      case "สูง":
        return t("risk_level_high")
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return t("risk_level_very_high")
      default:
        return t("risk_level_unknown")
    }
  }

  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return "text-green-600"
      case "medium":
      case "ปานกลาง":
        return "text-yellow-600"
      case "high":
      case "สูง":
        return "text-orange-600"
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskLevelBadgeClass = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
      case "medium":
      case "ปานกลาง":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
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

  return {
    getRiskLevelLabel,
    getRiskLevelColor,
    getRiskLevelBadgeClass,
  }
}
