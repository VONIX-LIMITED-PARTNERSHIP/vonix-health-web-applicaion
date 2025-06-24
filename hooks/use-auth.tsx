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

  // Clear all auth-related data (only call this on explicit sign out)
  const clearAuthData = () => {
    console.log("Clearing auth data...")
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
      console.log("Supabase not configured. Setting loading to false.")
      setLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      console.log("Initializing auth...")
      try {
        const sessionStartTime = Date.now()
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        console.log(`getSession took ${Date.now() - sessionStartTime}ms`)

        if (!mounted) {
          console.log("Auth initialization aborted: component unmounted.")
          return
        }

        if (error) {
          console.error("Error getting session:", error)
          // Only clear auth data if there's a real auth error, not just missing session
          if (error.message?.includes("invalid") || error.message?.includes("expired")) {
            clearAuthData()
          }
        } else if (session?.user) {
          console.log("Session found. User ID:", session.user.id)
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          console.log("No session found. User not authenticated.")
          // Don't clear auth data here - just set states to null
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error("Error during auth initialization:", err)
        // Only clear on actual errors, not on missing sessions
        if (err instanceof Error && (err.message?.includes("invalid") || err.message?.includes("expired"))) {
          clearAuthData()
        }
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
          console.log("Auth initialization finished. Loading set to false.")
        }
      }
    }

    if (!initialized) {
      initializeAuth()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        console.log("Auth state change listener aborted: component unmounted.")
        return
      }
      console.log("Auth state change event:", event, "User ID:", session?.user?.id)

      if (event === "SIGNED_OUT") {
        console.log("User explicitly signed out. Clearing auth data.")
        clearAuthData()
        setLoading(false)
        if (typeof window !== "undefined") {
          console.log("Redirecting to / after SIGNED_OUT event.")
          window.location.href = "/"
        }
      } else if (event === "TOKEN_REFRESHED" && !session) {
        console.log("Token refresh failed. Clearing auth data.")
        clearAuthData()
        setLoading(false)
      } else if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in. Loading profile.")
        setUser(session.user)
        await loadUserProfile(session.user.id)
        setLoading(false)
      } else if (session?.user) {
        console.log("Session user found. Updating user and loading profile.")
        setUser(session.user)
        await loadUserProfile(session.user.id)
        setLoading(false)
      } else if (event === "INITIAL_SESSION" && !session) {
        console.log("Initial session check - no session found.")
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      console.log("Auth state change subscription unsubscribed.")
    }
  }, [supabase, initialized])

  const loadUserProfile = async (userId: string) => {
    if (!supabase) {
      console.warn("Supabase not configured, cannot load user profile.")
      return
    }
    console.log("Loading user profile for ID:", userId)
    try {
      const profileStartTime = Date.now()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
      console.log(`loadUserProfile took ${Date.now() - profileStartTime}ms`)

      if (error) {
        if (error.code === "PGRST116") {
          console.warn("Profile not found (PGRST116), attempting to create missing profile.")
          await createMissingProfile(userId)
          return
        }
        console.error("Error loading user profile:", error)
        return
      }
      setProfile(data || null)
      console.log("User profile loaded:", data?.full_name)
    } catch (error) {
      console.error("Unexpected error loading user profile:", error)
    }
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) {
      console.warn("No user object available to create missing profile.")
      return
    }
    try {
      console.log("Attempting to create profile for user:", userId)
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
        console.error("Failed to create profile:", result)
      } else {
        console.log("Profile created successfully:", result)
        await refreshProfile()
      }
    } catch (profileError) {
      console.error("Error creating missing profile:", profileError)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      console.log("Refreshing profile for user:", user.id)
      await loadUserProfile(user.id)
    } else {
      console.warn("No user ID to refresh profile.")
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase not configured for sign in.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Signing in user:", email)
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error("Sign in error:", error)
        return { data, error }
      }
      console.log("User signed in successfully.")
      return { data, error: null }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      console.error("Supabase not configured for sign up.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Signing up user:", email)
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) {
        console.error("Sign up error:", error)
        return { data, error }
      }
      console.log("User signed up successfully:", data.user?.id)
      if (data.user && !data.user.email_confirmed_at) {
        try {
          console.log("Attempting to create profile after sign up for user:", data.user.id)
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
            console.error("Failed to create profile after sign up:", result)
          } else {
            console.log("Profile created after sign up:", result)
          }
        } catch (profileError) {
          console.error("Error creating profile after sign up:", profileError)
        }
      }
      return { data, error: null }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error("Supabase not configured for sign out.")
      return
    }
    try {
      console.log("Sign out initiated...")
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Supabase sign out error:", error)
      } else {
        console.log("Supabase sign out successful.")
      }
      // clearAuthData will be called by the onAuthStateChange listener when SIGNED_OUT event is triggered
    } catch (error) {
      console.error("Unexpected sign out error:", error)
    } finally {
      setLoading(false)
      console.log("Sign out process completed (loading state reset).")
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      console.error("Supabase not configured for password reset.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Resetting password for email:", email)
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) {
        console.error("Password reset error:", error)
        return { data, error }
      }
      console.log("Password reset email sent successfully.")
      return { data, error: null }
    } catch (error: any) {
      console.error("Unexpected password reset error:", error)
      return { error: new Error(error.message || "An unexpected error occurred") }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      console.error("Supabase not configured for password update.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Updating user password.")
      setLoading(true)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000),
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      if (error) {
        console.error("Password update error:", error)
        return { data, error }
      }
      console.log("Password updated successfully.")
      return { data, error: null }
    } catch (error: any) {
      console.error("Unexpected password update error:", error)
      return { error: new Error(error.message || "An unexpected error occurred during password update.") }
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
