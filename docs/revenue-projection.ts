// การคาดการณ์รายได้และกำไร (Revenue & Profit Projection)

export interface RevenueScenario {
  users: number
  monthlyRevenue: number
  monthlyCosts: number
  monthlyProfit: number
  profitMargin: string
  annualRevenue: number
  annualProfit: number
}

export const revenueProjections: RevenueScenario[] = [
  {
    users: 100,
    monthlyRevenue: 100 * 4.99, // $499
    monthlyCosts: 55 + 100 * 0.4, // $95
    monthlyProfit: 499 - 95, // $404
    profitMargin: "81%",
    annualRevenue: 499 * 12, // $5,988
    annualProfit: 404 * 12, // $4,848
  },
  {
    users: 500,
    monthlyRevenue: 500 * 4.99, // $2,495
    monthlyCosts: 55 + 500 * 0.4, // $255
    monthlyProfit: 2495 - 255, // $2,240
    profitMargin: "90%",
    annualRevenue: 2495 * 12, // $29,940
    annualProfit: 2240 * 12, // $26,880
  },
  {
    users: 1000,
    monthlyRevenue: 1000 * 4.99, // $4,990
    monthlyCosts: 55 + 1000 * 0.4, // $455
    monthlyProfit: 4990 - 455, // $4,535
    profitMargin: "91%",
    annualRevenue: 4990 * 12, // $59,880
    annualProfit: 4535 * 12, // $54,420
  },
  {
    users: 5000,
    monthlyRevenue: 5000 * 4.99, // $24,950
    monthlyCosts: 55 + 5000 * 0.4, // $2,055
    monthlyProfit: 24950 - 2055, // $22,895
    profitMargin: "92%",
    annualRevenue: 24950 * 12, // $299,400
    annualProfit: 22895 * 12, // $274,740
  },
]

// การวิเคราะห์ Customer Lifetime Value (CLV)
export const customerAnalysis = {
  averageChurnRate: 0.05, // 5% ต่อเดือน
  averageLifetimeMonths: 20, // 1/0.05 = 20 เดือน
  customerLifetimeValue: 4.99 * 20, // $99.80
  customerAcquisitionCost: 15, // $15 (marketing cost)
  netCustomerValue: 99.8 - 15, // $84.80
  paybackPeriod: 3, // เดือน (15/4.99 = 3 เดือน)
}

console.log("📈 Revenue Projections:")
revenueProjections.forEach((scenario) => {
  console.log(
    `${scenario.users} users: $${scenario.monthlyRevenue}/month revenue, $${scenario.monthlyProfit}/month profit (${scenario.profitMargin} margin)`,
  )
})
