"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AssessmentForm } from "@/components/assessment/assessment-form"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface AssessmentPageProps {
  params: {
    category: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  const { user, profile, isAuthSessionLoading, isProfileLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // รอให้ auth loading เสร็จก่อน
    if (!isAuthSessionLoading && !isProfileLoading && mounted) {
      if (!user || !profile) {
        console.log("🔒 Assessment Page: User not authenticated, redirecting to login")
        router.push("/login")
        return
      }
    }
  }, [user, profile, isAuthSessionLoading, isProfileLoading, mounted, router])

  // แสดง loading ขณะที่กำลังตรวจสอบ auth หรือยังไม่ mount
  if (!mounted || isAuthSessionLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>กำลังโหลด...</span>
        </div>
      </div>
    )
  }

  // ถ้ายังไม่ได้ login ให้แสดง loading (จะ redirect ใน useEffect)
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>กำลังตรวจสอบการเข้าสู่ระบบ...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AssessmentForm categoryId={params.category} />
    </div>
  )
}
