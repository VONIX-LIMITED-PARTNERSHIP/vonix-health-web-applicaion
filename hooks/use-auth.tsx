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
  const [loading, setLoading] = useState(true) // Initial state is true
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
    console.log("Auth data cleared by use-auth.tsx") // Added log
  }

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      console.log("Supabase not configured, setting loading to false.")
      setLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log("Starting initial session check in AuthProvider...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) {
          console.log("Component unmounted during initial session check.")
          return
        }

        if (error) {
          console.error("Error getting initial session:", error)
          clearAuthData()
        } else if (session?.user) {
          console.log("Initial session found, user ID:", session.user.id)
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          console.log("No initial session found.")
          clearAuthData()
        }
      } catch (err) {
        console.error("Exception during initial auth setup:", err)
        clearAuthData()
      } finally {
        if (mounted) {
          console.log("Initial auth setup complete, setting loading to false.")
          setLoading(false)
          setInitialized(true)
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
        console.log("Component unmounted during auth state change event.")
        return
      }

      console.log("Auth state changed event:", event)
      console.log("Auth state changed session:", session?.user?.id || "No user")

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        clearAuthData()
        setUser(null)
        setProfile(null)
        console.log("Auth state changed: SIGNED_OUT or TOKEN_REFRESHED (no session), loading set to false.")
        setLoading(false) // Ensure loading is false after sign out
      } else if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
        console.log("Auth state changed: SIGNED_IN or TOKEN_REFRESHED (with session), loading set to false.")
        setLoading(false) // Ensure loading is false after sign in/refresh
      } else {
        setUser(null)
        setProfile(null)
        console.log("Auth state changed: Other event or no user, loading set to false.")
        setLoading(false) // Fallback to ensure loading is false
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      console.log("Auth useEffect cleanup: subscription unsubscribed.")
    }
  }, [supabase, initialized]) // Keep initialized in dependency array

  const loadUserProfile = async (userId: string) => {
    if (!supabase) {
      console.error("Supabase client not available for loadUserProfile")
      return
    }
    try {
      console.log("Loading user profile for ID:", userId)
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
      if (error) {
        if (error.code === "PGRST116") {
          console.warn("Profile not found, attempting to create missing profile.")
          await createMissingProfile(userId)
          return
        }
        console.error("Error loading profile:", error)
        return
      }
      setProfile(data || null)
      console.log("User profile loaded:", data?.full_name || "N/A")
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) {
      console.error("Cannot create missing profile: user is null.")
      return
    }
    try {
      console.log("Attempting to create missing profile for user ID:", userId)
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
        console.error("Failed to create missing profile:", result.error)
      } else {
        console.log("Missing profile created successfully.")
        await refreshProfile() // Refresh profile after creation
      }
    } catch (error) {
      console.error("Error creating missing profile:", error)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      console.log("Refreshing user profile for ID:", user.id)
      await loadUserProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase not configured for signIn")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Attempting sign in for:", email)
      clearAuthData()
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error("Sign in error:", error)
        clearAuthData()
        return { data, error }
      }
      console.log("Sign in successful for user:", data.user?.id)
      return { data, error: null }
    } catch (error) {
      console.error("Sign in exception:", error)
      clearAuthData()
      return { error }
    } finally {
      setLoading(false)
      console.log("Sign in process finished, loading set to false.")
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      console.error("Supabase not configured for signUp")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Attempting sign up for:", email)
      clearAuthData()
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
      if (data.user && !data.user.email_confirmed_at) {
        console.log("User signed up, email not confirmed. Attempting manual profile creation.")
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
            console.error("Manual profile creation failed:", result.error)
          } else {
            console.log("Manual profile creation successful.")
          }
        } catch (profileError) {
          console.error("Error creating profile manually:", profileError)
        }
      }
      console.log("Sign up successful for user:", data.user?.id)
      return { data, error: null }
    } catch (error) {
      console.error("Sign up exception:", error)
      return { error }
    } finally {
      setLoading(false)
      console.log("Sign up process finished, loading set to false.")
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error("Supabase not configured for signOut")
      return
    }
    try {
      console.log("Attempting sign out.")
      setLoading(true)
      clearAuthData() // Clear auth data immediately
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      } else {
        console.log("Sign out successful.")
      }
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
      console.log("Sign out process finished, loading set to false.")
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      console.error("Supabase not configured for resetPasswordForEmail")
      return { error: new Error("Supabase not configured") }
    }
    try {
      console.log("Attempting to send password reset email to:", email)
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
    } catch (error: any) {
      console.error("resetPasswordForEmail exception:", error)
      return { error: new Error(error.message || "An unexpected error occurred") }
    } finally {
      setLoading(false)
      console.log("resetPasswordForEmail process finished, loading set to false.")
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      console.error("Supabase client not available for password update")
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)
      console.log("Attempting to update user password via Supabase.auth.updateUser...")

      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000), // 15 seconds timeout
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      console.log("Supabase updateUser data:", data)
      console.log("Supabase updateUser error:", error)

      if (error) {
        console.error("Error updating password via Supabase:", error)
        return { data, error }
      }
      console.log("Password update successful from Supabase.")
      return { data, error: null }
    } catch (error: any) {
      console.error("updatePassword exception caught:", error)
      return { error: new Error(error.message || "An unexpected error occurred during password update.") }
    } finally {
      setLoading(false)
      console.log("updatePassword function finished, loading set to false.")
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
