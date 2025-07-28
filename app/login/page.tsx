"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleLoginButton } from "@/components/auth/google-login-button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/contexts/language-context"
import { Shield, Zap, Users, ChevronRight, Sparkles, Heart, Star, CheckCircle, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { locale } = useLanguage()

  // Check for error messages from URL params
  useEffect(() => {
    const errorParam = searchParams.get("error")
    const messageParam = searchParams.get("message")

    if (errorParam && messageParam) {
      setError(decodeURIComponent(messageParam))
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const features = [
    {
      icon: <Heart className="h-5 w-5" />,
      title: locale === "th" ? "การประเมินสุขภาพครบถ้วน" : "Comprehensive Health Assessment",
      description:
        locale === "th"
          ? "ประเมินสุขภาพในทุกมิติ ตั้งแต่ร่างกายจนถึงจิตใจ"
          : "Assess health in all dimensions, from physical to mental",
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: locale === "th" ? "ข้อมูลปลอดภัย" : "Secure Data",
      description:
        locale === "th" ? "ข้อมูลของคุณได้รับการปกป้องด้วยมาตรฐานสูงสุด" : "Your data is protected with the highest standards",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: locale === "th" ? "รายงานแบบเรียลไทม์" : "Real-time Reports",
      description:
        locale === "th"
          ? "ติดตามผลการประเมินและดูแนวโน้มสุขภาพของคุณ"
          : "Track assessment results and view your health trends",
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    },
  ]

  const stats = [
    {
      number: "10,000+",
      label: locale === "th" ? "ผู้ใช้งาน" : "Active Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      number: "95%",
      label: locale === "th" ? "ความแม่นยำ" : "Accuracy Rate",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      number: "4.9",
      label: locale === "th" ? "คะแนนรีวิว" : "User Rating",
      icon: <Star className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-4 sm:py-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Branding and Features */}
            <div className="space-y-8 sm:space-y-10 text-center xl:text-left order-2 xl:order-1">
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-center xl:justify-start gap-4">
                  <div className="relative">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
                      <Heart className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                      VONIX Health Dashboard
                    </h1>
                  </div>
                </div>
              </div>

              {/* VONIX Info Image */}
              <div className="flex justify-center xl:justify-start">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transform rotate-1"></div>
                  <Image
                    src="/images/login_info.jpg"
                    alt="VONIX Health Information"
                    width={400}
                    height={533}
                    className="relative w-full h-auto rounded-2xl shadow-2xl border-4 border-white/50 dark:border-gray-700/50"
                    priority
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 400px"
                  />

                  {/* Floating Elements */}
                  <div className="hidden sm:block absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg animate-bounce delay-300"></div>
                  <div className="hidden sm:block absolute -bottom-6 -left-6 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg animate-bounce delay-700"></div>
                  <div className="hidden lg:block absolute top-1/4 -right-8 w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-lg animate-pulse delay-500"></div>
                  <div className="hidden lg:block absolute bottom-1/4 -left-8 w-5 h-5 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg animate-pulse delay-1000"></div>
                </div>
              </div>

              {/* Features List */}
            </div>

            {/* Right side - Login Card */}
            <div className="flex justify-center xl:justify-end order-1 xl:order-2">
              <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl sm:shadow-2xl">
                <CardHeader className="space-y-3 sm:space-y-4 text-center pb-6 sm:pb-8 px-4 sm:px-6">
                  <div className="flex justify-center">
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {locale === "th" ? "เข้าสู่ระบบ" : "Sign In"}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {locale === "th" ? "เริ่มต้นการดูแลสุขภาพของคุณวันนี้" : "Start taking care of your health today"}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    >
                      <AlertDescription className="text-sm text-red-800 dark:text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Google Login */}
                  <div className="space-y-3 sm:space-y-4">
                    <GoogleLoginButton
                      disabled={loading}
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-offset-2 ring-blue-500/20 hover:ring-blue-500/40"
                    />

                    <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {locale === "th" ? "การเข้าสู่ระบบแสดงว่าคุณยอมรับ" : "By signing in, you agree to our"}
                      <br />
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {locale === "th" ? "เงื่อนไขการใช้งาน" : "Terms of Service"}
                      </Link>{" "}
                      และ{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {locale === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
                      </Link>
                    </div>
                  </div>

                  {/* Guest Access */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="bg-white dark:bg-gray-800 px-3 sm:px-4 text-gray-500 dark:text-gray-400">
                        {locale === "th" ? "หรือ" : "or"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/guest-login"
                    className="w-full flex items-center justify-center gap-2 h-11 sm:h-12 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98] ring-2 ring-offset-2 ring-purple-500/20 hover:ring-purple-500/40"
                  >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{locale === "th" ? "ใช้งานแบบทดลอง" : "Try as Guest"}</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-white/50 dark:from-gray-900/50 to-transparent"></div>
      </main>

      <Footer />
    </div>
  )
}
