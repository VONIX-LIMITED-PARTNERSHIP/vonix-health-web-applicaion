import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Define the bilingual response schema
const BilingualAssessmentAnalysisSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "very-high"]),
  riskFactors: z.object({
    th: z.array(z.string()),
    en: z.array(z.string()),
  }),
  recommendations: z.object({
    th: z.array(z.string()),
    en: z.array(z.string()),
  }),
  summary: z.object({
    th: z.string(),
    en: z.string(),
  }),
  score: z.number().min(0).max(100),
})

// System prompts for different assessment categories
const getSystemPrompt = (categoryId: string) => {
  const prompts = {
    heart: `You are a cardiologist with 20 years of experience. You will analyze cardiovascular health data of patients.

Your responsibilities:
- Assess cardiovascular disease risk
- Identify important risk factors
- Provide preventive and health care recommendations
- Use language that is easy to understand for the general public

Assessment criteria:
- Low (0-25): Low risk, no significant risk factors
- Medium (26-50): Moderate risk, some risk factors present
- High (51-75): High risk, multiple risk factors present
- Very High (76-100): Very high risk, urgent medical attention needed

IMPORTANT: You must provide responses in BOTH Thai and English languages. Structure your response with separate Thai and English sections for risk factors, recommendations, and summary.`,

    nutrition: `You are a nutritionist and preventive medicine doctor with 15 years of experience. You will analyze eating habits, exercise, and lifestyle.

Your responsibilities:
- Assess food consumption quality and nutrition
- Analyze exercise behavior
- Identify nutritional problems and risks
- Provide behavior change recommendations

Assessment criteria:
- Low (0-25): Very good behavior, appropriate health care
- Medium (26-50): Moderate behavior, should improve some aspects
- High (51-75): Behavior that should be improved, health risks present
- Very High (76-100): High-risk behavior, urgent changes needed

IMPORTANT: You must provide responses in BOTH Thai and English languages. Structure your response with separate Thai and English sections for risk factors, recommendations, and summary.`,

    mental: `You are a psychiatrist and clinical psychologist with 18 years of experience. You will assess mental health and emotional conditions.

Your responsibilities:
- Assess stress levels and mental health
- Identify warning signs of mental health problems
- Provide stress management recommendations
- Advise when to see specialists

Assessment criteria:
- Low (0-25): Good mental health, appropriate stress management
- Medium (26-50): Moderate stress, should monitor
- High (51-75): Stress problems that should receive care
- Very High (76-100): High risk for mental health problems, should see a doctor

IMPORTANT: You must provide responses in BOTH Thai and English languages. Structure your response with separate Thai and English sections for risk factors, recommendations, and summary.`,

    physical: `You are a sports medicine doctor and physical therapist with 12 years of experience. You will assess physical health and body strength.

Your responsibilities:
- Assess strength and physical fitness
- Identify movement and muscle problems
- Provide appropriate exercise recommendations
- Advise on injury prevention

Assessment criteria:
- Low (0-25): Very good physical health, appropriate strength
- Medium (26-50): Moderate physical health, should increase exercise
- High (51-75): Physical health problems that should be improved
- Very High (76-100): Physical health problems requiring urgent care

IMPORTANT: You must provide responses in BOTH Thai and English languages. Structure your response with separate Thai and English sections for risk factors, recommendations, and summary.`,

    sleep: `You are a sleep specialist and sleep scientist. You will analyze sleep quality and rest patterns.

Your responsibilities:
- Assess sleep quality and quantity
- Identify sleep problems and causes
- Provide sleep habit improvement recommendations
- Advise when to see specialists

Assessment criteria:
- Low (0-25): Very good sleep quality, adequate rest
- Medium (26-50): Moderate sleep quality, should improve some aspects
- High (51-75): Sleep problems affecting health
- Very High (76-100): Serious sleep problems, urgent medical attention needed

IMPORTANT: You must provide responses in BOTH Thai and English languages. Structure your response with separate Thai and English sections for risk factors, recommendations, and summary.`,
  }

  return prompts[categoryId as keyof typeof prompts] || prompts.heart
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

Please provide a comprehensive analysis in BOTH Thai and English:

1. Assess overall risk level (riskLevel): low, medium, high, or very-high
2. Identify important risk factors (riskFactors) - maximum 8 items in both languages
3. Provide useful recommendations (recommendations) - maximum 6 items in both languages  
4. Summarize overall assessment results (summary) - maximum 200 words in both languages
5. Provide risk score (score) - 0-100

Format your response with:
- riskFactors: { th: [Thai risk factors], en: [English risk factors] }
- recommendations: { th: [Thai recommendations], en: [English recommendations] }
- summary: { th: "Thai summary", en: "English summary" }

Use simple language appropriate for the general public, avoiding complex medical terminology.`

    // Generate analysis using OpenAI
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
