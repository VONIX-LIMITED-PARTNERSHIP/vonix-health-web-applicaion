"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/database"
import { useAuth } from "./use-auth"

/**
 * ดึงข้อมูล profile ของผู้ใช้ปัจจุบัน
 * @returns { profile, isProfileLoading }
 */
export function useProfile() {
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setIsProfileLoading(false)
      return
    }

    const fetchProfile = async () => {
      setIsProfileLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("❌ useProfile: ดึงข้อมูล profile ล้มเหลว:", error)
      }
      setProfile(data ?? null)
      setIsProfileLoading(false)
    }

    fetchProfile()
  }, [user, supabase])

  return { profile, isProfileLoading }
}
