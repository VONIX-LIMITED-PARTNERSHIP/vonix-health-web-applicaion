"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

interface GuestUser {
  id: string
  nickname: string
  pdpaConsent: boolean
  createdAt: string
}

interface GuestAuthContextType {
  guestUser: GuestUser | null
  isGuestLoggedIn: boolean
  loginGuest: (nickname: string, pdpaConsent: boolean) => void
  logoutGuest: () => void
}

const GuestAuthContext = createContext<GuestAuthContextType>({
  guestUser: null,
  isGuestLoggedIn: false,
  loginGuest: () => {},
  logoutGuest: () => {},
})

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null)
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false)

  // Load guest session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const guestSession = localStorage.getItem("guest_session")
        const guestUserData = localStorage.getItem("guest_user")

        if (guestSession === "active" && guestUserData) {
          const userData = JSON.parse(guestUserData)
          setGuestUser(userData)
          setIsGuestLoggedIn(true)
        }
      } catch (error) {
        console.error("Error loading guest session:", error)
        // Clear corrupted data
        localStorage.removeItem("guest_session")
        localStorage.removeItem("guest_user")
      }
    }
  }, [])

  const loginGuest = useCallback((nickname: string, pdpaConsent: boolean) => {
    const guestUserData: GuestUser = {
      id: `guest_${Date.now()}`,
      nickname,
      pdpaConsent,
      createdAt: new Date().toISOString(),
    }

    setGuestUser(guestUserData)
    setIsGuestLoggedIn(true)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_session", "active")
      localStorage.setItem("guest_user", JSON.stringify(guestUserData))
    }
  }, [])

  const logoutGuest = useCallback(() => {
    setGuestUser(null)
    setIsGuestLoggedIn(false)

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("guest_session")
      localStorage.removeItem("guest_user")
      // Clear all guest assessment data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("guest_assessment_") || key.startsWith("guest_")) {
          localStorage.removeItem(key)
        }
      })
    }
  }, [])

  return (
    <GuestAuthContext.Provider
      value={{
        guestUser,
        isGuestLoggedIn,
        loginGuest,
        logoutGuest,
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  )
}

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext)
  if (!context) {
    throw new Error("useGuestAuth must be used within a GuestAuthProvider")
  }
  return context
}
