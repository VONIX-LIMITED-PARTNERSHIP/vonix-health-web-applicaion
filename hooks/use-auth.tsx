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
        // Clear any stale data first
        if (!initialized) {
          clearAuthData()
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          clearAuthData()
          setLoading(false)
          setInitialized(true)
          return
        }

        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          clearAuthData()
        }
      } catch (error) {
        clearAuthData()
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

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
        setLoading(false)
        return
      }

      // For other events, just update the user state
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, initialized])

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
      // Clear any existing auth data first
      clearAuthData()
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

      // Don't set user here, let the auth state change handler do it
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
      // Clear any existing auth data first
      clearAuthData()
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

      // If user is created but no profile exists, create it manually
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

      // Clear auth data immediately
      clearAuthData()

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        // console.error("Error signing out:", error) // Removed for security
      } else {
      }

      // Force reload to clear any cached state
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

  // New: Function to send password reset email
  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Redirect to the new password update page
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

  // New: Function to update user password
  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      console.error("Supabase client not available for password update") // Debugging log
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
      console.error("updatePassword exception:", error) // Debugging log
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
