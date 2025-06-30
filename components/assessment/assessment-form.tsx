"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AssessmentForm() {
  const router = useRouter()
  const { categoryId } = useParams()
  const { user, isAuthSessionLoading } = useAuth()
  const { profile, isProfileLoading } = useProfile()
  const { toast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [category, setCategory] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const initializeForm = async () => {
      setIsInitializing(true)
      try {
        // โหลดข้อมูลเริ่มต้น
        await loadInitialData()
      } catch (error) {
        console.error("Error initializing form:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    if (mounted && user && profile) {
      initializeForm()
    }
  }, [mounted, user, profile, categoryId])

  const loadInitialData = async () => {
    // TODO: Implement data loading logic here
    // Example:
    // const categoryData = await fetchCategory(categoryId);
    // setCategory(categoryData);
    setCategory({ id: categoryId, name: "Example Category" }) // Mock data
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement submission logic here
      // Example:
      // await submitAssessment(data);
      toast({
        title: "บันทึกข้อมูลสำเร็จ!",
        description: "ระบบกำลังบันทึกข้อมูลของคุณ",
      })
      router.push("/")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "พบข้อผิดพลาด!",
        description: "มีข้อผิดพลาดเกิดขึ้นขณะบันทึกข้อมูล",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isAuthSessionLoading || isProfileLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>กำลังเตรียมแบบประเมิน...</span>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ไม่พบแบบประเมินที่ระบุ</h2>
          <Button onClick={() => router.push("/")} variant="outline">
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">แบบประเมิน: {category?.name}</h1>
      {/* TODO: Implement form rendering logic here */}
      <p>Form content goes here.</p>
      <Button disabled={isSubmitting} onClick={() => handleSubmit({})}>
        {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
      </Button>
    </div>
  )
}

export default AssessmentForm
