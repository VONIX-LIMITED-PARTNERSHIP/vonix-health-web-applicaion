import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { Database } from "@/types/database"

export async function POST(request: Request) {
  const { userId, email, fullName, role, pdpaConsent } = await request.json()
  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    const { data, error } = await supabase.from("profiles").insert({
      id: userId,
      email: email,
      full_name: fullName,
      role: role,
      pdpa_consent: pdpaConsent,
      pdpa_consent_date: pdpaConsent ? new Date().toISOString() : null,
    })

    if (error) {
      console.error("Error inserting profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile created successfully", data }, { status: 200 })
  } catch (e: any) {
    console.error("Unexpected error in create-profile API:", e)
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}
