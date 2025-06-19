import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VONIX Health - ประเมินสุขภาพด้วย AI",
  description: "ระบบประเมินสุขภาพอัจฉริยะที่ช่วยคุณดูแลสุขภาพได้ดีขึ้น ไม่ต้องมีความรู้ทางการแพทย์ ใช้งานง่าย เข้าใจได้ทันที",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Footer />
            <Toaster />
            <ChatWidget />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
