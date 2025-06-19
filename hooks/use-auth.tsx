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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: new Error("Auth not configured") }),
  signUp: async () => ({ error: new Error("Auth not configured") }),
  signOut: async () => {},
  refreshProfile: async () => {},
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
      console.error("Supabase not configured in AuthProvider")
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

      console.log("Auth state changed:", event, session?.user?.id || "No user")

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        console.log("User signed out or token expired")
        clearAuthData()
        setLoading(false)
        return
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          console.log("User signed in:", session.user.id)
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
      console.error("Supabase client not available for profile loading")
      return
    }

    try {
      console.log("Loading profile for user:", userId)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error loading profile:", error)

        // If profile doesn't exist, try to create it
        if (error.code === "PGRST116") {
          console.log("Profile not found, attempting to create...")
          await createMissingProfile(userId)
          return
        }

        return
      }

      console.log("Profile loaded successfully:", data)
      setProfile(data || null)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) return

    try {
      console.log("Creating missing profile for user:", userId)

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

      if (response.ok && result.profile) {
        console.log("Missing profile created successfully:", result.profile)
        setProfile(result.profile)
      } else {
        console.error("Failed to create missing profile:", result.error)
      }
    } catch (error) {
      console.error("Error creating missing profile:", error)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase client not available for sign in")
      return { error: new Error("Supabase not configured") }
    }

    try {
      console.log("Attempting sign in for:", email)

      // Clear any existing auth data first
      clearAuthData()
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        clearAuthData()
        setLoading(false)
        return { data, error }
      }

      console.log("Sign in successful:", data.user?.id)

      // Don't set user here, let the auth state change handler do it
      return { data, error: null }
    } catch (error) {
      console.error("Sign in exception:", error)
      clearAuthData()
      setLoading(false)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      console.error("Supabase client not available for sign up")
      return { error: new Error("Supabase not configured") }
    }

    try {
      console.log("Attempting sign up for:", email, "with metadata:", metadata)

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
        console.error("Sign up error:", error)
        setLoading(false)
        return { data, error }
      }

      console.log("Sign up successful:", data.user?.id)

      // If user is created but no profile exists, create it manually
      if (data.user && !data.user.email_confirmed_at) {
        console.log("Attempting to create profile manually...")
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
            console.error("Manual profile creation failed:", result.error)
          } else {
            console.log("Manual profile creation successful:", result.profile)
          }
        } catch (profileError) {
          console.error("Error creating profile manually:", profileError)
        }
      }

      setLoading(false)
      return { data, error: null }
    } catch (error) {
      console.error("Sign up exception:", error)
      setLoading(false)
      return { error }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error("Supabase client not available for sign out")
      return
    }

    try {
      console.log("Signing out...")
      setLoading(true)

      // Clear auth data immediately
      clearAuthData()

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
      } else {
        console.log("Sign out successful")
      }

      // Force reload to clear any cached state
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }
    } catch (error) {
      console.error("Error signing out:", error)
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
