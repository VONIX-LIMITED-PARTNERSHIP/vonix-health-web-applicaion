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
  }

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) {
          return
        }

        if (error) {
          clearAuthData()
        } else if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          clearAuthData()
        }
      } catch (err) {
        clearAuthData()
      } finally {
        if (mounted) {
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
        return
      }

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        clearAuthData()
        setUser(null)
        setProfile(null)
        setLoading(false) // Ensure loading is false after sign out
      } else if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
        setLoading(false) // Ensure loading is false after sign in/refresh
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false) // Fallback to ensure loading is false
      }
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
        return
      }
      setProfile(data || null)
    } catch (error) {}
  }

  const createMissingProfile = async (userId: string) => {
    if (!user) {
      return
    }
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
      } else {
        await refreshProfile() // Refresh profile after creation
      }
    } catch (error) {}
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
        return { data, error }
      }
      return { data, error: null }
    } catch (error) {
      clearAuthData()
      return { error }
    } finally {
      setLoading(false)
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
          } else {
          }
        } catch (profileError) {}
      }
      return { data, error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
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
      } else {
      }
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/"
        }, 100)
      }
    } catch (error) {
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
      return { error: new Error("Supabase not configured") }
    }
    try {
      setLoading(true)

      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000), // 15 seconds timeout
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error: any) {
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
