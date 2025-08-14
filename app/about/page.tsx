"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import {
  Heart,
  Brain,
  Shield,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Lock,
  Users,
  Handshake,
  Lightbulb,
  Scale,
  Mail,
} from "lucide-react"

export default function AboutPage() {
  const { locale } = useLanguage()
  const { t } = useTranslation(["about"])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const solutions = [
    {
      icon: Brain,
      title: t("solution_ai_title"),
      description: t("solution_ai_description"),
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: Stethoscope,
      title: t("solution_telemedicine_title"),
      description: t("solution_telemedicine_description"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Shield,
      title: t("solution_blockchain_title"),
      description: t("solution_blockchain_description"),
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Lock,
      title: t("solution_privacy_title"),
      description: t("solution_privacy_description"),
      gradient: "from-pink-500 to-rose-600",
    },
  ]

  const whyChooseUs = [
    {
      icon: Lock,
      title: t("why_privacy_title"),
      description: t("why_privacy_description"),
    },
    {
      icon: Brain,
      title: t("why_ai_insights_title"),
      description: t("why_ai_insights_description"),
    },
    {
      icon: Users,
      title: t("why_community_focus_title"),
      description: t("why_community_focus_description"),
    },
    {
      icon: Scale,
      title: t("why_regulatory_title"),
      description: t("why_regulatory_description"),
    },
  ]

  const impactValues = [
    {
      icon: Users,
      title: t("impact_community_title"),
      description: t("impact_community_description"),
    },
    {
      icon: Handshake,
      title: t("impact_collaboration_title"),
      description: t("impact_collaboration_description"),
    },
    {
      icon: Lightbulb,
      title: t("impact_advocacy_title"),
      description: t("impact_advocacy_description"),
    },
  ]

  const teamMembers = [
    {
      name: "Pichsinee Thanyatare",
      role: t("team_ceo"),
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Nantapong Pongtumrongsak",
      role: t("team_cto"),
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Kodchamon Wongkarnkah",
      role: t("team_coo"),
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Sutthida Klinmanee",
      role: t("team_cfo"),
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Header />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section - Storytelling Driven */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 text-sm font-medium mb-8 shadow-lg animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("hero_badge")}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("hero_title_line1")}
              </span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up delay-200">
                {t("hero_title_line2")}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6 font-light max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-400">
              {t("hero_subtitle")}
            </p>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-600">
              {t("hero_description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-800">
              <Button
                size="lg"
                className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                asChild
              >
                <Link href="/guest-login">
                  {t("cta_try_platform")}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section - Human-Centered */}
        <section id="mission" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                  {t("mission_title")}
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                {t("mission_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {t("value_accessible_title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t("value_accessible_desc")}</p>
              </div>

              <div className="text-center p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{t("value_secure_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t("value_secure_desc")}</p>
              </div>

              <div className="text-center p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <Brain className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {t("value_intelligent_title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t("value_intelligent_desc")}</p>
              </div>
            </div>
          </div>
        </section>


        {/* Solutions Section - Feature Focused */}
        <section className="py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {t("solutions_title")}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t("solutions_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${solution.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <solution.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {solution.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{solution.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why VONIX Section - Differentiation */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                  {t("why_vonix_title")}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t("why_vonix_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="text-center group p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 mb-6">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact & Social Value Section */}
        <section className="py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {t("impact_title")}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t("impact_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {impactValues.map((item, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl"
                >
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 mb-6">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section - Strategic Collaborations */}
        <section className="py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {t("partnerships_title")}
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t("partnerships_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    {t("partnership_hospitals_title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {t("partnership_hospitals_desc")}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    {t("partnership_hospitals_type")}
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <Brain className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    {t("partnership_universities_title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {t("partnership_universities_desc")}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                    {t("partnership_universities_type")}
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    {t("partnership_tech_title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t("partnership_tech_desc")}</p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                    {t("partnership_tech_type")}
                  </div>
                </CardContent>
              </Card>
            </div>


          </div>
        </section>

        {/* Get Involved / Contact Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">{t("get_involved_title")}</h2>
            <p className="text-lg sm:text-xl mb-12 opacity-90 leading-relaxed">{t("get_involved_description")}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 py-6 h-auto bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                asChild
              >
                <Link href="/guest-login">
                  {t("get_involved_try_now")}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 h-auto border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 bg-transparent"
                asChild
              >
                <Link href="mailto:vonix.th@gmail.com">
                  {t("get_involved_contact")}
                  <Mail className="ml-2 h-5 w-5" />
                </Link>
              </Button> */}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }

        .delay-800 {
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
