// Define the AssessmentCategory type
export type AssessmentCategory = "basic" | "heart" | "nutrition" | "mental" | "physical" | "sleep"

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
  id: string // Add unique ID for each assessment result
  categoryId: AssessmentCategory // Change to use AssessmentCategory type
  completedAt: string // ISO string date of completion
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: string[] | BilingualArray
  recommendations: string[] | BilingualArray
  summary?: string | BilingualText
  answers: AssessmentAnswer[] // Add answers to store the actual responses
}

// AI Analysis result type
export interface AIAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualArray
  recommendations: BilingualArray
  summary: BilingualText
}

// Dashboard stats interface
export interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  riskLevels: { [key in AssessmentCategory]?: "low" | "medium" | "high" | "very-high" }
  overallRisk: "low" | "medium" | "high" | "very-high" | "unknown"
  recommendations: string[]
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
  ai_analysis?: AIAnalysisResult
  completed_at: string
  created_at: string
  updated_at: string
}
