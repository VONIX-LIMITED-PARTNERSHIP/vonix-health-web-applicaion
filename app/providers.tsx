"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProviderClient } from "./language-provider-client"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { GuestAuthProvider } from "@/hooks/use-guest-auth"
import { useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { setGuestServiceTranslation } from "@/lib/guest-assessment-service"
import { ChatWidget } from "@/components/chatbot/chat-widget" // Import ChatWidget

export function Providers({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()

  useEffect(() => {
    // Set the translation function for the GuestAssessmentService
    setGuestServiceTranslation(t)
  }, [t])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProviderClient>
        <AuthProvider>
          <GuestAuthProvider>{children}</GuestAuthProvider>
        </AuthProvider>
        <Toaster />
        <ChatWidget /> {/* Add ChatWidget here to render it globally */}
      </LanguageProviderClient>
    </ThemeProvider>
  )
}

export default Providers
