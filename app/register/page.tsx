"use client"

import type React from "react"

import { useState, useEffect } from "react" // Added useEffect import
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Eye, EyeOff, ArrowLeft, ExternalLink, Mail, Lock, User, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, user, loading: authLoading } = useAuth() // Added user and authLoading from useAuth
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Local loading state for form submission
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPDPA: false,
  })

  console.log("RegisterPage loaded. Current user from useAuth:", user)
  console.log("Auth loading state (from useAuth):", authLoading)
  console.log("Local form submission loading state:", loading)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Redirecting to / because user is logged in and auth is not loading.")
      router.push("/")
    } else if (!authLoading && !user) {
      console.log("Auth not loading and no user found. Ready for registration.")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) {
      console.log("handleSubmit: Already loading, returning.")
      return
    }

    console.log("handleSubmit: Starting form submission.")
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านให้ตรงกัน",
        variant: "destructive",
      })
      setLoading(false)
      console.log("handleSubmit: Password mismatch, local loading set to false.")
      return
    }

    if (!formData.acceptPDPA) {
      toast({
        title: "กรุณายอมรับเงื่อนไข PDPA",
        description: "จำเป็นต้องยอมรับเงื่อนไขการใช้งานก่อนสมัครสมาชิก",
        variant: "destructive",
      })
      setLoading(false)
      console.log("handleSubmit: PDPA not accepted, local loading set to false.")
      return
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        pdpa_consent: formData.acceptPDPA,
      })

      if (error) {
        toast({
          title: "สมัครสมาชิกไม่สำเร็จ",
          description: error.message === "User already registered" ? "อีเมลนี้ถูกใช้งานแล้ว" : error.message,
          variant: "destructive",
        })
        console.error("Error from signUp hook in page:", error)
      } else {
        toast({
          title: "สมัครสมาชิกสำเร็จ",
          description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
        })
        console.log("Sign up successful, redirecting to /login.")
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
      console.error("Exception during registration form submission:", error)
    } finally {
      setLoading(false)
      console.log("handleSubmit: Form submission finished, local loading set to false.")
    }
  }

  // Show loading if auth is still loading (full page spinner)
  if (authLoading) {
    console.log("RegisterPage: authLoading is true, showing full page spinner.")
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</span>
        </div>
      </div>
    )
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
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">สมัครสมาชิก</h1>
                  <p className="text-gray-600">เริ่มต้นดูแลสุขภาพของคุณวันนี้</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">
                      ชื่อ-นามสกุล
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="ชื่อ-นามสกุลของคุณ"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      อีเมล
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      รหัสผ่าน
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="รหัสผ่านของคุณ"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
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
                      ยืนยันรหัสผ่าน
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="ยืนยันรหัสผ่านของคุณ"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-gray-50 focus:bg-white transition-all duration-300"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* PDPA Consent */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <h3 className="font-semibold text-sm">การให้ความยินยอมตาม PDPA</h3>
                    <div className="text-xs text-gray-600 space-y-2">
                      <p>
                        <strong>ข้อมูลที่เราจะเก็บรวบรวม:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <strong>ข้อมูลส่วนตัว:</strong> ชื่อ-นามสกุล, อีเมล, วันเกิด, เพศ, เบอร์โทรศัพท์
                        </li>
                        <li>
                          <strong>ข้อมูลสุขภาพพื้นฐาน:</strong> น้ำหนัก, ส่วนสูง, หมู่เลือด, BMI
                        </li>
                        <li>
                          <strong>ประวัติการแพทย์:</strong> การแพ้ยา, อาหาร, สิ่งแวดล้อม
                        </li>
                        <li>
                          <strong>ประวัติสุขภาพ:</strong> โรคประจำตัว, ยาที่ใช้, ประวัติครอบครัว
                        </li>
                        <li>
                          <strong>ข้อมูลการประเมิน:</strong> คำตอบแบบประเมินสุขภาพ, ผลการวิเคราะห์
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="pdpa-consent"
                        checked={formData.acceptPDPA}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptPDPA: checked as boolean })}
                        disabled={loading}
                      />
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <label htmlFor="pdpa-consent" className="cursor-pointer">
                          ข้าพเจ้ายินยอมให้ VONIX เก็บรวบรวม ใช้ และประมวลผล ข้อมูลส่วนบุคคลและข้อมูลสุขภาพของข้าพเจ้า เพื่อการให้
                          บริการประเมินสุขภาพ การสร้างรายงานสำหรับแพทย์ และการ ปรับปรุงบริการ{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Link
                          href="/privacy-policy"
                          className="text-blue-600 hover:underline inline-flex items-center ml-1"
                        >
                          อ่านนโยบายความเป็นส่วนตัว
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
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
                        <span className="hidden sm:inline">กำลังสมัครสมาชิก...</span>
                        <span className="sm:hidden">กำลังสมัคร...</span>
                      </>
                    ) : (
                      <span>สมัครสมาชิก</span>
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <span>มีบัญชีอยู่แล้ว?</span>
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      เข้าสู่ระบบ
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
                      กลับหน้าหลัก
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
