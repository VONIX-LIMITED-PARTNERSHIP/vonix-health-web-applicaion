// Define the AssessmentCategory type
export interface AssessmentCategory {
  id: string
  title: string
  description: string
  icon: string
  questions: AssessmentQuestion[]
  estimatedTime: number
}

// Define the AssessmentQuestion type
export interface AssessmentQuestion {
  id: string
  question: string
  type:
    | "single"
    | "multiple"
    | "text"
    | "number"
    | "scale"
    | "yes-no"
    | "rating"
    | "multiple-choice"
    | "checkbox"
    | "multi-select-combobox-with-other"
  options?: string[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  category?: string // Added category to question type
  weight?: number // Added weight to question type
  description?: string // Added description to question type
  riskFactors?: string[] // Added riskFactors to question type
}

// Define the AssessmentAnswer type to allow null for answer
export interface AssessmentAnswer {
  questionId: string
  question: string // Added for AI analysis context
  answer: string | number | string[] | null
  score: number
  isValid: boolean
}

// Bilingual text types
export interface BilingualText {
  th: string
  en: string
}

export interface BilingualStringArray {
  th: string[]
  en: string[]
}

// Updated AssessmentResult interface with bilingual support
export interface AssessmentResult {
  id?: string
  userId?: string
  categoryId: string
  categoryTitle: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: string
  riskFactors: BilingualStringArray // Updated type
  recommendations: BilingualStringArray // Updated type
  summary?: BilingualText // Updated type
  totalQuestions: number
  createdAt?: string
  aiAnalysis?: AiAnalysisResult // More specific type
}

// AI Analysis result type
export interface AiAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualStringArray
  recommendations: BilingualStringArray
  summary: BilingualText
}

// Saved assessment type
export interface SavedAssessment {
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
