import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get("token")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/"

  if (!token || !type) {
    // Redirect to error page if token or type is missing
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )

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
