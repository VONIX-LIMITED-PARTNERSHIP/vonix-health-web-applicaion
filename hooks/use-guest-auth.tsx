"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { GuestAssessmentService } from "@/lib/guest-assessment-service"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

interface GuestUser {
  id: string
  nickname: string
  pdpaConsent: boolean
  createdAt: string
}

interface GuestAuthContextType {
  guestUser: GuestUser | null
  isGuestLoggedIn: boolean
  loading: boolean
  loginGuest: (nickname: string, pdpaConsent: boolean) => void
  logoutGuest: () => void
  clearGuestSession: () => void
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined)

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null)
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation(["common"])

  useEffect(() => {
    // On mount, try to load guest user from localStorage
    try {
      const storedGuestUser = localStorage.getItem("guestUser")
      if (storedGuestUser) {
        const parsedUser: GuestUser = JSON.parse(storedGuestUser)
        setGuestUser(parsedUser)
        setIsGuestLoggedIn(true)
        console.log("GuestAuth: Loaded guest user from localStorage:", parsedUser.id)
      }
    } catch (error) {
      console.error("GuestAuth: Error loading guest user from localStorage:", error)
      localStorage.removeItem("guestUser") // Clear corrupted data
    } finally {
      setLoading(false)
    }
  }, [])

  const loginGuest = useCallback((nickname: string, pdpaConsent: boolean) => {
    const newGuestUser: GuestUser = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      nickname: nickname,
      pdpaConsent: pdpaConsent,
      createdAt: new Date().toISOString(),
    }
    try {
      // Clear any previous guest data to ensure a fresh start for this new session
      GuestAssessmentService.clearGuestAssessments()
      localStorage.setItem("guestUser", JSON.stringify(newGuestUser))
      setGuestUser(newGuestUser)
      setIsGuestLoggedIn(true)
      console.log("GuestAuth: Guest user logged in:", newGuestUser.id)
    } catch (error) {
      console.error("GuestAuth: Error saving guest user to localStorage:", error)
      // Handle error, maybe show a toast
    }
  }, [])

  const clearGuestSession = useCallback(() => {
    try {
      // Clear all guest-related data from localStorage
      GuestAssessmentService.clearGuestAssessments()

      // Additional cleanup to ensure everything is cleared
      if (typeof window !== "undefined") {
        // Clear specific guest-related keys
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.startsWith("guest-") || key.startsWith("guestUser") || key.includes("guest"))) {
            keysToRemove.push(key)
          }
        }

        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
        })

        // Also clear session storage for guest data
        sessionStorage.clear()
      }

      setGuestUser(null)
      setIsGuestLoggedIn(false)
      console.log("GuestAuth: Guest user logged out and all data cleared completely.")
    } catch (error) {
      console.error("GuestAuth: Error clearing guest user data:", error)
    }
  }, [])

  // Alias for backward compatibility
  const logoutGuest = clearGuestSession

  return (
    <GuestAuthContext.Provider
      value={{
        guestUser,
        isGuestLoggedIn,
        loading,
        loginGuest,
        logoutGuest,
        clearGuestSession,
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  )
}

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext)
  if (context === undefined) {
    throw new Error("useGuestAuth must be used within a GuestAuthProvider")
  }
  return context
}
