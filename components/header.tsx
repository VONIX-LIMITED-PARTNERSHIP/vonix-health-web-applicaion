"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, LogOut, RefreshCw, Loader2, Settings, Sun, Moon, Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "next-themes"

export function Header() {
  const { user, profile, isAuthSessionLoading, isProfileLoading, signOut, refreshProfile } = useAuth() // Destructure new states
  const [refreshing, setRefreshing] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslation(["common", "profile"])
  const { setTheme, theme } = useTheme()

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
    } catch (error) {
      // Removed console.error
    } finally {
      setTimeout(() => {
        setSigningOut(false)
      }, 100)
    }
  }

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      // Removed console.error
    } finally {
      setRefreshing(false)
    }
  }

  const handleLanguageToggle = () => {
    setLocale(locale === "th" ? "en" : "th")
  }

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
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
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">{t("settings")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLanguageToggle}>
                <Languages className="mr-2 h-4 w-4" />
                <span className="flex-1">{t("language")}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{locale === "th" ? "ไทย" : "English"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleThemeToggle}>
                {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                <span className="flex-1">{t("theme")}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {theme === "light" ? t("dark") : t("light")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleRefreshProfile} disabled={refreshing}>
                {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="sr-only">{t("refreshProfile")}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                <span className="sr-only">{t("signOut")}</span>
              </Button>
              <Avatar>
                <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} alt={profile?.name || "User"} />
                <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile?.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{getRoleLabel(profile?.role)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
