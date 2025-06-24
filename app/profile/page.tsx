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
import { Separator } from "@/components/ui/separator"
import { PencilIcon, CheckIcon, XIcon, Loader2 } from "lucide-react" // Import Loader2
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define validation schema for profile fields
const profileFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required").optional().nullable(),
  phone: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
})

export default function ProfilePage() {
  const { t } = useTranslation(["common", "profile"])
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isWithdrawingConsent, setIsWithdrawingConsent] = useState(false)
  const [isDeletingAssessments, setIsDeletingAssessments] = useState(false)

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
      })
    }
  }, [profile, form])

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

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    if (!user?.id) return

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName: data.full_name,
          phone: data.phone,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
        }),
      })
      const result = await response.json()

      if (response.ok) {
        toast({
          title: t("common.success"),
          description: t("profile.profile_updated_success"),
        })
        await refreshProfile() // Refresh profile to show updated data
        setIsEditing(false)
      } else {
        throw new Error(result.error || t("profile.profile_update_error"))
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg text-gray-600 dark:text-gray-400">{t("common.loading_profile")}</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">{t("profile.my_profile")}</CardTitle>
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-5 w-5" />
              <span className="sr-only">{t("profile.edit_profile")}</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t("profile.personal_information")}</h2>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="fullName">{t("common.full_name")}</FormLabel>
                      <FormControl>
                        <Input
                          id="fullName"
                          readOnly={!isEditing}
                          placeholder={t("common.no_profile")}
                          value={field.value ?? ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input id="email" value={user?.email || t("common.no_profile")} readOnly />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone">{t("profile.phone")}</FormLabel>
                      <FormControl>
                        <Input
                          id="phone"
                          readOnly={!isEditing}
                          placeholder={t("common.not_available")}
                          value={field.value ?? ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="dateOfBirth">{t("profile.date_of_birth")}</FormLabel>
                      <FormControl>
                        <Input
                          id="dateOfBirth"
                          readOnly={!isEditing}
                          placeholder={t("common.not_available")}
                          value={field.value ?? ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="gender">{t("profile.gender")}</FormLabel>
                      <FormControl>
                        <Input
                          id="gender"
                          readOnly={!isEditing}
                          placeholder={t("common.not_available")}
                          value={field.value ?? ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="consentStatus">{t("profile.consent_status")}</Label>
                  <Input
                    id="consentStatus"
                    value={profile?.pdpa_consent ? t("profile.consent_given") : t("profile.consent_not_given")}
                    readOnly
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      form.reset() // Reset form to original profile values
                    }}
                    className="w-full sm:w-auto" // Make button full width on small screens
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    {t("profile.cancel_edit")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                    className="w-full sm:w-auto" // Make button full width on small screens
                  >
                    {form.formState.isSubmitting ? t("common.saving") : <CheckIcon className="h-4 w-4 mr-2" />}
                    {form.formState.isSubmitting ? "" : t("profile.save_changes")}
                  </Button>
                </div>
              )}
            </form>
          </Form>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("profile.data_management")}</h2>
            <div className="space-y-2">
              <Label>{t("profile.withdraw_consent")}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.withdraw_consent_description")}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isWithdrawingConsent || !profile?.pdpa_consent || isEditing}>
                    {isWithdrawingConsent ? t("common.loading") : t("profile.withdraw_consent_button")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("profile.withdraw_consent_confirm_title")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("profile.withdraw_consent_confirm_content")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleWithdrawConsent}>{t("common.submit")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-2">
              <Label>{t("profile.delete_assessment_data")}</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("profile.delete_assessment_data_description")}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeletingAssessments || isEditing}>
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
