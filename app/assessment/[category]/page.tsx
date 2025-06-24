import { AssessmentForm } from "@/components/assessment/assessment-form"

interface AssessmentPageProps {
  params: {
    category: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  return (
    // เปลี่ยนจาก bg-gradient-to-br... เป็น bg-background เพื่อใช้สีธีมหลัก
    <div className="min-h-screen bg-background">
      <AssessmentForm categoryId={params.category} />
    </div>
  )
}
