"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"

type Locale = "th" | "en"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

// 👇 Export so other modules can import it directly
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th") // Default to Thai

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem("vonix_locale") as Locale
    if (savedLocale && (savedLocale === "th" || savedLocale === "en")) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("vonix_locale", newLocale)
  }

  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
