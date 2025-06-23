"use client"

import { useLanguage } from "@/contexts/language-context"
import th from "@/locales/th"
import en from "@/locales/en"

type TranslationKeys = typeof th.common // Assuming all common keys are in th.ts

export function useTranslation() {
  const { locale } = useLanguage()

  const translations = locale === "en" ? en : th

  const t = (key: keyof TranslationKeys["common"]) => {
    return translations.common[key] || key // Fallback to key if translation not found
  }

  return { t, locale }
}
