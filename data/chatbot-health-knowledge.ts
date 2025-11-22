export interface healthKnowledgeBase{
  keywords: string[]
  response: string
}

export const healthKnowledgeBase = [
  {
    keywords: ["cholesterol", "ไขมัน", "LDL", "ไขมันสูง"],
    response: `
High cholesterol can increase the risk of heart disease. 
To reduce it, limit fried or fatty foods, eat more vegetables, fruits, and whole grains, 
and exercise at least 30 minutes most days. 
If your levels remain high, consult a doctor for possible medication.
`
  },
  {
    keywords: ["blood pressure", "ความดัน", "ความดันสูง", "ความดันต่ำ"],
    response: `
Healthy blood pressure is generally below 120/80 mmHg. 
Reduce salt intake, maintain a healthy weight, exercise regularly, 
and avoid smoking and excessive alcohol. 
If your blood pressure stays high, you should see a doctor.
`
  },
  {
    keywords: ["stress", "depression", "anxiety", "วิตกกังวล", "ซึมเศร้า", "เครียด"],
    response: `
Mental health is as important as physical health. 
Try relaxation, exercise, mindfulness, and enough sleep. 
If negative feelings persist or interfere with daily life, please talk to a mental health professional.
`
  },
  {
    keywords: ["sleep", "นอน", "insomnia", "นอนไม่หลับ", "หลับไม่สนิท"],
    response: `
Good sleep helps recovery and focus. 
Try to sleep 7–9 hours per night, keep a regular bedtime, 
avoid caffeine after 3 p.m., and reduce screen time before bed.
`
  }
]
