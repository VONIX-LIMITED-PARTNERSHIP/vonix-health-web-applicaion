/**
 * Auth Confirmation Route
 * Handles email confirmation and magic link authentication
 */

import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get("token")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/"

  if (!token || !type) {
    // Redirect to error page if token or type is missing
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const supabase = createServerComponentClient()

  try {
    // Verify the token and create session
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
    })

    if (error) {
      console.error("Auth confirmation error:", error)
      return NextResponse.redirect(
        `${origin}/login?error=invalid_token&message=${encodeURIComponent("โทเค็นไม่ถูกต้องหรือหมดอายุ")}`,
      )
    }

    if (!data.user) {
      return NextResponse.redirect(`${origin}/login?error=no_user&message=${encodeURIComponent("ไม่พบข้อมูลผู้ใช้")}`)
    }

    // Successful authentication - redirect to the next page
    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error("Unexpected error during auth confirmation:", error)
    return NextResponse.redirect(
      `${origin}/login?error=confirmation_failed&message=${encodeURIComponent("การยืนยันตัวตนล้มเหลว")}`,
    )
  }
}
