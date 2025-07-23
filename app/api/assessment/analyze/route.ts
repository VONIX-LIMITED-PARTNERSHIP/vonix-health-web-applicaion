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

⭐ กฎสำคัญในการวิเคราะห์:
1. ระบุปัจจัยเสี่ยง (Risk Factors) ไม่เกิน 5 ข้อ โดยเรียงลำดับตามความสำคัญจากมากไปน้อย
2. ระบุคำแนะนำ (Recommendations) ไม่เกิน 5 ข้อ โดยเน้นสิ่งที่ปฏิบัติได้จริง
3. ให้คะแนนรวม 0-100 โดยพิจารณาจากคำตอบจริง (0=สุขภาพดีมาก, 100=เสี่ยงสูงมาก)
4. กำหนดระดับความเสี่ยง: low, medium, high, very-high
5. สรุปภาพรวมสุขภาพให้กระชับไม่เกิน 3 ประโยค

🔗 การรวบรวมปัจจัยเสี่ยงที่เกี่ยวข้องกัน:
- รวมปัจจัยเสี่ยงที่เกี่ยวข้องกับโภชนาการเป็นข้อเดียว เช่น "พฤติกรรมการกินที่ไม่เหมาะสม: กินอาหารหวานมาก กินผักน้อย และดื่มน้ำไม่เพียงพอ"
- รวมปัจจัยเสี่ยงเกี่ยวกับการออกกำลังกายและกิจกรรมเป็นข้อเดียว เช่น "ขาดการเคลื่อนไหวร่างกาย: ไม่ออกกำลังกายสม่ำเสมอ และนั่งทำงานนานเกินไป"
- รวมปัจจัยเสี่ยงด้านการพักผ่อนเป็นข้อเดียว เช่น "รูปแบบการพักผ่อนไม่เหมาะสม: นอนดึก นอนไม่เพียงพอ และมีปัญหาการนอนหลับ"
- รวมปัจจัยเสี่ยงด้านความเครียดและอารมณ์เป็นข้อเดียว เช่น "ปัญหาสุขภาพจิต: มีความเครียดสูง วิตกกังวล และจัดการอารมณ์ได้ไม่ดี"
- รวมปัจจัยเสี่ยงด้านสิ่งแวดล้อมและพฤติกรรมเสี่ยงเป็นข้อเดียว เช่น "พฤติกรรมเสี่ยงต่อสุขภาพ: สูบบุหรี่ ดื่มแอลกอฮอล์ และสัมผัสมลพิษ"

📋 เกณฑ์การประเมิน:
- ปัจจัยเสี่ยงต้องเป็นสิ่งที่พบจริงจากคำตอบ ไม่ใช่การคาดเดา
- คำแนะนำต้องเฉพาะเจาะจงและสามารถปฏิบัติได้
- หลีกเลี่ยงการระบุปัจจัยเสี่ยงที่ซ้ำซ้อนหรือคล้ายกัน
- จัดกลุ่มปัจจัยเสี่ยงที่เกี่ยวข้องกันให้เป็นข้อเดียวเสมอ

🎯 ลำดับความสำคัญของปัจจัยเสี่ยง:
1. ปัจจัยเสี่ยงที่เป็นอันตรายต่อชีวิตหรือสุขภาพร้ายแรง
2. ปัจจัยเสี่ยงที่ส่งผลต่อสุขภาพระยะยาวและเรื้อรัง
3. ปัจจัยเสี่ยงที่ส่งผลต่อคุณภาพชีวิตประจำวัน
4. ปัจจัยเสี่ยงที่แก้ไขได้ง่ายและรวดเร็ว
5. ปัจจัยเสี่ยงทั่วไปที่มีผลกระทบน้อย

📝 รูปแบบการเขียนปัจจัยเสี่ยงที่รวบรวมแล้ว:
- ใช้หัวข้อหลัก: รายละเอียดย่อย
- ตัวอย่าง: "ปัญหาด้านโภชนาการ: กินอาหารหวานมากเกินไป ขาดการกินผักและผลไม้ และดื่มน้ำไม่เพียงพอ"
- ตัวอย่าง: "การขาดการเคลื่อนไหว: ไม่ออกกำลังกายเป็นประจำ นั่งทำงานติดต่อกันนานเกิน 4 ชั่วโมง และเดินน้อยกว่า 5,000 ก้าวต่อวัน"

⚠️ หลีกเลี่ยง:
- การแยกปัจจัยเสี่ยงที่เกี่ยวข้องกันออกเป็นหลายข้อ
- การระบุปัจจัยเสี่ยงที่ไม่เกี่ยวข้องกับคำตอบ
- คำแนะนำที่เป็นนามธรรมหรือทั่วไป
- การทำซ้ำเนื้อหาในหลายข้อ

สำคัญ: ให้ผลลัพธ์เป็นทั้งภาษาไทยและอังกฤษ
สำคัญ: ใช้คำตอบจริงในการประเมิน ไม่ใช่คะแนนที่ส่งมา
สำคัญ: รวบรวมปัจจัยเสี่ยงที่เกี่ยวข้องกันเป็นข้อเดียวเสมอ

ข้อมูลการประเมิน:
${questionsAndAnswers}`

    const userPrompt = `กรุณาวิเคราะห์ผลการประเมินสุขภาพนี้และให้ผลลัพธ์เป็นทั้งภาษาไทยและอังกฤษ

🔢 เกณฑ์การให้คะแนน:
- 0-25: ความเสี่ยงต่ำ (low) - สุขภาพดี มีปัจจัยเสี่ยงน้อย
- 26-50: ความเสี่ยงปานกลาง (medium) - มีปัจจัยเสี่ยงบางประการ ควรปรับปรุง
- 51-75: ความเสี่ยงสูง (high) - มีปัจจัยเสี่ยงหลายประการ ต้องดูแลเป็นพิเศษ
- 76-100: ความเสี่ยงสูงมาก (very-high) - มีปัจจัยเสี่ยงร้ายแรง ควรปรึกษาแพทย์

📝 รูปแบบการตอบที่ต้องการ:
- ปัจจัยเสี่ยง: รวบรวมที่เกี่ยวข้องกันเป็นข้อเดียว ไม่เกิน 5 ข้อ
- คำแนะนำ: เฉพาะเจาะจงและปฏิบัติได้จริง ไม่เกิน 5 ข้อ
- สรุป: กระชับ ชัดเจน ไม่เกิน 3 ประโยค

🔗 ตัวอย่างการรวบรวมปัจจัยเสี่ยง:
แทนที่จะเขียน:
- "กินอาหารหวานมาก"
- "กินผักน้อย" 
- "ดื่มน้ำไม่พอ"

ให้เขียนเป็น:
- "ปัญหาด้านโภชนาการ: กินอาหารหวานมากเกินไป ขาดการกินผักและผลไม้ และดื่มน้ำไม่เพียงพอ"

⚠️ สิ่งที่ต้องหลีกเลี่ยง:
- การแยกปัจจัยเสี่ยงที่เกี่ยวข้องกันออกเป็นหลายข้อแยก
- การระบุปัจจัยเสี่ยงที่ไม่เกี่ยวข้องกับคำตอบ
- คำแนะนำที่เป็นนามธรรมหรือทั่วไป
- การทำซ้ำเนื้อหาในหลายข้อ

🎯 เป้าหมาย: ให้ได้ปัจจัยเสี่ยงที่กระชับ ครอบคลุม และเข้าใจง่าย ไม่เกิน 5 ข้อ`

    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: BilingualAssessmentAnalysisSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3,
    })

    // เพิ่ม log เพื่อเช็คคะแนนจาก OpenAI
    console.log("🎯 OpenAI Assessment Score:", analysis.score)
    console.log("📊 OpenAI Risk Level:", analysis.riskLevel)

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
