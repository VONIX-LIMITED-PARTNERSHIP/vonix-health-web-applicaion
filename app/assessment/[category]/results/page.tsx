"use client"

import { AssessmentResults } from "@/components/assessment/assessment-results"

interface AssessmentResultsPageProps {
  params: {
    category: string
  }
}

export default function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  const { category } = params

  return <AssessmentResults categoryId={category} />
}
