"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Eye,
  Heart,
  Shield,
  Brain,
  Sparkles,
  Lock,
  Users,
  Building2,
  GraduationCap,
  Handshake,
  Stethoscope,
  Database,
  MonitorSmartphone,
  ChevronRight,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const { t } = useTranslation(["about"])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("about.hero_badge")}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                {t("about.hero_title_line1")}
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                {t("about.hero_title_line2")}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4">
              {t("about.hero_subtitle")}
            </p>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
              {t("about.hero_description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg rounded-full">
                <Play className="mr-2 h-5 w-5" />
                {t("about.cta_try_platform")}
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-semibold px-8 py-6 text-lg rounded-full bg-transparent">
                <Eye className="mr-2 h-5 w-5" />
                {t("about.cta_learn_more")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Future of Digital Health Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#0d0d12] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("about.mission_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("about.mission_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t("about.value_accessible_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.value_accessible_desc")}
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t("about.value_secure_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.value_secure_desc")}
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t("about.value_intelligent_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.value_intelligent_desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solutions Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Badge className="mb-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs">
              OUR SOLUTIONS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("about.solutions_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              {t("about.solutions_description")}
            </p>
            <Link href="#" className="inline-flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 mt-4 text-sm font-medium">
              {t("about.cta_learn_more")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Health Assessment */}
            <Card className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 border-violet-300 dark:border-violet-500/30 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-200 dark:bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.solution_ai_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {t("about.solution_ai_description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Telemedicine */}
            <Card className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 border-violet-300 dark:border-violet-500/30 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-200 dark:bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                    <MonitorSmartphone className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.solution_telemedicine_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {t("about.solution_telemedicine_description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Records */}
            <Card className="bg-gray-50 dark:bg-[#12121a] border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.solution_blockchain_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {t("about.solution_blockchain_description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy First */}
            <Card className="bg-gray-50 dark:bg-[#12121a] border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.solution_privacy_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {t("about.solution_privacy_description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* VONIX Highlights Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#0d0d12] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("about.why_vonix_title")}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Lock className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">{t("about.why_privacy_title")}</h3>
                <p className="text-gray-500 text-xs">
                  {t("about.why_privacy_description")}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <MonitorSmartphone className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">{t("about.why_ai_insights_title")}</h3>
                <p className="text-gray-500 text-xs">
                  {t("about.why_ai_insights_description")}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Users className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">{t("about.why_community_focus_title")}</h3>
                <p className="text-gray-500 text-xs">
                  {t("about.why_community_focus_description")}
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center">
                  <Stethoscope className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">{t("about.why_regulatory_title")}</h3>
                <p className="text-gray-500 text-xs">
                  {t("about.why_regulatory_description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t("about.impact_title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {t("about.impact_description")}
              </p>
            </div>
            <Link href="#" className="inline-flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 mt-4 md:mt-0 text-sm font-medium">
              {t("about.cta_learn_more")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Equity */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-500/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-200 dark:bg-emerald-600/30 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.impact_community_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.impact_community_description")}
                </p>
              </CardContent>
            </Card>

            {/* Partnerships */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border-violet-200 dark:border-violet-500/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-violet-200 dark:bg-violet-600/30 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.impact_collaboration_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.impact_collaboration_description")}
                </p>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-500/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-200 dark:bg-blue-600/30 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{t("about.impact_advocacy_title")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t("about.impact_advocacy_description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#0d0d12] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs">
              ECOSYSTEM
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("about.partnerships_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Healthcare Providers */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-600/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("about.partnership_hospitals_title")}</h3>
                    <p className="text-gray-500 text-xs">{t("about.partnership_hospitals_desc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Partners */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("about.partnership_universities_title")}</h3>
                    <p className="text-gray-500 text-xs">{t("about.partnership_universities_desc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tech Partners */}
            <Card className="bg-white dark:bg-[#12121a] border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-600/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("about.partnership_tech_title")}</h3>
                    <p className="text-gray-500 text-xs">{t("about.partnership_tech_desc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              {t("about.get_involved_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {t("about.get_involved_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg rounded-full">
                {t("about.get_involved_try_now")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-semibold px-8 py-6 text-lg rounded-full bg-transparent">
                {t("about.get_involved_contact")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
