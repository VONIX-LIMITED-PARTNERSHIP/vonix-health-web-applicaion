"use client"

import { Suspense } from "react"
import { PHQAssessmentForm } from "@/components/assessment/phq-assessment-form"
import { Loader2 } from "lucide-react"

function PHQAssessmentContent() {
  return <PHQAssessmentForm categoryId="phq" />
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600 dark:text-gray-400">กำลังโหลดแบบประเมิน...</p>
      </div>
    </div>
  )
}

export default function PHQAssessmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PHQAssessmentContent />
    </Suspense>
  )
}
