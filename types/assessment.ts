export interface Question {
  id: string
  type: "multiple-choice" | "rating" | "yes-no" | "text" | "number" | "checkbox"
  question: string
  description?: string
  options?: string[]
  required: boolean
  category: string
  weight: number
  riskFactors?: string[]
}

export interface AssessmentAnswer {
  questionId: string
  answer: string | number | string[]
  score: number
}

export interface AssessmentResult {
  categoryId: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  recommendations: string[]
  riskFactors: string[]
}

export interface AssessmentCategory {
  id: string
  title: string
  description: string
  icon: string
  required: boolean
  questions: Question[]
  estimatedTime: number
}
