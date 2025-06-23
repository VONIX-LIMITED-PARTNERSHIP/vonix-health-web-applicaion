"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  const { t } = useTranslation(["common", "profile"])
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isWithdrawingConsent, setIsWithdrawingConsent] = useState(false)
  const [isDeletingAssessments, setIsDeletingAssessments] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleWithdrawConsent = async () => {
    if (!user?.id) return

    setIsWithdrawingConsent(true)
    try {
      const response = await fetch("/api/auth/withdraw-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })
      const result = await response.json()

      if (response.ok) {
        toast({
          title: t("common.success"),
          description: t("profile.withdraw_consent_success"),
        })
        await refreshProfile() // Refresh profile to show updated consent status
      } else {
        throw new Error(result.error || t("profile.withdraw_consent_error"))
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsWithdrawingConsent(false)
    }
  }

  const handleDeleteAssessments = async () => {
    if (!user?.id) return

    setIsDeletingAssessments(true)
    try {
      const response = await fetch("/api/assessment/delete-all", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })
      const result = await response.json()

      if (response.ok) {
        toast({
          title: t("common.success"),
          description: t("profile.delete_assessment_data_success"),
        })
      } else {
        throw new Error(result.error || t("profile.delete_assessment_data_error"))
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsDeletingAssessments(false)
    }
  }

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
          <CardTitle>{t("profile.my_profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="consentStatus">{t("profile.consent_status")}</Label>
              <Input
                id="consentStatus"
                value={profile?.pdpa_consent ? t("profile.consent_given") : t("profile.consent_not_given")}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("profile.data_management")}</h2>
            <div className="space-y-2">
              <Label>{t("profile.withdraw_consent")}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.withdraw_consent_description")}</p>
              <Button
                variant="outline"
                onClick={handleWithdrawConsent}
                disabled={isWithdrawingConsent || !profile?.pdpa_consent}
              >
                {isWithdrawingConsent ? t("common.loading") : t("profile.withdraw_consent_button")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>{t("profile.delete_assessment_data")}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("profile.delete_assessment_data_description")}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeletingAssessments}>
                    {isDeletingAssessments ? t("common.loading") : t("profile.delete_assessment_data")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("profile.delete_assessment_data_confirm_title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("profile.delete_assessment_data_confirm_content")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAssessments}>{t("common.submit")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
