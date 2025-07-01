import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Schema for bilingual AI analysis results
const BilingualAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high", "very-high"]),

  // Thai language results
  riskFactors: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),

  // English language results
  riskFactorsEn: z.array(z.string()),
  recommendationsEn: z.array(z.string()),
  summaryEn: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { categoryId, categoryTitle, answers, language = "th" } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Create system prompt for bilingual analysis
    const systemPrompt = `You are a health assessment AI that provides analysis in both Thai and English languages.

Assessment Category: ${categoryTitle}
User's Language Preference: ${language}

Analyze the health assessment answers and provide:
1. Overall health score (0-100, where 0 is excellent health, 100 is high risk)
2. Risk level (low, medium, high, very-high)
3. Risk factors in both Thai and English
4. Recommendations in both Thai and English  
5. Summary in both Thai and English

Guidelines:
- Be professional and supportive
- Provide actionable recommendations
- Consider cultural context for both languages
- Use appropriate medical terminology
- Be encouraging while being honest about risks

For Thai content:
- Use respectful Thai language (คุณ, ท่าน)
- Include culturally appropriate advice
- Use Thai medical terms when appropriate

For English content:
- Use clear, professional English
- Include international health guidelines
- Use standard medical terminology

Risk Level Guidelines:
- low (0-25): Excellent health, minimal risk factors
- medium (26-50): Good health with some areas for improvement
- high (51-75): Moderate risk, needs attention and lifestyle changes
- very-high (76-100): High risk, should consult healthcare provider soon`

    const userPrompt = `Please analyze these health assessment answers:

${answers
  .map(
    (answer: any, index: number) =>
      `${index + 1}. ${answer.question || "Question"}: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer} (Score: ${answer.score})`,
  )
  .join("\n")}

Provide a comprehensive bilingual health analysis with specific, actionable recommendations for both Thai and English speakers.`

    console.log("🤖 Generating bilingual AI analysis...")

    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: BilingualAnalysisSchema,
      temperature: 0.7,
    })

    console.log("✅ Bilingual AI analysis completed")

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("❌ AI Analysis Error:", error)

    return NextResponse.json(
      {
        error: "Failed to analyze assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
