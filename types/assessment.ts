import type { LucideIcon } from "lucide-react"

// Define the AssessmentCategory type
export interface AssessmentCategory {
  id: string
  title: string
  description: string
  icon: LucideIcon
  route: string
  questions: any[] // Define a more specific type for questions if possible
}

// Define the QuestionType type
export type QuestionType =
  | "text"
  | "number"
  | "radio"
  | "checkbox"
  | "select"
  | "date"
  | "textarea"
  | "slider"
  | "multi-select-combobox"
  | "multi-select-combobox-with-other"

// Define the QuestionOption type
export type QuestionOption = {
  value: string
  label: string
  score?: number // Optional score for this option
}

// Define the Question type
export type Question = {
  id: string
  type: QuestionType
  question: BilingualText
  options?: QuestionOption[]
  placeholder?: BilingualText
  unit?: BilingualText
  min?: number
  max?: number
  step?: number
  required: boolean
  scoreMapping?: { [key: string]: number } // For text/number inputs, map value ranges to scores
  score?: number // Direct score for a question if not based on options
  category: string // The category this question belongs to
}

// Define the AssessmentAnswer type to allow null for answer
export interface AssessmentAnswer {
  questionId: string
  answer: string | string[] | number
  score: number
}

// Bilingual text types
export interface BilingualText {
  en: string
  th: string
}

export interface BilingualArray {
  th: string[]
  en: string[]
}

// Updated AssessmentResult interface with bilingual support
export interface AssessmentResult {
  id: string // Unique ID for this specific assessment instance
  category: AssessmentCategory["id"] // e.g., "physical", "nutrition"
  completedAt: string // ISO string date
  answers: AssessmentAnswer[] // Array of answers
  totalScore: number // Total score for the assessment
  maxScore: number // Maximum possible score for the assessment
  percentage: number // Percentage score (totalScore / maxScore * 100)
  riskLevel: "low" | "medium" | "high" | "very-high" | "unknown" // Overall risk level
  riskFactors?: BilingualArray // AI-generated risk factors
  recommendations?: BilingualArray // AI-generated recommendations
  summary?: BilingualText // AI-generated summary
}

// AI Analysis result type
export interface AIAnalysisResult {
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
  risk_level: "low" | "medium" | "high" | "very-high" | "unknown"
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
  riskLevels: { [key: string]: AssessmentResult["riskLevel"] } // Risk level per category
  overallRisk: AssessmentResult["riskLevel"]
  recommendations: string[] // General recommendations based on overall health
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar_url?: string
  // Add other profile fields as needed
}

export interface Consultation {
  id: string
  patient_id: string
  doctor_id: string | null
  status: "pending" | "accepted" | "completed" | "cancelled"
  requested_at: string
  accepted_at: string | null
  completed_at: string | null
  summary: string | null
  patient_notes: string | null
  doctor_notes: string | null
  // Add other consultation fields as needed
}
