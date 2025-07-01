import type { createClientComponentClient } from "@/lib/supabase"
import type { AssessmentAnswer } from "@/types/assessment"

export class AssessmentService {
  static async analyzeWithAI(categoryId: string, answers: AssessmentAnswer[], language = "th") {
    try {
      console.log("🤖 AssessmentService: เริ่มการวิเคราะห์ด้วย AI...")
      console.log("🌐 AssessmentService: ภาษา:", language)

      const response = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          categoryTitle: `Assessment ${categoryId}`,
          answers: answers.map((answer) => ({
            question: answer.questionId,
            answer: answer.answer,
            score: answer.score,
          })),
          language, // ส่งภาษาไปด้วย
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "AI analysis failed")
      }

      const result = await response.json()
      console.log("✅ AssessmentService: การวิเคราะห์ AI สำเร็จ")
      return { data: result.analysis, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: การวิเคราะห์ AI ล้มเหลว:", error)
      return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async saveAssessment(
    supabase: ReturnType<typeof createClientComponentClient>,
    userId: string,
    categoryId: string,
    categoryTitle: string,
    answers: AssessmentAnswer[],
    aiAnalysis: any = null,
    language = "th", // เพิ่มพารามิเตอร์ภาษา
  ) {
    try {
      console.log("💾 AssessmentService: เริ่มบันทึกการประเมิน...")
      console.log("🌐 AssessmentService: ภาษา:", language)

      // คำนวณคะแนนรวม
      const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
      const maxScore = answers.length * 5 // สมมติว่าคะแนนเต็มคือ 5 ต่อคำถาม
      const percentage = Math.round((totalScore / maxScore) * 100)

      // กำหนดระดับความเสี่ยงจากคะแนน
      let riskLevel = "low"
      if (percentage >= 76) riskLevel = "very-high"
      else if (percentage >= 51) riskLevel = "high"
      else if (percentage >= 26) riskLevel = "medium"

      // ใช้ข้อมูลจาก AI ถ้ามี
      if (aiAnalysis) {
        riskLevel = aiAnalysis.riskLevel || riskLevel
      }

      const assessmentData = {
        user_id: userId,
        category_id: categoryId,
        category_title: categoryTitle,
        answers: answers,
        total_score: totalScore,
        max_score: maxScore,
        percentage: aiAnalysis?.score || percentage,
        risk_level: riskLevel,
        risk_factors: aiAnalysis?.riskFactors || [],
        recommendations: aiAnalysis?.recommendations || [],
        summary: aiAnalysis?.summary || "",
        language: language, // บันทึกภาษาที่ใช้
        completed_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("assessments").insert(assessmentData).select().single()

      if (error) {
        console.error("❌ AssessmentService: เกิดข้อผิดพลาดในการบันทึก:", error)
        throw error
      }

      console.log("✅ AssessmentService: บันทึกการประเมินสำเร็จ รหัส:", data.id)
      return { data, error: null }
    } catch (error) {
      console.error("❌ AssessmentService: การบันทึกล้มเหลว:", error)
      return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async getAssessmentById(supabase: ReturnType<typeof createClientComponentClient>, assessmentId: string) {
    try {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", assessmentId).single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async getLatestAssessmentForUserAndCategory(
    supabase: ReturnType<typeof createClientComponentClient>,
    userId: string,
    categoryId: string,
  ) {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async getUserAssessments(supabase: ReturnType<typeof createClientComponentClient>, userId: string) {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async deleteAllUserAssessments(supabase: ReturnType<typeof createClientComponentClient>, userId: string) {
    try {
      const { error } = await supabase.from("assessments").delete().eq("user_id", userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
