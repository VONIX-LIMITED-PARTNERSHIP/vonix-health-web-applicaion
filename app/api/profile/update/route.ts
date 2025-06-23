import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"
import { z } from "zod"

// Define schema for profile update validation
const profileUpdateSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1, "Full name is required").optional().nullable(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
})

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, fullName, phone, dateOfBirth, gender } = profileUpdateSchema.parse(body)

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const updateData: { [key: string]: any } = {
      updated_at: new Date().toISOString(),
    }

    if (fullName !== undefined) updateData.full_name = fullName
    if (phone !== undefined) updateData.phone = phone
    if (dateOfBirth !== undefined) updateData.date_of_birth = dateOfBirth
    if (gender !== undefined) updateData.gender = gender

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Database error updating profile:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    // Log audit (don't fail if this fails)
    try {
      await supabaseAdmin.from("audit_logs").insert({
        user_id: userId,
        action: "profile_updated",
        resource_type: "profiles",
        resource_id: userId,
        details: updateData,
        ip_address: request.ip || null,
        user_agent: request.headers.get("user-agent") || null,
      })
    } catch (auditError) {
      console.error("Audit log error (non-critical):", auditError)
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("API error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
