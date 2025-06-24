"use client"

import { useContext } from "react"
import { LanguageContext } from "@/contexts/language-context"
import th from "@/locales/th"
import en from "@/locales/en"

/**
 * Basic translation hook.
 * Pass an array of namespaces you want to use (e.g. ["common","profile"]).
 * The hook will look up keys in those namespaces, falling back to the key itself.
 */
export function useTranslation(namespaces: string[] = ["common"]) {
  // หากไม่ได้อยู่ภายใต้ <LanguageProvider> ให้ fallback เป็น "th"
  const context = useContext(LanguageContext)
  const locale = context?.locale ?? "th"

  // Pick the proper dictionary
  const dict = locale === "en" ? en : th

  function t(key: string): string {
    // 1. If the key includes a namespace ("namespace.key"), resolve deeply.
    if (key.includes(".")) {
      const [ns, subKey] = key.split(".")
      // Only look up if the namespace is one of the requested ones
      if (namespaces.includes(ns) && dict[ns]?.[subKey] !== undefined) {
        // @ts-ignore – dynamic index access
        return dict[ns][subKey]
      }
    }

    // 2. Try `common` namespace by default
    // @ts-ignore – dynamic index access
    if (dict.common?.[key] !== undefined) return dict.common[key]

    // 3. Fallback to raw key
    return key
  }

  return { t, locale }
}
