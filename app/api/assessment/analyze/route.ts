import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { Database } from "@/types/database"

// Bilingual assessment result schema
const BilingualAssessmentResultSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "very_high"]),
  riskFactors_th: z.array(z.string()).describe("Risk factors in Thai language"),
  riskFactors_en: z.array(z.string()).describe("Risk factors in English language"),
  recommendations_th: z.array(z.string()).describe("Recommendations in Thai language"),
  recommendations_en: z.array(z.string()).describe("Recommendations in English language"),
  summary_th: z.string().describe("Summary in Thai language"),
  summary_en: z.string().describe("Summary in English language"),
})

// Category-specific prompts
const getCategoryPrompt = (categoryId: string) => {
  const prompts = {
    lifestyle: {
      th: "วิเคราะห์ผลการประเมินไลฟ์สไตล์และโภชนาการ ให้คำแนะนำเกี่ยวกับการปรับปรุงพฤติกรรมการกิน การออกกำลังกาย และการดูแลสุขภาพ",
      en: "Analyze lifestyle and nutrition assessment results. Provide recommendations about improving eating habits, exercise, and health care.",
    },
    mental: {
      th: "วิเคราะห์ผลการประเมินสุขภาพจิต ให้คำแนะนำเกี่ยวกับการจัดการความเครียด การดูแลสุขภาพจิต และการสร้างความสมดุลในชีวิต",
      en: "Analyze mental health assessment results. Provide recommendations about stress management, mental health care, and creating life balance.",
    },
    physical: {
      th: "วิเคราะห์ผลการประเมินสุขภาพกาย ให้คำแนะนำเกี่ยวกับการออกกำลังกาย การดูแลร่างกาย และการป้องกันโรค",
      en: "Analyze physical health assessment results. Provide recommendations about exercise, body care, and disease prevention.",
    },
    sleep: {
      th: "วิเคราะห์ผลการประเมินคุณภาพการนอน ให้คำแนะนำเกี่ยวกับการปรับปรุงนิสัยการนอน และการดูแลสุขภาพการนอน",
      en: "Analyze sleep quality assessment results. Provide recommendations about improving sleep habits and sleep health care.",
    },
  }

  return prompts[categoryId as keyof typeof prompts] || prompts.lifestyle
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 API: Starting assessment analysis...")

    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("❌ API: Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { answers, categoryId, totalScore, maxScore } = body

    console.log("📊 API: Assessment data received:")
    console.log("  - Category:", categoryId)
    console.log("  - Total Score:", totalScore)
    console.log("  - Max Score:", maxScore)
    console.log("  - Answers count:", answers?.length || 0)

    if (!answers || !categoryId) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Calculate percentage and risk level
    const percentage = Math.round((totalScore / maxScore) * 100)
    let riskLevel: "low" | "medium" | "high" | "very_high" = "medium"

    if (percentage >= 80) riskLevel = "low"
    else if (percentage >= 60) riskLevel = "medium"
    else if (percentage >= 40) riskLevel = "high"
    else riskLevel = "very_high"

    console.log("📈 API: Calculated metrics:")
    console.log("  - Percentage:", percentage + "%")
    console.log("  - Risk Level:", riskLevel)

    // Get category-specific prompts
    const categoryPrompt = getCategoryPrompt(categoryId)

    // Prepare answers summary for AI
    const answersText = answers
      .map(
        (answer: any, index: number) =>
          `คำถามที่ ${index + 1}: ${answer.question} - คำตอบ: ${answer.value} (คะแนน: ${answer.score})`,
      )
      .join("\n")

    console.log("🤖 API: Calling OpenAI for bilingual analysis...")

    // Generate bilingual AI analysis
    const { object: aiResult } = await generateObject({
      model: openai("gpt-4o"),
      system: `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพที่ให้คำปรึกษาเป็นภาษาไทยและอังกฤษ

ให้วิเคราะห์ผลการประเมินและตอบกลับในรูปแบบ JSON ที่มีทั้งภาษาไทยและอังกฤษ:

หลักเกณฑ์การประเมิน:
- คะแนน 80-100%: ความเสี่ยงต่ำ (low)
- คะแนน 60-79%: ความเสี่ยงปานกลาง (medium)  
- คะแนน 40-59%: ความเสี่ยงสูง (high)
- คะแนน 0-39%: ความเสี่ยงสูงมาก (very_high)

สำหรับ ${categoryPrompt.th}
For ${categoryPrompt.en}

ให้ระบุ:
1. riskFactors_th: ปัจจัยเสี่ยงที่พบ (ภาษาไทย) - array ของ string
2. riskFactors_en: Risk factors found (English) - array of strings
3. recommendations_th: คำแนะนำการปรับปรุง (ภาษาไทย) - array ของ string
4. recommendations_en: Improvement recommendations (English) - array of strings
5. summary_th: สรุปผลการประเมิน (ภาษาไทย)
6. summary_en: Assessment summary (English)

ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง`,
      prompt: `วิเคราะห์ผลการประเมิน ${categoryId}:

คะแนนรวม: ${totalScore}/${maxScore} (${percentage}%)
ระดับความเสี่ยง: ${riskLevel}

รายละเอียดคำตอบ:
${answersText}

กรุณาวิเคราะห์และให้คำแนะนำในรูปแบบที่กำหนด`,
      schema: BilingualAssessmentResultSchema,
    })

    console.log("✅ API: OpenAI analysis completed")
    console.log("🔍 API: AI Result:", aiResult)

    // Get category titles
    const categoryTitles = {
      lifestyle: { th: "ไลฟ์สไตล์และโภชนาการ", en: "Lifestyle and Nutrition" },
      mental: { th: "สุขภาพจิต", en: "Mental Health" },
      physical: { th: "สุขภาพกาย", en: "Physical Health" },
      sleep: { th: "คุณภาพการนอน", en: "Sleep Quality" },
    }

    const categoryTitle = categoryTitles[categoryId as keyof typeof categoryTitles] || categoryTitles.lifestyle

    // Save to database with bilingual data
    console.log("💾 API: Saving assessment to database...")

    const { data: savedAssessment, error: saveError } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        category_id: categoryId,
        category_title_th: categoryTitle.th,
        category_title_en: categoryTitle.en,
        total_score: totalScore,
        max_score: maxScore,
        percentage: percentage,
        risk_level: riskLevel,
        risk_factors_th: aiResult.riskFactors_th,
        risk_factors_en: aiResult.riskFactors_en,
        recommendations_th: aiResult.recommendations_th,
        recommendations_en: aiResult.recommendations_en,
        summary_th: aiResult.summary_th,
        summary_en: aiResult.summary_en,
        answers: answers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saveError) {
      console.error("❌ API: Database save error:", saveError)
      return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
    }

    console.log("✅ API: Assessment saved successfully")
    console.log("📋 API: Saved assessment ID:", savedAssessment?.id)

    // Return the complete result
    const result = {
      id: savedAssessment.id,
      categoryId,
      totalScore,
      maxScore,
      percentage,
      riskLevel,
      ...aiResult, // Include all bilingual AI results
    }

    console.log("🎉 API: Analysis completed successfully")
    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
