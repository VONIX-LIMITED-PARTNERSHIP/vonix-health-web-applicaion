export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string
          user_id: string
          category_id: string
          category_title: string
          category_title_en: string | null
          answers: Json
          total_score: number
          max_score: number
          percentage: number
          risk_level: "low" | "medium" | "high" | "very-high"
          language: "th" | "en"
          risk_factors: string[]
          recommendations: string[]
          summary: string | null
          risk_factors_en: string[]
          recommendations_en: string[]
          summary_en: string | null
          completed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          category_title: string
          category_title_en?: string | null
          answers: Json
          total_score?: number
          max_score?: number
          percentage?: number
          risk_level: "low" | "medium" | "high" | "very-high"
          language?: "th" | "en"
          risk_factors?: string[]
          recommendations?: string[]
          summary?: string | null
          risk_factors_en?: string[]
          recommendations_en?: string[]
          summary_en?: string | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          category_title?: string
          category_title_en?: string | null
          answers?: Json
          total_score?: number
          max_score?: number
          percentage?: number
          risk_level?: "low" | "medium" | "high" | "very-high"
          language?: "th" | "en"
          risk_factors?: string[]
          recommendations?: string[]
          summary?: string | null
          risk_factors_en?: string[]
          recommendations_en?: string[]
          summary_en?: string | null
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          gender: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          medical_conditions: string[] | null
          allergies: string[] | null
          medications: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          medications?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          medications?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
