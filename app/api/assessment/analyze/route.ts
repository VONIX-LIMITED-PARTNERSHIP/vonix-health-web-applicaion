import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Define the bilingual response schema
const BilingualAssessmentAnalysisSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "very-high"]),
  riskFactors_th: z.array(z.string()).describe("Risk factors in Thai language"),
  riskFactors_en: z.array(z.string()).describe("Risk factors in English language"),
  recommendations_th: z.array(z.string()).describe("Recommendations in Thai language"),
  recommendations_en: z.array(z.string()).describe("Recommendations in English language"),
  summary_th: z.string().describe("Summary in Thai language"),
  summary_en: z.string().describe("Summary in English language"),
  score: z.number().min(0).max(100),
})

// System prompts for different assessment categories
const getSystemPrompt = (categoryId: string) => {
  const prompts = {
    heart: `You are an experienced cardiologist with 20 years of experience. You will analyze cardiovascular health data.

Your responsibilities:
- Assess cardiovascular disease risk
- Identify important risk factors
- Provide preventive care and health recommendations
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Low risk, no significant risk factors
- Medium (26-50): Moderate risk, some risk factors present
- High (51-75): High risk, multiple risk factors
- Very High (76-100): Very high risk, urgent medical attention needed

IMPORTANT: You must provide ALL results in both Thai and English. Use clear, simple language appropriate for general public understanding.`,

    nutrition: `You are a nutritionist and preventive medicine doctor with 15 years of experience. You will analyze eating habits, exercise, and lifestyle.

Your responsibilities:
- Assess nutritional quality and eating behaviors
- Analyze exercise habits
- Identify nutritional problems and risks
- Provide behavior modification recommendations
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Excellent behavior, appropriate health care
- Medium (26-50): Moderate behavior, some areas need improvement
- High (51-75): Behavior needs improvement, health risks present
- Very High (76-100): High-risk behavior, urgent changes needed

IMPORTANT: You must provide ALL results in both Thai and English.`,

    mental: `You are a psychiatrist and clinical psychologist with 18 years of experience. You will assess mental health and emotional well-being.

Your responsibilities:
- Assess stress levels and mental health
- Identify warning signs of mental health problems
- Provide stress management recommendations
- Advise when to seek professional help
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Good mental health, appropriate stress management
- Medium (26-50): Moderate stress, should monitor
- High (51-75): Stress problems requiring attention
- Very High (76-100): High risk for mental health problems, should see doctor

IMPORTANT: You must provide ALL results in both Thai and English.`,

    physical: `You are a sports medicine doctor and physical therapist with 12 years of experience. You will assess physical health and body strength.

Your responsibilities:
- Assess strength and physical fitness
- Identify movement and muscle problems
- Provide appropriate exercise recommendations
- Advise on injury prevention
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Excellent physical health, appropriate strength
- Medium (26-50): Moderate physical health, should increase exercise
- High (51-75): Physical health problems need improvement
- Very High (76-100): Physical health problems requiring urgent attention

IMPORTANT: You must provide ALL results in both Thai and English.`,

    sleep: `You are a sleep medicine specialist and sleep scientist. You will analyze sleep quality and rest patterns.

Your responsibilities:
- Assess sleep quality and quantity
- Identify sleep problems and causes
- Provide sleep habit improvement recommendations
- Advise when to see specialists
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Excellent sleep quality, adequate rest
- Medium (26-50): Moderate sleep quality, some areas need improvement
- High (51-75): Sleep problems affecting health
- Very High (76-100): Serious sleep problems, need to see doctor urgently

IMPORTANT: You must provide ALL results in both Thai and English.`,

    lifestyle: `You are a lifestyle medicine specialist with 15 years of experience. You will analyze lifestyle and nutrition habits.

Your responsibilities:
- Assess overall lifestyle quality
- Analyze nutrition and exercise patterns
- Identify lifestyle risk factors
- Provide comprehensive lifestyle recommendations
- Provide results in BOTH Thai and English languages

Assessment criteria:
- Low (0-25): Excellent lifestyle, very healthy habits
- Medium (26-50): Good lifestyle, some areas for improvement
- High (51-75): Lifestyle needs significant improvement
- Very High (76-100): High-risk lifestyle, urgent changes needed

IMPORTANT: You must provide ALL results in both Thai and English.`,
  }

  return prompts[categoryId as keyof typeof prompts] || prompts.lifestyle
}

export async function POST(request: NextRequest) {
  try {
    const { categoryId, categoryTitle, answers } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format answers for AI analysis
    const formattedAnswers = answers
      .map((answer, index) => {
        return `Question ${index + 1}: ${answer.question || "No question specified"}
Answer: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
Score: ${answer.score}`
      })
      .join("\n\n")

    const userPrompt = `Please analyze the assessment results for "${categoryTitle}" from the following data:

${formattedAnswers}

Please provide a comprehensive analysis in BOTH Thai and English languages:

1. Assess overall risk level (riskLevel)
2. Identify important risk factors (riskFactors_th and riskFactors_en) - maximum 8 items each
3. Provide useful recommendations (recommendations_th and recommendations_en) - maximum 6 items each
4. Summarize overall assessment results (summary_th and summary_en) - maximum 200 words each
5. Provide risk score (score) - 0-100

REQUIREMENTS:
- riskFactors_th: Risk factors in Thai language
- riskFactors_en: Risk factors in English language
- recommendations_th: Recommendations in Thai language
- recommendations_en: Recommendations in English language
- summary_th: Summary in Thai language (simple Thai, suitable for general public)
- summary_en: Summary in English language (simple English, suitable for general public)

Avoid complex medical terminology. Use language that is easy to understand for the general public.`

    // Generate bilingual analysis using OpenAI
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      system: getSystemPrompt(categoryId),
      prompt: userPrompt,
      schema: BilingualAssessmentAnalysisSchema,
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Error analyzing assessment:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
