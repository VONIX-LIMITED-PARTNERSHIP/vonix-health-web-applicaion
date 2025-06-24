import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"

// Define the message structure expected by the AI SDK
interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Schema for intent classification
const IntentSchema = z.object({
  category: z.enum(["สุขภาพ", "แอป VONIX", "อื่นๆ"]),
})

// System prompt for health advice
const HEALTH_SYSTEM_PROMPT = `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

หน้าที่ของคุณ:
- ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์
- ต��บคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
- เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
- ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
- ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
- หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์`

// System prompt for intent classification
const INTENT_CLASSIFICATION_PROMPT = `คุณคือผู้ช่วยที่ทำหน้าที่จำแนกประเภทคำถามของผู้ใช้

หน้าที่ของคุณ:
- วิเคราะห์ข้อความของผู้ใช้และระบุว่าคำถามนั้นเกี่ยวข้องกับ "สุขภาพ" หรือ "การใช้งานแอป VONIX" หรือไม่
- หากคำถามเกี่ยวข้องกับสุขภาพ ให้ระบุว่าเป็น "สุขภาพ"
- หากคำถามเกี่ยวข้องกับการใช้งานแอป VONIX (เช่น วิธีใช้, สมัครสมาชิก, เข้าสู่ระบบ, แบบประเมิน, ผลลัพธ์, บันทึก, แก้ไข, ปัญหา, ข้อมูล, ความปลอดภัย) ให้ระบุว่าเป็น "แอป VONIX"
- หากคำถามไม่เกี่ยวข้องกับทั้งสองประเภทนี้ ให้ระบุว่าเป็น "อื่นๆ"

ตัวอย่าง:
- ผู้ใช้: "ปวดหัวทำไงดี" -> สุขภาพ
- ผู้ใช้: "วิธีสมัครสมาชิก" -> แอป VONIX
- ผู้ใช้: "วันนี้อากาศเป็นไง" -> อื่นๆ`

export async function POST(req: Request) {
  try {
    // Expect an array of messages from the client
    const { messages: clientMessages } = (await req.json()) as { messages: AIMessage[] }

    // The last message is the current user's query
    const userMessage = clientMessages[clientMessages.length - 1].content

    // Prepare messages for AI SDK, excluding the system prompt for classification
    // The system prompt for classification is passed directly to generateObject
    const conversationHistoryForAI = clientMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // First, classify the intent of the user's message using the full conversation history
    const { object: intentClassification } = await generateObject({
      model: openai("gpt-4o"),
      system: INTENT_CLASSIFICATION_PROMPT,
      messages: conversationHistoryForAI, // Pass full history for context
      schema: IntentSchema,
    })

    let botResponse: string

    if (intentClassification.category === "สุขภาพ") {
      // If it's a health-related question, generate a health advice
      const { text: healthResponse } = await generateText({
        model: openai("gpt-4o"),
        system: HEALTH_SYSTEM_PROMPT,
        messages: conversationHistoryForAI, // Pass full history for context
      })
      botResponse = healthResponse
    } else if (intentClassification.category === "แอป VONIX") {
      // This case should ideally be handled by hardcoded responses on the client,
      // but as a fallback or for more complex app-related queries, AI can respond.
      // For simplicity, we'll give a general app-related response here.
      botResponse = `ผมเป็นผู้ช่วยด้านการใช้งานแอป VONIX ครับ! คุณมีคำถามเกี่ยวกับการใช้งานแอปเพิ่มเติมไหมครับ?`
    } else {
      // If it's neither health nor app-related, provide a refusal message
      const redirectResponses = [
        `ผมเป็น VONIX Assistant ผู้ช่วยด้านสุขภาพและการใช้งานแอพครับ! 🤖

แทนที่จะคุยเรื่องนั้น มาคุยเรื่องที่ผมช่วยได้ดีกว่า:

🏥 เรื่องสุขภาพ:
• มีอาการไม่สบายไหม?
• อยากทราบเรื่องอาหารเพื่อสุขภาพ?
• สนใจการออกกำลังกาย?

📱 การใช้งาน VONIX:
• วิธีทำแบบประเมิน
• ดูผลการวิเคราะห์
• แก้ไขปัญหาการใช้งาน`,

        `ขอโทษครับ ผมเชี่ยวชาญเฉพาะเรื่องสุขภาพและ VONIX เท่านั้น 🩺

มาคุยเรื่องที่ผมช่วยได้ดีกว่านะครับ:

💚 สุขภาพ: ปวดหัว ปวดท้อง การกิน การนอน
📱 VONIX: วิธีใช้ แก้ปัญหา ดูผลประเมิน
🤖 AI: คำแนะนำเฉพาะบุคคล

ถามอะไรก็ได้เกี่ยวกับเรื่องเหล่านี้นะครับ! 😊`,

        `ผมเป็นผู้ช่วยอัจฉริยะของ VONIX ครับ! 🌟

ลองถามผมเรื่องเหล่านี้ดูสิ:

🎯 การใช้งาน:
• "แอพใช้ยังไง?"
• "ทำแบบประเมินยังไง?"
• "ดูผลลัพธ์ที่ไหน?"

💊 สุขภาพ:
• "ปวดหัวแก้ยังไง?"
• "ผลไม้อะไรดี?"
• "ออกกำลังกายแบบไหนดี?"

ผมพร้อมช่วยเหลือ 24/7! 🚀`,
      ]
      botResponse = redirectResponses[Math.floor(Math.random() * redirectResponses.length)]
    }

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error("Error in /api/chat:", error)
    return NextResponse.json(
      { error: "ขอโทษครับ เกิดข้อผิดพลาดในการประมวลผลคำถามของคุณ กรุณาลองใหม่อีกครั้งนะครับ 😅" },
      { status: 500 },
    )
  }
}
