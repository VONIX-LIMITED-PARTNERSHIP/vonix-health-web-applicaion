import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    const next = searchParams.get("next") ?? "/"

    console.log("Auth callback received:", { code: !!code, error, errorDescription })

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error, errorDescription)
      return NextResponse.redirect(
        `${origin}/login?error=oauth_error&message=${encodeURIComponent(errorDescription || "เกิดข้อผิดพลาดจาก OAuth provider")}`,
      )
    }

    if (!code) {
      console.error("No code provided in callback")
      return NextResponse.redirect(
        `${origin}/login?error=missing_parameters&message=${encodeURIComponent("ไม่พบ authorization code")}`,
      )
    }

    const cookieStore = await cookies()

    // Create Supabase client with proper SSR cookie handling
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

    console.log("Attempting to exchange code for session...")

    // Exchange code for session - this handles PKCE automatically
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError)
      return NextResponse.redirect(
        `${origin}/login?error=auth_failed&message=${encodeURIComponent("ไม่สามารถแลกเปลี่ยน authorization code ได้: " + exchangeError.message)}`,
      )
    }

    if (!data.user) {
      console.error("No user data after code exchange")
      return NextResponse.redirect(`${origin}/login?error=auth_failed&message=${encodeURIComponent("ไม่พบข้อมูลผู้ใช้")}`)
    }

    console.log("User authenticated successfully:", data.user.id)

    // Create or update user profile using service role key
    try {
      const adminSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get() {
              return undefined
            },
            set() {},
            remove() {},
          },
        },
      )

      const { data: existingProfile, error: profileError } = await adminSupabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it
        console.log("Creating new profile for user:", data.user.id)

        const { error: insertError } = await adminSupabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
          role: "patient",
          pdpa_consent: true,
          pdpa_consent_date: new Date().toISOString(),
          provider: "google",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error creating profile:", insertError)
        } else {
          console.log("Profile created successfully")
        }
      } else if (existingProfile) {
        console.log("Profile already exists for user:", data.user.id)

        // Update existing profile with latest info
        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || existingProfile.full_name,
            avatar_url:
              data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || existingProfile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        if (updateError) {
          console.error("Error updating profile:", updateError)
        }
      }
    } catch (profileError) {
      console.error("Error handling profile:", profileError)
      // Don't fail the login if profile creation fails
    }

    console.log("Redirecting to:", `${origin}${next}`)

    // Create response with redirect
    const response = NextResponse.redirect(`${origin}${next}`)

    return response
  } catch (error) {
    console.error("Unexpected error in auth callback:", error)
    const origin = new URL(request.url).origin
    return NextResponse.redirect(
      `${origin}/login?error=callback_failed&message=${encodeURIComponent("เกิดข้อผิดพลาดในการประมวลผล: " + (error as Error).message)}`,
    )
  }
}
