"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Key, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const { updatePassword, user, loading: authLoading } = useAuth() // ด��ง user และ authLoading มาใช้
  const router = useRouter()
  const { t } = useTranslation() // Use translation hook

  useEffect(() => {
    // Supabase automatically handles session from URL hash for password reset
    // No explicit token parsing needed here, just ensure the user is logged in
    // The useAuth hook will handle the session detection
  }, [user, authLoading]) // เพิ่ม user และ authLoading ใน dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsSuccess(false)

    if (password !== confirmPassword) {
      toast({
        title: t("password_mismatch"),
        description: t("password_mismatch"),
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: t("password_too_short"),
        description: t("password_too_short"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await updatePassword(password)

      if (error) {
        setMessage(`${t("error")}: ${error.message}`)
        setIsSuccess(false)
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        })
      } else {
        setMessage(t("password_reset_success"))
        setIsSuccess(true)
        toast({
          title: t("success"),
          description: t("password_reset_success"),
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error: any) {
      setMessage(`${t("unexpected_error")}: ${error.message}`)
      setIsSuccess(false)
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center min-h-[calc(100vh-5rem)] relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="bg-white rounded-3xl">
              <CardHeader className="text-center space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-4 sm:pb-6 px-6 sm:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("reset_password")}</h1>
                <p className="text-gray-600">{t("enter_email_for_link")}</p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      {t("new_password")}
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                      {t("confirm_new_password")}
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {message && (
                    <p className={`text-center text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>{message}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">{t("setting_password")}...</span>
                        <span className="sm:hidden">{t("setting_password")}...</span>
                      </>
                    ) : (
                      <span>{t("reset_password")}</span>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Link href="/login" className="flex items-center">
                      {t("back_to_login")}
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
