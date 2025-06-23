"use client"

import type React from "react"

import Link from "next/link"
import { ChevronLeft, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { resetPasswordForEmail } = useAuth()
  const { t } = useTranslation() // Use translation hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await resetPasswordForEmail(email)
      if (error) {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("email_sent"),
          description: t("check_email_for_reset"),
        })
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("unexpected_error"),
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("forgot_password")}</h1>
                <p className="text-gray-600">{t("enter_email_for_link")}</p>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">{t("sending")}...</span>
                        <span className="sm:hidden">{t("sending")}...</span>
                      </>
                    ) : (
                      <span>{t("send_link")}</span>
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
                      <ChevronLeft className="mr-2 h-4 w-4" />
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
