"use client"

import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { Footer } from "@/components/footer"
import { MaintenanceModeProvider } from "@/contexts/maintenance-mode-context" // Import the new provider

/**
 * Groups every client-side context / widget so the server layout
 * doesn’t have to pass non-serialisable values through RSC.
 *
 * Defaults:
 *   – Language  : Thai (“th”)        (already default in LanguageProvider)
 *   – Theme     : Light mode only    (enableSystem = false)
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <MaintenanceModeProvider>
            {children}
            <Footer />
            <Toaster />
            <ChatWidget />
          </MaintenanceModeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
