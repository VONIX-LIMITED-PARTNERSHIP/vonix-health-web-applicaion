"use client"

import type React from "react"

import { AuthProvider } from "@/hooks/use-auth"
import { GuestAuthProvider } from "@/hooks/use-guest-auth"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <GuestAuthProvider>
            {children}
            <Toaster />
          </GuestAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
