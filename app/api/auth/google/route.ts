import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const next = searchParams.get("next") ?? "/"

    console.log("Google OAuth initiation requested")

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("OAuth initiation error:", error)
      return NextResponse.redirect(
        `${origin}/login?error=oauth_init_failed&message=${encodeURIComponent("ไม่สามารถเริ่มต้นการเข้าสู่ระบบได้")}`,
      )
    }

    if (data.url) {
      console.log("Redirecting to Google OAuth:", data.url)
      return NextResponse.redirect(data.url)
    }

    return NextResponse.redirect(
      `${origin}/login?error=oauth_init_failed&message=${encodeURIComponent("ไม่ได้รับ URL สำหรับการเข้าสู่ระบบ")}`,
    )
  } catch (error) {
    console.error("Unexpected error in Google OAuth route:", error)
    return NextResponse.redirect(
      `${origin}/login?error=oauth_init_failed&message=${encodeURIComponent("เกิดข้อผิดพลาดในการเริ่มต้นการเข้าสู่ระบบ")}`,
    )
  }
}
