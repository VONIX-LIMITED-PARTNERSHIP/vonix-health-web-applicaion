"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  fullName: z.string().min(1, { message: "Full name is required." }),
  pdpaConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the PDPA consent.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      pdpaConsent: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log("RegisterPage: Attempting to sign up with values:", values)
    const { error } = await signUp(values.email, values.password, {
      full_name: values.fullName,
      pdpa_consent: values.pdpaConsent,
      role: "patient", // Default role for new registrations
    })

    if (error) {
      console.error("RegisterPage: Sign up error:", error.message)
      toast({
        title: t("auth.signUpError"),
        description: error.message,
        variant: "destructive",
      })
    } else {
      console.log("RegisterPage: Sign up successful. Redirecting to login.")
      toast({
        title: t("auth.signUpSuccess"),
        description: t("auth.checkEmailForConfirmation"),
      })
      // Supabase's redirectTo will handle the actual redirect after email confirmation
      // For now, we just inform the user to check their email.
      // The user will be redirected to /login after clicking the confirmation link.
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            {t("auth.registerTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("auth.fullNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("auth.emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("auth.passwordPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pdpaConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="pdpaConsent" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="pdpaConsent">
                      {t("auth.pdpaConsentText")}{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                        {t("auth.privacyPolicy")}
                      </Link>{" "}
                      {t("auth.and")}{" "}
                      <Link href="/terms" className="text-primary hover:underline" target="_blank">
                        {t("auth.termsOfService")}
                      </Link>
                      .
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.registering") : t("auth.register")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
