"use client"

import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { Footer } from "@/components/footer"

/**
 * Groups every client-side context / widget so the server layout
 * doesn’t have to pass non-serialisable values through RSC.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <Footer />
          <Toaster />
          <ChatWidget />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
