import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Define the bilingual response schema
const BilingualAssessmentAnalysisSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "very-high"]),
  score: z.number().min(0).max(100),

  // Thai language results
  riskFactors: z.array(z.string()).describe("Risk factors in Thai"),
  recommendations: z.array(z.string()).describe("Recommendations in Thai"),
  summary: z.string().describe("Summary in Thai"),

  // English language results
  riskFactorsEn: z.array(z.string()).describe("Risk factors in English"),
  recommendationsEn: z.array(z.string()).describe("Recommendations in English"),
  summaryEn: z.string().describe("Summary in English"),
})

// System prompts for different assessment categories
const getSystemPrompt = (categoryId: string, language: "th" | "en") => {
  const prompts = {
    heart: {
      th: `คุณเป็นแพทย์หัวใจและหลอดเลือดที่มีประสบการณ์ 20 ปี คุณจะวิเคราะห์ข้อมูลสุขภาพหัวใจและหลอดเลือดของผู้ป่วย

หน้าที่ของคุณ:
- ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด
- ระบุปัจจัยเสี่ยงที่สำคัญ
- ให้คำแนะนำเชิงป้องกันและการดูแลสุขภาพ
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ

เกณฑ์การประเมิน:
- Low (0-25): ความเสี่ยงต่ำ ไม่มีปัจจัยเสี่ยงสำคัญ
- Medium (26-50): ความเสี่ยงปานกลาง มีปัจจัยเสี่ยงบางอย่าง
- High (51-75): ความเสี่ยงสูง มีปัจจัยเสี่ยงหลายอย่าง
- Very High (76-100): ความเสี่ยงสูงมาก ต้องพบแพทย์เร่งด่วน`,

      en: `You are a cardiologist with 20 years of experience. You will analyze cardiovascular health data of patients.

Your responsibilities:
- Assess cardiovascular disease risk
- Identify important risk factors
- Provide preventive care and health management recommendations
- Provide results in both Thai and English

Assessment criteria:
- Low (0-25): Low risk, no significant risk factors
- Medium (26-50): Moderate risk, some risk factors present
- High (51-75): High risk, multiple risk factors present
- Very High (76-100): Very high risk, urgent medical attention needed`,
    },

    nutrition: {
      th: `คุณเป็นนักโภชนาการและแพทย์เวชศาสตร์ป้องกันที่มีประสบการณ์ 15 ปี คุณจะวิเคราะห์พฤติกรรมการกิน การออกกำลังกาย และไลฟ์สไตล์

หน้าที่ของคุณ:
- ประเมินคุณภาพการบริโภคอาหารและโภชนาการ
- วิเคราะห์พฤติกรรมการออกกำลังกาย
- ระบุปัญหาและความเสี่ยงด้านโภชนาการ
- ให้คำแนะนำการปรับเปลี่ยนพฤติกรรม
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ`,

      en: `You are a nutritionist and preventive medicine doctor with 15 years of experience. You will analyze eating behaviors, exercise habits, and lifestyle.

Your responsibilities:
- Assess food consumption quality and nutrition
- Analyze exercise behavior patterns
- Identify nutritional problems and risks
- Provide behavior modification recommendations
- Provide results in both Thai and English`,
    },

    mental: {
      th: `คุณเป็นจิตแพทย์และนักจิตวิทยาคลินิกที่มีประสบการณ์ 18 ปี คุณจะประเมินสุขภาพจิตและสภาวะทางอารมณ์

หน้าที่ของคุณ:
- ประเมินระดับความเครียดและสุขภาพจิต
- ระบุสัญญาณเตือนของปัญหาสุขภาพจิต
- ให้คำแนะนำการจัดการความเครียด
- แนะนำเมื่อไหร่ควรพบผู้เชี่ยวชาญ
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ`,

      en: `You are a psychiatrist and clinical psychologist with 18 years of experience. You will assess mental health and emotional well-being.

Your responsibilities:
- Assess stress levels and mental health
- Identify warning signs of mental health problems
- Provide stress management recommendations
- Advise when to seek professional help
- Provide results in both Thai and English`,
    },

    physical: {
      th: `คุณเป็นแพทย์เวชศาสตร์การกีฬาและกายภาพบำบัดที่มีประสบการณ์ 12 ปี คุณจะประเมินสุขภาพกายและความแข็งแรงของร่างกาย

หน้าที่ของคุณ:
- ประเมินความแข็งแรงและสมรรถภาพทางกาย
- ระบุปัญหาการเคลื่อนไหวและกล้ามเนื้อ
- ให้คำแนะนำการออกกำลังกายที่เหมาะสม
- แนะนำการป้องกันการบาดเจ็บ
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ`,

      en: `You are a sports medicine doctor and physical therapist with 12 years of experience. You will assess physical health and body strength.

Your responsibilities:
- Assess strength and physical fitness
- Identify movement and muscle problems
- Provide appropriate exercise recommendations
- Advise on injury prevention
- Provide results in both Thai and English`,
    },

    sleep: {
      th: `คุณเป็นแพทย์ผู้เชี่ยวชาญด้านการนอนหลับและนักวิทยาศาสตร์การนอน คุณจะวิเคราะห์คุณภาพการนอนและรูปแบบการพักผ่อน

หน้าที่ของคุณ:
- ประเมินคุณภาพและปริมาณการนอนหลับ
- ระบุปัญหาการนอนหลับและสาเหตุ
- ให้คำแนะนำการปรับปรุงนิสัยการนอน
- แนะนำเมื่อไหร่ควรพบแพทย์ผู้เชี่ยวชาญ
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ`,

      en: `You are a sleep medicine specialist and sleep scientist. You will analyze sleep quality and rest patterns.

Your responsibilities:
- Assess sleep quality and quantity
- Identify sleep problems and causes
- Provide sleep habit improvement recommendations
- Advise when to see a sleep specialist
- Provide results in both Thai and English`,
    },

    basic: {
      th: `คุณเป็นแพทย์เวชศาสตร์ป้องกันที่มีประสบการณ์ 10 ปี คุณจะวิเคราะห์ข้อมูลสุขภาพพื้นฐานของผู้ป่วย

หน้าที่ของคุณ:
- ประเมินข้อมูลสุขภาพพื้นฐาน
- ระบุปัจจัยเสี่ยงจากประวัติสุขภาพ
- ให้คำแนะนำการดูแลสุขภาพเบื้องต้น
- ให้ผลลัพธ์ทั้งภาษาไทยและอังกฤษ`,

      en: `You are a preventive medicine doctor with 10 years of experience. You will analyze basic health information of patients.

Your responsibilities:
- Assess basic health information
- Identify risk factors from health history
- Provide basic health care recommendations
- Provide results in both Thai and English`,
    },
  }

  return prompts[categoryId as keyof typeof prompts]?.[language] || prompts.basic[language]
}

export async function POST(request: NextRequest) {
  try {
    const { categoryId, categoryTitle, answers, language = "th" } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format answers for AI analysis
    const formattedAnswers = answers
      .map((answer, index) => {
        return `${language === "th" ? "คำถามที่" : "Question"} ${index + 1}: ${answer.question || (language === "th" ? "ไม่ระบุคำถาม" : "No question specified")}
${language === "th" ? "คำตอบ" : "Answer"}: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
${language === "th" ? "คะแนน" : "Score"}: ${answer.score}`
      })
      .join("\n\n")

    const userPrompt =
      language === "th"
        ? `กรุณาวิเคราะห์ผลการประเมิน "${categoryTitle}" จากข้อมูลต่อไปนี้:

${formattedAnswers}

กรุณาให้การวิเคราะห์ที่ครอบคลุมในทั้งภาษาไทยและอังกฤษ:
1. ประเมินระดับความเสี่ยงโดยรวม (riskLevel)
2. ระบุปัจจัยเสี่ยงที่สำคัญ (riskFactors และ riskFactorsEn) - ไม่เกิน 8 ข้อ
3. ให้คำแนะนำที่เป็นประโยชน์ (recommendations และ recommendationsEn) - ไม่เกิน 6 ข้อ
4. สรุปผลการประเมินโดยรวม (summary และ summaryEn) - ไม่เกิน 200 คำ
5. ให้คะแนนความเสี่ยง (score) - 0-100

ใช้ภาษาไทยที่เข้าใจง่าย เหมาะสำหรับคนทั่วไป และภาษาอังกฤษที่ชัดเจน หลีกเลี่ยงศัพท์ทางการแพทย์ที่ซับซ้อน`
        : `Please analyze the assessment results for "${categoryTitle}" from the following data:

${formattedAnswers}

Please provide comprehensive analysis in both Thai and English:
1. Assess overall risk level (riskLevel)
2. Identify important risk factors (riskFactors and riskFactorsEn) - maximum 8 items
3. Provide useful recommendations (recommendations and recommendationsEn) - maximum 6 items
4. Overall assessment summary (summary and summaryEn) - maximum 200 words
5. Risk score (score) - 0-100

Use simple Thai suitable for general public and clear English, avoiding complex medical terminology`

    // Generate bilingual analysis using OpenAI
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      system: getSystemPrompt(categoryId, language),
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
