import { AssessmentForm } from "@/components/assessment/assessment-form"
import { Header } from "@/components/header"

interface AssessmentPageProps {
  params: {
    category: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30">
      <Header />
      <div className="relative">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

        {/* Content Container */}
        <div className="relative">
          <AssessmentForm categoryId={params.category} />
        </div>
      </div>
    </div>
  )
}
