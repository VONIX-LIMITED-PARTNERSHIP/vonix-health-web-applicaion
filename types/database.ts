export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "patient" | "doctor" | "admin"
          phone: string | null
          date_of_birth: string | null
          gender: "male" | "female" | "other" | null
          created_at: string
          updated_at: string
          pdpa_consent: boolean
          pdpa_consent_date: string | null
          provider: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "patient" | "doctor" | "admin"
          phone?: string | null
          date_of_birth?: string | null
          gender?: "male" | "female" | "other" | null
          pdpa_consent?: boolean
          pdpa_consent_date?: string | null
          provider?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "patient" | "doctor" | "admin"
          phone?: string | null
          date_of_birth?: string | null
          gender?: "male" | "female" | "other" | null
          pdpa_consent?: boolean
          pdpa_consent_date?: string | null
          provider?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          category_id: string
          category_title: string
          answers: any
          total_score: number
          max_score: number
          percentage: number
          risk_level: "low" | "medium" | "high" | "very-high"
          risk_factors: string[]
          recommendations: string[]
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          category_title: string
          answers: any
          total_score: number
          max_score: number
          percentage: number
          risk_level: "low" | "medium" | "high" | "very-high"
          risk_factors?: string[]
          recommendations?: string[]
          completed_at?: string
        }
        Update: {
          answers?: any
          total_score?: number
          max_score?: number
          percentage?: number
          risk_level?: "low" | "medium" | "high" | "very-high"
          risk_factors?: string[]
          recommendations?: string[]
        }
      }
      doctor_profiles: {
        Row: {
          id: string
          user_id: string
          license_number: string
          specialization: string[]
          experience_years: number
          hospital_affiliation: string | null
          consultation_fee: number | null
          available_hours: any
          bio: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_number: string
          specialization: string[]
          experience_years: number
          hospital_affiliation?: string | null
          consultation_fee?: number | null
          available_hours?: any
          bio?: string | null
          verified?: boolean
        }
        Update: {
          license_number?: string
          specialization?: string[]
          experience_years?: number
          hospital_affiliation?: string | null
          consultation_fee?: number | null
          available_hours?: any
          bio?: string | null
          verified?: boolean
        }
      }
      consultations: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          status: "pending" | "confirmed" | "completed" | "cancelled"
          scheduled_at: string
          duration_minutes: number
          consultation_type: "video" | "chat" | "phone"
          notes: string | null
          prescription: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          scheduled_at: string
          duration_minutes?: number
          consultation_type?: "video" | "chat" | "phone"
          notes?: string | null
          prescription?: any | null
        }
        Update: {
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          scheduled_at?: string
          duration_minutes?: number
          consultation_type?: "video" | "chat" | "phone"
          notes?: string | null
          prescription?: any | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: any | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "patient" | "doctor" | "admin"
      risk_level: "low" | "medium" | "high" | "very-high"
      consultation_status: "pending" | "confirmed" | "completed" | "cancelled"
      consultation_type: "video" | "chat" | "phone"
    }
  }
}
