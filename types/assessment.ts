// Define the AssessmentCategory type
export type AssessmentCategory = {
  id: string
  title: string
  description: string
  icon: string
  questions: AssessmentQuestion[]
  estimatedTime: number
}

// Define the AssessmentQuestion type
export type AssessmentQuestion = {
  id: string
  question: BilingualText // Changed to BilingualText
  type: "text" | "number" | "radio" | "checkbox" | "rating" | "multiselect"
  options?: { value: string; label: BilingualText }[] // Changed to BilingualText
  min?: number
  max?: number
  step?: number
  unit?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: BilingualText // Changed to BilingualText
  }
}

// Define the AssessmentAnswer type to allow null for answer
export type AssessmentAnswer = {
  questionId: string
  question: string // Added for AI analysis context
  answer: string | number | string[] | null
  score: number
  isValid: boolean
}

// Bilingual text types
export type BilingualText = {
  th: string
  en: string
}

export type BilingualStringArray = {
  th: string[]
  en: string[]
}

// Updated AssessmentResult interface with bilingual support
export type AssessmentResult = {
  id?: string
  userId?: string
  categoryId: string
  categoryTitle: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high" | "unspecified"
  riskFactors: BilingualStringArray // Changed to BilingualStringArray
  recommendations: BilingualStringArray // Changed to BilingualStringArray
  summary?: BilingualText // Changed to BilingualText
  totalQuestions: number
  createdAt?: string
  aiAnalysis?: AiAnalysisResult // More specific type
}

// AI Analysis result type
export type AiAnalysisResult = {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualStringArray
  recommendations: BilingualStringArray
  summary: BilingualText
}

// Saved assessment type
export type SavedAssessment = {
  id: string
  user_id: string
  guest_session_id?: string
  category_id: string
  category_title: string
  answers: AssessmentAnswer[]
  total_score: number
  max_score: number
  percentage: number
  risk_level: "low" | "medium" | "high" | "very-high"
  risk_factors: string[]
  recommendations: string[]
  ai_analysis?: AiAnalysisResult
  completed_at: string
  created_at: string
  updated_at: string
}
