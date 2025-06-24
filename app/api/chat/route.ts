import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"
import { appKnowledgeBase } from "@/data/chatbot-app-knowledge" // Import the new knowledge base

// Define the message structure expected by the AI SDK
interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Schema for intent classification
const IntentSchema = z.object({
  category: z.enum(["สุขภาพ", "แอป VONIX", "อื่นๆ"]),
})

// System prompt for health advice - STRONGLY IMPROVED
const HEALTH_SYSTEM_PROMPT = `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

**กฎสำคัญที่สุด:**
- **ตอบคำถามของผู้ใช้ที่อยู่ท้ายสุดของประวัติการสนทนาโดยตรงและทันที**
- **ห้ามทักทายซ้ำ หรือถามกลับว่า "มีอะไรให้ช่วยไหมคะ/ครับ" หากผู้ใช้ได้ระบุคำถามมาแล้ว**
- **ห้ามตอบคำถามเก่า หรืออ้างอิงถึงข้อความก่อนหน้าของผู้ใช้ หากมีคำถามใหม่ที่ชัดเจนปรากฏขึ้นในข้อความล่าสุด**
- **หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย ให้ถามอาการเฉพาะเจาะจงเพิ่มเติมเพื่อช่วยให้คำแนะนำได้ดีขึ้น**

หน้าที่ของคุณ:
- ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์
- ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
- เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
- ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
- ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
- หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์`

// System prompt for intent classification (still used for more nuanced cases)
const INTENT_CLASSIFICATION_PROMPT = `คุณคือผู้ช่วยที่ทำหน้าที่จำแนกประเภทคำถามของผู้ใช้
วิเคราะห์ข้อความล่าสุดของผู้ใช้และระบุว่าคำถามนั้นเกี่ยวข้องกับ "สุขภาพ" หรือ "การใช้งานแอป VONIX" หรือไม่ ใช้ประวัติการสนทนาเพื่อทำความเข้าใจบริบท แต่ให้ความสำคัญกับคำถามล่าสุดของผู้ใช้เป็นหลัก

**กฎสำคัญ:**
1.  หากคำถามล่าสุดมีคำที่เกี่ยวข้องกับสุขภาพ (เช่น อาการ, โรค, การดูแลร่างกาย, โภชนาการ, การออกกำลังกาย, สุขภาพจิต, การนอนหลับ, หรือชื่อโรคต่างๆ) ให้ระบุว่าเป็น "สุขภาพ" เสมอ
2.  หากคำถามล่าสุดเกี่ยวข้องกับการใช้งานแอป VONIX (เช่น วิธีใช้, สมัครสมาชิก, เข้าสู่ระบบ, แบบประเมิน, ผลลัพธ์, บันทึก, แก้ไข, ปัญหา, ข้อมูล, ความปลอดภัย) ให้ระบุว่าเป็น "แอป VONIX"
3.  หากคำถามล่าสุดไม่เกี่ยวข้องกับทั้งสองประเภทข้างต้น และไม่เข้าข่ายสุขภาพ ให้ระบุว่าเป็น "อื่นๆ"

ตัวอย่าง:
- ผู้ใช้: "ปวดหัวทำไงดี" -> สุขภาพ
- ผู้ใช้: "วิธีสมัครสมาชิก" -> แอป VONIX
- ผู้ใช้: "วันนี้อากาศเป็นไง" -> อื่นๆ
- ผู้ใช้: "เบาหวาน" -> สุขภาพ
- ผู้ใช้: "ฉันกลัวเป็นเบาหวาน" -> สุขภาพ
- ผู้ใช้: "หลังจากคุยเรื่องสุขภาพแล้ว แอพนี้ใช้ยังไง" -> แอป VONIX
- ผู้ใช้: "ไข้หวัด" -> สุขภาพ
- ผู้ใช้: "การออกกำลังกาย" -> สุขภาพ
- ผู้ใช้: "ฉันป่วย" -> สุขภาพ
- ผู้ใช้: "ฉันไม่สบาย" -> สุขภาพ
- ผู้ใช้: "ฉันหิว" -> สุขภาพ
`

// Define critical health keywords for direct classification - UPDATED WITH ALL USER-PROVIDED TERMS
const CRITICAL_HEALTH_KEYWORDS = [
  "เบาหวาน",
  "ความดัน",
  "หัวใจ",
  "โรคหัวใจ",
  "ไขมัน",
  "คอเลสเตอรอล",
  "น้ำตาลในเลือด",
  "น้ำหนัก",
  "โรคอ้วน",
  "ผอมเกินไป",
  "ดัชนีมวลกาย",
  "BMI",
  "ภูมิแพ้",
  "หอบหืด",
  "ปวดหัว",
  "ไมเกรน",
  "วิงเวียน",
  "บ้านหมุน",
  "ใจสั่น",
  "เหนื่อยง่าย",
  "อ่อนเพลีย",
  "นอนไม่หลับ",
  "นอนหลับยาก",
  "หลับไม่สนิท",
  "หลับไม่ลึก",
  "ซึมเศร้า",
  "วิตกกังวล",
  "เครียด",
  "mental health",
  "สุขภาพจิต",
  "DASS",
  "PHQ",
  "อารมณ์",
  "ร้องไห้",
  "สมาธิสั้น",
  "สมาธิ",
  "วิตกกังวลมาก",
  "ไม่อยากอยู่แล้ว",
  "โรคซึมเศร้า",
  "เครียดมาก",
  "นอนไม่หลับเลย",
  "พักผ่อนไม่พอ",
  "อารมณ์แปรปรวน",
  "หงุดหงิดง่าย",
  "โรคตับ",
  "ไต",
  "ไทรอยด์",
  "ซีสต์",
  "มะเร็ง",
  "มะเร็งเต้านม",
  "มะเร็งปากมดลูก",
  "ซีสต์รังไข่",
  "มดลูก",
  "ประจำเดือน",
  "ปวดประจำเดือน",
  "รอบเดือน",
  "ฮอร์โมน",
  "วัยทอง",
  "ภาวะมีบุตรยาก",
  "หมอ",
  "คลินิก",
  "ปรึกษาแพทย์",
  "ปรึกษาหมอ",
  "ตรวจสุขภาพ",
  "ประเมินสุขภาพ",
  "เจ็บหน้าอก",
  "เจ็บท้อง",
  "ปวดหลัง",
  "ปวดเอว",
  "ปวดไหล่",
  "ปวดเข่า",
  "ปวดข้อ",
  "ปวดกล้ามเนื้อ",
  "ชาแขน",
  "ชาขา",
  "ยาบำรุง",
  "ยาแก้ปวด",
  "ยานอนหลับ",
  "วิตามิน",
  "วิตามินซี",
  "วิตามินดี",
  "โอเมก้า",
  "บำรุงสมอง",
  "อาหารเสริม",
  "แคลเซียม",
  "ธาตุเหล็ก",
  "ภูมิคุ้มกัน",
  "หิวบ่อย",
  "ปัสสาวะบ่อย",
  "นอนไม่พอ",
  "ตื่นบ่อยตอนกลางคืน",
  "นอนกลางวัน",
  "อ่อนแรง",
  "ไม่มีแรง",
  "ขี้ลืม",
  "มือสั่น",
  "เท้าชา",
  "หายใจไม่อิ่ม",
  "หายใจลำบาก",
  "หน้ามืด",
  "เป็นลม",
  "ป่วยง่าย",
  "ติดเชื้อง่าย",
  "แผลหายช้า",
  "แผลเรื้อรัง",
  "คัดจมูก",
  "ไอเรื้อรัง",
  "มีไข้",
  "หนาวสั่น",
  "ท้องเสีย",
  "ท้องอืด",
  "จุกแน่น",
  "ท้องผูก",
  "ถ่ายไม่ออก",
  "อาหารไม่ย่อย",
  "แพ้อาหาร",
  "แพ้นมวัว",
  "นมถั่วเหลือง",
  "แพ้ยา",
  "โรคติดต่อ",
  "เชื้อรา",
  "แบคทีเรีย",
  "ไวรัส",
  "HIV",
  "HPV",
  "เอดส์",
  "โรคเพศสัมพันธ์",
  "โรคตับแข็ง",
  "โรคเก๊าท์",
  "โรคกระดูกพรุน",
  "เบญจเพส",
  "หมอแนะนำ",
  "ฉีดวัคซีน",
  "ตรวจร่างกาย",
  "ตรวจเลือด",
  "ตรวจภายใน",
  "ตรวจโควิด",
  "ตรวจมะเร็ง",
  "ตรวจเบาหวาน",
  "ตรวจน้ำตาล",
  "ตรวจฮอร์โมน",
  "ป่วย", // เพิ่ม 'ป่วย' เข้าไปใน CRITICAL_HEALTH_KEYWORDS ด้วย
  "ไม่สบาย", // เพิ่ม 'ไม่สบาย' เข้าไปใน CRITICAL_HEALTH_KEYWORDS ด้วย
]

export async function POST(req: Request) {
  try {
    // Expect an array of messages from the client
    const { messages: clientMessages } = (await req.json()) as { messages: AIMessage[] }

    // The last message is the current user's query
    const userMessageContent = clientMessages[clientMessages.length - 1].content.toLowerCase()

    // Prepare messages for AI SDK, excluding the system prompt for classification
    const conversationHistoryForAI = clientMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    let botResponse: string
    let intentCategory: z.infer<typeof IntentSchema>["category"]

    // --- Direct classification for critical health keywords ---
    let isCriticalHealthQuery = false
    for (const keyword of CRITICAL_HEALTH_KEYWORDS) {
      if (userMessageContent.includes(keyword)) {
        isCriticalHealthQuery = true
        break
      }
    }

    if (isCriticalHealthQuery) {
      intentCategory = "สุขภาพ" // Force health intent
    } else {
      // Otherwise, use AI to classify the intent
      const { object: intentClassification } = await generateObject({
        model: openai("gpt-4o"),
        system: INTENT_CLASSIFICATION_PROMPT,
        messages: conversationHistoryForAI, // Pass full history for context
        schema: IntentSchema,
      })
      intentCategory = intentClassification.category
    }

    if (intentCategory === "สุขภาพ") {
      // If it's a health-related question, generate a health advice
      const { text: healthResponse } = await generateText({
        model: openai("gpt-4o"),
        system: HEALTH_SYSTEM_PROMPT,
        messages: conversationHistoryForAI, // Pass full history for context
      })
      botResponse = healthResponse
    } else if (intentCategory === "แอป VONIX") {
      // Implement simple RAG for app-related questions
      let foundAppResponse = false
      for (const entry of appKnowledgeBase) {
        if (entry.keywords.some((keyword) => userMessageContent.includes(keyword))) {
          botResponse = entry.response
          foundAppResponse = true
          break
        }
      }

      if (!foundAppResponse) {
        // Fallback to AI if no specific hardcoded app response is found
        const { text: appRelatedResponse } = await generateText({
          model: openai("gpt-4o"),
          system: `คุณคือผู้ช่วยที่เชี่ยวชาญด้านการใช้งานแอป VONIX ตอบคำถามเกี่ยวกับการใช้งานแอปเท่านั้น หากไม่แน่ใจให้แนะนำให้ผู้ใช้ถามคำถามที่เกี่ยวข้องกับการใช้งานแอป`,
          messages: conversationHistoryForAI,
        })
        botResponse = appRelatedResponse
      }
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
