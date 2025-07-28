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
  isAuthSessionLoading: boolean
  isProfileLoading: boolean
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any; error?: any }>
  signInWithOAuth: (provider: "google") => Promise<void>
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
  signInWithOAuth: async () => {},
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

  const supabase = createClientComponentClient()

  const clearAuthData = useCallback(() => {
    setUser(null)
    setProfile(null)
    if (typeof window !== "undefined") {
      // Clear Supabase auth tokens
      localStorage.removeItem("sb-hybtdrtuyovowhzinbbu-auth-token")
      localStorage.removeItem("supabase.auth.token")

      // Clear all Supabase auth related items and assessment data
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (
          key &&
          ((key.startsWith("sb-") && key.includes("auth")) ||
            key.startsWith("assessment-") ||
            key === "user-preferences" ||
            key === "dashboard-cache")
        ) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        console.log(`Cleared auth-related key: ${key}`)
      })

      // Clear session storage
      sessionStorage.clear()

      console.log(`Auth data cleared. Removed ${keysToRemove.length} keys from localStorage.`)
    }
  }, [])

  const loadUserProfile = useCallback(
    async (userId: string) => {
      if (!supabase) {
        console.warn("loadUserProfile: Supabase client not available.")
        return
      }
      setIsProfileLoading(true)
      try {
        console.log(`loadUserProfile: Attempting to fetch profile for user ${userId}.`)
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
        if (error) {
          if (error.code === "PGRST116") {
            console.log(`loadUserProfile: Profile not found for user ${userId}. Attempting to create missing profile.`)
            await createMissingProfile(userId)
          } else {
            console.error(`loadUserProfile: Database error fetching profile for user ${userId}:`, error.message)
            setProfile(null)
          }
          return
        }
        console.log(`loadUserProfile: Profile loaded successfully for user ${userId}.`, data)
        setProfile(data || null)
      } catch (error) {
        console.error(`loadUserProfile: Unexpected error fetching profile for user ${userId}:`, error)
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
        console.warn("createMissingProfile called without a user object. Cannot create profile.")
        return
      }
      console.log(`createMissingProfile: Attempting to create missing profile for user: ${userId} via API.`)
      try {
        const response = await fetch("/api/auth/create-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || "",
            role: user.user_metadata?.role || "patient",
            pdpaConsent: user.user_metadata?.pdpa_consent || true,
          }),
        })
        const responseData = await response.json()
        if (response.ok) {
          console.log("createMissingProfile: Missing profile created successfully via API:", responseData)
          await loadUserProfile(userId)
        } else {
          console.error(
            "createMissingProfile: Error creating missing profile via API:",
            response.status,
            responseData.error || responseData,
          )
        }
      } catch (profileError) {
        console.error("createMissingProfile: Error during fetch to create missing profile API:", profileError)
      }
    },
    [user, loadUserProfile],
  )

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      console.log(`refreshProfile: Refreshing profile for user ${user.id}.`)
      await loadUserProfile(user.id)
    } else {
      console.log("refreshProfile: No user ID found to refresh profile.")
    }
  }, [user, loadUserProfile])

  // Effect for initial session check and auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("Auth Effect: Supabase not configured. Skipping auth initialization.")
      setIsAuthSessionLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true
    console.log("Auth Effect: Initializing Supabase auth listener.")

    const initializeAuth = async () => {
      setIsAuthSessionLoading(true)
      try {
        // Add timeout to prevent infinite loading
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session check timeout")), 10000),
        )

        const {
          data: { session },
          error,
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any

        if (!mounted) return

        if (error) {
          console.error("Auth Effect: Error getting session:", error.message)
          clearAuthData()
          setUser(null)
          setProfile(null)
        } else if (session?.user) {
          console.log("Auth Effect: Initial session found for user:", session.user.id)
          setUser(session.user)
        } else {
          console.log("Auth Effect: No initial session found.")
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error("Auth Effect: Unexpected error during initial session check:", err)
        clearAuthData()
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) {
          setIsAuthSessionLoading(false)
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
      if (!mounted) return
      console.log("Auth State Change Event:", event, "User ID:", session?.user?.id)

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        console.log("Auth State Change: User signed out or token refreshed without session.")
        clearAuthData()
        setUser(null)
        setProfile(null)
        setIsAuthSessionLoading(false)
        if (typeof window !== "undefined" && event === "SIGNED_OUT") {
          window.location.href = "/"
        }
      } else if (event === "SIGNED_IN" && session?.user) {
        console.log("Auth State Change: User signed in.", session.user.id)
        setUser(session.user)
        setIsAuthSessionLoading(false)
      } else if (session?.user) {
        console.log("Auth State Change: Session user updated.", session.user.id)
        setUser(session.user)
        setIsAuthSessionLoading(false)
      } else if (event === "INITIAL_SESSION" && !session) {
        console.log("Auth State Change: Initial session, no user.")
        setUser(null)
        setProfile(null)
        setIsAuthSessionLoading(false)
      }
    })

    return () => {
      mounted = false
      console.log("Auth Effect: Unsubscribing from auth state changes.")
      subscription.unsubscribe()
    }
  }, [supabase, initialized, clearAuthData])

  // Effect for loading user profile when user state changes
  useEffect(() => {
    if (user?.id) {
      console.log(`Profile Effect: User ID changed to ${user.id}. Loading profile...`)
      loadUserProfile(user.id)
    } else {
      console.log("Profile Effect: No user ID, clearing profile.")
      setProfile(null)
      setIsProfileLoading(false)
    }
  }, [user, loadUserProfile])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("signIn: Supabase not configured.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      console.log(`signIn: Attempting to sign in user ${email}.`)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error("signIn: Error during sign in:", error.message)
        return { data, error }
      }
      console.log("signIn: User signed in successfully.")
      return { data, error: null }
    } catch (error) {
      console.error("signIn: Unexpected error during sign in:", error)
      return { error }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      console.error("signUp: Supabase not configured.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      console.log(`signUp: Attempting to sign up user ${email}.`)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) {
        console.error("signUp: Error during sign up:", error.message)
        return { data, error }
      }
      console.log("signUp: User signed up successfully. Check email for confirmation.")
      return { data, error: null }
    } catch (error) {
      console.error("signUp: Unexpected error during sign up:", error)
      return { error }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const signInWithOAuth = async (provider: "google") => {
    if (!supabase) {
      console.error("signInWithOAuth: Supabase not configured.")
      throw new Error("Supabase not configured")
    }

    try {
      console.log(`signInWithOAuth: Initiating ${provider} OAuth flow.`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("signInWithOAuth: Error during OAuth:", error.message)
        throw error
      }

      console.log("signInWithOAuth: OAuth initiated successfully.")
    } catch (error) {
      console.error("signInWithOAuth: Unexpected error during OAuth:", error)
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error("signOut: Supabase not configured.")
      return
    }
    try {
      setIsAuthSessionLoading(true)
      console.log("signOut: Attempting to sign out user.")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("signOut: Error signing out:", error.message)
      } else {
        console.log("signOut: User signed out successfully.")
      }
    } catch (error) {
      console.error("signOut: Unexpected error during sign out:", error)
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) {
      console.error("resetPasswordForEmail: Supabase not configured.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      console.log(`resetPasswordForEmail: Sending password reset email to ${email}.`)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) {
        console.error("resetPasswordForEmail: Error sending reset email:", error.message)
        return { data, error }
      }
      console.log("resetPasswordForEmail: Password reset email sent successfully.")
      return { data, error: null }
    } catch (error: any) {
      console.error("resetPasswordForEmail: Unexpected error:", error)
      return { error: new Error(error.message || "An unexpected error occurred") }
    } finally {
      setIsAuthSessionLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      console.error("updatePassword: Supabase not configured.")
      return { error: new Error("Supabase not configured") }
    }
    try {
      setIsAuthSessionLoading(true)
      console.log("updatePassword: Attempting to update user password.")

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Password update request timed out after 15 seconds.")), 15000),
      )

      const { data, error } = await Promise.race([supabase.auth.updateUser({ password: newPassword }), timeoutPromise])

      if (error) {
        console.error("updatePassword: Error updating password:", error.message)
        return { data, error }
      }
      console.log("updatePassword: Password updated successfully.")
      return { data, error: null }
    } catch (error: any) {
      console.error("updatePassword: Unexpected error during password update:", error)
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
        signInWithOAuth,
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
