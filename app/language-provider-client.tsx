"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

/**
 * Lazy-load LanguageProvider on the client only.
 * This avoids the “ssr:false inside a server component” build error
 * while still keeping the provider out of the RSC JSON payload.
 */
const LanguageProviderNoSSR = dynamic(() => import("@/contexts/language-context").then((m) => m.LanguageProvider), {
  ssr: false,
})

export default function LanguageProviderClient({
  children,
}: {
  children: ReactNode
}) {
  return <LanguageProviderNoSSR>{children}</LanguageProviderNoSSR>
}
