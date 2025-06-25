import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { userId } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("POST /api/auth/withdraw-consent:")
  console.log("  User from Supabase session:", user ? user.id : "No user found")
  console.log("  UserId from request body:", userId)

  if (!user || user.id !== userId) {
    console.log("  Unauthorized: User mismatch or no user.")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ pdpa_consent: false })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("  Error withdrawing consent:", error.message)
      throw error
    }

    console.log("  Consent withdrawn successfully for user:", userId)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to withdraw consent" }, { status: 500 })
  }
}
