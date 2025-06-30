"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isAuthSessionLoading: boolean // Indicates if the initial Supabase session check is ongoing
  isProfileLoading: boolean // Indicates if the user profile data is being fetched
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
  isAuthSessionLoading: true,
  isProfileLoading: false,
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
  const [isAuthSessionLoading, setIsAuthSessionLoading] = useState(true)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const supabase = createClientComponentClient()

  const clearAuthData = useCallback(() => {
    setUser(null)
    setProfile(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("sb-hybtdrtuyovowhzinbbu-auth-token")
      localStorage.removeItem("supabase.auth.token")
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("assessment-")) {
          localStorage.removeItem(key)
        }
      })
      localStorage.removeItem("user-preferences")
      localStorage.removeItem("dashboard-cache")
    }
  }, [])

  const loadUserProfile = useCallback(
    async (userId: string) => {
      if (!supabase) {
        return
      }
      setIsProfileLoading(true)
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
        if (error) {
          if (error.code === "PGRST116") {
            await createMissingProfile(userId)
          } else {
            setProfile(null)
          }
          return
        }
        setProfile(data || null)
      } catch (error) {
        setProfile(null)
      } finally {
        setIsProfileLoading(false)
      }
    },
    [supabase],
  )

  const createMissingProfile = useCallback(
    async (userId: string) => {
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
        if (response.ok) {
          await loadUserProfile(userId)
        }
      } catch (profileError) {
        // console.error("Error creating missing profile:", profileError);
      }
    },
    [user, loadUserProfile],
  )

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadUserProfile(user.id)
    }
  }, [user, loadUserProfile])

  // Effect for initial session check and auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setIsAuthSessionLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      setIsAuthSessionLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          if (error.message?.includes("invalid") || error.message?.includes("expired")) {
            clearAuthData()
          }
          setUser(null)
          setProfile(null)
        } else if (session?.user) {
          setUser(session.user)
          // Profile loading will be handled by the separate useEffect below
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        if (err instanceof Error && (err.message?.includes("invalid") || err.message?.includes("expired"))) {
          clearAuthData()
        }
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) {
          setIsAuthSessionLoading(false)
          setIsInitialized(true)
        }
      }
    }

    if (!initialized) {
      initializeAuth()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        clearAuthData()
        setUser(null)
        setProfile(null)
        setIsAuthSessionLoading(false)
        if (typeof window !== "undefined" && event === "SIGNED_OUT") {
          window.location.href = "/"
        }
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        setIsAuthSessionLoading(false)
      } else if (session?.user) {
        setUser(session.user)
        setIsAuthSessionLoading(false)
      } else if (event === "INITIAL_SESSION" && !session) {
        setUser(null)
        setProfile(null)
        setIsAuthSessionLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, initialized, clearAuthData])

  // Effect for loading user profile when user state changes
  useEffect(() => {
    if (user?.id) {
      loadUserProfile(user.id)
    } else {
      setProfile(null)
      setIsProfileLoading(false)
    }
  }, [user, loadUserProfile])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error) {
      return { error }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error) {
      return { error }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }
    try {
      setIsAuthSessionLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        // console.error("Error signing out:", error);
      }
    } catch (error) {
      // console.error("Unexpected error during sign out:", error);
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
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
      setIsAuthSessionLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000),
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      if (error) {
        return { data, error }
      }
      return { data, error: null }
    } catch (error: any) {
      return { error: new Error(error.message || "An unexpected error occurred during password update.") }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthSessionLoading,
        isProfileLoading,
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
