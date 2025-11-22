import { generateText, generateObject } from "ai"
import { embed } from "ai";
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"
import { appKnowledgeBase } from "@/data/chatbot-app-knowledge"
import { healthKnowledgeBase } from "@/data/chatbot-health-knowledge"
import { AssessmentService } from "@/lib/assessment-service"
import { createClient } from "@supabase/supabase-js"

//Helper function to detect Thai text for runtime bilingual control
const isThaiText = (text: string) => /[\u0E00-\u0E7F]/.test(text)

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
const HEALTH_SYSTEM_PROMPT = `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เป็นมิตรและให้คำแนะนำด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

แนวทางการตอบ:
- ตอบโดยอิงจากข้อความล่าสุดของผู้ใช้เป็นหลัก
- ใช้ภาษาที่สุภาพ เข้าใจง่าย และเป็นกันเอง
- หากผู้ใช้พูดถึงอาการเจ็บป่วย ให้สอบถามเพิ่มเติมเพื่อช่วยให้คำแนะนำได้ดีขึ้น
- ถ้าอาการรุนแรงหรือเรื้อรัง ให้แนะนำให้พบแพทย์
- ไม่ต้องเข้มงวดกับรูปแบบหรือการจัดข้อความมากนัก ตอบให้เป็นธรรมชาติและเป็นประโยชน์ต่อผู้ใช้
- สามารถเพิ่มข้อมูลเสริมที่เกี่ยวข้อง เช่น การดูแลตนเอง หรือวิธีป้องกัน เพื่อให้คำตอบสมบูรณ์ขึ้นได้
- หากคำถามไม่ชัดเจน ให้ถามกลับอย่างสุภาพเพื่อขอข้อมูลเพิ่ม`

// Define a system prompt template that accepts context for health intent
const HEALTH_RAG_SYSTEM_PROMPT = (context: string) => `
You are VONIX Assistant, a friendly and knowledgeable health advisor.

Use the following health information as reference:
---
${context}
---

Guidelines:
- Answer naturally and clearly, using easy-to-understand language.
- Add simple, helpful details if needed (but keep factual accuracy).
- If the user asks for something not covered in the context, use your general health knowledge.
- Always remind that advice is not a medical diagnosis.
- Respond in the same language as the user.
`


// System prompt for intent classification
const INTENT_CLASSIFICATION_PROMPT = `คุณคือระบบจำแนกประเภทคำถามของผู้ใช้ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้เพื่อระบุหมวดหมู่หลัก

หมวดหมู่ที่เป็นไปได้:
- "สุขภาพ" — เกี่ยวกับอาการ, โรค, การดูแลสุขภาพ, การออกกำลังกาย, อาหาร, สุขภาพจิต
- "แอป VONIX" — เกี่ยวกับการใช้งานแอป VONIX เช่น การสมัคร, การล็อกอิน, แบบประเมิน, ผลลัพธ์, ปัญหา
- "อื่นๆ" — ไม่เกี่ยวข้องกับทั้งสองหมวดข้างต้น

ถ้าคำถามมีคำหรือบริบทเกี่ยวกับสุขภาพแม้เพียงเล็กน้อย ให้เลือก "สุขภาพ"
ถ้ามีคำที่สื่อถึงแอปหรือการใช้งาน ให้เลือก "แอป VONIX"
ถ้าไม่เข้าข่ายใดเลย ให้เลือก "อื่นๆ"
`

// System prompt for "อื่นๆ" intent
const OTHER_SYSTEM_PROMPT = `
คุณคือ VONIX Assistant ที่เชี่ยวชาญเฉพาะด้านสุขภาพและการใช้งานแอป VONIX เท่านั้น
หากผู้ใช้ถามเรื่องอื่น ให้ตอบอย่างสุภาพว่าคุณสามารถช่วยได้เฉพาะสองเรื่องนี้ และชวนให้ถามในเรื่องที่เกี่ยวข้องแทน
`

// System prompt for VONIX App usage
const APP_SYSTEM_PROMPT = `
คุณคือ VONIX Assistant ผู้เชี่ยวชาญด้านการใช้งานแอป VONIX

หน้าที่ของคุณ:
- ช่วยตอบคำถามเกี่ยวกับการใช้งานแอป VONIX เช่น การสมัครสมาชิก การเข้าสู่ระบบ การทำแบบประเมิน การดูผล หรือการแก้ปัญหา
- ใช้ภาษาที่สุภาพ เข้าใจง่าย และเป็นกันเอง
- ถ้าผู้ใช้ถามเรื่องที่ไม่เกี่ยวกับแอป ให้แนะนำให้ถามเรื่องสุขภาพหรือการใช้งานแอปแทน
`

// Define a system prompt template that accepts context
const APP_RAG_SYSTEM_PROMPT = (context: string) => `
คุณคือ VONIX Assistant ผู้เชี่ยวชาญด้านการใช้งานแอป VONIX

**ข้อมูลจากแหล่งข้อมูลของแอป VONIX:**
---
${context}
---

หน้าที่ของคุณ:
- ใช้ข้อมูลในส่วน "ข้อมูลจากแหล่งข้อมูลของแอป VONIX" เพื่อตอบคำถามของผู้ใช้
- ให้คำตอบที่สุภาพ เป็นกันเอง เข้าใจง่าย และดูเป็นธรรมชาติ (ห้ามใช้เครื่องหมายตัวหนา หรือ Markdown)
- หากข้อมูลบริบทไม่สามารถตอบคำถามได้ ให้ตอบโดยอ้างอิงจากความรู้ทั่วไปของคุณเกี่ยวกับการใช้งานแอป VONIX
- หากผู้ใช้ถามเรื่องที่ไม่เกี่ยวกับแอป ให้แนะนำให้ถามเรื่องสุขภาพหรือการใช้งานแอปแทน
`

// System prompt for personalized health advice
const PERSONALIZED_HEALTH_SYSTEM_PROMPT = (
  userName: string,
  healthData: string,
) => `คุณคือ VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวที่เชี่ยวชาญด้านสุขภาพทั่วไป โภชนาการ การออกกำลังกาย สุขภาพจิต และการนอนหลับ

**ข้อมูลสุขภาพล่าสุดของ ${userName} (อ้างอิงจากแบบประเมินที่ทำล่าสุด):**
${healthData}

**กฎสำคัญที่สุด:**
- **เมื่อตอบ ให้พิจารณาเฉพาะข้อความล่าสุดของผู้ใช้ในประวัติการสนทนาเท่านั้น และใช้ข้อมูลสุขภาพที่ให้มาข้างต้นเพื่อตอบคำถามเกี่ยวกับสุขภาพของ ${userName} โดยเฉพาะ**
- **ห้ามทักทายซ้ำ หรือถามคำถามทั่วไปซ้ำ (เช่น "มีอะไรให้ช่วยไหมคะ/ครับ?") หากผู้ใช้ได้ระบุคำถามเฉพาะเจาะจงมาแล้ว**
- **หากผู้ใช้แจ้งอาการป่วยหรือความไม่สบาย ให้ถามอาการเฉพาะเจาะจงเพิ่มเติม**

หน้าที่ของคุณ:
- ให้ข้อมูลและคำแนะนำด้านสุขภาพเบื้องต้นที่เข้าใจง่ายและเป็นประโยชน์ โดยอ้างอิงจากข้อมูลสุขภาพของ ${userName} ที่ให้มา
- ตอบคำถามเกี่ยวกับอาการทั่วไป, การดูแลตัวเอง, การป้องกันโรค, และการส่งเสริมสุขภาพ
- เน้นย้ำเสมอว่าคำแนะนำของคุณไม่ใช่การวินิจฉัยทางการแพทย์ และควรปรึกษาแพทย์หรือผู้เชี่ยวชาญหากมีอาการรุนแรงหรือเรื้อรัง
- ใช้ภาษาไทยที่เป็นกันเอง สุภาพ และให้กำลังใจ
- ห้ามใช้เครื่องหมายตัวหนา (เช่น **) หรือการจัดรูปแบบ Markdown อื่นๆ ในข้อความตอบกลับของคุณ
- หากคำถามซับซ้อนเกินกว่าความสามารถของคุณ หรือเป็นเรื่องที่ต้องวินิจฉัยโดยแพทย์ ให้แนะนำให้ผู้ใช้ปรึกษาแพทย์
`

// Define critical health keywords for direct classification
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
  "ป่วย",
  "ไม่สบาย",
  "หิว",
  "ปวดท้อง",
  "เวียนหัว",
  "แปลก",
  "สุขภาพของฉัน",
  "ผลประเมินของฉัน",
  "สุขภาพเป็นยังไง",
  "ข้อมูลสุขภาพ",
  "ประเมินสุขภาพ",
  "สรุปสุขภาพ",
  "สุขภาพฉัน",
  "สุขภาพเป็นอย่างไร",
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

/* =============================
   Semantic RAG utilities added
   ============================= */

// How many top matches to include in context
const RAG_TOP_K = 3

// In-memory caches for embeddings to avoid repeated calls
let healthKBEmbeddingsCache: {
  id: string
  text: string
  keywords: string[]
  vector: number[]
}[] | null = null

let appKBEmbeddingsCache: {
  id: string
  text: string
  keywords: string[]
  vector: number[]
}[] | null = null

// Generate embeddings for a single text using OpenAI embeddings model
async function embedText(text: string): Promise<number[]> {
  const res = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text, // <- correct property
  });

  return res.embedding; // <- correct property
}


// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Precompute or load health KB embeddings (lazy)
async function loadHealthKBEmbeddings() {
  if (healthKBEmbeddingsCache) return healthKBEmbeddingsCache

  const items = healthKnowledgeBase.map((entry, idx) => ({
    id: `health-${idx}`, 
    text: entry.response,
    keywords: entry.keywords ?? [],
  }))

  // Compute embeddings in parallel with Promise.all
  const vectorPromises = items.map((it) => embedText(it.text))
  const vectors = await Promise.all(vectorPromises)

  healthKBEmbeddingsCache = items.map((it, i) => ({
    id: it.id,
    text: it.text,
    keywords: it.keywords,
    vector: vectors[i],
  }))

  return healthKBEmbeddingsCache
}

// Precompute or load app KB embeddings (lazy)
async function loadAppKBEmbeddings() {
  if (appKBEmbeddingsCache) return appKBEmbeddingsCache

  const items = appKnowledgeBase.map((entry, idx) => ({
     id:`app-${idx}`,
    text: entry.response.replace("{userName}", "{userName}"), // keep placeholder
    keywords: entry.keywords ?? [],
  }))

  const vectorPromises = items.map((it) => embedText(it.text))
  const vectors = await Promise.all(vectorPromises)

  appKBEmbeddingsCache = items.map((it, i) => ({
    id: it.id,
    text: it.text,
    keywords: it.keywords,
    vector: vectors[i],
  }))

  return appKBEmbeddingsCache
}

// Semantic retrieve top-k for health KB
async function semanticRetrieveHealth(query: string, topK = RAG_TOP_K) {
  try {
    const kb = await loadHealthKBEmbeddings()
    const qVec = await embedText(query)
    const scored = kb.map((entry) => ({
      ...entry,
      score: cosineSimilarity(qVec, entry.vector),
    }))
    const top = scored.sort((a, b) => b.score - a.score).slice(0, topK)
    return top
  } catch (err) {
    // If anything fails, return empty array and let caller fallback to keyword logic
    return []
  }
}

// Semantic retrieve top-k for app KB
async function semanticRetrieveApp(query: string, topK = RAG_TOP_K) {
  try {
    const kb = await loadAppKBEmbeddings()
    const qVec = await embedText(query)
    const scored = kb.map((entry) => ({
      ...entry,
      score: cosineSimilarity(qVec, entry.vector),
    }))
    const top = scored.sort((a, b) => b.score - a.score).slice(0, topK)
    return top
  } catch (err) {
    return []
  }
}

// Helper to assemble context from matches (limit total length)
function buildContextFromMatches(matches: { text: string; score: number }[], maxChars = 3000) {
  // Join top matches with separators and optionally include score for debugging
  const sep = "\n\n---\n\n"
  let context = ""
  for (const m of matches) {
    const chunk = `${m.text.trim()}`
    if (context.length + sep.length + chunk.length > maxChars) {
      break
    }
    if (context.length > 0) context += sep
    context += chunk
  }
  return context
}

/* =============================
  End semantic RAG utilities
============================= */

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
    const userMessageContentLower = userMessageContent.toLowerCase()

    // Determine the user's input language and set a hint for the AI
    const userMessage = clientMessages[clientMessages.length - 1].content
    const isThai = isThaiText(userMessage)
    // The language hint will be appended to the system prompt
    const languageHint = isThai ? "ตอบกลับเป็นภาษาไทย" : "Respond in English."

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
              - ทำเมื่อ: ${new Date(assessment.completed_at).toLocaleDateString("th-TH")}`.trim()
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

    // --- NEW ADDITION: Direct classification for app keywords (Priority 0) ---
    // This ensures app-related keywords are detected BEFORE GPT classification,
    // so the bot responds immediately with predefined text.
    const isAppKeyword = appKnowledgeBase.some((entry) =>
      entry.keywords.some((keyword) =>
        userMessageContent.includes(keyword.toLowerCase()),
      ),
    )

    if (isAppKeyword) {
      intentCategory = "แอป VONIX"
    } else {
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
          messages: conversationHistoryForAI,
          schema: IntentSchema,
        })
        intentCategory = intentClassification.category
      }
    }

    /* ===============================
       Intent: สุขภาพ (Health) - semantic RAG
       =============================== */
    if (intentCategory === "สุขภาพ") {
      // --- 1. Define sub-intents (for personalized status queries) ---
      const HEALTH_SUB_INTENTS = {
        PERSONAL_STATUS: [
          "my health", "สุขภาพของฉัน", "ผลประเมิน", "ประเมินสุขภาพ",
          "สุขภาพเป็นยังไง", "health condition", "summary", "สรุปสุขภาพ"
        ]
      }
      let isPersonalStatusQuery = HEALTH_SUB_INTENTS.PERSONAL_STATUS.some(keyword =>
        userMessageContentLower.includes(keyword.toLowerCase())
      )
      const defaultUserName = isThai ? "คุณ" : "you"

      // --- 2. Handle case: user asks for their personal health status ---
      if (isPersonalStatusQuery && !hasPersonalizedHealthData) {
        // No personalized data found → tell user
        botResponse = isThai
          ? `ขออภัยครับ ${userName || "คุณ"} ผมไม่พบข้อมูลการประเมินสุขภาพล่าสุดของคุณในระบบ คุณสามารถทำแบบประเมินสุขภาพเพื่อรับคำแนะนำส่วนบุคคลได้นะครับ 😊`
          : `Sorry ${userName || "you"}, I couldn’t find your latest health assessment in the system. Please complete a health assessment for personalized advice. 😊`
      } else {
        // --- 3. Semantic RAG Retrieval for Health Knowledge Base ---
        // Try semantic retrieval first (embedding-based). If it fails, fallback to keyword as before.
        let semanticMatches = await semanticRetrieveHealth(userMessageContent, RAG_TOP_K)

        // If semantic retrieval failed or returned nothing, fallback to previous keyword matching
        if (!semanticMatches || semanticMatches.length === 0) {
          // fallback: original keyword match (first match)
          let matchedHealthEntry = null
          for (const entry of healthKnowledgeBase) {
            if (entry.keywords.some(keyword =>
              userMessageContentLower.includes(keyword.toLowerCase())
            )) {
              matchedHealthEntry = entry
              break
            }
          }
          if (matchedHealthEntry) {
            semanticMatches = [{ id: "fallback", text: matchedHealthEntry.response, keywords: matchedHealthEntry.keywords ?? [], vector: [], score: 1 }]
          } else {
            semanticMatches = []
          }
        }

        // --- 4. Choose system prompt dynamically ---
        let systemPromptToUse: string
        if (semanticMatches && semanticMatches.length > 0) {
          // Build a combined context from top-N semantic matches
          const context = buildContextFromMatches(semanticMatches.map(m => ({ text: m.text, score: m.score })))
          systemPromptToUse = HEALTH_RAG_SYSTEM_PROMPT(context)
        } else if (hasPersonalizedHealthData) {
          // Use personalized data if available
          systemPromptToUse = PERSONALIZED_HEALTH_SYSTEM_PROMPT(
            userName || defaultUserName,
            healthDataSummary
          )
        } else {
          // Fallback to general health advice
          systemPromptToUse = HEALTH_SYSTEM_PROMPT + "\n\n" +
            (isThai
              ? `หมายเหตุ: ผู้ใช้นี้ยังไม่มีข้อมูลการประเมินสุขภาพในระบบ โปรดให้คำแนะนำทั่วไปแทน`
              : `Note: This user does not have a health assessment on record. Provide general advice instead.`)
        }

        // --- 5. Generate the response ---
        if (!botResponse) {
          const { text: healthResponse } = await generateText({
            model: openai("gpt-4o"),
            system: `${systemPromptToUse}\n\n${languageHint}`,
            messages: conversationHistoryForAI,
          })
          botResponse = healthResponse
        }
      }
    }
    /* ===============================
       Intent: แอป VONIX (App) - semantic RAG
       =============================== */
      else if (intentCategory === "แอป VONIX") {
      // Attempt semantic retrieval from the app KB (top K)
      let semanticAppMatches = await semanticRetrieveApp(userMessageContent, RAG_TOP_K)

      // Fallback to keyword-based match if semantic retrieval fails or returns empty
      if (!semanticAppMatches || semanticAppMatches.length === 0) {
        let matchedEntry = null
        for (const entry of appKnowledgeBase) {
          if (entry.keywords.some((keyword) => userMessageContentLower.includes(keyword.toLowerCase()))) {
            matchedEntry = entry
            break
          }
        }
        if (matchedEntry) {
          semanticAppMatches = [{ id: "fallback", text: matchedEntry.response.replace("{userName}", userName || (isThai ? "คุณ" : "you")), keywords: matchedEntry.keywords ?? [], vector: [], score: 1 }]
        } else {
          semanticAppMatches = []
        }
      }

      if (semanticAppMatches && semanticAppMatches.length > 0) {
        // Replace placeholder if present in each chunk
        const context = buildContextFromMatches(semanticAppMatches.map(m => ({ text: m.text.replace("{userName}", userName || (isThai ? "คุณ" : "you")), score: m.score })))
        const systemPromptToUse = APP_RAG_SYSTEM_PROMPT(context)

        const { text: appRelatedResponse } = await generateText({
          model: openai("gpt-4o"),
          system: `${systemPromptToUse}\n\n${languageHint}`,
          messages: conversationHistoryForAI,
        })
        botResponse = appRelatedResponse
      } else {
        // No matches — fallback to generic app prompt
        const systemPromptToUse = `${APP_SYSTEM_PROMPT}\n\n${languageHint}`

        const { text: appRelatedResponse } = await generateText({
          model: openai("gpt-4o"),
          system: systemPromptToUse,
          messages: conversationHistoryForAI,
        })
        botResponse = appRelatedResponse
      }
    }
    /* ===============================
       Intent: อื่นๆ (Other) 
       =============================== */
      else {
        // --- NEW HANDLING FOR "อื่นๆ" INTENT (Option 3: smart friendly redirection) ---
        const defaultUserName = isThai ? "คุณ" : "you"
        // Static polite redirection message
        if (isThai) {
          botResponse = `ขออภัยนะครับ ${userName || defaultUserName} ตอนนี้ผมสามารถช่วยตอบคำถามที่เกี่ยวกับสุขภาพหรือการใช้งานแอป VONIX ได้เท่านั้นนะครับ คุณอยากให้ช่วยเรื่องไหนดีครับ? 😊`
        } else {
          botResponse = `Sorry ${userName || defaultUserName}, I can currently assist with health-related topics or VONIX app usage only. What would you like help with? 😊`
        }

        //GPT polish (keeps friendly tone)
        const { text: refinedOtherResponse } = await generateText({
          model: openai("gpt-4o"),
          system: `${OTHER_SYSTEM_PROMPT}\n\n${languageHint}`,
          messages: [
            ...conversationHistoryForAI,
            { role: "assistant", content: botResponse },
          ],
        })
        botResponse = refinedOtherResponse
    }
    return NextResponse.json({ response: botResponse })  
  } catch (error) {
    return NextResponse.json(
      { error: "ขอโทษครับ เกิดข้อผิดพลาดในการประมวลผลคำถามของคุณ กรุณาลองใหม่อีกครั้งนะครับ 😅" },
      { status: 500 },
    )
  }
}