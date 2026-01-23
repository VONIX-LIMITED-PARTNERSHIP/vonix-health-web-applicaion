"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Heart,
    Shield,
    Zap,
    Activity,
    Globe,
    Users,
    ArrowRight,
    Leaf,
    Smartphone,
    Database,
    Lock,
    Stethoscope,
    Brain,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"

export function LandingPage() {
    const router = useRouter()
    const { t } = useTranslation(["landing"])

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <Badge variant="outline" className="mb-6 px-4 py-1 border-purple-200 bg-white/50 text-purple-700 backdrop-blur-sm shadow-sm rounded-full">
                        {t("landing.hero_badge")}
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                        <span className="text-purple-600 block mb-2">{t("landing.hero_title_line1")}</span>
                        <span className="text-purple-600">{t("landing.hero_title_line2")}</span>
                    </h1>

                    <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {t("landing.hero_subtitle")}
                    </p>

                    <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 mb-10 text-lg">
                        {t("landing.hero_description")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="px-8 py-6 text-lg rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-200 dark:shadow-purple-900/20 transition-all hover:scale-105"
                            onClick={() => router.push('/guest-login')}
                        >
                            {t("landing.cta_assessment")} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl filter opacity-50"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl filter opacity-50"></div>
                </div>
            </section>

            {/* Digital Health Future Section */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t("landing.future_title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {t("landing.future_desc")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Heart className="w-8 h-8 text-purple-600" />}
                            title={t("landing.feature_accessible_title")}
                            description={t("landing.feature_accessible_desc")}
                            color="bg-purple-50"
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-blue-600" />}
                            title={t("landing.feature_secure_title")}
                            description={t("landing.feature_secure_desc")}
                            color="bg-blue-50"
                        />
                        <FeatureCard
                            icon={<Activity className="w-8 h-8 text-pink-600" />}
                            title={t("landing.feature_comprehensive_title")}
                            description={t("landing.feature_comprehensive_desc")}
                            color="bg-pink-50"
                        />
                    </div>
                </div>
            </section>

            {/* Key Solutions Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-purple-600">
                            {t("landing.solutions_title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t("landing.solutions_subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SolutionCard
                            icon={<Stethoscope className="w-6 h-6 text-white" />}
                            iconBg="bg-purple-600"
                            title={t("landing.solution_ai_title")}
                            description={t("landing.solution_ai_desc")}
                        />
                        <SolutionCard
                            icon={<Database className="w-6 h-6 text-white" />}
                            iconBg="bg-blue-600"
                            title={t("landing.solution_hospital_title")}
                            description={t("landing.solution_hospital_desc")}
                        />
                        <SolutionCard
                            icon={<Lock className="w-6 h-6 text-white" />}
                            iconBg="bg-green-600"
                            title={t("landing.solution_records_title")}
                            description={t("landing.solution_records_desc")}
                        />
                        <SolutionCard
                            icon={<Users className="w-6 h-6 text-white" />}
                            iconBg="bg-pink-600"
                            title={t("landing.solution_privacy_title")}
                            description={t("landing.solution_privacy_desc")}
                        />
                    </div>
                </div>
            </section>

            {/* Why Vonix Section */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t("landing.why_title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t("landing.why_subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HighlightCard
                            icon={<Shield className="w-8 h-8 text-blue-600" />}
                            title={t("landing.why_security_title")}
                            description={t("landing.why_security_desc")}
                            bg="bg-blue-50"
                        />
                        <HighlightCard
                            icon={<Smartphone className="w-8 h-8 text-purple-600" />}
                            title={t("landing.why_ai_title")}
                            description={t("landing.why_ai_desc")}
                            bg="bg-purple-50"
                        />
                        <HighlightCard
                            icon={<Users className="w-8 h-8 text-pink-600" />}
                            title={t("landing.why_person_title")}
                            description={t("landing.why_person_desc")}
                            bg="bg-pink-50"
                        />
                        <HighlightCard
                            icon={<Globe className="w-8 h-8 text-indigo-600" />}
                            title={t("landing.why_access_title")}
                            description={t("landing.why_access_desc")}
                            bg="bg-indigo-50"
                        />
                    </div>
                </div>
            </section>

            {/* Social Impact Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">
                            {t("landing.impact_title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {t("landing.impact_desc")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ImpactCard
                            icon={<Heart className="w-8 h-8 text-white" />}
                            title={t("landing.impact_community_title")}
                            description={t("landing.impact_community_desc")}
                            iconBg="bg-green-500"
                        />
                        <ImpactCard
                            icon={<Leaf className="w-8 h-8 text-white" />}
                            title={t("landing.impact_sustainability_title")}
                            description={t("landing.impact_sustainability_desc")}
                            iconBg="bg-teal-500"
                        />
                        <ImpactCard
                            icon={<Brain className="w-8 h-8 text-white" />}
                            title={t("landing.impact_tech_title")}
                            description={t("landing.impact_tech_desc")}
                            iconBg="bg-emerald-500"
                        />
                    </div>
                </div>
            </section>

            {/* Strategic Collaboration Section */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">
                            {t("landing.collab_title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {t("landing.collab_desc")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <CollaborationCard
                            icon={<Users className="w-8 h-8 text-white" />}
                            title={t("landing.collab_health_title")}
                            description={t("landing.collab_health_desc")}
                            iconBg="bg-blue-600"
                        />
                        <CollaborationCard
                            icon={<Activity className="w-8 h-8 text-white" />}
                            title={t("landing.collab_gov_title")}
                            description={t("landing.collab_gov_desc")}
                            iconBg="bg-green-600"
                        />
                        <CollaborationCard
                            icon={<Zap className="w-8 h-8 text-white" />}
                            title={t("landing.collab_startup_title")}
                            description={t("landing.collab_startup_desc")}
                            iconBg="bg-purple-600"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Footer Section */}
            <section className="py-20 bg-purple-600 relative overflow-hidden">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                        {t("landing.cta_footer_title")}
                    </h2>
                    <p className="text-purple-100 max-w-2xl mx-auto mb-10 text-lg">
                        {t("landing.cta_footer_desc")}
                    </p>
                    <Button
                        size="lg"
                        className="px-10 py-6 text-lg rounded-full bg-white text-purple-600 hover:bg-gray-100 font-bold shadow-lg"
                        onClick={() => router.push('/guest-login')}
                    >
                        {t("landing.cta_footer_button")} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                {/* Decorative background circles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-3xl"></div>
                    <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/30 blur-3xl"></div>
                </div>
            </section>

        </div>
    )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
    return (
        <div className={`p-8 rounded-2xl ${color} border border-transparent hover:border-purple-100 hover:shadow-lg transition-all text-center group`}>
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-800">{title}</h3>
            <p className="text-gray-600 dark:text-gray-600">{description}</p>
        </div>
    )
}

function SolutionCard({ icon, iconBg, title, description }: { icon: React.ReactNode, iconBg: string, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
            <div className={`p-4 rounded-xl ${iconBg} shadow-md shrink-0`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

function HighlightCard({ icon, title, description, bg }: { icon: React.ReactNode, title: string, description: string, bg: string }) {
    return (
        <div className={`p-6 rounded-2xl ${bg} dark:bg-gray-800/50 border border-transparent hover:shadow-md transition-all h-full text-center flex flex-col items-center`}>
            <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}

function ImpactCard({ icon, title, description, iconBg }: { icon: React.ReactNode, title: string, description: string, iconBg: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-xl transition-all text-center group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
            <div className={`w-16 h-16 mx-auto ${iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-md rotate-3 group-hover:rotate-0 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    )
}

function CollaborationCard({ icon, title, description, iconBg }: { icon: React.ReactNode, title: string, description: string, iconBg: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 hover:shadow-lg transition-all text-center">
            <div className={`w-16 h-16 mx-auto ${iconBg} rounded-full flex items-center justify-center mb-6 shadow-lg ring-4 ring-white dark:ring-gray-800`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    )
}
