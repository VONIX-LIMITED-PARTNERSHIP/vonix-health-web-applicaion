import type { ComponentIcon as IconNode } from "lucide-react"

export type AssessmentCategory =
  | "basic"
  | "heart"
  | "nutrition"
  | "mental"
  | "physical"
  | "sleep"
  | "overall"
  | "diabetes"
  | "cardiac"

export type RiskLevel = "low" | "medium" | "high" | "very-high" | "unknown"

export interface Question {
  id: string
  question: string
  type: "single-choice" | "multi-choice" | "number" | "text" | "date"
  options?: { value: string; label: string }[]
  unit?: string // For number type questions, e.g., "kg", "cm", "years"
  min?: number // For number type questions
  max?: number // For number type questions
  placeholder?: string // For text/number type questions
  required?: boolean
  category: AssessmentCategory
  riskFactor?: string // Optional: associates a question with a specific risk factor
}

export interface Answer {
  questionId: string
  value: string | string[] | number | Date
}

export interface AssessmentResult {
  id: string
  userId?: string // For authenticated users
  guestId?: string // For guest users
  category: AssessmentCategory
  score: number // Raw score based on answers
  percentage: number // Score converted to percentage (0-100)
  riskLevel: RiskLevel
  riskFactors: string[] // Identified risk factors based on answers
  recommendations: string[] // AI-generated recommendations
  completedAt: string // ISO date string
  answers: Answer[]
  aiAnalysis?: string // AI-generated detailed analysis
}

export interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  riskLevels: {
    [key in AssessmentCategory]?: RiskLevel
  }
  overallRisk: RiskLevel | ""
  recommendations: string[] // Changed to string[]
}

export interface AssessmentCategoryInfo {
  id: AssessmentCategory
  title: string
  description: string
  icon: IconNode
  required: boolean
  gradient: string
  bgGradient: string
  darkBgGradient: string
}
