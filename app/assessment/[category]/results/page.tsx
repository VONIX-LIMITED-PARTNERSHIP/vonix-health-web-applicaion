import { AssessmentResults } from "@/components/assessment/assessment-results"

interface AssessmentResultsPageProps {
  params: {
    category: string
  }
}

export default function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  return <AssessmentResults categoryId={params.category} />
}
