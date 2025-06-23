"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t("common.loading_profile")}</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("common.profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">{t("profile.personal_information")}</h2>
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("common.full_name")}</Label>
            <Input id="fullName" value={profile?.full_name || t("common.no_profile")} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input id="email" value={user?.email || t("common.no_profile")} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("profile.phone")}</Label>
            <Input id="phone" value={profile?.phone || t("common.not_available")} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t("profile.date_of_birth")}</Label>
            <Input id="dateOfBirth" value={profile?.date_of_birth || t("common.not_available")} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">{t("profile.gender")}</Label>
            <Input id="gender" value={profile?.gender || t("common.not_available")} readOnly />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
