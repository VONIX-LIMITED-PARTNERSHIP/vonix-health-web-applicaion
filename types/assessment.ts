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
  answer: string | string[] | number
  score: number
}

// Bilingual text types
export interface BilingualText {
  th: string
  en: string
}

export interface BilingualArray {
  th: string[]
  en: string[]
}

// Updated AssessmentResult interface with bilingual support
export interface AssessmentResult {
  id: string // Unique ID for this specific assessment instance
  completedAt: string // Timestamp of completion
  category: string // The category ID (e.g., "basic", "heart")
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: string[] | BilingualArray
  recommendations: string[] | BilingualArray
  summary?: string | BilingualText
  aiAnalysis?: AIAnalysisResult // Added aiAnalysis to AssessmentResult
}

// AI Analysis result type
export interface AIAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualArray
  recommendations: BilingualArray
  summary: BilingualText
}

// Saved assessment type (from DB, already has id and completed_at)
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
  ai_analysis?: AIAnalysisResult
  completed_at: string
  created_at: string
  updated_at: string
}

// DashboardStats type (needs to be updated to reflect AssessmentResult changes)
export interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  riskLevels: { [categoryId: string]: AssessmentResult["riskLevel"] }
  overallRisk: AssessmentResult["riskLevel"] | "unknown"
  recommendations: string[]
}
