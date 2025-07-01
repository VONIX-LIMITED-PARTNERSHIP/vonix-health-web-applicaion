import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import type { AssessmentAnswer } from "@/types/assessment"

// Schema for AI analysis response
const AnalysisSchema = z.object({
  riskLevel: z.enum(["low", "moderate", "high", "critical"]),
  riskFactors: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { categoryId, answers } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required fields: categoryId and answers" }, { status: 400 })
    }

    console.log("🤖 Starting bilingual AI analysis...")
    console.log("📊 Category:", categoryId)
    console.log("📝 Answers count:", answers.length)

    // Prepare answers for AI analysis
    const answersText = answers
      .map(
        (answer: AssessmentAnswer, index: number) =>
          `${index + 1}. Question ID: ${answer.questionId}, Answer: ${JSON.stringify(answer.answer)}, Score: ${answer.score}`,
      )
      .join("\n")

    // Generate Thai analysis
    console.log("🇹🇭 Generating Thai analysis...")
    const thaiAnalysis = await generateObject({
      model: openai("gpt-4o"),
      schema: AnalysisSchema,
      prompt: `
        คุณเป็นผู้เชี่ยวชาญด้านสุขภาพ กรุณาวิเคราะห์ผลการประเมินสุขภาพต่อไปนี้และให้คำแนะนำเป็นภาษาไทย:

        หมวดหมู่การประเมิน: ${categoryId}
        คำตอบของผู้ใช้:
        ${answersText}

        กรุณาประเมิน:
        1. ระดับความเสี่ยง (low, moderate, high, critical)
        2. ปัจจัยเสี่ยงที่พบ (3-5 ข้อ)
        3. คำแนะนำสำหรับการดูแลสุขภาพ (5-7 ข้อ)
        4. สรุปผลการประเมินโดยรวม

        ตอบเป็นภาษาไทยเท่านั้น และให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง
      `,
    })

    // Generate English analysis
    console.log("🇺🇸 Generating English analysis...")
    const englishAnalysis = await generateObject({
      model: openai("gpt-4o"),
      schema: AnalysisSchema,
      prompt: `
        You are a health expert. Please analyze the following health assessment results and provide recommendations in English:

        Assessment Category: ${categoryId}
        User Answers:
        ${answersText}

        Please evaluate:
        1. Risk level (low, moderate, high, critical)
        2. Risk factors identified (3-5 items)
        3. Health care recommendations (5-7 items)
        4. Overall assessment summary

        Respond in English only and provide practical, actionable recommendations.
      `,
    })

    console.log("✅ Bilingual AI analysis completed successfully")

    // Return bilingual results
    const bilingualResult = {
      th: {
        riskLevel: thaiAnalysis.object.riskLevel,
        riskFactors: thaiAnalysis.object.riskFactors,
        recommendations: thaiAnalysis.object.recommendations,
        summary: thaiAnalysis.object.summary,
      },
      en: {
        riskLevel: englishAnalysis.object.riskLevel,
        riskFactors: englishAnalysis.object.riskFactors,
        recommendations: englishAnalysis.object.recommendations,
        summary: englishAnalysis.object.summary,
      },
    }

    return NextResponse.json({
      success: true,
      data: bilingualResult,
    })
  } catch (error) {
    console.error("❌ AI Analysis failed:", error)

    let errorMessage = "Failed to analyze assessment"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
