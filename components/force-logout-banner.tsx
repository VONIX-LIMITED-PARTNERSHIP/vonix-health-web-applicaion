"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, LogOut, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"

export function ForceLogoutBanner() {
  const { user, profile, isAuthSessionLoading, signOut } = useAuth()
  const { isGuestLoggedIn } = useGuestAuth()
  const [showBanner, setShowBanner] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { t } = useTranslation(["common"])
  const { locale } = useLanguage()

  useEffect(() => {
    // Show banner if user is logged in but not in guest mode
    // This means they have an old regular login session
    if (!isAuthSessionLoading && user && !isGuestLoggedIn) {
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
  }, [user, isGuestLoggedIn, isAuthSessionLoading])

  const handleForceLogout = async () => {
    setIsLoggingOut(true)
    try {
      console.log("Force logging out user with old session")

      // Clear all auth data manually
      if (typeof window !== "undefined") {
        // Clear all localStorage items
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            keysToRemove.push(key)
          }
        }

        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
        })

        // Clear session storage
        sessionStorage.clear()

        console.log(`Cleared ${keysToRemove.length} items from localStorage`)
      }

      // Sign out from Supabase
      await signOut()

      // Force reload the page to ensure clean state
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch (error) {
      console.error("Error during force logout:", error)
      // Force reload anyway
      window.location.href = "/"
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="bg-orange-500 text-white px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {locale === "th"
                ? "คุณยังคงเข้าสู่ระบบด้วยบัญชีเก่าอยู่ กรุณาออกจากระบบเพื่อใช้งานระบบใหม่"
                : "You're still logged in with an old account. Please log out to use the new system"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleForceLogout}
            disabled={isLoggingOut}
            className="text-white hover:bg-orange-600 hover:text-white"
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {locale === "th" ? "กำลังออกจากระบบ..." : "Logging out..."}
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                {locale === "th" ? "ออกจากระบบ" : "Log Out"}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-orange-600 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
