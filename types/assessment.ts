// Define the AssessmentCategory type
export interface AssessmentCategory {
  id: string
  title: string
  description: string
  icon: string
  questions: AssessmentQuestion[]
  estimatedTime: number
}

// Define the AssessmentQuestion type
export interface AssessmentQuestion {
  id: string
  question: string
  type: "single" | "multiple" | "text" | "number" | "scale"
  options?: string[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

// Define the AssessmentAnswer type to allow null for answer
export interface AssessmentAnswer {
  questionId: string
  answer: string | string[] | number
  score: number
}

// Bilingual text types
export interface BilingualText {
  th: string
  en: string
}

export interface BilingualArray {
  th: string[]
  en: string[]
}

// Updated AssessmentResult interface with bilingual support
export interface AssessmentResult {
  categoryId: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: string[] | BilingualArray
  recommendations: string[] | BilingualArray
  summary?: string | BilingualText
}

// AI Analysis result type
export interface AIAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualArray
  recommendations: BilingualArray
  summary: BilingualText
}

// Guest assessment (for non-logged-in users)
export const guestAssessmentCategory: AssessmentCategory = {
  id: "guest-assessment",
  title: "ประเมินสุขภาพเบื้องต้น",
  description: "ทดลองประเมินสุขภาพเบื้องต้นเพื่อดูผลลัพธ์และคำแนะนำ",
  icon: "FlaskConical", // ใช้ชื่อ string สำหรับ icon
  estimatedTime: 5, // เพิ่มเวลาประเมินตามจำนวนคำถาม
  questions: [
    {
      id: "guest_q1",
      question: "อายุของคุณ",
      type: "number",
      description: "กรุณาระบุอายุเป็นปี",
      required: true,
      category: "guest",
      weight: 1,
    },
    {
      id: "guest_q2",
      question: "เพศ",
      type: "multiple",
      options: ["ชาย", "หญิง", "ไม่ระบุ"],
      required: true,
      category: "guest",
      weight: 1,
    },
    {
      id: "guest_q3",
      question: "น้ำหนัก (กิโลกรัม)",
      type: "number",
      description: "น้ำหนักปัจจุบันของคุณ",
      required: true,
      category: "guest",
      weight: 2,
    },
    {
      id: "guest_q4",
      question: "ส่วนสูง (เซนติเมตร)",
      type: "number",
      description: "ส่วนสูงของคุณ",
      required: true,
      category: "guest",
      weight: 2,
    },
    {
      id: "guest_q5",
      question: "โรคประจำตัว (เลือกได้หลายข้อ)",
      type: "multiple",
      options: [
        "เบาหวาน",
        "ความดันโลหิตสูง",
        "โรคหัวใจ",
        "โรคไต",
        "โรคตับ",
        "โรคปอด",
        "โรคไทรอยด์",
        "โรคกระดูกพรุน",
        "ไม่มีโรคประจำตัว",
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q6",
      question: "คุณมีประวัติโรคหัวใจในครอบครัวหรือไม่?",
      type: "yes-no",
      description: "เช่น พ่อ แม่ พี่น้อง ที่เป็นโรคหัวใจ",
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q7",
      question: "ความดันโลหิตของคุณเป็นอย่างไร?",
      type: "multiple",
      options: ["ปกติ (น้อยกว่า 120/80)", "สูงเล็กน้อย (120-139/80-89)", "สูง (140/90 ขึ้นไป)", "ไม่ทราบ"],
      required: true,
      category: "guest",
      weight: 4,
    },
    {
      id: "guest_q8",
      question: "คุณสูบบุหรี่หรือไม่?",
      type: "yes-no",
      required: true,
      category: "guest",
      weight: 4,
    },
    {
      id: "guest_q9",
      question: "คุณออกกำลังกายสม่ำเสมอแค่ไหน?",
      type: "scale",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q10",
      question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
      type: "scale",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q11",
      question: "คุณดื่มน้ำเปล่าวันละกี่แก้ว?",
      type: "multiple",
      options: ["น้อยกว่า 4 แก้ว", "4-6 แก้ว", "7-8 แก้ว", "มากกว่า 8 แก้ว"],
      required: true,
      category: "guest",
      weight: 2,
    },
    {
      id: "guest_q12",
      question: "คุณรู้สึกเครียดจากงานหรือชีวิตประจำวันแค่ไหน?",
      type: "scale",
      description: "ให้คะแนน 1-5 (1=ไม่เครียด, 5=เครียดมาก)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q13",
      question: "คุณมีปัญหาในการนอนหลับบ่อยแค่ไหน?",
      type: "scale",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q14",
      question: "คุณนอนกี่ชั่วโมงต่อคืนโดยเฉลี่ย?",
      type: "multiple",
      options: ["น้อยกว่า 5 ชั่วโมง", "5-6 ชั่วโมง", "7-8 ชั่วโมง", "9-10 ชั่วโมง", "มากกว่า 10 ชั่วโมง"],
      required: true,
      category: "guest",
      weight: 4,
    },
    {
      id: "guest_q15",
      question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นแค่ไหน?",
      type: "scale",
      description: "ให้คะแนน 1-5 (1=ไม่สดชื่น, 5=สดชื่นมาก)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
  ],
}

export const assessmentCategories: AssessmentCategory[] = [
  {
    id: "basic",
    title: "ข้อมูลส่วนตัว",
    description: "ข้อมูลสำคัญที่แพทย์ต้องการเพื่อการวินิจฉัยและรักษา",
    icon: "User",
    estimatedTime: 5,
    questions: [
      {
        id: "basic-1",
        question: "อายุของคุณ",
        type: "number",
        description: "กรุณาระบุอายุเป็นปี",
        required: true,
        category: "basic",
        weight: 1,
      },
      {
        id: "basic-2",
        question: "เพศ",
        type: "multiple",
        options: ["ชาย", "หญิง", "ไม่ระบุ"],
        required: true,
        category: "basic",
        weight: 1,
      },
      {
        id: "basic-3",
        question: "น้ำหนัก (กิโลกรัม)",
        type: "number",
        description: "น้ำหนักปัจจุบันของคุณ",
        required: true,
        category: "basic",
        weight: 2,
      },
      {
        id: "basic-4",
        question: "ส่วนสูง (เซนติเมตร)",
        type: "number",
        description: "ส่วนสูงของคุณ",
        required: true,
        category: "basic",
        weight: 2,
      },
      {
        id: "basic-5",
        question: "หมู่เลือด",
        type: "multiple",
        options: ["A", "B", "AB", "O", "ไม่ทราบ"],
        required: false,
        category: "basic",
        weight: 1,
      },
      {
        id: "basic-6",
        question: "โรคประจำตัว (เลือกได้หลายข้อ)",
        type: "multiple",
        options: [
          "เบาหวาน",
          "ความดันโลหิตสูง",
          "โรคหัวใจ",
          "โรคไต",
          "โรคตับ",
          "โรคปอด",
          "โรคไทรอยด์",
          "โรคกระดูกพรุน",
          "ไม่มีโรคประจำตัว",
        ],
        required: true,
        category: "basic",
        weight: 3,
      },
      {
        id: "basic-7",
        question: "การแพ้ยา/อาหาร (เลือกได้หลายข้อ)",
        type: "multiple",
        options: ["แพ้ยาแอสไพริน", "แพ้ยาปฏิชีวนะ", "แพ้อาหารทะเล", "แพ้นม/ผลิตภัณฑ์นม", "แพ้ไข่", "แพ้ถั่ว", "แพ้ผงชูรส", "ไม่มีการแพ้"],
        required: true,
        category: "basic",
        weight: 2,
      },
      {
        id: "basic-8",
        question: "ยาที่ใช้ประจำ",
        type: "text",
        description: 'ระบุชื่อยาและความถี่ในการใช้ (หากไม่มีให้ใส่ "ไม่มี")',
        required: true,
        category: "basic",
        weight: 2,
      },
    ],
  },
  {
    id: "heart",
    title: "ประเมินหัวใจและหลอดเลือด",
    description: "ตรวจสอบความเสี่ยงหัวใจ ความดันโลหิต และสุขภาพหลอดเลือด",
    icon: "Heart",
    estimatedTime: 8,
    questions: [
      {
        id: "heart-1",
        question: "คุณมีประวัติโรคหัวใจในครอบครัวหรือไม่?",
        type: "yes-no",
        description: "พ่อ แม่ พี่น้อง ที่เป็นโรคหัวใจ",
        required: true,
        category: "heart",
        weight: 3,
      },
      {
        id: "heart-2",
        question: "ความดันโลหิตของคุณเป็นอย่างไร?",
        type: "multiple",
        options: ["ปกติ (น้อยกว่า 120/80)", "สูงเล็กน้อย (120-139/80-89)", "สูง (140/90 ขึ้นไป)", "ไม่ทราบ"],
        required: true,
        category: "heart",
        weight: 4,
      },
      {
        id: "heart-3",
        question: "คุณรู้สึกเหนื่อยหอบเมื่อขึ้นบันได 2-3 ชั้นบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=เสมอ)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "heart",
        weight: 3,
      },
      {
        id: "heart-4",
        question: "คุณเคยรู้สึกเจ็บแน่นหน้าอกหรือไม่?",
        type: "yes-no",
        required: true,
        category: "heart",
        weight: 4,
      },
      {
        id: "heart-5",
        question: "คุณสูบบุหรี่หรือไม่?",
        type: "yes-no",
        required: true,
        category: "heart",
        weight: 4,
      },
      {
        id: "heart-6",
        question: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
        type: "multiple",
        options: ["ไม่ดื่มเลย", "นาน ๆ ครั้ง (เดือนละครั้ง)", "บางครั้ง (สัปดาห์ละครั้ง)", "บ่อย (เกือบทุกวัน)", "ทุกวัน"],
        required: true,
        category: "heart",
        weight: 3,
      },
      {
        id: "heart-7",
        question: "คุณออกกำลังกายสม่ำเสมอแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "heart",
        weight: 3,
      },
      {
        id: "heart-8",
        question: "ระดับความเครียดในชีวิตประจำวัน",
        type: "multiple",
        options: ["ต่ำมาก", "ต่ำ", "ปานกลาง", "สูง", "สูงมาก"],
        required: true,
        category: "heart",
        weight: 2,
      },
    ],
  },
  {
    id: "nutrition",
    title: "ประเมินไลฟ์สไตล์และโภชนาการ",
    description: "ตรวจสอบพฤติกรรมการกิน การออกกำลังกาย และการดูแลสุขภาพ",
    icon: "Apple",
    estimatedTime: 10,
    questions: [
      {
        id: "nutrition-1",
        question: "คุณทานข้าวกี่มื้อต่อวัน?",
        type: "multiple",
        options: ["1 มื้อ", "2 มื้อ", "3 มื้อ", "มากกว่า 3 มื้อ", "ไม่แน่นอน"],
        required: true,
        category: "nutrition",
        weight: 2,
      },
      {
        id: "nutrition-2",
        question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "nutrition",
        weight: 3,
      },
      {
        id: "nutrition-3",
        question: "คุณดื่มน้ำเปล่าวันละกี่แก้ว?",
        type: "multiple",
        options: ["น้อยกว่า 4 แก้ว", "4-6 แก้ว", "7-8 แก้ว", "มากกว่า 8 แก้ว"],
        required: true,
        category: "nutrition",
        weight: 2,
      },
      {
        id: "nutrition-4",
        question: "คุณทานอาหารหวาน ขนม เค้ก บ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "nutrition",
        weight: 3,
      },
      {
        id: "nutrition-5",
        question: "คุณทานอาหารทอด อาหารมัน บ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "nutrition",
        weight: 3,
      },
      {
        id: "nutrition-6",
        question: "คุณออกกำลังกายกี่ครั้งต่อสัปดาห์?",
        type: "multiple",
        options: ["ไม่ออกกำลังกาย", "1-2 ครั้ง", "3-4 ครั้ง", "5-6 ครั้ง", "ทุกวัน"],
        required: true,
        category: "nutrition",
        weight: 4,
      },
      {
        id: "nutrition-7",
        question: "การออกกำลังกายแต่ละครั้งใช้เวลานานเท่าไหร่?",
        type: "multiple",
        options: ["ไม่ออกกำลังกาย", "น้อยกว่า 15 นาที", "15-30 นาที", "30-60 นาที", "มากกว่า 60 นาที"],
        required: true,
        category: "nutrition",
        weight: 3,
      },
      {
        id: "nutrition-8",
        question: "ประเภทการออกกำลังกายที่คุณทำ (เลือกได้หลายข้อ)",
        type: "multiple",
        options: ["เดิน/วิ่ง", "ปั่นจักรยาน", "ว่ายน้ำ", "ยิมนาสติก/ฟิตเนส", "โยคะ", "กีฬาประเภททีม", "ไม่ออกกำลังกาย"],
        required: true,
        category: "nutrition",
        weight: 2,
      },
      {
        id: "nutrition-9",
        question: "คุณรู้สึกมีพลังงานในการทำกิจกรรมประจำวันแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่มีพลังงาน, 5=มีพลังงานมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "nutrition",
        weight: 2,
      },
    ],
  },
  {
    id: "mental",
    title: "ประเมินสุขภาพจิต",
    description: "การตรวจสุขภาพจิต ความเครียด และสุขภาพทางอารมณ์",
    icon: "Brain",
    estimatedTime: 7,
    questions: [
      {
        id: "mental-1",
        question: "ในช่วง 2 สัปดาห์ที่ผ่านมา คุณรู้สึกเศร้า ดหู่ บ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "mental",
        weight: 4,
      },
      {
        id: "mental-2",
        question: "คุณรู้สึกวิตกกังวลบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ตลอดเวลา)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "mental",
        weight: 3,
      },
      {
        id: "mental-3",
        question: "คุณมีปัญหาในการนอนหลับบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "mental",
        weight: 3,
      },
      {
        id: "mental-4",
        question: "คุณรู้สึกเครียดจากงานหรือชีวิตประจำวันแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เครียด, 5=เครียดมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "mental",
        weight: 3,
      },
      {
        id: "mental-5",
        question: "คุณรู้สึกมีความสุขในชีวิตแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่มีความสุข, 5=มีความสุขมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "mental",
        weight: 3,
      },
      {
        id: "mental-6",
        question: "คุณมีคนที่สามารถปรึกษาเมื่อมีปัญหาหรือไม่?",
        type: "yes-no",
        required: true,
        category: "mental",
        weight: 2,
      },
      {
        id: "mental-7",
        question: "คุณจัดการกับความเครียดอย่างไร?",
        type: "multiple",
        options: ["ออกกำลังกาย", "ฟังเพลง/ดูหนัง", "คุยกับเพื่อน/ครอบครัว", "ทำสมาธิ/โยคะ", "ไม่รู้วิธีจัดการ"],
        required: true,
        category: "mental",
        weight: 2,
      },
    ],
  },
  {
    id: "physical",
    title: "ประเมินสุขภาพกาย",
    description: "ตรวจสอบสุขภาพกาย ความแข็งแรง และความสามารถทางกาย",
    icon: "Dumbbell",
    estimatedTime: 6,
    questions: [
      {
        id: "physical-1",
        question: "คุณรู้สึกปวดหลังบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "physical",
        weight: 3,
      },
      {
        id: "physical-2",
        question: "คุณรู้สึกปวดข้อ หรือข้อแข็งบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "physical",
        weight: 3,
      },
      {
        id: "physical-3",
        question: "คุณสามารถเดินขึ้นบันได 3 ชั้นโดยไม่หอบเหนื่อยได้หรือไม่?",
        type: "multiple",
        options: ["ได้อย่างง่ายดาย", "ได้แต่เหนื่อยเล็กน้อย", "ได้แต่เหนื่อยมาก", "ทำไม่ได้"],
        required: true,
        category: "physical",
        weight: 3,
      },
      {
        id: "physical-4",
        question: "คุณรู้สึกว่าความแข็งแรงของกล้ามเนื้อเป็นอย่างไร?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=อ่อนแอมาก, 5=แข็งแรงมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "physical",
        weight: 2,
      },
      {
        id: "physical-5",
        question: "คุณรู้สึกว่าความยืดหยุ่นของร่างกายเป็นอย่างไร?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=แข็งมาก, 5=ยืดหยุ่นมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "physical",
        weight: 2,
      },
      {
        id: "physical-6",
        question: "คุณเคยได้รับบาดเจ็บจากการออกกำลังกายหรือไม่?",
        type: "yes-no",
        required: true,
        category: "physical",
        weight: 2,
      },
    ],
  },
  {
    id: "sleep",
    title: "ประเมินคุณภาพการนอน",
    description: "วิเคราะห์รูปแบบการนอนและคุณภาพการพักผ่อน",
    icon: "Moon",
    estimatedTime: 5,
    questions: [
      {
        id: "sleep-1",
        question: "คุณนอนกี่ชั่วโมงต่อคืนโดยเฉลี่ย?",
        type: "multiple",
        options: ["น้อยกว่า 5 ชั่วโมง", "5-6 ชั่วโมง", "7-8 ชั่วโมง", "9-10 ชั่วโมง", "มากกว่า 10 ชั่วโมง"],
        required: true,
        category: "sleep",
        weight: 4,
      },
      {
        id: "sleep-2",
        question: "คุณมีปัญหาในการเข้านอนบ่อยแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "sleep",
        weight: 3,
      },
      {
        id: "sleep-3",
        question: "คุณตื่นกลางคืนบ่อยแค่ไน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "sleep",
        weight: 3,
      },
      {
        id: "sleep-4",
        question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นแค่ไหน?",
        type: "scale",
        description: "ให้คะแนน 1-5 (1=ไม่สดชื่น, 5=สดชื่นมาก)",
        options: ["1", "2", "3", "4", "5"],
        required: true,
        category: "sleep",
        weight: 3,
      },
      {
        id: "sleep-5",
        question: "คุณกรนหรือไม่?",
        type: "yes-no",
        required: true,
        category: "sleep",
        weight: 2,
      },
      {
        id: "sleep-6",
        question: "คุณใช้อุปกรณ์อิเล็กทรอนิกส์ก่อนนอนหรือไม่?",
        type: "multiple",
        options: ["ไม่ใช้เลย", "ใช้นาน ๆ ครั้ง", "ใช้บางครั้ง", "ใช้เกือบทุกคืน", "ใช้ทุกคืน"],
        required: true,
        category: "sleep",
        weight: 2,
      },
    ],
  },
  guestAssessmentCategory,
]

// Saved assessment type
export interface SavedAssessment {
  id: string
  user_id: string
  guest_session_id?: string
  category_id: string
  category_title: string
  answers: AssessmentAnswer[]
  total_score: number
  max_score: number
  percentage: number
  risk_level: "low" | "medium" | "high" | "very-high"
  risk_factors: string[]
  recommendations: string[]
  ai_analysis?: AIAnalysisResult
  completed_at: string
  created_at: string
  updated_at: string
}
