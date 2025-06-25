import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  const { userId } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("DELETE /api/assessment/delete-all:")
  console.log("  User from Supabase session:", user ? user.id : "No user found")
  console.log("  UserId from request body:", userId)

  if (!user || user.id !== userId) {
    console.log("  Unauthorized: User mismatch or no user.")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { error } = await supabase.from("assessments").delete().eq("user_id", userId)

    if (error) {
      console.error("  Error deleting assessments:", error.message)
      throw error
    }

    console.log("  Assessments deleted successfully for user:", userId)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete assessments" }, { status: 500 })
  }
}
