"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Activity, Bell, LogOut, RefreshCw, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

export function Header() {
  const { user, profile, signOut, loading, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const { locale, setLocale } = useLanguage() // Use language context
  const { t } = useTranslation() // Use translation hook

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "patient":
        return t("patient")
      case "doctor":
        return t("doctor")
      case "admin":
        return t("admin")
      default:
        return t("user")
    }
  }

  const handleSignOut = async () => {
    if (signingOut) return

    setSigningOut(true)
    try {
      await signOut()
      // signOut function in useAuth will now handle the redirect via onAuthStateChange
    } catch (error) {
      console.error("Error during sign out in Header:", error)
    } finally {
      setSigningOut(false) // Ensure signingOut state is reset
    }
  }

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      console.error("Error refreshing profile:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Activity className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VONIX
              </span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs font-medium">
                DEMO
              </Badge>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "th" ? "en" : "th")}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg font-semibold"
          >
            {locale === "th" ? "EN" : "TH"}
          </Button>

          <ModeToggle />

          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{t("loading")}...</span>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={signingOut}
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                        {profile?.full_name || t("user")}
                        {!profile && user && <span className="text-red-500 text-xs ml-2">{t("no_profile")}</span>}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {profile ? getRoleLabel(profile.role || "patient") : t("loading_profile")}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!profile && user && (
                    <DropdownMenuItem onClick={handleRefreshProfile} disabled={refreshing}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? t("loading") : t("refresh_profile")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">👤 {t("profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600" disabled={signingOut}>
                    {signingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("signing_out")}
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("sign_out")}
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" className="font-medium text-sm sm:text-base px-3 sm:px-4" asChild>
                <Link href="/login">
                  <span className="hidden sm:inline">{t("login")}</span>
                  <span className="sm:hidden">{t("login")}</span>
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-3 sm:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                asChild
              >
                <Link href="/register">
                  <span className="hidden sm:inline">{t("start_free")}</span>
                  <span className="sm:hidden">{t("register")}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
