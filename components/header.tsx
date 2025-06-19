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

export function Header() {
  const { user, profile, signOut, loading, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

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
        return "ผู้ใช้งานทั่วไป"
      case "doctor":
        return "แพทย์"
      case "admin":
        return "ผู้ดูแลระบบ"
      default:
        return "ผู้ใช้งาน"
    }
  }

  const handleSignOut = async () => {
    if (signingOut) return

    setSigningOut(true)
    try {
      await signOut()
      // signOut function will handle the redirect
    } catch (error) {
      setSigningOut(false)
    }
  }

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
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
          <ModeToggle />

          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">กำลังโหลด...</span>
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
                        {profile?.full_name || "ผู้ใช้งาน"}
                        {!profile && user && <span className="text-red-500 text-xs ml-2">(ไม่มีโปรไฟล์)</span>}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {profile ? getRoleLabel(profile.role || "patient") : "กำลังโหลด..."}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!profile && user && (
                    <DropdownMenuItem onClick={handleRefreshProfile} disabled={refreshing}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "กำลังโหลด..." : "โหลดโปรไฟล์"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">👤 โปรไฟล์ของฉัน</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">📊 แดชบอร์ด</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports">📋 รายงานสุขภาพ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">⚙️ การตั้งค่า</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600" disabled={signingOut}>
                    {signingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังออกจากระบบ...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        ออกจากระบบ
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
                  <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                  <span className="sm:hidden">เข้าสู่</span>
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-3 sm:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                asChild
              >
                <Link href="/register">
                  <span className="hidden sm:inline">เริ่มต้นฟรี</span>
                  <span className="sm:hidden">สมัคร</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
