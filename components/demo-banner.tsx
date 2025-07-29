"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"

export function DemoBanner() {
  const { user, isAuthSessionLoading } = useAuth()
  const { isGuestLoggedIn } = useGuestAuth()
  const [showBanner, setShowBanner] = useState(true)
  const { t } = useTranslation(["common"])
  const { locale } = useLanguage()

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('demo-banner-dismissed')
    if (dismissed) {
      setShowBanner(false)
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('demo-banner-dismissed', 'true')
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="bg-blue-600 text-white px-3 py-1.5 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium">
              {locale === "th"
                ? "แอปพลิเคชันนี้อยู่ในระหว่างการทดสอบ หากพบปัญหาการใช้งาน กรุณาติดต่อ : Thnapat@vonix.life"
                : "This application is currently in demo mode. If you encounter any issues, please contact : Thnapat@vonix.life"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-blue-700 hover:text-white p-0.5 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}