import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Sarabun } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const sarabun = Sarabun({
  subsets: ["thai"],
  weight: ["400", "700"], // Regular and Bold weights
  variable: "--font-sarabun",
})

export const metadata: Metadata = {
  title: "VONIX Health - ประเมินสุขภาพด้วย AI",
  description: "ระบบประเมินสุขภาพอัจฉริยะที่ช่วยคุณดูแลสุขภาพได้ดีขึ้น ไม่ต้องมีความรู้ทางการแพทย์ ใช้งานง่าย เข้าใจได้ทันที",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={sarabun.variable}>
        {/* All client logic is encapsulated here */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
