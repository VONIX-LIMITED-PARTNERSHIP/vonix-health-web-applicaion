import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName, role, pdpaConsent } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existingProfile) {
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

    const { data: profile, error } = await supabaseAdmin.from("profiles").insert(profileData).select().single()

    if (error) {
      console.error("Database error creating profile:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

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
    } catch (auditError) {
      console.error("Audit log error (non-critical):", auditError)
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
