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
        if (error.code === "PGRST116") {
          await createMissingProfile(userId)
          return
        }
        console.error("Error loading profile:", error) // Uncommented for debugging
        return
      }
      setProfile(data || null)
    } catch (error) {
      console.error("Error loading user profile:", error) // Uncommented for debugging
    }
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) return
    try {
      const response = await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        console.error("Failed to create missing profile:", result.error) // Uncommented for debugging
      } else {
        console.log("Missing profile created successfully.") // New log
      }
    } catch (error) {
      console.error("Error creating missing profile:", error) // Uncommented for debugging
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
      clearAuthData()
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        clearAuthData()
        setLoading(false)
        console.error("Sign in error:", error) // Uncommented for debugging
        return { data, error }
      }
      console.log("Sign in successful.") // New log
      return { data, error: null }
    } catch (error) {
      console.error("Sign in exception:", error) // Uncommented for debugging
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
      clearAuthData()
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) {
        setLoading(false)
        console.error("Sign up error:", error) // Uncommented for debugging
        return { data, error }
      }
      if (data.user && !data.user.email_confirmed_at) {
        try {
          const response = await fetch("/api/auth/create-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
            console.error("Manual profile creation failed:", result.error) // Uncommented for debugging
          } else {
            console.log("Manual profile creation successful.") // New log
          }
        } catch (profileError) {
          console.error("Error creating profile manually:", profileError) // Uncommented for debugging
        }
      }
      setLoading(false)
      console.log("Sign up successful.") // New log
      return { data, error: null }
    } catch (error) {
      console.error("Sign up exception:", error) // Uncommented for debugging
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
      clearAuthData()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error) // Uncommented for debugging
      } else {
        console.log("Sign out successful.") // New log
      }
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }
    } catch (error) {
      console.error("Error signing out:", error) // Uncommented for debugging
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      console.error("Supabase client not available for password update") // Uncommented for debugging
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)
      console.log("Attempting to update user password via Supabase.auth.updateUser...") // New log

      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000), // 15 seconds timeout
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      console.log("Supabase updateUser data:", data)
      console.log("Supabase updateUser error:", error)

      if (error) {
        console.error("Error updating password via Supabase:", error) // Uncommented for debugging
        return { data, error }
      }
      console.log("Password update successful from Supabase.") // New log
      return { data, error: null }
    } catch (error: any) {
      console.error("updatePassword exception caught:", error) // Uncommented for debugging
      return { error: new Error(error.message || "An unexpected error occurred during password update.") }
    } finally {
      setLoading(false)
      console.log("updatePassword function finished.") // New log
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
        console.error("resetPasswordForEmail error:", error)
        return { data, error }
      }
      console.log("resetPasswordForEmail successful.")
      return { data, error: null }
    } catch (error) {
      console.error("resetPasswordForEmail exception:", error)
      return { error }
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
