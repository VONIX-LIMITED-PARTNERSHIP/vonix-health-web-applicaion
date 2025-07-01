// การคำนวณต้นทุนต่อผู้ใช้ 1 คน (Cost Analysis per User)
// อัพเดท: มกราคม 2025

export interface CostBreakdown {
  service: string
  costPerMonth: number
  costPerUser: number
  usage: string
  notes: string
}

export const costAnalysis: CostBreakdown[] = [
  // 1. OpenAI API Costs
  {
    service: "OpenAI GPT-4o (Assessment Analysis)",
    costPerMonth: 0,
    costPerUser: 0.15, // ประมาณ 4.50 บาท
    usage: "5 assessments/month × ~3,000 tokens × $0.01/1K tokens",
    notes: "ผู้ใช้ทำแบบประเมิน 5 หมวด เดือนละ 1 ครั้ง",
  },
  {
    service: "OpenAI GPT-4o (Chatbot)",
    costPerMonth: 0,
    costPerUser: 0.25, // ประมาณ 7.50 บาท
    usage: "50 chat messages/month × ~1,000 tokens × $0.005/1K tokens",
    notes: "สนทนากับ AI chatbot เดือนละ 50 ข้อความ",
  },

  // 2. Database & Backend
  {
    service: "Supabase (Database + Auth)",
    costPerMonth: 25, // $25/month สำหรับ Pro plan
    costPerUser: 0.025, // ถ้ามี 1,000 users
    usage: "Unlimited API requests, 8GB database, 100GB bandwidth",
    notes: "ราคาลดลงเมื่อมีผู้ใช้มากขึ้น (economies of scale)",
  },

  // 3. Hosting & CDN
  {
    service: "Vercel Pro",
    costPerMonth: 20, // $20/month
    costPerUser: 0.02, // ถ้ามี 1,000 users
    usage: "Unlimited bandwidth, Edge functions",
    notes: "สำหรับ production deployment",
  },

  // 4. Monitoring & Analytics
  {
    service: "Error Tracking & Analytics",
    costPerMonth: 10, // Sentry + Analytics
    costPerUser: 0.01,
    usage: "Error monitoring, user analytics",
    notes: "เสริมสำหรับ production monitoring",
  },
]

// สรุปต้นทุนรวม
export const totalCostSummary = {
  // ต้นทุนคงที่ต่อเดือน (Fixed Costs)
  fixedCostsUSD: 55, // $55/month
  fixedCostsTHB: 1925, // ประมาณ 1,925 บาท/เดือน (35 บาท/$)

  // ต้นทุนผันแปรต่อผู้ใช้ (Variable Costs per User)
  variableCostPerUserUSD: 0.4, // $0.40/user/month
  variableCostPerUserTHB: 14, // ประมาณ 14 บาท/user/เดือน

  // Break-even analysis
  breakEvenUsers: 138, // ต้องมีผู้ใช้อย่างน้อย 138 คน เพื่อคุ้มต้นทุนคงที่

  // ต้นทุนรวมต่อผู้ใช้ในระดับต่างๆ
  costPerUserAt100Users: 0.95, // $0.95/user (33 บาท)
  costPerUserAt500Users: 0.51, // $0.51/user (18 บาท)
  costPerUserAt1000Users: 0.46, // $0.46/user (16 บาท)
  costPerUserAt5000Users: 0.41, // $0.41/user (14 บาท)
}

// รายละเอียดการใช้งาน OpenAI
export const openAIUsageDetails = {
  assessmentAnalysis: {
    tokensPerRequest: 3000, // input + output tokens
    requestsPerUserPerMonth: 5, // 5 assessments
    costPerRequest: 0.03, // $0.03 per request
    monthlyTokens: 15000, // 3,000 × 5
    monthlyCost: 0.15, // $0.15 per user
  },

  chatbot: {
    tokensPerMessage: 1000, // average conversation
    messagesPerUserPerMonth: 50,
    costPerMessage: 0.005, // $0.005 per message
    monthlyTokens: 50000, // 1,000 × 50
    monthlyCost: 0.25, // $0.25 per user
  },

  totalOpenAICost: 0.4, // $0.40 per user per month
}

// แนะนำการลดต้นทุน
export const costOptimizationTips = [
  "ใช้ GPT-4o-mini สำหรับ chatbot (ลดต้นทุน 90%)",
  "Cache ผลลัพธ์การวิเคราะห์ที่คล้ายกัน",
  "ใช้ Supabase Free tier จนกว่าจะมีผู้ใช้ 50,000+ คน",
  "Implement rate limiting เพื่อป้องกันการใช้งานเกิน",
  "ใช้ streaming responses เพื่อลด token usage",
  "Batch processing สำหรับการวิเคราะห์หลายๆ assessment",
]

// การคำนวณราคาขายที่แนะนำ
export const pricingRecommendation = {
  freeTier: {
    price: 0,
    assessmentsPerMonth: 2,
    chatMessagesPerMonth: 10,
    features: ["แบบประเมินพื้นฐาน", "AI chatbot จำกัด"],
  },

  basicTier: {
    priceUSD: 4.99, // $4.99/month
    priceTHB: 175, // 175 บาท/เดือน
    grossMargin: "90%", // กำไรขั้นต้น 90%
    assessmentsPerMonth: "ไม่จำกัด",
    chatMessagesPerMonth: 200,
    features: ["แบบประเมินครบทุกหมวด", "AI analysis", "ประวัติการประเมิน"],
  },

  premiumTier: {
    priceUSD: 9.99, // $9.99/month
    priceTHB: 350, // 350 บาท/เดือน
    grossMargin: "95%",
    features: ["ทุกอย่างใน Basic", "AI chatbot ไม่จำกัด", "รายงานเชิงลึก", "การแจ้งเตือน"],
  },
}

console.log("💰 VONIX Cost Analysis Summary:")
console.log(`Fixed costs: $${totalCostSummary.fixedCostsUSD}/month (${totalCostSummary.fixedCostsTHB} บาท)`)
console.log(
  `Variable cost per user: $${totalCostSummary.variableCostPerUserUSD}/month (${totalCostSummary.variableCostPerUserTHB} บาท)`,
)
console.log(`Break-even point: ${totalCostSummary.breakEvenUsers} users`)
console.log(
  `Cost per user at 1,000 users: $${totalCostSummary.costPerUserAt1000Users} (${totalCostSummary.costPerUserAt1000Users * 35} บาท)`,
)
