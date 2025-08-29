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
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-100 md:py-48 px-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-left max-w-4xl">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                  {t("hero_title_line1")} {t("hero_title_line2")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-normal max-w-3xl leading-relaxed">
                {t("hero_subtitle")}
              </p>

              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed">
                {t("hero_description")}
              </p>

              {/* Thai CTA Button */}
              <div>
                <button className="px-10 py-7 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105">
                  <Link href="/guest-login">
                  {t("cta_try_platform")}
                </Link>
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* Our Story Section */}
        <section id="story" className="py-23 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
             <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("about_vonix_title")}
              </h2>

              <div className="max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t("about_vonix_description1")}
                </p>
               
              </div>
            </div>

            {/* Challenge Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Left: Text */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                  {t("Milestone")}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                  {t("Milestone_description")}
                </p>
                
              </div>
              
              {/* Right: Image */}
              <div className="relative">
                <div className="aspect-[5/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/Vonix_key1.jpg" 
                    alt="Healthcare Challenges"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
      <section id="mission" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("mission_title")}
              </span>
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              {t("mission_description")}
            </p>
          </div>
          
          {/* Icons Row */}
          <div className="flex justify-center items-center gap-16 mb-16">
            {/* Accessible */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("value_accessible_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xs">
                {t("value_accessible_desc")}
              </p>
            </div>

            {/* Secure */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("value_secure_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xs">
                {t("value_secure_desc")}
              </p>
            </div>

            {/* Intelligent */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent animate-fade-in-up">
                {t("value_intelligent_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xs">
                {t("value_intelligent_desc")}
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* Solutions Section - Vision & Mission Style Layout */}
      <section className="py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          
          {/* Vision Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img 
                    src="/images/Vonix_key2.jpg" 
                    alt="Healthcare Vision"
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                </div>
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {t("ourvision_title")}
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {t("ourvision_description")}
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t("ourmission_title")}
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {t("ourmission_description")}
                </p>
              </div>
              
              {/* Image */}
              <div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img 
                    src="/images/Vonix_key.jpg" 
                    alt="Healthcare Mission"
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                </div>
              </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {solutions.map((solution, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl"
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${solution.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 mb-4`}
                      >
                        <solution.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{solution.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        

        {/* Impact & Social Value Section - Timeline Style */}
        <section className="py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Impact & Social Value
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t("impact_description")}
              </p>
            </div>

            {/* Timeline Layout - Compact Version */}
            <div className="relative max-w-4xl mx-auto">
              {/* Central Vertical Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" style={{height: 'calc(100% - 2rem)'}}></div>
              
              {/* Timeline Items */}
              <div className="space-y-6 md:space-y-8">
                {impactValues.map((item, index) => (
                  <div key={index} className="relative flex items-center">
                    {/* Desktop Layout */}
                      <div className={`hidden md:flex items-center w-full ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                        {/* Content */}
                        <div className="w-5/12 flex items-center justify-end pr-4">
                          <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        
                        {/* Central Circle with Connection */}
                        <div className="w-2/12 flex justify-center relative items-center">
                          {/* Horizontal Line */}
                          <div
                            className={`absolute top-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600
                              ${index % 2 === 0 ? 'right-1/2 left-0' : 'left-1/2 right-0'}`}>
                          </div>

                          {/* Circle at the center of vertical line - FIXED */}
                          <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full border-2 border-white dark:border-gray-800 shadow-lg z-10 relative">
                          </div>
                        </div>

                        {/* Spacer */}
                        <div className="w-5/12"></div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden w-full">
                        <Card className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl">
                          <CardContent className="p-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 mb-4">
                              <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                  </div>
                ))}
              </div>
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
              {/* Healthcare Institutions */}
              <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-300 p-8 flex flex-col">
                <div>
                  <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {t("partnership_hospitals_title")}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t("partnership_hospitals_desc")}
                  </p>
                </div>
                <div className="mt-auto flex justify-end">
                  <span className="px-4 py-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mr-2">
                    {t("partnership_hospitals_type")}
                  </span>
                </div>
              </div>

              {/* Academic Partners */}
              <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-300 p-8 flex flex-col">
                <div>
                  <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {t("partnership_universities_title")}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t("partnership_universities_desc")}
                  </p>
                </div>
                <div className="mt-auto flex justify-end">
                  <span className="px-4 py-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mr-3">
                    {t("partnership_universities_type")}
                  </span>
                </div>
              </div>

              {/* Technology Partners */}
              <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-300 p-8 flex flex-col">
                <div>
                  <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200 ">
                    {t("partnership_tech_title")}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t("partnership_tech_desc")}
                  </p>
                </div>
                <div className="mt-auto flex justify-end">
                  <span className="px-4 py-3 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mr-1">
                    {t("partnership_tech_type")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved / Contact Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-white gap-8">
            
            {/* Left Content */}
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {t("get_involved_title")}
              </h2>
              <p className="text-lg sm:text-xl opacity-90 leading-relaxed max-w-[49rem]">
                {t("get_involved_description")}
              </p>
            </div>

            {/* Right Button */}
            <div>
              <Button
                size="lg"
                className="text-lg px-10 py-6 h-auto bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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