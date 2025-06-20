import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging (remove in production)
// if (typeof window !== "undefined") {
//   console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing")
//   console.log("Supabase Anon Key:", supabaseAnonKey ? "Set" : "Missing")
// }

// Create a single instance for the entire app
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storage: typeof window !== "undefined" ? window.localStorage : undefined,
        },
      })
    : null

// Client-side Supabase client (singleton pattern)
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const createClientComponentClient = () => {
  // Return null if environment variables are not available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
    })
    return null
  }

  // Return existing instance if available
  if (clientInstance) {
    return clientInstance
  }

  // Create new instance only if none exists
  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sb-hybtdrtuyovowhzinbbu-auth-token",
    },
  })

  return clientInstance
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const configured = !!(supabaseUrl && supabaseAnonKey)
  if (!configured) {
    console.error("Supabase not configured. Missing environment variables.")
  }
  return configured
}

// Helper function to clear all auth data
export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    // Clear Supabase auth tokens
    localStorage.removeItem("sb-hybtdrtuyovowhzinbbu-auth-token")
    localStorage.removeItem("supabase.auth.token")

    // Clear assessment data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("assessment-")) {
        localStorage.removeItem(key)
      }
    })

    // Clear session storage
    sessionStorage.clear()

    console.log("Auth data cleared by lib/supabase.ts") // Uncommented/added for debugging
  }
}
