import { AssessmentForm } from "@/components/assessment/assessment-form"

interface AssessmentPageProps {
  params: {
    category: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  return <AssessmentForm categoryId={params.category} />
}
