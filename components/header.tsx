"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Bell, LogOut, RefreshCw, Loader2, Settings, Sun, Moon, Languages, User, Menu } from "lucide-react" // Added Menu icon
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // Added Sheet components
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "next-themes"

export function Header() {
  const { user, profile, isAuthSessionLoading, isProfileLoading, signOut, refreshProfile } = useAuth()
  const { guestUser, isGuestLoggedIn, logoutGuest } = useGuestAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
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
      if (isGuestLoggedIn) {
        logoutGuest()
        router.push("/")
      } else {
        await signOut()
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setTimeout(() => {
        setSigningOut(false)
      }, 100)
    }
  }

  const handleRefreshProfile = async () => {
    if (isGuestLoggedIn) return // No profile refresh for guests

    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      // Handle error silently
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

  const isLoggedIn = user || isGuestLoggedIn
  const displayName = profile?.full_name || guestUser?.nickname || t("user")
  const displayRole = guestUser
    ? locale === "th"
      ? "ผู้ทดลองใช้งาน"
      : "Guest User"
    : getRoleLabel(profile?.role || "patient")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Combined Logo and Desktop Navigation Menu */}
        <div className="flex items-center space-x-4 sm:space-x-6">
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

          {/* Desktop Navigation Menu - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {locale === "th" ? "หน้าหลัก" : "Home"}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/about" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {locale === "th" ? "เกี่ยวกับเรา" : "About"}
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Navigation Toggle (Hamburger Menu) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 md:hidden">
                {" "}
                {/* Visible only on mobile */}
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">{t("common.menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] flex flex-col">
              <div className="flex items-center space-x-2 sm:space-x-3 group mb-6">
                <div className="relative">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <Activity className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    VONIX
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/" ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {locale === "th" ? "หน้าหลัก" : "Home"}
                </Link>
                <Link
                  href="/about"
                  className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/about" ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {locale === "th" ? "เกี่ยวกับเรา" : "About"}
                </Link>
                {/* Add other mobile-specific navigation items here if needed */}
              </nav>
            </SheetContent>
          </Sheet>

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

          {isAuthSessionLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{t("loading")}...</span>
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {!isGuestLoggedIn && (
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={signingOut}
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
                      <AvatarFallback
                        className={`${isGuestLoggedIn ? "bg-gradient-to-br from-purple-400 to-pink-500" : "bg-gradient-to-br from-blue-400 to-purple-500"} text-white font-semibold text-sm`}
                      >
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                        {displayName}
                        {isGuestLoggedIn && (
                          <span className="text-purple-500 text-xs ml-2">({locale === "th" ? "ทดลอง" : "Guest"})</span>
                        )}
                        {!profile && user && !isProfileLoading && !isGuestLoggedIn && (
                          <span className="text-red-500 text-xs ml-2">{t("no_profile")}</span>
                        )}
                        {isProfileLoading && !isGuestLoggedIn && (
                          <span className="text-gray-500 text-xs ml-2">{t("loading_profile")}...</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{displayRole}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isProfileLoading && !isGuestLoggedIn && (
                    <DropdownMenuItem disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loading_profile")}...
                    </DropdownMenuItem>
                  )}
                  {!profile && user && !isProfileLoading && !isGuestLoggedIn && (
                    <DropdownMenuItem onClick={handleRefreshProfile} disabled={refreshing}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? t("loading") : t("refresh_profile")}
                    </DropdownMenuItem>
                  )}
                  {profile && !isGuestLoggedIn && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile">👤 {t("common.profile_link_text")}</Link>
                    </DropdownMenuItem>
                  )}
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
              {/* Only show the "Try Now" button */}
              <Button variant="ghost" className="font-medium text-sm sm:text-base px-3 sm:px-4" asChild>
                <Link href="/guest-login">
                  <User className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{locale === "th" ? "ทดลองใช้งาน" : "Try Now"}</span>
                  <span className="sm:hidden">{locale === "th" ? "ทดลอง" : "Try"}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
