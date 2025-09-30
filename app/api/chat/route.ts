// import { generateText, generateObject } from "ai"
// import { openai } from "@ai-sdk/openai"
// import { z } from "zod"
// import { NextResponse } from "next/server"
// import { appKnowledgeBase } from "@/data/chatbot-app-knowledge"
// import { AssessmentService } from "@/lib/assessment-service"
// import { createClient } from "@supabase/supabase-js"
// import { searchPHQKnowledge, getAllPHQKeywords } from "@/data/phq-knowledge-base"
// import { searchAUDITKnowledge, getAllAUDITKeywords } from "@/data/audit-knowledge-base"

// // Define the message structure expected by the AI SDK
// interface AIMessage {
//   role: "user" | "assistant" | "system"
//   content: string
// }

// // Schema for intent classification
// const IntentSchema = z.object({
//   category: z.enum(["สุขภาพ", "แอป VONIX", "อื่นๆ"]),
// })

// // System prompt for health advice
// const HEALTH_SYSTEM_PROMPT = `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

// **กฎสำคัญที่สุด:**
// - **เมื่อตอบ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้ในประวัติการสนทนาเท่านั้น**
// - **ห้ามทักทายซ้ำ หรือถามคำถามทั่วไปซ้ำ (เช่น "มีอะไรให้ช่วยไหมคะ/ครับ?") หากผู้ใช้ได้ระบุคำถามเฉพาะเจาะจงมาแล้ว**
// - **หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย (เช่น "ฉันป่วย", "ไม่สบาย", "ปวดท้อง", "เวียนหัว") ให้ถามอาการเฉพาะเจาะจงเพิ่มเติมเพื่อช่วยให้คำแนะนำได้ดีขึ้น เช่น "คุณมีอาการปวดท้องแบบไหนครับ? ปวดจุกเสียด ปวดบิด หรือปวดแบบไหนครับ?" หรือ "อาการเวียนหัวเป็นแบบไหนครับ? เวียนหัวบ้านหมุน หรือเวียนหัวคลื่นไส้ครับ?"**
// - **หากผู้ใช้บอกว่า "มันแปลกอะ" หรือคำพูดกำกวม ให้ถามกลับเพื่อขอข้อมูลเพิ่มเติมเกี่ยวกับสิ่งที่แปลกหรืออาการที่เกิดขึ้น**

// หน้าที่ของคุณ:
// - ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์
// - ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
// - เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
// - ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
// - ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
// - หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์`

// // System prompt for intent classification
// const INTENT_CLASSIFICATION_PROMPT = `คุณคือผู้ช่วยที่ทำหน้าที่จำแนกประเภทคำถามของผู้ใช้
// **ในการจำแนกประเภท ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้เท่านั้น เพื่อกำหนดเจตนา ห้ามนำข้อความก่อนหน้ามาใช้ในการจำแนกเจตนาของข้อความปัจจุบัน**

// **กฎสำคัญ:**
// 1.  **ให้ความสำคัญกับ "สุขภาพ" เป็นอันดับแรก:** หากมีคำที่เกี่ยวข้องกับสุขภาพแม้เพียงเล็กน้อย หรือคำถามมีความกำกวม ให้จัดประเภทเป็น "สุขภาพ" เสมอ
// 2.  หากคำถามล่าสุดเกี่ยวข้องกับการใช้งานแอป VONIX (เช่น วิธีใช้, สมัครสมาชิก, เข้าสู่ระบบ, แบบประเมิน, ผลลัพธ์, บันทึก, แก้ไข, ปัญหา, ข้อมูล, ความปลอดภัย) ให้ระบุว่าเป็น "แอป VONIX"
// 3.  หากคำถามล่าสุดไม่เกี่ยวข้องกับทั้งสองประเภทข้างต้น และไม่เข้าข่ายสุขภาพ ให้ระบุว่าเป็น "อื่นๆ"

// ตัวอย่าง:
// - ผู้ใช้: "ปวดหัวทำไงดี" -> สุขภาพ
// - ผู้ใช้: "วิธีสมัครสมาชิก" -> แอป VONIX
// - ผู้ใช้: "วันนี้อากาศเป็นไง" -> อื่นๆ
// - ผู้ใช้: "เบาหวาน" -> สุขภาพ
// - ผู้ใช้: "ฉันกลัวเป็นเบาหวาน" -> สุขภาพ
// - ผู้ใช้: "หลังจากคุยเรื่องสุขภาพแล้ว แอพนี้ใช้ยังไง" -> แอป VONIX
// - ผู้ใช้: "ไข้หวัด" -> สุขภาพ
// - ผู้ใช้: "การออกกำลังกาย" -> สุขภาพ
// - ผู้ใช้: "ฉันป่วย" -> สุขภาพ
// - ผู้ใช้: "ฉันไม่สบาย" -> สุขภาพ
// - ผู้ใช้: "ฉันหิว" -> สุขภาพ
// - ผู้ใช้: "ปวดท้องมาก แล้วก็เวียนหัว" -> สุขภาพ
// - ผู้ใช้: "มันแปลกอะ" -> สุขภาพ (เพราะอาจจะหมายถึงอาการแปลกๆ)
// - ผู้ใช้: "สวัสดี" -> อื่นๆ
// `

// // System prompt for "อื่นๆ" intent
// const OTHER_SYSTEM_PROMPT = `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพและการใช้งานแอปพลิเคชันเท่านั้น หากผู้ใช้ถามคำถามที่ไม่เกี่ยวข้องกับสุขภาพหรือการใช้งานแอป ให้ตอบกลับอย่างสุภาพว่าคุณเชี่ยวชาญเฉพาะสองเรื่องนี้ และแนะนำให้ผู้ใช้ถามคำถามที่เกี่ยวข้องกับสุขภาพหรือการใช้งานแอปแทน ห้ามตอบคำถามที่ไม่เกี่ยวข้องโดยตรง ห้ามทักทายซ้ำ`

// // System prompt for personalized health advice
// const PERSONALIZED_HEALTH_SYSTEM_PROMPT = (
//   userName: string,
//   healthData: string,
// ) => `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

// **ข้อมูลสุขภาพล่าสุดของ ${userName} (อ้างอิงจากแบบประเมินที่ทำล่าสุด):**
// ${healthData}

// **กฎสำคัญที่สุด:**
// - **เมื่อตอบ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้ในประวัติการสนทนาเท่านั้น และใช้ข้อมูลสุขภาพที่ให้มาข้างต้นเพื่อตอบคำถามเกี่ยวกับสุขภาพของ ${userName} โดยเฉพาะ**
// - **ห้ามทักทายซ้ำ หรือถามคำถามทั่วไปซ้ำ (เช่น "มีอะไรให้ช่วยไหมคะ/ครับ?") หากผู้ใช้ได้ระบุคำถามเฉพาะเจาะจงมาแล้ว**
// - **หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย ให้ถามอาการเฉพาะเจาะจงเพิ่มเติม**

// หน้าที่ของคุณ:
// - ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์ โดยอ้างอิงจากข้อมูลสุขภาพของ ${userName} ที่ให้มา
// - ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
// - เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
// - ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
// - ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
// - หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์
// `

// // Define critical health keywords for direct classification
// const CRITICAL_HEALTH_KEYWORDS = [
//   "เบาหวาน",
//   "ความดัน",
//   "หัวใจ",
//   "โรคหัวใจ",
//   "ไขมัน",
//   "คอเลสเตอรอล",
//   "น้ำตาลในเลือด",
//   "น้ำหนัก",
//   "โรคอ้วน",
//   "ผอมเกินไป",
//   "ดัชนีมวลกาย",
//   "BMI",
//   "ภูมิแพ้",
//   "หอบหืด",
//   "ปวดหัว",
//   "ไมเกรน",
//   "วิงเวียน",
//   "บ้านหมุน",
//   "ใจสั่น",
//   "เหนื่อยง่าย",
//   "อ่อนเพลีย",
//   "นอนไม่หลับ",
//   "นอนหลับยาก",
//   "หลับไม่สนิท",
//   "หลับไม่ลึก",
//   "ซึมเศร้า",
//   "วิตกกังวล",
//   "เครียด",
//   "mental health",
//   "สุขภาพจิต",
//   "DASS",
//   "PHQ",
//   "อารมณ์",
//   "ร้องไห้",
//   "สมาธิสั้น",
//   "สมาธิ",
//   "วิตกกังวลมาก",
//   "ไม่อยากอยู่แล้ว",
//   "โรคซึมเศร้า",
//   "เครียดมาก",
//   "นอนไม่หลับเลย",
//   "พักผ่อนไม่พอ",
//   "อารมณ์แปรปรวน",
//   "หงุดหงิดง่าย",
//   "โรคตับ",
//   "ไต",
//   "ไทรอยด์",
//   "ซีสต์",
//   "มะเร็ง",
//   "มะเร็งเต้านม",
//   "มะเร็งปากมดลูก",
//   "ซีสต์รังไข่",
//   "มดลูก",
//   "ประจำเดือน",
//   "ปวดประจำเดือน",
//   "รอบเดือน",
//   "ฮอร์โมน",
//   "วัยทอง",
//   "ภาวะมีบุตรยาก",
//   "หมอ",
//   "คลินิก",
//   "ปรึกษาแพทย์",
//   "ปรึกษาหมอ",
//   "ตรวจสุขภาพ",
//   "ประเมินสุขภาพ",
//   "เจ็บหน้าอก",
//   "เจ็บท้อง",
//   "ปวดหลัง",
//   "ปวดเอว",
//   "ปวดไหล่",
//   "ปวดเข่า",
//   "ปวดข้อ",
//   "ปวดกล้ามเนื้อ",
//   "ชาแขน",
//   "ชาขา",
//   "ยาบำรุง",
//   "ยาแก้ปวด",
//   "ยานอนหลับ",
//   "วิตามิน",
//   "วิตามินซี",
//   "วิตามินดี",
//   "โอเมก้า",
//   "บำรุงสมอง",
//   "อาหารเสริม",
//   "แคลเซียม",
//   "ธาตุเหล็ก",
//   "ภูมิคุ้มกัน",
//   "หิวบ่อย",
//   "ปัสสาวะบ่อย",
//   "นอนไม่พอ",
//   "ตื่นบ่อยตอนกลางคืน",
//   "นอนกลางวัน",
//   "อ่อนแรง",
//   "ไม่มีแรง",
//   "ขี้ลืม",
//   "มือสั่น",
//   "เท้าชา",
//   "หายใจไม่อิ่ม",
//   "หายใจลำบาก",
//   "หน้ามืด",
//   "เป็นลม",
//   "ป่วยง่าย",
//   "ติดเชื้อง่าย",
//   "แผลหายช้า",
//   "แผลเรื้อรัง",
//   "คัดจมูก",
//   "ไอเรื้อรัง",
//   "มีไข้",
//   "หนาวสั่น",
//   "ท้องเสีย",
//   "ท้องอืด",
//   "จุกแน่น",
//   "ท้องผูก",
//   "ถ่ายไม่ออก",
//   "อาหารไม่ย่อย",
//   "แพ้อาหาร",
//   "แพ้นมวัว",
//   "นมถั่วเหลือง",
//   "แพ้ยา",
//   "โรคติดต่อ",
//   "เชื้อรา",
//   "แบคทีเรีย",
//   "ไวรัส",
//   "HIV",
//   "HPV",
//   "เอดส์",
//   "โรคเพศสัมพันธ์",
//   "โรคตับแข็ง",
//   "โรคเก๊าท์",
//   "โรคกระดูกพรุน",
//   "เบญจเพส",
//   "หมอแนะนำ",
//   "ฉีดวัคซีน",
//   "ตรวจร่างกาย",
//   "ตรวจเลือด",
//   "ตรวจภายใน",
//   "ตรวจโควิด",
//   "ตรวจมะเร็ง",
//   "ตรวจเบาหวาน",
//   "ตรวจน้ำตาล",
//   "ตรวจฮอร์โมน",
//   "ป่วย",
//   "ไม่สบาย",
//   "หิว",
//   "ปวดท้อง",
//   "เวียนหัว",
//   "แปลก",
//   "สุขภาพของฉัน",
//   "ผลประเมินของฉัน",
//   "สุขภาพเป็นยังไง",
//   "ข้อมูลสุขภาพ",
//   "ประเมินสุขภาพ",
//   "สรุปสุขภาพ",
//   "สุขภาพฉัน",
//   "สุขภาพเป็นอย่างไร",
//   "diabetes", "blood pressure", "heart", "cholesterol", "obesity", "overweight", "underweight",
//   "BMI", "allergy", "asthma", "headache", "migraine", "dizziness", "vertigo",
//   "palpitations", "fatigue", "tired", "insomnia", "sleep", "depression", "anxiety",
//   "stress", "mental health", "mood", "crying", "ADHD", "concentration", "suicidal",
//   "liver", "kidney", "thyroid", "cyst", "cancer", "menstruation", "period", "hormone",
//   "menopause", "infertility", "chest pain", "stomach pain", "back pain", "shoulder pain",
//   "knee pain", "joint pain", "muscle pain", "numb arm", "numb leg", "shortness of breath",
//   "fainting", "infection", "slow healing", "fever", "chills", "diarrhea", "bloating",
//   "constipation", "indigestion", "food allergy", "milk allergy", "soy milk", "drug allergy",
//   "STD", "hepatitis", "gout", "osteoporosis", "vaccine", "blood test", "cancer test",
//   "COVID test", "health check", "sick", "not feeling well", "hungry", "strange symptoms",
//   ...getAllPHQKeywords(),
//   ...getAllAUDITKeywords(),
// ]

// // Helper function to get risk level label
// const getRiskLevelLabel = (riskLevel: string): string => {
//   switch (riskLevel) {
//     case "low":
//       return "ต่ำ"
//     case "medium":
//       return "ปานกลาง"
//     case "high":
//       return "สูง"
//     case "very-high":
//       return "สูงมาก"
//     default:
//       return "ไม่ระบุ"
//   }
// }

// export async function POST(req: Request) {
//   try {
//     // Expect an array of messages, userName, and userId from the client
//     const { messages: clientMessages, userName } = (await req.json()) as {
//       messages: AIMessage[]
//       userName?: string
//       userId?: string // userId is now optional from client, will be derived from session
//     }

//     // Get user session from cookies on the server side
//     const supabaseServerClient = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_ROLE_KEY!,
//       {
//         auth: {
//           persistSession: false, // Do not persist session on server
//         },
//       },
//     )
//     const {
//       data: { user },
//     } = await supabaseServerClient.auth.getUser()
//     const userId = user?.id || null

//     // The last message is the current user's query
//     const userMessageContent = clientMessages[clientMessages.length - 1].content.toLowerCase()

//     // Prepare messages for AI SDK
//     const conversationHistoryForAI = clientMessages.map((msg) => ({
//       role: msg.role,
//       content: msg.content,
//     }))

//     let botResponse = "" 
//     let intentCategory: z.infer<typeof IntentSchema>["category"]
//     let healthDataSummary = ""
//     let hasPersonalizedHealthData = false

//     // --- Fetch personalized health data if user is logged in ---
//     if (userId) {
//       try {
//         // Pass the supabase client to the service method
//         const { data: latestAssessments, error: fetchError } = await AssessmentService.getLatestUserAssessments(
//           supabaseServerClient, // Use the server-side client
//           userId,
//         )

//         if (fetchError) {
//           // Continue without personalized data if there's an error
//         } else if (latestAssessments && latestAssessments.length > 0) {
//           hasPersonalizedHealthData = true

//           healthDataSummary = latestAssessments
//             .map((assessment) => {
//               const riskLabel = getRiskLevelLabel(assessment.risk_level)
//               const factors =
//                 assessment.risk_factors && assessment.risk_factors.length > 0
//                   ? `ปัจจัยเสี่ยง: ${assessment.risk_factors.join(", ")}`
//                   : "ไม่มีปัจจัยเสี่ยงที่ระบุ"
//               const recommendations =
//                 assessment.recommendations && assessment.recommendations.length > 0
//                   ? `คำแนะนำ: ${assessment.recommendations.join(", ")}`
//                   : "ไม่มีคำแนะนำเฉพาะ"

//               return `
// - หมวดหมู่: ${assessment.category_title} (ID: ${assessment.category_id})
//   - ระดับความเสี่ยง: ${riskLabel} (${assessment.percentage}%)
//   - ${factors}
//   - ${recommendations}
//   - ทำเมื่อ: ${new Date(assessment.completed_at).toLocaleDateString("th-TH")}
//           `.trim()
//             })
//             .join("\n\n")

//           healthDataSummary = `นี่คือข้อมูลสรุปผลการประเมินสุขภาพล่าสุดของคุณ:\n\n${healthDataSummary}\n\nโปรดใช้ข้อมูลนี้เพื่อตอบคำถามเกี่ยวกับสุขภาพของผู้ใช้`
//         } else {
//           healthDataSummary = "ผู้ใช้ยังไม่มีข้อมูลการประเมินสุขภาพล่าสุดในระบบ"
//         }
//       } catch (error) {
//         healthDataSummary = "เกิดข้อผิดพลาดในการดึงข้อมูลสุขภาพ"
//       }
//     } else {
//       healthDataSummary = "ผู้ใช้ไม่ได้ล็อกอิน จึงไม่สามารถเข้าถึงข้อมูลสุขภาพส่วนตัวได้"
//     }

//     // --- Direct classification for critical health keywords (Priority 1) ---
//     let isCriticalHealthQuery = false
//     for (const keyword of CRITICAL_HEALTH_KEYWORDS) {
//       if (userMessageContent.includes(keyword)) {
//         isCriticalHealthQuery = true
//         break
//       }
//     }

//     if (isCriticalHealthQuery) {
//       intentCategory = "สุขภาพ" // Force health intent
//     } else {
//       // --- AI-based intent classification (Priority 2) ---
//       const { object: intentClassification } = await generateObject({
//         model: openai("gpt-4o"),
//         system: INTENT_CLASSIFICATION_PROMPT,
//         messages: conversationHistoryForAI, // Pass full history for context
//         schema: IntentSchema,
//       })
//       intentCategory = intentClassification.category
//     }

import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"
import { appKnowledgeBase } from "@/data/chatbot-app-knowledge"
import { AssessmentService } from "@/lib/assessment-service"
import { createClient } from "@supabase/supabase-js"
import { searchPHQKnowledge, getAllPHQKeywords } from "@/data/phq-knowledge-base"
import { searchAUDITKnowledge, getAllAUDITKeywords } from "@/data/audit-knowledge-base"

// Define the message structure expected by the AI SDK
interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Schema for intent classification
const IntentSchema = z.object({
  category: z.enum(["สุขภาพ", "แอป VONIX", "อื่นๆ", "Health", "VONIX App", "Other"]),
})

// System prompt for intent classification (bilingual: Thai + English)
const INTENT_CLASSIFICATION_PROMPT = `You are an assistant that classifies the user's intent into categories.

**Rules (Thai + English):**
1. If the latest message relates to health (สุขภาพ), even slightly or ambiguously, classify as "สุขภาพ" or "Health".
2. If the latest message is about using the VONIX app (เช่น วิธีใช้, สมัครสมาชิก, login, subscription, assessment, results, records, edit, problems, data, security), classify as "แอป VONIX" or "VONIX App".
3. If the message is unrelated to both health and the app, classify as "อื่นๆ" or "Other".

**Important:**
- Only consider the most recent user message for classification, never past conversation.
- Health has the highest priority. If unsure, classify as Health/สุขภาพ.

Examples:
- ผู้ใช้: "ปวดหัวทำไงดี" -> สุขภาพ
- User: "I have a headache" -> Health
- ผู้ใช้: "วิธีสมัครสมาชิก" -> แอป VONIX
- User: "How to register an account" -> VONIX App
- ผู้ใช้: "วันนี้อากาศเป็นไง" -> อื่นๆ
- User: "What is the weather today?" -> Other
- ผู้ใช้: "ฉันกลัวเป็นเบาหวาน" -> สุขภาพ
- User: "I think I might have diabetes" -> Health
- ผู้ใช้: "หลังจากคุยเรื่องสุขภาพแล้ว แอพนี้ใช้ยังไง" -> แอป VONIX
- User: "How do I use this app?" -> VONIX App
- ผู้ใช้: "มันแปลกอะ" -> สุขภาพ
- User: "Something feels strange" -> Health
- ผู้ใช้: "สวัสดี" -> อื่นๆ
- User: "Hello" -> Other`

// System prompt for health advice Bilingual
const HEALTH_SYSTEM_PROMPT = `You are VONIX Assistant, a personal health assistant.
Reply in the same language as the user's last message.
If the user writes in Thai, reply in Thai.
If the user writes in English, reply in English.

คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

กฎสำคัญที่สุด:
- เมื่อตอบ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้ในประวัติการสนทนาเท่านั้น
- ห้ามทักทายซ้ำ หรือถามคำถามทั่วไปซ้ำ (เช่น "มีอะไรให้ช่วยไหมคะ/ครับ?") หากผู้ใช้ได้ระบุคำถามเฉพาะเจาะจงมาแล้ว
- หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย (เช่น "ฉันป่วย", "ไม่สบาย", "ปวดท้อง", "เวียนหัว") ให้ถามอาการเฉพาะเจาะจงเพิ่มเติมเพื่อช่วยให้คำแนะนำได้ดีขึ้น เช่น "คุณมีอาการปวดท้องแบบไหนครับ? ปวดจุกเสียด ปวดบิด หรือปวดแบบไหนครับ?" หรือ "อาการเวียนหัวเป็นแบบไหนครับ? เวียนหัวบ้านหมุน หรือเวียนหัวคลื่นไส้ครับ?"
- หากผู้ใช้บอกว่า "มันแปลกอะ" หรือคำพูดกำกวม ให้ถามกลับเพื่อขอข้อมูลเพิ่มเติมเกี่ยวกับสิ่งที่แปลกหรืออาการที่เกิดขึ้น
หน้าที่ของคุณ:
- ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์
- ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
- เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
- ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
- ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
- หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์
---
Rules in English:
- When answering, consider only the user's most recent message in the conversation.
- Do not repeat greetings or generic questions if the user has already asked something specific.
- If the user reports feeling sick or unwell (e.g., "I am sick", "stomach ache", "dizzy"), ask for more specific symptoms to give better advice. For example: "What kind of stomach pain do you have? Is it cramping, stabbing, or something else?" or "What kind of dizziness are you experiencing? Vertigo or nausea?"
- If the user says something vague like "It feels strange", ask for clarification about what feels strange.
Your role:
- Provide simple and useful health advice.
- Answer questions about common symptoms, self-care, disease prevention, and general health promotion.
- Always emphasize that your advice is not a medical diagnosis and that the user should consult a doctor or professional if symptoms are severe or persistent.
- Use polite, friendly, and encouraging English.
- Do not use bold formatting (**) or other Markdown formatting in your responses.
- If the question is too complex or requires a medical diagnosis, recommend that the user consult a doctor.`

// System prompt for "อื่นๆ", "other" intent
const OTHER_SYSTEM_PROMPT = `You are VONIX Assistant, an assistant specialized only in health and the VONIX app.
Reply in the same language as the user's last message.
If the user writes in Thai, reply in Thai.
If the user writes in English, reply in English.

คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพและการใช้งานแอปพลิเคชันเท่านั้น หากผู้ใช้ถามคำถามที่ไม่เกี่ยวข้องกับสุขภาพหรือการใช้งานแอป ให้ตอบกลับอย่างสุภาพว่าคุณเชี่ยวชาญเฉพาะสองเรื่องนี้ และแนะนำให้ผู้ใช้ถามคำถามที่เกี่ยวข้องกับสุขภาพหรือการใช้งานแอปแทน ห้ามตอบคำถามที่ไม่เกี่ยวข้องโดยตรง ห้ามทักทายซ้ำ
---
English version:
You are VONIX Assistant, an assistant focused only on health and the VONIX application.
If the user asks something unrelated to health or the app, politely reply that you specialize only in these two areas, and encourage the user to ask a health-related or app-related question instead.
Do not answer unrelated questions.
Do not repeat greetings.`

// System prompt for personalized health advice (bilingual)
const PERSONALIZED_HEALTH_SYSTEM_PROMPT = (
  userName: string,
  healthData: string,
) => `You are VONIX Assistant, a personal health assistant.
Reply in the same language as the user's last message.
If the user writes in Thai, reply in Thai.
If the user writes in English, reply in English.

คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

ข้อมูลสุขภาพล่าสุดของ ${userName} (อ้างอิงจากแบบประเมินที่ทำล่าสุด):
${healthData}
กฎสำคัญที่สุด:
- เมื่อตอบ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้ในประวัติการสนทนาเท่านั้น และใช้ข้อมูลสุขภาพที่ให้มาข้างต้นเพื่อตอบคำถามเกี่ยวกับสุขภาพของ ${userName} โดยเฉพาะ
- ห้ามทักทายซ้ำ หรือถามคำถามทั่วไปซ้ำ (เช่น "มีอะไรให้ช่วยไหมคะ/ครับ?") หากผู้ใช้ได้ระบุคำถามเฉพาะเจาะจงมาแล้ว
- หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย ให้ถามอาการเฉพาะเจาะจงเพิ่มเติม
หน้าที่ของคุณ:
- ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์ โดยอ้างอิงจากข้อมูลสุขภาพของ ${userName} ที่ให้มา
- ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
- เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
- ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
- ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
- หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์
---

English version:
You are VONIX Assistant, a personal health assistant specializing in general health, nutrition, fitness, mental health, and sleep.

Latest health data for ${userName} (based on the most recent assessment):
${healthData}
Important rules:
- When answering, only consider the user's most recent message and the health data provided above about ${userName}.
- Do not repeat greetings or generic questions (e.g., "How can I help you?") if the user has already asked something specific.
- If the user reports feeling sick or unwell, ask for more specific details about their symptoms.
Your role:
- Provide simple, useful, personalized health advice based on the health data of ${userName}.
- Answer questions about common symptoms, self-care, disease prevention, and health promotion.
- Always emphasize that your advice is not a medical diagnosis, and recommend consulting a doctor or professional if symptoms are severe or persistent.
- Use polite, friendly, encouraging English.
- Do not use bold formatting (**) or other Markdown formatting in your responses.
- If the question is too complex or requires a medical diagnosis, advise the user to consult a doctor.`

// Define critical health keywords for direct classification
const CRITICAL_HEALTH_KEYWORDS = [
  // Thai critical health keywords
  "เบาหวาน", "ความดัน", "หัวใจ", "โรคหัวใจ", "ไขมัน", "คอเลสเตอรอล", "น้ำตาลในเลือด",
  "น้ำหนัก", "โรคอ้วน", "ผอมเกินไป", "ดัชนีมวลกาย", "BMI", "ภูมิแพ้", "หอบหืด", "ปวดหัว",
  "ไมเกรน", "วิงเวียน", "บ้านหมุน", "ใจสั่น", "เหนื่อยง่าย", "อ่อนเพลีย", "นอนไม่หลับ",
  "หลับไม่สนิท", "ซึมเศร้า", "วิตกกังวล", "เครียด", "สุขภาพจิต", "อารมณ์", "ร้องไห้",
  "นอนไม่พอ", "พักผ่อนไม่พอ", "อารมณ์แปรปรวน", "หงุดหงิดง่าย", "มะเร็ง", "ปวดท้อง",
  "เวียนหัว", "ป่วย", "ไม่สบาย", "มันแปลก", "สุขภาพของฉัน", "ผลประเมินของฉัน",
  // English critical health keywords
  "diabetes", "blood pressure", "heart", "heart disease", "cholesterol", "blood sugar",
  "weight", "obesity", "overweight", "underweight", "BMI", "allergy", "asthma",
  "headache", "migraine", "dizziness", "vertigo", "palpitations", "fatigue", "tired",
  "insomnia", "sleep", "depression", "anxiety", "stress", "mental health", "mood",
  "crying", "ADHD", "concentration", "suicidal", "cancer", "period", "hormone",
  "menopause", "infertility", "chest pain", "stomach pain", "back pain", "shoulder pain",
  "joint pain", "muscle pain", "numb arm", "numb leg", "shortness of breath", "fainting",
  "infection", "fever", "diarrhea", "constipation", "indigestion", "food allergy",
  "drug allergy", "STD", "hepatitis", "osteoporosis", "vaccine", "blood test",
  "health check", "sick", "not feeling well", "hungry", "strange symptoms",
  ...getAllPHQKeywords(),
  ...getAllAUDITKeywords(),
]

// Helper function to get risk level label
const getRiskLevelLabel = (riskLevel: string): string => {
  switch (riskLevel) {
    case "low":
      return "ต่ำ"
    case "medium":
      return "ปานกลาง"
    case "high":
      return "สูง"
    case "very-high":
      return "สูงมาก"
    default:
      return "ไม่ระบุ"
  }
}

export async function POST(req: Request) {
  try {
    // Expect an array of messages, userName, and userId from the client
    const { messages: clientMessages, userName } = (await req.json()) as {
      messages: AIMessage[]
      userName?: string
      userId?: string // userId is now optional from client, will be derived from session
    }

    // Get user session from cookies on the server side
    const supabaseServerClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false, // Do not persist session on server
        },
      },
    )
    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser()
    const userId = user?.id || null

    // The last message is the current user's query
    const userMessageContent = clientMessages[clientMessages.length - 1].content.toLowerCase()

    // Prepare messages for AI SDK
    const conversationHistoryForAI = clientMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    let botResponse = "" 
    let intentCategory: z.infer<typeof IntentSchema>["category"]
    let healthDataSummary = ""
    let hasPersonalizedHealthData = false

    // --- Fetch personalized health data if user is logged in ---
    if (userId) {
      try {
        // Pass the supabase client to the service method
        const { data: latestAssessments, error: fetchError } = await AssessmentService.getLatestUserAssessments(
          supabaseServerClient, // Use the server-side client
          userId,
        )

        if (fetchError) {
          // Continue without personalized data if there's an error
        } else if (latestAssessments && latestAssessments.length > 0) {
          hasPersonalizedHealthData = true

          healthDataSummary = latestAssessments
            .map((assessment) => {
              const riskLabel = getRiskLevelLabel(assessment.risk_level)
              const factors =
                assessment.risk_factors && assessment.risk_factors.length > 0
                  ? `ปัจจัยเสี่ยง: ${assessment.risk_factors.join(", ")}`
                  : "ไม่มีปัจจัยเสี่ยงที่ระบุ"
              const recommendations =
                assessment.recommendations && assessment.recommendations.length > 0
                  ? `คำแนะนำ: ${assessment.recommendations.join(", ")}`
                  : "ไม่มีคำแนะนำเฉพาะ"

              return `
- หมวดหมู่: ${assessment.category_title} (ID: ${assessment.category_id})
  - ระดับความเสี่ยง: ${riskLabel} (${assessment.percentage}%)
  - ${factors}
  - ${recommendations}
  - ทำเมื่อ: ${new Date(assessment.completed_at).toLocaleDateString("th-TH")}
          `.trim()
            })
            .join("\n\n")

          healthDataSummary = `นี่คือข้อมูลสรุปผลการประเมินสุขภาพล่าสุดของคุณ:\n\n${healthDataSummary}\n\nโปรดใช้ข้อมูลนี้เพื่อตอบคำถามเกี่ยวกับสุขภาพของผู้ใช้`
        } else {
          healthDataSummary = "ผู้ใช้ยังไม่มีข้อมูลการประเมินสุขภาพล่าสุดในระบบ"
        }
      } catch (error) {
        healthDataSummary = "เกิดข้อผิดพลาดในการดึงข้อมูลสุขภาพ"
      }
    } else {
      healthDataSummary = "ผู้ใช้ไม่ได้ล็อกอิน จึงไม่สามารถเข้าถึงข้อมูลสุขภาพส่วนตัวได้"
    }

    // --- Direct classification for critical health keywords (Priority 1) ---
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
      // --- AI-based intent classification (Priority 2) ---
      const { object: intentClassification } = await generateObject({
        model: openai("gpt-4o"),
        system: INTENT_CLASSIFICATION_PROMPT,
        messages: conversationHistoryForAI, // Pass full history for context
        schema: IntentSchema,
      })
      intentCategory = intentClassification.category
    }
    // HERE 
    if (intentCategory === "สุขภาพ") {
      // If it's a health-related question, generate a health advice
      let systemPromptToUse = HEALTH_SYSTEM_PROMPT

      // Always use personalized health prompt if data is available
      if (hasPersonalizedHealthData) {
        systemPromptToUse = PERSONALIZED_HEALTH_SYSTEM_PROMPT(userName || "คุณ", healthDataSummary)
      } else {
        // If no data, inform them
        botResponse = `ขออภัยครับ ${userName || "คุณ"} ผมไม่พบข้อมูลการประเมินสุขภาพล่าสุดของคุณในระบบ คุณสามารถทำแบบประเมินสุขภาพเพื่อรับคำแนะนำส่วนบุคคลได้นะครับ 😊`
      }

      if (!botResponse) {
        // Only generate if botResponse hasn't been set by the "no data" case
        const { text: healthResponse } = await generateText({
          model: openai("gpt-4o"),
          system: systemPromptToUse,
          messages: conversationHistoryForAI, // Pass full history for context
        })
        botResponse = healthResponse
      }
    } else if (intentCategory === "แอป VONIX") {
      // Check PHQ-specific questions first
      const phqKnowledge = searchPHQKnowledge(userMessageContent)
      if (phqKnowledge) {
        botResponse = phqKnowledge.response.replace("{userName}", userName || "คุณ")
      } else {
        // Check AUDIT-specific questions
        const auditKnowledge = searchAUDITKnowledge(userMessageContent)
        if (auditKnowledge) {
          botResponse = auditKnowledge.response.replace("{userName}", userName || "คุณ")
        } else {
          // Implement simple RAG for general app-related questions
          let foundAppResponse = false
          for (const entry of appKnowledgeBase) {
            if (entry.keywords.some((keyword) => userMessageContent.includes(keyword))) {
              botResponse = entry.response.replace("{userName}", userName || "คุณ")
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
        }
      }
    } else {
      // If it's neither health nor app-related, use AI to provide a refusal/redirection message
      const { text: otherResponse } = await generateText({
        model: openai("gpt-4o"),
        system: OTHER_SYSTEM_PROMPT,
        messages: conversationHistoryForAI,
      })
      botResponse = otherResponse
    }

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    return NextResponse.json(
      { error: "ขอโทษครับ เกิดข้อผิดพลาดในการประมวลผลคำถามของคุณ กรุณาลองใหม่อีกครั้งนะครับ 😅" },
      { status: 500 },
    )
  }
}
