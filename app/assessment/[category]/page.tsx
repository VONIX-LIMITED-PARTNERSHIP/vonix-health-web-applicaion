// Server Component
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { assessmentCategories } from "@/data/assessment-questions"
import { AssessmentForm } from "@/components/assessment/assessment-form"

interface AssessmentPageProps {
  params: { category: string }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  const category = assessmentCategories.find((cat) => cat.id === params.category)

  if (!category) {
    // If the slug doesn’t match any category, show the built-in 404 page
    notFound()
  }

  return (
    <main className="container mx-auto py-8">
      {/*  Suspense is optional but keeps the UI consistent with Next.js streaming */}
      <Suspense fallback={null}>
        {/* Pass the fully-typed category object to the client component */}
        <AssessmentForm category={category} />
      </Suspense>
    </main>
  )
}
