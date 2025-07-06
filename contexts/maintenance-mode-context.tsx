"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth" // Assuming useAuth is available for checking login status

interface MaintenanceModeContextType {
  isMaintenanceMode: boolean
}

const MaintenanceModeContext = createContext<MaintenanceModeContextType | undefined>(undefined)

export function MaintenanceModeProvider({ children }: { children: ReactNode }) {
  // Read from environment variable. In Next.js, NEXT_PUBLIC_ prefix makes it available on client.
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // If in maintenance mode and user is logged in, sign them out and redirect to home
    // This ensures that even if they were logged in, they can't access restricted features.
    if (isMaintenanceMode && !authLoading && user) {
      // You might want to add a signOut function here if useAuth provides one
      // For now, we'll just redirect.
      // If you want to force sign out, you'd need to call signOut() from useAuth
      // and then redirect.
      // Example: if (user) { signOut(); }
      router.push("/") // Redirect to home page which will show maintenance message
    }
  }, [isMaintenanceMode, user, authLoading, router])

  return <MaintenanceModeContext.Provider value={{ isMaintenanceMode }}>{children}</MaintenanceModeContext.Provider>
}

export function useMaintenanceMode() {
  const context = useContext(MaintenanceModeContext)
  if (context === undefined) {
    throw new Error("useMaintenanceMode must be used within a MaintenanceModeProvider")
  }
  return context
}
