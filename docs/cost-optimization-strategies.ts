// กลยุทธ์การลดต้นทุน (Cost Optimization Strategies)

export const optimizationStrategies = [
  {
    strategy: "ใช้ GPT-4o-mini สำหรับ Chatbot",
    currentCost: 0.25, // $0.25 per user
    optimizedCost: 0.025, // $0.025 per user
    savings: 0.225, // $0.225 per user (90% reduction)
    implementation: "แทนที่ model ใน chatbot API call",
    impact: "ลดต้นทุน AI ลง 90% โดยคุณภาพลดลงเพียงเล็กน้อย",
  },

  {
    strategy: "Cache Assessment Results",
    currentCost: 0.15, // $0.15 per assessment
    optimizedCost: 0.075, // $0.075 per assessment (50% cache hit)
    savings: 0.075,
    implementation: "เก็บผลลัพธ์ของคำตอบที่เหมือนกันใน Redis",
    impact: "ลดการเรียก OpenAI API ลง 50%",
  },

  {
    strategy: "Batch Processing",
    currentCost: 0.4, // individual requests
    optimizedCost: 0.32, // batch requests (20% discount)
    savings: 0.08,
    implementation: "รวม multiple assessments ใน 1 API call",
    impact: "ลดต้นทุน token usage ผ่าน batch processing",
  },

  {
    strategy: "Smart Rate Limiting",
    currentCost: 0.4,
    optimizedCost: 0.35, // ป้องกันการใช้งานเกิน
    savings: 0.05,
    implementation: "จำกัดจำนวน API calls ต่อผู้ใช้",
    impact: "ป้องกันการใช้งานเกินจำเป็น",
  },
]

export const totalOptimizedCost = {
  originalCostPerUser: 0.4, // $0.40 per user
  optimizedCostPerUser: 0.2, // $0.20 per user (50% reduction)
  monthlySavingsAt1000Users: (0.4 - 0.2) * 1000, // $200/month
  annualSavingsAt1000Users: 200 * 12, // $2,400/year
}

console.log("🎯 Cost Optimization Results:")
console.log(`Original cost: $${totalOptimizedCost.originalCostPerUser} per user`)
console.log(`Optimized cost: $${totalOptimizedCost.optimizedCostPerUser} per user`)
console.log(`Monthly savings at 1,000 users: $${totalOptimizedCost.monthlySavingsAt1000Users}`)
console.log(`Annual savings at 1,000 users: $${totalOptimizedCost.annualSavingsAt1000Users}`)
