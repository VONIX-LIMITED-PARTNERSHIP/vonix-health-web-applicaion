import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Bilingual assessment analysis schema
const BilingualAssessmentAnalysisSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall health score from 0-100"),
  riskLevel: z.enum(["low", "medium", "high", "very-high"]).describe("Risk level based on assessment"),
  riskFactors: z
    .object({
      th: z.array(z.string()).describe("Risk factors in Thai"),
      en: z.array(z.string()).describe("Risk factors in English"),
    })
    .describe("Identified risk factors in both languages"),
  recommendations: z
    .object({
      th: z.array(z.string()).describe("Health recommendations in Thai"),
      en: z.array(z.string()).describe("Health recommendations in English"),
    })
    .describe("Health recommendations in both languages"),
  summary: z
    .object({
      th: z.string().describe("Overall health summary in Thai"),
      en: z.string().describe("Overall health summary in English"),
    })
    .describe("Overall health summary in both languages"),
})

export async function POST(request: NextRequest) {
  try {
    const { categoryId, categoryTitle, answers } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Create context for AI analysis
    const questionsAndAnswers = answers
      .map((answer) => `คำถาม: ${answer.question}\nคำตอบ: ${answer.answer} (คะแนน: ${answer.score})`)
      .join("\n\n")

    const systemPrompt = `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพที่วิเคราะห์ผลการประเมินสุขภาพ

หมวดหมู่การประเมิน: ${categoryTitle} (${categoryId})

คำแนะนำการวิเคราะห์:
1. วิเคราะห์คำตอบทั้งหมดอย่างละเอียด โดยไม่ต้องสนใจคะแนนที่ส่งมา
2. ให้คะแนนรวม 0-100 โดยพิจารณาจากคำตอบจริง (0=สุขภาพดีมาก, 100=เสี่ยงสูงมาก)
3. กำหนดระดับความเสี่ยง: low, medium, high, very-high
4. ระบุปัจจัยเสี่ยงที่พบ
5. ให้คำแนะนำเฉพาะเจาะจง
6. สรุปภาพรวมสุขภาพ

สำคัญ: ให้ผลลัพธ์เป็นทั้งภาษาไทยและอังกฤษ
สำคัญ: ใช้คำตอบจริงในการประเมิน ไม่ใช่คะแนนที่ส่งมา

ข้อมูลการประเมิน:
${questionsAndAnswers}`

    const userPrompt = `กรุณาวิเคราะห์ผลการประเมินสุขภาพนี้และให้ผลลัพธ์เป็นทั้งภาษาไทยและอังกฤษ

เกณฑ์การให้คะแนน:
- 0-25: ความเสี่ยงต่ำ (low)
- 26-50: ความเสี่ยงปานกลาง (medium)  
- 51-75: ความเสี่ยงสูง (high)
- 76-100: ความเสี่ยงสูงมาก (very-high)

ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง`

    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: BilingualAssessmentAnalysisSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3,
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to analyze assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
