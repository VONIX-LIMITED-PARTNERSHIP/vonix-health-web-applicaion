"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function GuestLoginPage() {
  const [guestId, setGuestId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useTranslation()
  const { loginGuest } = useGuestAuth()

  const handleLogin = async () => {
    if (!guestId) {
      setError(t("guest_login_id_required"))
      return
    }
    setError(null)
    try {
      await loginGuest(guestId)
      router.push("/guest-assessment")
    } catch (err) {
      setError(t("guest_login_failed"))
      console.error("Guest login error:", err)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {t("guest_login_title")}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{t("guest_login_description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{t("error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="guestId" className="text-gray-700 dark:text-gray-300">
              {t("guest_id_label")}
            </Label>
            <Input
              id="guestId"
              type="text"
              placeholder={t("guest_id_placeholder")}
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              className="bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {t("guest_login_button")}
          </Button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">{t("guest_login_note_part1")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
