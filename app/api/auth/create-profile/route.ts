import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName, role, pdpaConsent } = await request.json()

    if (!userId || !email) {
      console.error("API Error: Missing userId or email in request body.")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      console.error("API Error: Supabase admin client not configured.")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error(`API Error: Database error checking existing profile for user ${userId}:`, checkError.message)
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existingProfile) {
      console.log(`API Info: Profile already exists for user ${userId}.`)
      return NextResponse.json({ profile: existingProfile })
    }

    // Create profile using service role (bypasses RLS)
    const profileData = {
      id: userId,
      email: email,
      full_name: fullName || null,
      role: role || "patient",
      pdpa_consent: pdpaConsent || false,
      pdpa_consent_date: pdpaConsent ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log(`API Info: Attempting to create new profile for user ${userId} with data:`, profileData)
    const { data: profile, error } = await supabaseAdmin.from("profiles").insert(profileData).select().single()

    if (error) {
      console.error("API Error: Database error creating profile:", error.message, error.details, error.hint)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    console.log(`API Success: Profile created for user ${userId}.`)

    // Log audit (don't fail if this fails)
    try {
      await supabaseAdmin.from("audit_logs").insert({
        user_id: userId,
        action: "profile_created",
        resource_type: "profiles",
        resource_id: userId,
        details: { email, role: role || "patient" },
        ip_address: request.ip || null,
        user_agent: request.headers.get("user-agent") || null,
      })
      console.log(`API Info: Audit log recorded for profile creation for user ${userId}.`)
    } catch (auditError) {
      console.error("API Warning: Audit log error (non-critical):", auditError)
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("API Error: Uncaught error in /api/auth/create-profile:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
