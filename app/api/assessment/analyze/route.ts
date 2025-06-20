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

// System prompts for different assessment categories
const getSystemPrompt = (categoryId: string) => {
  const prompts = {
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
- Very High (76-100): ความเสี่ยงสูงมาก ต้องพบแพทย์เร่งด่วน`,

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
- Very High (76-100): พฤติกรรมเสี่ยงสูง ต้องเปลี่ยนแปลงเร่งด่วน`,

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
- Very High (76-100): มีความเสี่ยงสูงต่อปัญหาสุขภาพจิต ควรพบแพทย์`,

    physical: `คุณเป็นแพทย์เวชศาสตร์การกีฬาและกายภาพบำบัดที่มีประสบการณ์ 12 ปี คุณจะประเมินสุขภาพกายและความแข็งแรงของร่างกาย

���น้าที่ของคุณ:
- ประเมินความแข็งแรงและสมรรถภาพทางกาย
- ระบุปัญหาการเคลื่อนไหวและกล้ามเนื้อ
- ให้คำแนะนำการออกกำลังกายที่เหมาะสม
- แนะนำการป้องกันการบาดเจ็บ

เกณฑ์การประเมิน:
- Low (0-25): สุขภาพกายดีมาก มีความแข็งแรงเหมาะสม
- Medium (26-50): สุขภาพกายปานกลาง ควรเพิ่มการออกกำลังกาย
- High (51-75): มีปัญหาสุขภาพกายที่ควรปรับปรุง
- Very High (76-100): มีปัญหาสุขภาพกายที่ต้องได้รับการดูแลเร่งด่วน`,

    sleep: `คุณเป็นแพทย์ผู้เชี่ยวชาญด้านการนอนหลับและนักวิทยาศาสตร์การนอน คุณจะวิเค��าะห์คุณภาพการนอนและรูปแบบการพักผ่อน

หน้าที่ของคุณ:
- ประเมินคุณภาพและปริมาณการนอนหลับ
- ระบุปัญหาการนอนหลับและสาเหตุ
- ให้คำแนะนำการปรับปรุงนิสัยการนอน
- แนะนำเมื่อไหร่ควรพบแพทย์ผู้เชี่ยวชาญ

เกณฑ์การประเมิน:
- Low (0-25): คุณภาพการนอนดีมาก มีการพักผ่อนเพียงพอ
- Medium (26-50): คุณภาพการนอนปานกลาง ควรปรับปรุงบางด้าน
- High (51-75): มีปัญหาการนอนที่ส่งผลต่อสุขภาพ
- Very High (76-100): มีปัญหาการนอนร้ายแรง ต้องพบแพทย์เร่งด่วน`,
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
        return `คำถามที่ ${index + 1}: ${answer.question || "ไม่ระบุคำถาม"}
คำตอบ: ${Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
คะแนน: ${answer.score}`
      })
      .join("\n\n")

    const userPrompt = `กรุณาวิเคราะห์ผลการประเมิน "${categoryTitle}" จากข้อมูลต่อไปนี้:

${formattedAnswers}

กรุณาให้การวิเคราะห์ที่ครอบคลุม:
1. ประเมินระดับความเสี่ยงโดยรวม (riskLevel)
2. ระบุปัจจัยเสี่ยงที่สำคัญ (riskFactors) - ไม่เกิน 8 ข้อ
3. ให้คำแนะนำที่เป็นประโยชน์ (recommendations) - ไม่เกิน 6 ข้อ
4. สรุปผลการประเมินโดยรวม (summary) - ไม่เกิน 200 คำ
5. ให้คะแนนความเสี่ยง (score) - 0-100

ใช้ภาษาไทยที่เข้าใจง่าย เหมาะสำหรับคนทั่วไป หลีกเลี่ยงศัพท์ทางการแพทย์ที่ซับซ้อน`

    // Generate analysis using OpenAI
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      system: getSystemPrompt(categoryId),
      prompt: userPrompt,
      schema: AssessmentAnalysisSchema,
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
