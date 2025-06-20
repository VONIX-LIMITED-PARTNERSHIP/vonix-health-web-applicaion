"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any; error?: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  resetPasswordForEmail: (email: string) => Promise<{ data?: any; error?: any }>
  updatePassword: (newPassword: string) => Promise<{ data?: any; error?: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: new Error("Auth not configured") }),
  signUp: async () => ({ error: new Error("Auth not configured") }),
  signOut: async () => {},
  refreshProfile: async () => {},
  resetPasswordForEmail: async () => ({ error: new Error("Auth not configured") }),
  updatePassword: async () => ({ error: new Error("Auth not configured") }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const supabase = createClientComponentClient()

  // Clear all auth-related data
  const clearAuthData = () => {
    setUser(null)
    setProfile(null)

    // Clear localStorage
    if (typeof window !== "undefined") {
      // Clear Supabase auth data
      localStorage.removeItem("sb-hybtdrtuyovowhzinbbu-auth-token")
      localStorage.removeItem("supabase.auth.token")

      // Clear assessment data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("assessment-")) {
          localStorage.removeItem(key)
        }
      })

      // Clear any other app-specific data
      localStorage.removeItem("user-preferences")
      localStorage.removeItem("dashboard-cache")
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const getInitialSession = async () => {
      try {
        // Removed clearAuthData() from here to prevent clearing session too early
        // Supabase's onAuthStateChange should handle session changes and persistence

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          clearAuthData() // Clear only if there's an explicit error getting session
          setLoading(false)
          setInitialized(true)
          return
        }

        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          clearAuthData() // Clear if no session found
        }
      } catch (error) {
        clearAuthData() // Clear on any unexpected error
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Only run initial session check once
    if (!initialized) {
      getInitialSession()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      // --- TEMPORARY DEBUGGING LOGS ---
      console.log("Auth state changed event:", event)
      console.log("Auth state changed session:", session?.user?.id || "No user")
      // --- END TEMPORARY DEBUGGING LOGS ---

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        clearAuthData()
        setLoading(false)
        return
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          clearAuthData()
        }
        setLoading(false) // Ensure loading is false after state change
        return
      }

      // For other events, just update the user state
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false) // Ensure loading is false after any state change
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, initialized]) // Keep initialized in dependency array

  const loadUserProfile = async (userId: string) => {
    if (!supabase) {
      return
    }

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        // If profile doesn't exist, try to create it
        if (error.code === "PGRST116") {
          await createMissingProfile(userId)
          return
        }

        // console.error("Error loading profile:", error) // Removed for security
        return
      }

      setProfile(data || null)
    } catch (error) {
      // console.error("Error loading user profile:", error) // Removed for security
    }
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          email: user.email,
          fullName: user.user_metadata?.full_name || "",
          role: user.user_metadata?.role || "patient",
          pdpaConsent: user.user_metadata?.pdpa_consent || false,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // console.error("Failed to create missing profile:", result.error) // Removed for security
      } else {
      }
    } catch (error) {
      // console.error("Error creating missing profile:", error) // Removed for security
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }

    try {
      clearAuthData() // Clear before sign in attempt
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        clearAuthData()
        setLoading(false)
        return { data, error }
      }

      return { data, error: null }
    } catch (error) {
      // console.error("Sign in exception:", error) // Removed for security
      clearAuthData()
      setLoading(false)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }

    try {
      clearAuthData() // Clear before sign up attempt
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        setLoading(false)
        return { data, error }
      }

      if (data.user && !data.user.email_confirmed_at) {
        try {
          const response = await fetch("/api/auth/create-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              fullName: metadata?.full_name,
              role: metadata?.role || "patient",
              pdpaConsent: metadata?.pdpa_consent || false,
            }),
          })

          const result = await response.json()

          if (!response.ok) {
            // console.error("Manual profile creation failed:", result.error) // Removed for security
          } else {
          }
        } catch (profileError) {
          // console.error("Error creating profile manually:", profileError) // Removed for security
        }
      }

      setLoading(false)
      return { data, error: null }
    } catch (error) {
      // console.error("Sign up exception:", error) // Removed for security
      setLoading(false)
      return { error }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }

    try {
      setLoading(true)
      clearAuthData() // Clear auth data immediately

      const { error } = await supabase.auth.signOut()

      if (error) {
        // console.error("Error signing out:", error) // Removed for security
      } else {
      }

      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }
    } catch (error) {
      // console.error("Error signing out:", error) // Removed for security
    } finally {
      setLoading(false)
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error: any) {
      return { error: new Error(error.message || "An unexpected error occurred") }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      // console.error("Supabase client not available for password update") // Removed for security
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      // --- TEMPORARY DEBUGGING LOGS ---
      console.log("Supabase updateUser data:", data)
      console.log("Supabase updateUser error:", error)
      // --- END TEMPORARY DEBUGGING LOGS ---

      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error: any) {
      // console.error("updatePassword exception:", error) // Removed for security
      return { error: new Error(error.message || "An unexpected error occurred") }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        resetPasswordForEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
