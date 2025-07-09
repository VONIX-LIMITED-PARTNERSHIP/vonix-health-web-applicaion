"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, ArrowLeft, User, Shield } from "lucide-react"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"

export default function GuestLoginPage() {
  const [nickname, setNickname] = useState("")
  const [pdpaConsent, setPdpaConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { loginGuest } = useGuestAuth()
  const router = useRouter()
  const { locale } = useLanguage()
  const { t } = useTranslation(["common", "auth"])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nickname.trim()) {
      setError(locale === "th" ? "กรุณากรอกชื่อเล่น" : "Please enter your nickname")
      return
    }

    if (!pdpaConsent) {
      setError(locale === "th" ? "กรุณายินยอมตาม PDPA" : "Please consent to PDPA")
      return
    }

    setIsLoading(true)
    try {
      loginGuest(nickname.trim(), pdpaConsent)
      router.push("/")
    } catch (error) {
      setError(locale === "th" ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const pdpaText =
    locale === "th"
      ? "การให้ความยินยอมตาม PDPA\n\nข้าพเจ้ายินยอมให้ VONIX เก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลและข้อมูลสุขภาพของข้าพเจ้า รวมถึงข้อมูลจากแบบประเมินสุขภาพ เพื่อให้บริการประเมินสุขภาพเบื้องต้น สร้างรายงานสุขภาพ ส่งต่อให้บุคลากรทางการแพทย์ และปรับปรุงคุณภาพของบริการผ่านการวิเคราะห์โดยระบบ AI และเครื่องมือวิเคราะห์ข้อมูล\n\nทั้งนี้ข้อมูลของข้าพเจ้าจะได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และกฎหมาย GDPR ของสหภาพยุโรป โดยสามารถศึกษารายละเอียดเพิ่มเติมได้ในนโยบายความเป็นส่วนตัว"
      : "PDPA Consent\n\nI consent to VONIX collecting, using, and processing my personal data and health information, including data from health assessments, to provide preliminary health assessment services, create health reports, refer to medical personnel, and improve service quality through AI system analysis and data analytics tools.\n\nMy data will be protected in accordance with the Personal Data Protection Act B.E. 2562 (PDPA) and the EU GDPR law. For more details, please refer to the Privacy Policy."

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Activity className="h-7 w-7" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VONIX
            </span>
          </Link>

          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}</span>
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                <User className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {locale === "th" ? "ทดลองใช้งาน VONIX" : "Try VONIX"}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {locale === "th"
                  ? "เริ่มต้นประเมินสุขภาพของคุณได้ทันที โดยไม่ต้องสมัครสมาชิก"
                  : "Start your health assessment immediately without registration"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nickname Input */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {locale === "th" ? "ชื่อเล่น" : "Nickname"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={locale === "th" ? "กรอกชื่อเล่นของคุณ" : "Enter your nickname"}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                {/* PDPA Consent */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {pdpaText}
                      </div>
                      <div className="pt-2">
                        <Link
                          href="/privacy-policy"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium underline"
                          target="_blank"
                        >
                          {locale === "th" ? "อ่านนโยบายความเป็นส่วนตัว" : "Read Privacy Policy"}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="pdpa-consent"
                      checked={pdpaConsent}
                      onCheckedChange={(checked) => setPdpaConsent(checked as boolean)}
                      disabled={isLoading}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="pdpa-consent"
                      className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer"
                    >
                      {locale === "th"
                        ? "ข้าพเจ้ายินยอมตามเงื่อนไขการให้ความยินยอมตาม PDPA ข้างต้น"
                        : "I agree to the PDPA consent terms above"}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading
                    ? locale === "th"
                      ? "กำลังเข้าสู่ระบบ..."
                      : "Signing in..."
                    : locale === "th"
                      ? "เริ่มต้นใช้งาน"
                      : "Get Started"}
                </Button>
              </form>

              {/* Info Box */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>{locale === "th" ? "หมายเหตุ:" : "Note:"}</strong>{" "}
                  {locale === "th"
                    ? "ข้อมูลในโหมดทดลองใช้งานจะถูกเก็บไว้ในเครื่องของคุณเท่านั้น และจะหายไปเมื่อล้างข้อมูลเบราว์เซอร์ หากต้องการเก็บข้อมูลถาวร กรุณาสมัครสมาชิก"
                    : "Data in trial mode is stored locally on your device only and will be lost when browser data is cleared. For permanent data storage, please register for an account."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
