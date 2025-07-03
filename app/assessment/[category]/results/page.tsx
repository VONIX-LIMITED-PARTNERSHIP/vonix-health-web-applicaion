"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AssessmentResults } from "@/components/assessment/assessment-results"
import { AssessmentService } from "@/lib/assessment-service"
import { useAuth } from "@/hooks/use-auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface ResultsPageProps {
  params: {
    category: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient<Database>()
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const assessmentId = searchParams.get("id")
  const categoryId = params.category

  useEffect(() => {
    async function loadAssessmentResults() {
      if (!user?.id) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        console.log("🔍 Loading assessment results...")
        console.log("  - Assessment ID:", assessmentId)
        console.log("  - Category ID:", categoryId)
        console.log("  - User ID:", user.id)

        let result

        if (assessmentId) {
          // Load specific assessment by ID
          result = await AssessmentService.getAssessmentById(supabase, assessmentId)
        } else {
          // Load latest assessment for user and category
          result = await AssessmentService.getLatestAssessmentForUserAndCategory(supabase, user.id, categoryId)
        }

        if (result.error) {
          console.error("❌ Error loading assessment results:", result.error)
          setError(result.error)
        } else if (result.data) {
          console.log("✅ Assessment results loaded successfully")
          console.log("📋 Assessment data:", result.data)
          setAssessmentData(result.data)
        } else {
          console.log("⚠️ No assessment results found")
          setError("No assessment results found")
        }
      } catch (error: any) {
        console.error("❌ Error loading assessment results:", error)
        setError(error.message || "Failed to load assessment results")
      } finally {
        setLoading(false)
      }
    }

    loadAssessmentResults()
  }, [user?.id, assessmentId, categoryId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
            <CardContent className="p-8">
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
            <CardContent className="p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Results</h1>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl dark:bg-card/80">
            <CardContent className="p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-600 mb-4">No Results Found</h1>
                <p className="text-gray-600 dark:text-gray-400">No assessment results were found for this category.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AssessmentResults assessmentData={assessmentData} />
    </div>
  )
}
