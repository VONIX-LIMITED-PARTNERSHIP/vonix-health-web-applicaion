/**
 * Google OAuth Callback Route
 * Handles the OAuth callback and creates user session
 */

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth/google-oauth"
import { createUserProfile, getUserProfileByEmail, updateLastLogin } from "@/lib/database/user-service"
import { createServerComponentClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    const errorUrl = new URL("/login", request.url)
    errorUrl.searchParams.set("error", "oauth_error")
    errorUrl.searchParams.set("message", `Google OAuth error: ${error}`)
    return NextResponse.redirect(errorUrl)
  }

  // Validate required parameters
  if (!code || !state) {
    const errorUrl = new URL("/login", request.url)
    errorUrl.searchParams.set("error", "missing_parameters")
    errorUrl.searchParams.set("message", "ข้อมูลไม่ครบถ้วน")
    return NextResponse.redirect(errorUrl)
  }

  try {
    const cookieStore = cookies()

    // Retrieve PKCE parameters from cookies
    const storedState = cookieStore.get("oauth_state")?.value
    const codeVerifier = cookieStore.get("oauth_code_verifier")?.value

    // Validate state parameter
    if (!storedState || storedState !== state) {
      const errorUrl = new URL("/login", request.url)
      errorUrl.searchParams.set("error", "invalid_state")
      errorUrl.searchParams.set("message", "การตรวจสอบความปลอดภัยล้มเหลว")
      return NextResponse.redirect(errorUrl)
    }

    // Validate code verifier
    if (!codeVerifier) {
      const errorUrl = new URL("/login", request.url)
      errorUrl.searchParams.set("error", "missing_code_verifier")
      errorUrl.searchParams.set("message", "ข้อมูลการตรวจสอบหายไป")
      return NextResponse.redirect(errorUrl)
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier)

    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token)

    // Create Supabase client
    const supabase = createServerComponentClient()

    // Check if user already exists
    let userProfile = await getUserProfileByEmail(googleUser.email)

    if (!userProfile) {
      // Create new user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: googleUser.email,
        email_confirm: true,
        user_metadata: {
          full_name: googleUser.name,
          avatar_url: googleUser.picture,
          provider: "google",
          google_id: googleUser.id,
        },
      })

      if (authError || !authData.user) {
        throw new Error(`Failed to create auth user: ${authError?.message}`)
      }

      // Create user profile
      userProfile = await createUserProfile({
        id: authData.user.id,
        email: googleUser.email,
        fullName: googleUser.name,
        avatarUrl: googleUser.picture,
        provider: "google",
      })
    } else {
      // Update last login
      await updateLastLogin(userProfile.id)
    }

    // Create session
    const { error: signInError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: googleUser.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/success`,
      },
    })

    if (signInError) {
      throw new Error(`Failed to create session: ${signInError.message}`)
    }

    // Clear OAuth cookies
    cookieStore.delete("oauth_state")
    cookieStore.delete("oauth_code_verifier")

    // Redirect to success page
    const successUrl = new URL("/auth/success", request.url)
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error("OAuth callback error:", error)

    // Clear OAuth cookies on error
    const cookieStore = cookies()
    cookieStore.delete("oauth_state")
    cookieStore.delete("oauth_code_verifier")

    const errorUrl = new URL("/login", request.url)
    errorUrl.searchParams.set("error", "auth_failed")
    errorUrl.searchParams.set("message", "การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง")

    return NextResponse.redirect(errorUrl)
  }
}
