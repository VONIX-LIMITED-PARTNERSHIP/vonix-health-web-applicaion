"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Share2, Download, Sparkles, Heart, Brain, Zap } from "lucide-react"
import { type ElementalResult, elementalInfo } from "@/data/elemental-questions"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/header"

export default function ElementalResultsPage() {
  const router = useRouter()
  const { t, locale } = useTranslation(["common", "assessment"])
  const [result, setResult] = useState<ElementalResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animatedScores, setAnimatedScores] = useState({ vata: 0, pitta: 0, kapha: 0 })
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    {
      th: "💡 ทำแบบประเมินเป็นประจำเพื่อติดตามการเปลี่ยนแปลงของธาตุในร่างกาย",
      en: "💡 Take regular assessments to track changes in your elemental balance",
    },
    {
      th: "🌟 การรู้จักธาตุของตัวเองช่วยให้เลือกอาหารและกิจกรรมที่เหมาะสม",
      en: "🌟 Understanding your element helps choose suitable foods and activities",
    },
    {
      th: "🧘‍♀️ การทำสมาธิและโยคะช่วยปรับสมดุลธาตุในร่างกาย",
      en: "🧘‍♀️ Meditation and yoga help balance your elemental constitution",
    },
  ]

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem("elementalResult")
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult)
      setResult(parsedResult)

      // Trigger confetti effect
      setTimeout(() => setShowConfetti(true), 500)

      // Animate scores
      setTimeout(() => {
        const duration = 2000
        const steps = 60
        const stepDuration = duration / steps

        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            const progress = i / steps
            setAnimatedScores({
              vata: Math.round(parsedResult.vata * progress),
              pitta: Math.round(parsedResult.pitta * progress),
              kapha: Math.round(parsedResult.kapha * progress),
            })
          }, i * stepDuration)
        }
      }, 1000)
    } else {
      router.push("/assessment/elemental")
    }
    setLoading(false)
  }, [router])

  // Rotate tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [tips.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-400 opacity-20 mx-auto"></div>
            </div>
            <p className="dark:text-gray-200 text-lg font-medium animate-pulse">
              {locale === "th" ? "กำลังวิเคราะห์ธาตุของคุณ..." : "Analyzing your elemental constitution..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">😔</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {locale === "th" ? "ไม่พบผลลัพธ์" : "No results found"}
            </p>
            <Button onClick={() => router.push("/assessment/elemental")} size="lg" className="animate-pulse">
              {locale === "th" ? "ทำแบบประเมินใหม่" : "Retake Assessment"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const dominantInfo = elementalInfo[result.dominant]
  const isThaiLanguage = locale === "th"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "✨", "🌟", "💫", "🎊"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <Header />

      <div className="py-8 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isThaiLanguage ? "ย้อนกลับ" : "Back"}
          </Button>

          {/* Floating Tips */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 transition-all duration-500 hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse">💡</div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium transition-all duration-500">
                    {isThaiLanguage ? tips[currentTip].th : tips[currentTip].en}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Result Card with Enhanced Animation */}
          <Card
            className={`mb-8 bg-gradient-to-r ${dominantInfo.color} text-white transform transition-all duration-1000 hover:scale-105 shadow-2xl animate-fade-in-up`}
          >
            <CardContent className="text-center py-12 relative overflow-hidden">
              {/* Sparkle Effects */}
              <div className="absolute top-4 right-4 animate-spin-slow">
                <Sparkles className="h-6 w-6 opacity-60" />
              </div>
              <div className="absolute bottom-4 left-4 animate-spin-slow" style={{ animationDelay: "1s" }}>
                <Sparkles className="h-4 w-4 opacity-40" />
              </div>

              <div className="text-8xl mb-4 animate-bounce-gentle">{dominantInfo.emoji}</div>
              <h1 className="text-4xl font-bold mb-2 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                {isThaiLanguage ? `คุณคือ${dominantInfo.name}` : `You are ${dominantInfo.nameEn}`}
              </h1>
              <p className="text-xl opacity-90 mb-6 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                {isThaiLanguage ? dominantInfo.tagline : `${dominantInfo.nameEn} Type - Balanced and Strong!`}
              </p>
              <div className="text-3xl font-bold animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                {result.percentage}% {isThaiLanguage ? "เด่น" : "Dominant"}
              </div>

              {/* Floating Action Buttons */}
              {/* <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: isThaiLanguage ? `ฉันคือ${dominantInfo.name}!` : `I am ${dominantInfo.nameEn}!`,
                        text: isThaiLanguage
                          ? `ฉันทำแบบประเมินธาตุแล้วได้ผลว่าเป็น${dominantInfo.name} ${result.percentage}% เด่น!`
                          : `I took an elemental assessment and I'm ${result.percentage}% ${dominantInfo.nameEn}!`,
                        url: window.location.href,
                      })
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {isThaiLanguage ? "แชร์" : "Share"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    // Simple download functionality
                    const element = document.createElement("a")
                    const file = new Blob(
                      [`My Elemental Assessment Result: ${dominantInfo.nameEn} - ${result.percentage}% Dominant`],
                      { type: "text/plain" },
                    )
                    element.href = URL.createObjectURL(file)
                    element.download = "elemental-result.txt"
                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isThaiLanguage ? "ดาวน์โหลด" : "Download"}
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Enhanced Score Breakdown */}
          <Card
            className="mb-8 dark:bg-gray-800 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle className="text-center dark:text-gray-100 flex items-center justify-center gap-2">
                <div className="animate-pulse">📊</div>
                {isThaiLanguage ? "คะแนนแต่ละธาตุ" : "Element Scores"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Vata */}
                <div className="group hover:bg-blue-50 dark:hover:bg-blue-900/20 p-4 rounded-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:animate-bounce">🌬️</span>
                      <div>
                        <span className="font-medium dark:text-gray-200 text-lg">
                          {isThaiLanguage ? "วาตะ (ธาตุลม)" : "Vata (Wind Element)"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Brain className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isThaiLanguage ? "ความคิด การเคลื่อนไหว" : "Thought & Movement"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={result.dominant === "vata" ? "default" : "secondary"}
                      className="text-lg px-3 py-1 animate-pulse"
                    >
                      {animatedScores.vata} {isThaiLanguage ? "คะแนน" : "points"}
                    </Badge>
                  </div>
                  <Progress
                    value={(animatedScores.vata / result.total) * 100}
                    className="h-4 transition-all duration-1000"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {Math.round((animatedScores.vata / result.total) * 100)}%
                  </div>
                </div>

                {/* Pitta */}
                <div className="group hover:bg-red-50 dark:hover:bg-red-900/20 p-4 rounded-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:animate-bounce">🔥</span>
                      <div>
                        <span className="font-medium dark:text-gray-200 text-lg">
                          {isThaiLanguage ? "ปิตตะ (ธาตุไฟ)" : "Pitta (Fire Element)"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Zap className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isThaiLanguage ? "การเผาผลาญ พลังงาน" : "Metabolism & Energy"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={result.dominant === "pitta" ? "default" : "secondary"}
                      className="text-lg px-3 py-1 animate-pulse"
                    >
                      {animatedScores.pitta} {isThaiLanguage ? "คะแนน" : "points"}
                    </Badge>
                  </div>
                  <Progress
                    value={(animatedScores.pitta / result.total) * 100}
                    className="h-4 transition-all duration-1000"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {Math.round((animatedScores.pitta / result.total) * 100)}%
                  </div>
                </div>

                {/* Kapha */}
                <div className="group hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:animate-bounce">💧</span>
                      <div>
                        <span className="font-medium dark:text-gray-200 text-lg">
                          {isThaiLanguage ? "เสมหะ (ธาตุน้ำ)" : "Kapha (Water Element)"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Heart className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isThaiLanguage ? "โครงสร้าง ความมั่นคง" : "Structure & Stability"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={result.dominant === "kapha" ? "default" : "secondary"}
                      className="text-lg px-3 py-1 animate-pulse"
                    >
                      {animatedScores.kapha} {isThaiLanguage ? "คะแนน" : "points"}
                    </Badge>
                  </div>
                  <Progress
                    value={(animatedScores.kapha / result.total) * 100}
                    className="h-4 transition-all duration-1000"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {Math.round((animatedScores.kapha / result.total) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Detailed Information */}
          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <Card
              className="dark:bg-gray-800 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 dark:text-gray-100">
                  <div className="animate-bounce-gentle">{dominantInfo.emoji}</div>
                  <div>
                    {isThaiLanguage ? `รายละเอียด${dominantInfo.name}` : `${dominantInfo.nameEn} Details`}
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                      {isThaiLanguage ? "เข้าใจตัวเองให้ลึกซึ้งยิ่งขึ้น" : "Understand yourself more deeply"}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Description */}
                <div className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300">
                  <h3 className="font-semibold text-xl mb-3 dark:text-gray-200 flex items-center gap-2">
                    <div className="animate-pulse">🧬</div>
                    {isThaiLanguage ? "ลักษณะเด่น" : "Key Characteristics"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {isThaiLanguage ? dominantInfo.description.th : dominantInfo.description.en}
                  </p>
                </div>

                {/* Symptoms */}
                <div className="group hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-6 rounded-xl transition-all duration-300">
                  <h3 className="font-semibold text-xl mb-3 dark:text-gray-200 flex items-center gap-2">
                    <div className="animate-pulse">⚠️</div>
                    {isThaiLanguage ? "อาการเมื่อเสียสมดุล" : "When Out of Balance"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {isThaiLanguage ? dominantInfo.symptoms.th : dominantInfo.symptoms.en}
                  </p>
                </div>

                {/* Care */}
                <div className="group hover:bg-green-50 dark:hover:bg-green-900/20 p-6 rounded-xl transition-all duration-300">
                  <h3 className="font-semibold text-xl mb-3 dark:text-gray-200 flex items-center gap-2">
                    <div className="animate-pulse">💚</div>
                    {isThaiLanguage ? "การดูแลสุขภาพ" : "Health Care Recommendations"}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {isThaiLanguage ? dominantInfo.care.th : dominantInfo.care.en}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Actions */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <Button
              onClick={() => router.push("/assessment/elemental")}
              variant="outline"
              size="lg"
              className="group hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 hover:border-purple-400"
            >
              <div className="group-hover:animate-spin mr-2">🔄</div>
              {isThaiLanguage ? "ทำแบบประเมินใหม่" : "Retake Assessment"}
            </Button>
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="group hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <div className="group-hover:animate-bounce mr-2">🏠</div>
              {isThaiLanguage ? "กลับหน้าหลัก" : "Back to Home"}
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-confetti { animation: confetti linear forwards; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  )
}
