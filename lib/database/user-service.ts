/**
 * User Database Service
 * Handles all user-related database operations
 */

import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"]
type UserProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
type UserProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export interface CreateUserParams {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  provider: "google"
}

export interface UpdateUserParams {
  fullName?: string
  avatarUrl?: string
  phone?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
}

/**
 * Create a new user profile
 */
export async function createUserProfile(params: CreateUserParams): Promise<UserProfile> {
  const supabase = createClientComponentClient()

  const profileData: UserProfileInsert = {
    id: params.id,
    email: params.email,
    full_name: params.fullName,
    avatar_url: params.avatarUrl,
    provider: params.provider,
    role: "patient",
    pdpa_consent: true,
    pdpa_consent_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("profiles").insert(profileData).select().single()

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  return data
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get user profile: ${error.message}`)
  }

  return data
}

/**
 * Get user profile by email
 */
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get user profile by email: ${error.message}`)
  }

  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: UpdateUserParams): Promise<UserProfile> {
  const supabase = createClientComponentClient()

  const updateData: UserProfileUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key as keyof UserProfileUpdate] === undefined) {
      delete updateData[key as keyof UserProfileUpdate]
    }
  })

  const { data, error } = await supabase.from("profiles").update(updateData).eq("id", userId).select().single()

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`)
  }

  return data
}

/**
 * Check if user exists
 */
export async function userExists(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile !== null
}

/**
 * Update user's last login time
 */
export async function updateLastLogin(userId: string): Promise<void> {
  const supabase = createClientComponentClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    // Don't throw error for last login update failure
    console.warn("Failed to update last login:", error.message)
  }
}
