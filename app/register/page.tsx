"use client"

import type React from "react"
import { redirect } from "next/navigation"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"

export default function RegisterPage() {
  // 👋 Block normal register. Send everyone to the guest-login page.
  redirect("/guest-login")

  const router = useRouter()
  const { signUp, user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPDPA: false,
  })
  const { t } = useTranslation()

  // Redirect immediately to guest login
  useEffect(() => {
    router.replace("/guest-login")
  }, [router])

  // Show a loading state while redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("redirecting")}...</span>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("password_mismatch"),
        description: t("password_mismatch"),
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (!formData.acceptPDPA) {
      toast({
        title: t("accept_pdpa_terms"),
        description: t("accept_pdpa_terms"),
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        pdpa_consent: formData.acceptPDPA,
        role: "patient", // Explicitly add role to metadata
      })

      if (error) {
        toast({
          title: t("registration_failed"),
          description: error.message === "User already registered" ? t("email_already_used") : error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("register_success"),
          description: t("check_email_for_confirmation"),
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("try_again"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("loading_profile")}...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center min-h-[calc(100vh-5rem)] relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="bg-white rounded-3xl">
              <CardHeader className="text-center space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-4 sm:pb-6 px-6 sm:px-8">
                <div className="mx-auto">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
                        <Activity className="h-9 w-9" />
                      </div>
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        VONIX
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("register")}</h1>
                  <p className="text-gray-600">{t("start_health_assessment")}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">
                      {t("full_name")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder={t("full_name")}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300 text-black"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      {t("email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300 text-black"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      {t("password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password")}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300 text-black"
                        required
                        disabled={loading}
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      {t("confirm_password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t("confirm_password")}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300 text-black"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* PDPA Consent */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <h3 className="text-black font-semibold text-sm">{t("pdpa_consent_title")}</h3>
                    <div className="text-xs text-gray-600 space-y-2">
                      <label htmlFor="pdpa-consent" className="cursor-pointer">
                        {t("pdpa_consent_text")} <span className="text-red-500">*</span>
                      </label>
                      <a href="/privacy-policy" className="text-blue-600 hover:underline inline-flex items-center ml-1">
                        {t("read_privacy_policy")}
                      </a>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="pdpa-consent"
                        checked={formData.acceptPDPA}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptPDPA: checked as boolean })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                    disabled={loading || !formData.acceptPDPA}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">{t("signing_up")}...</span>
                        <span className="sm:hidden">{t("signing_up")}...</span>
                      </>
                    ) : (
                      <span>{t("register")}</span>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <span>{t("already_have_account")}</span>
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      {t("login")}
                    </Link>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Link href="/" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("home")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
