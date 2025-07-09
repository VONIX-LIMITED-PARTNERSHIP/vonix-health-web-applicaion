"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Activity, Eye, EyeOff, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation
import { redirect } from "next/navigation" // Import redirect

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Local loading state for form submission
  const [formData, setFormData] = useState({ email: "", password: "" })
  const { t } = useTranslation() // Use translation hook

  // 👋 Block normal login. Send everyone to the guest-login page.
  redirect("/guest-login")

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

    try {
      const { data, error } = await signIn(formData.email, formData.password)

      if (error) {
        let errorMessage = t("login_failed")
        if (error.message === "Invalid login credentials") {
          errorMessage = t("invalid_credentials")
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = t("email_not_confirmed")
        } else if (error.message.includes("network")) {
          errorMessage = t("network_issue")
        }

        toast({
          title: errorMessage,
          description: error.message,
          variant: "destructive",
        })
      } else if (data.user) {
        toast({
          title: t("login_success"),
          description: t("welcome_back"),
        })

        // Small delay to ensure auth state is updated
        setTimeout(() => {
          router.push("/")
        }, 500)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />

      {/* Decorative Elements */}
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
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("welcome")}</h1>
                  <p className="text-gray-600">{t("login_to_manage_health")}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                        className="pl-12 h-12 text-black rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
                        required
                        disabled={loading}
                        autoComplete="email"
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
                        className="pl-12 h-12 text-black rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
                        required
                        disabled={loading}
                        autoComplete="current-password"
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">{t("loading")}...</span>
                        <span className="sm:hidden">{t("loading")}...</span>
                      </>
                    ) : (
                      <span>{t("login")}</span>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    {t("forgot_password")}
                  </Link>

                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <span>{t("no_account_yet")}</span>
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      {t("sign_up_free")}
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
