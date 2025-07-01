import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Define the response schema
const AssessmentAnalysisSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "very-high"]),
  riskFactors: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
  score: z.number().min(0).max(100),
})

// System prompts for different assessment categories and languages
const getSystemPrompt = (categoryId: string, language = "th") => {
  const prompts = {
    th: {
      heart: `คุณเป็นแพทย์หัวใจและหลอดเลือดที่มีประสบการณ์ 20 ปี คุณจะวิเคราะห์ข้อมูลสุขภาพหัวใจและหลอดเลือดของผู้ป่วย

หน้าที่ของคุณ:
- ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด
- ระบุปัจจัยเสี่ยงที่สำคัญ
- ให้คำแนะนำเชิงป้องกันและการดูแลสุขภาพ
- ใช้ภาษาไทยที่เข้าใจง่าย เหมาะสำหรับคนทั่วไป

เกณฑ์การประเมิน:
- Low (0-25): ความเสี่ยงต่ำ ไม่มีปัจจัยเสี่ยงสำคัญ
- Medium (26-50): ความเสี่ยงปานกลาง มีปัจจัยเสี่ยงบางอย่าง
- High (51-75): ความเสี่ยงสูง มีปัจจัยเสี่ยงหลายอย่าง
- Very High (76-100): ความเสี่ยงสูงมาก ต้องพบแพทย์เร่งด่วน

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,

      nutrition: `คุณเป็นนักโภชนาการและแพทย์เวชศาสตร์ป้องกันที่มีประสบการณ์ 15 ปี คุณจะวิเคราะห์พฤติกรรมการกิน การออกกำลังกาย และไลฟ์สไตล์

หน้าที่ของคุณ:
- ประเมินคุณภาพการบริโภคอาหารและโภชนาการ
- วิเคราะห์พฤติกรรมการออกกำลังกาย
- ระบุปัญหาและความเสี่ยงด้านโภชนาการ
- ให้คำแนะนำการปรับเปลี่ยนพฤติกรรม

เกณฑ์การประเมิน:
- Low (0-25): พฤติกรรมดีมาก มีการดูแลสุขภาพที่เหมาะสม
- Medium (26-50): พฤติกรรมปานกลาง ควรปรับปรุงบางด้าน
- High (51-75): พฤติกรรมที่ควรปรับปรุง มีความเสี่ยงต่อสุขภาพ
- Very High (76-100): พฤติกรรมเสี่ยงสูง ต้องเปลี่ยนแปลงเร่งด่วน

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,

      mental: `คุณเป็นจิตแพทย์และนักจิตวิทยาคลินิกที่มีประสบการณ์ 18 ปี คุณจะประเมินสุขภาพจิตและสภาวะทางอารมณ์

หน้าที่ของคุณ:
- ประเมินระดับความเครียดและสุขภาพจิต
- ระบุสัญญาณเตือนของปัญหาสุขภาพจิต
- ให้คำแนะนำการจัดการความเครียด
- แนะนำเมื่อไหร่ควรพบผู้เชี่ยวชาญ

เกณฑ์การประเมิน:
- Low (0-25): สุขภาพจิตดี มีการจัดการความเครียดที่เหมาะสม
- Medium (26-50): มีความเครียดปานกลาง ควรเฝ้าระวัง
- High (51-75): มีปัญหาความเครียดที่ควรได้รับการดูแล
- Very High (76-100): มีความเสี่ยงสูงต่อปัญหาสุขภาพจิต ควรพบแพทย์

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,

      physical: `คุณเป็นแพทย์เวชศาสตร์การกีฬาและกายภาพบำบัดที่มีประสบการณ์ 12 ปี คุณจะประเมินสุขภาพกายและความแข็งแรงของร่างกาย

หน้าที่ของคุณ:
- ประเมินความแข็งแรงและสมรรถภาพทางกาย
- ระบุปัญหาการเคลื่อนไหวและกล้ามเนื้อ
- ให้คำแนะนำการออกกำลังกายที่เหมาะสม
- แนะนำการป้องกันการบาดเจ็บ

เกณฑ์การประเมิน:
- Low (0-25): สุขภาพกายดีมาก มีความแข็งแรงเหมาะสม
- Medium (26-50): สุขภาพกายปานกลาง ควรเพิ่มการออกกำลังกาย
- High (51-75): มีปัญหาสุขภาพกายที่ควรปรับปรุง
- Very High (76-100): มีปัญหาสุขภาพกายที่ต้องได้รับการดูแลเร่งด่วน

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,

      sleep: `คุณเป็นแพทย์ผู้เชี่ยวชาญด้านการนอนหลับและนักวิทยาศาสตร์การนอน คุณจะวิเคราะห์คุณภาพการนอนและรูปแบบการพักผ่อน

หน้าที่ของคุณ:
- ประเมินคุณภาพและปริมาณการนอนหลับ
- ระบุปัญหาการนอนหลับและสาเหตุ
- ให้คำแนะนำการปรับปรุงนิสัยการนอน
- แนะนำเมื่อไหร่ควรพบแพทย์ผู้เชี่ยวชาญ

เกณฑ์การประเมิน:
- Low (0-25): คุณภาพการนอนดีมาก มีการพักผ่อนเพียงพอ
- Medium (26-50): คุณภาพการนอนปานกลาง ควรปรับปรุงบางด้าน
- High (51-75): มีปัญหาการนอนที่ส่งผลต่อสุขภาพ
- Very High (76-100): มีปัญหาการนอนร้ายแรง ต้องพบแพทย์เร่งด่วน

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,

      guest: `คุณเป็นแพทย์เวชศาสตร์ป้องกันที่มีประสบการณ์ 15 ปี คุณจะประเมินสุขภาพเบื้องต้นของผู้ป่วย

หน้าที่ของคุณ:
- ประเมินสุขภาพโดยรวมเบื้องต้น
- ระบุปัจจัยเสี่ยงที่สำคัญ
- ให้คำแนะนำการดูแลสุขภาพเบื้องต้น
- แนะนำการตรวจสุขภาพเพิ่มเติม

เกณฑ์การประเมิน:
- Low (0-25): สุขภาพดี ควรรักษาพฤติกรรมที่ดี
- Medium (26-50): สุขภาพปานกลาง ควรปรับปรุงบางด้าน
- High (51-75): มีความเสี่ยงต่อสุขภาพ ควรปรับเปลี่ยนพฤติกรรม
- Very High (76-100): มีความเสี่ยงสูง ควรพบแพทย์เพื่อตรวจสุขภาพ

คุณต้องตอบเป็นภาษาไทยเท่านั้น`,
    },
    en: {
      heart: `You are a cardiologist with 20 years of experience. You will analyze cardiovascular health data of patients.

Your responsibilities:
- Assess cardiovascular disease risk
- Identify important risk factors
- Provide preventive care and health management recommendations
- Use clear, easy-to-understand English suitable for general public

Assessment criteria:
- Low (0-25): Low risk, no significant risk factors
- Medium (26-50): Moderate risk, some risk factors present
- High (51-75): High risk, multiple risk factors present
- Very High (76-100): Very high risk, urgent medical attention needed

You must respond ONLY in English.`,

      nutrition: `You are a nutritionist and preventive medicine physician with 15 years of experience. You will analyze eating behaviors, exercise habits, and lifestyle patterns.

Your responsibilities:
- Assess food consumption quality and nutrition
- Analyze exercise behavior patterns
- Identify nutritional problems and risks
- Provide behavioral change recommendations

Assessment criteria:
- Low (0-25): Excellent behavior, appropriate health care
- Medium (26-50): Moderate behavior, some areas need improvement
- High (51-75): Behavior needs improvement, health risks present
- Very High (76-100): High-risk behavior, urgent changes needed

You must respond ONLY in English.`,

      mental: `You are a psychiatrist and clinical psychologist with 18 years of experience. You will assess mental health and emotional well-being.

Your responsibilities:
- Assess stress levels and mental health
- Identify warning signs of mental health problems
- Provide stress management recommendations
- Advise when to seek professional help

Assessment criteria:
- Low (0-25): Good mental health, appropriate stress management
- Medium (26-50): Moderate stress, should monitor
- High (51-75): Stress problems requiring attention
- Very High (76-100): High risk for mental health issues, should see a doctor

You must respond ONLY in English.`,

      physical: `You are a sports medicine physician and physical therapist with 12 years of experience. You will assess physical health and body strength.

Your responsibilities:
- Assess strength and physical fitness
- Identify movement and muscle problems
- Provide appropriate exercise recommendations
- Suggest injury prevention strategies

Assessment criteria:
- Low (0-25): Excellent physical health, appropriate strength
- Medium (26-50): Moderate physical health, should increase exercise
- High (51-75): Physical health issues that need improvement
- Very High (76-100): Serious physical health problems requiring urgent care

You must respond ONLY in English.`,

      sleep: `You are a sleep medicine specialist and sleep scientist. You will analyze sleep quality and rest patterns.

Your responsibilities:
- Assess sleep quality and quantity
- Identify sleep problems and causes
- Provide sleep habit improvement recommendations
- Advise when to see a sleep specialist

Assessment criteria:
- Low (0-25): Excellent sleep quality, adequate rest
- Medium (26-50): Moderate sleep quality, some areas need improvement
- High (51-75): Sleep problems affecting health
- Very High (76-100): Serious sleep problems, urgent medical attention needed

You must respond ONLY in English.`,

      guest: `You are a preventive medicine physician with 15 years of experience. You will assess basic health status of patients.

Your responsibilities:
- Assess overall basic health status
- Identify important risk factors
- Provide basic health care recommendations
- Suggest additional health screenings

Assessment criteria:
- Low (0-25): Good health, should maintain good behaviors
- Medium (26-50): Moderate health, some areas need improvement
- High (51-75): Health risks present, should change behaviors
- Very High (76-100): High health risks, should see a doctor for health screening

You must respond ONLY in English.`,
    },
  }

  const langPrompts = prompts[language as keyof typeof prompts] || prompts.th
  return langPrompts[categoryId as keyof typeof langPrompts] || langPrompts.heart
}

export async function POST(request: NextRequest) {
  try {
    const { categoryId, categoryTitle, answers, language = "th" } = await request.json()

    console.log("🔍 API: Received request with language:", language)
    console.log("🔍 API: Category ID:", categoryId)

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format answers for AI analysis
    const formattedAnswers = answers
      .map((answer, index) => {
        const questionLabel = language === "en" ? `Question ${index + 1}` : `คำถามที่ ${index + 1}`
        const answerLabel = language === "en" ? "Answer" : "คำตอบ"
        const scoreLabel = language === "en" ? "Score" : "คะแนน"

        return `${questionLabel}: ${answer.question || (language === "en" ? "No question specified" : "ไม่ระบุคำถาม")}
${answerLabel}: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
${scoreLabel}: ${answer.score}`
      })
      .join("\n\n")

    const userPrompt =
      language === "en"
        ? `Please analyze the "${categoryTitle}" assessment results from the following data:

${formattedAnswers}

Please provide a comprehensive analysis in ENGLISH ONLY:
1. Assess overall risk level (riskLevel)
2. Identify important risk factors (riskFactors) - maximum 8 items
3. Provide useful recommendations (recommendations) - maximum 6 items
4. Summarize overall assessment results (summary) - maximum 200 words
5. Provide risk score (score) - 0-100

Use clear, easy-to-understand English suitable for general public. Avoid complex medical terminology.
IMPORTANT: All responses must be in English only.`
        : `กรุณาวิเคราะห์ผลการประเมิน "${categoryTitle}" จากข้อมูลต่อไปนี้:

${formattedAnswers}

กรุณาให้การวิเคราะห์ที่ครอบคลุมเป็นภาษาไทยเท่านั้น:
1. ประเมินระดับความเสี่ยงโดยรวม (riskLevel)
2. ระบุปัจจัยเสี่ยงที่สำคัญ (riskFactors) - ไม่เกิน 8 ข้อ
3. ให้คำแนะนำที่เป็นประโยชน์ (recommendations) - ไม่เกิน 6 ข้อ
4. สรุปผลการประเมินโดยรวม (summary) - ไม่เกิน 200 คำ
5. ให้คะแนนความเสี่ยง (score) - 0-100

ใช้ภาษาไทยที่เข้าใจง่าย เหมาะสำหรับคนทั่วไป หลีกเลี่ยงศัพท์ทางการแพทย์ที่ซับซ้อน
สำคัญ: คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น`

    console.log("🤖 API: Using system prompt for language:", language)
    console.log("🤖 API: System prompt:", getSystemPrompt(categoryId, language).substring(0, 200) + "...")

    // Generate analysis using OpenAI
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      system: getSystemPrompt(categoryId, language),
      prompt: userPrompt,
      schema: AssessmentAnalysisSchema,
    })

    console.log("✅ API: Analysis completed successfully")
    console.log("🔍 API: Sample analysis result:", {
      riskLevel: analysis.riskLevel,
      riskFactorsCount: analysis.riskFactors.length,
      recommendationsCount: analysis.recommendations.length,
      summaryLength: analysis.summary.length,
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("❌ API: Error analyzing assessment:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
