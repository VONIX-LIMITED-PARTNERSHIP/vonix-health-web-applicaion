export type RiskLevel = "low" | "medium" | "high" | "very-high"

export type BilingualText = {
  th: string
  en: string
}

export type BilingualArray = {
  th: string[]
  en: string[]
}

export type QuestionOption = {
  value: string
  label: BilingualText
  score: number
}

export type ScoreMapping = {
  range: [number, number]
  score: number
}

export type AssessmentQuestion = {
  id: string
  question: BilingualText
  type: "text" | "number" | "single-choice" | "multiple-choice" | "rating" | "date"
  required: boolean
  options: QuestionOption[]
  scoreMapping?: ScoreMapping[]
  placeholder?: BilingualText
  min?: number
  max?: number
}

export type AssessmentCategory = {
  id: string
  title: BilingualText
  description: BilingualText
  estimatedTime: BilingualText
  required: boolean
  questions: AssessmentQuestion[]
}

export type AssessmentAnswer = {
  questionId: string
  answer: string | number | string[] | null
  score: number
  isValid: boolean
  question?: string // Optional: for AI analysis context
}

export type AIAnalysisResult = {
  score: number
  riskLevel: RiskLevel
  riskFactors: BilingualArray
  recommendations: BilingualArray
  summary: BilingualText
}

export type AssessmentResult = {
  categoryId: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: RiskLevel
  riskFactors: BilingualArray | string[] // Allow both for flexibility
  recommendations: BilingualArray | string[] // Allow both for flexibility
  summary?: BilingualText
  totalQuestions?: number
}

export type UserAssessment = {
  id: string
  user_id: string
  category_id: string
  category_title: string
  answers: AssessmentAnswer[]
  total_score: number
  max_score: number
  percentage: number
  risk_level: RiskLevel
  risk_factors: string[] // Stored as simple array in DB
  recommendations: string[] // Stored as simple array in DB
  completed_at: string
  ai_analysis?: AIAnalysisResult | null // Stored as JSONB
}
