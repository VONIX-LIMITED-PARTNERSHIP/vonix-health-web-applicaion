import type { LucideIcon as IconNode } from "lucide-react"

// Define the AssessmentCategory type
export type AssessmentCategory = {
  id: string
  title: string
  description: string
  icon: string
  required: boolean
  guest?: boolean
  estimatedTime: number
  questions: AssessmentQuestion[]
}

// Define the AssessmentQuestion type
export type AssessmentQuestion = {
  id: string
  type: string
  question: string
  options?: { value: string; label: string; score?: number }[]
  required: boolean
  category: string
  weight: number
  description?: string
  riskFactors?: string[]
}

// Define the AssessmentAnswer type
export type AssessmentAnswer = {
  questionId: string
  answer: string | number | string[] | null
  score: number
}

export interface AssessmentResult {
  categoryId: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  recommendations: string[]
  riskFactors: string[]
}

export type RiskLevel = "low" | "medium" | "high" | "very-high" | "unknown"

export interface Question {
  id: string
  question: string
  type:
    | "single-choice"
    | "multi-choice"
    | "number"
    | "text"
    | "date"
    | "rating"
    | "radio"
    | "yes-no"
    | "multiple-choice"
    | "multi-select-combobox-with-other"
  options?: { value: string; label: string; score?: number }[]
  unit?: string
  min?: number
  max?: number
  placeholder?: string
  required?: boolean
  category: string
  weight: number
  description?: string
  riskFactors?: string[]
}

export interface Answer {
  questionId: string
  value: string | string[] | number | Date
  score: number
}

export interface AssessmentResultOld {
  id: string
  userId?: string
  guestId?: string
  category: string
  score: number
  percentage: number
  riskLevel: RiskLevel
  riskFactors: string[]
  recommendations: string[]
  completedAt: string
  answers: Answer[]
  aiAnalysis?: AIAnalysisResult | null
}

export interface DashboardStats {
  totalAssessments: number
  lastAssessmentDate: string | null
  riskLevels: {
    [key in string]?: RiskLevel
  }
  overallRisk: RiskLevel | ""
  recommendations: string[]
}

export interface AssessmentCategoryInfo {
  id: string
  title: string
  description: string
  icon: IconNode
  required: boolean
  gradient: string
  bgGradient: string
  darkBgGradient: string
}

export interface AIAnalysisResult {
  score: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: BilingualArray
  recommendations: BilingualArray
  summary: BilingualString
}

export interface BilingualString {
  th: string
  en: string
}

export interface BilingualArray {
  th: string[]
  en: string[]
}

export interface UserAssessment {
  id: string
  user_id: string
  category_id: string
  category_title: string
  answers: Answer[]
  total_score: number
  max_score: number
  percentage: number
  risk_level: "low" | "medium" | "high" | "very-high"
  risk_factors: string[]
  recommendations: string[]
  completed_at: string
  ai_analysis?: AIAnalysisResult | null
}

// Guest assessment category
export const guestAssessmentCategory: AssessmentCategory = {
  id: "guest-assessment",
  title: "ประเมินสุขภาพเบื้องต้น",
  description: "ทดลองประเมินสุขภาพเบื้องต้นเพื่อดูผลลัพธ์และคำแนะนำ",
  icon: "FlaskConical",
  required: false,
  guest: true,
  estimatedTime: 5,
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
      type: "multiple-choice",
      options: [
        { value: "male", label: "ชาย" },
        { value: "female", label: "หญิง" },
        { value: "not_specified", label: "ไม่ระบุ" },
      ],
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
      type: "multi-select-combobox-with-other",
      options: [
        { value: "เบาหวาน", label: "เบาหวาน" },
        { value: "ความดันโลหิตสูง", label: "ความดันโลหิตสูง" },
        { value: "โรคหัวใจ", label: "โรคหัวใจ" },
        { value: "โรคไต", label: "โรคไต" },
        { value: "โรคตับ", label: "โรคตับ" },
        { value: "โรคปอด", label: "โรคปอด" },
        { value: "โรคไทรอยด์", label: "โรคไทรอยด์" },
        { value: "โรคกระดูกพรุน", label: "โรคกระดูกพรุน" },
        { value: "ไม่มีโรคประจำตัว", label: "ไม่มีโรคประจำตัว" },
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
      options: [
        { value: "yes", label: "ใช่" },
        { value: "no", label: "ไม่ใช่" },
      ],
    },
    {
      id: "guest_q7",
      question: "ความดันโลหิตของคุณเป็นอย่างไร?",
      type: "multiple-choice",
      options: [
        { value: "normal", label: "ปกติ (น้อยกว่า 120/80)" },
        { value: "slightly_high", label: "สูงเล็กน้อย (120-139/80-89)" },
        { value: "high", label: "สูง (140/90 ขึ้นไป)" },
        { value: "unknown", label: "ไม่ทราบ" },
      ],
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
      options: [
        { value: "yes", label: "ใช่" },
        { value: "no", label: "ไม่ใช่" },
      ],
    },
    {
      id: "guest_q9",
      question: "คุณออกกำลังกายสม่ำเสมอแค่ไหน?",
      type: "rating",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q10",
      question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
      type: "rating",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q11",
      question: "คุณดื่มน้ำเปล่าวันละกี่แก้ว?",
      type: "multiple-choice",
      options: [
        { value: "less_than_4", label: "น้อยกว่า 4 แก้ว" },
        { value: "4_to_6", label: "4-6 แก้ว" },
        { value: "7_to_8", label: "7-8 แก้ว" },
        { value: "more_than_8", label: "มากกว่า 8 แก้ว" },
      ],
      required: true,
      category: "guest",
      weight: 2,
    },
    {
      id: "guest_q12",
      question: "คุณรู้สึกเครียดจากงานหรือชีวิตประจำวันแค่ไหน?",
      type: "rating",
      description: "ให้คะแนน 1-5 (1=ไม่เครียด, 5=เครียดมาก)",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q13",
      question: "คุณมีปัญหาในการนอนหลับบ่อยแค่ไหน?",
      type: "rating",
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q14",
      question: "คุณนอนกี่ชั่วโมงต่อคืนโดยเฉลี่ย?",
      type: "multiple-choice",
      options: [
        { value: "less_than_5", label: "น้อยกว่า 5 ชั่วโมง" },
        { value: "5_to_6", label: "5-6 ชั่วโมง" },
        { value: "7_to_8", label: "7-8 ชั่วโมง" },
        { value: "9_to_10", label: "9-10 ชั่วโมง" },
        { value: "more_than_10", label: "มากกว่า 10 ชั่วโมง" },
      ],
      required: true,
      category: "guest",
      weight: 4,
    },
    {
      id: "guest_q15",
      question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นแค่ไหน?",
      type: "rating",
      description: "ให้คะแนน 1-5 (1=ไม่สดชื่น, 5=สดชื่นมาก)",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      required: true,
      category: "guest",
      weight: 3,
    },
  ],
}

// Multilingual assessment data
export const assessmentData = {
  th: {
    categories: [
      {
        id: "basic",
        title: "ข้อมูลส่วนตัว",
        description: "ข้อมูลสำคัญที่แพทย์ต้องการเพื่อการวินิจฉัยและรักษา เป็นข้อมูลพื้นฐานที่ผู้ใช้จะต้องกรอก",
        icon: "User",
        required: true,
        estimatedTime: 5,
        questions: [
          {
            id: "basic-1",
            type: "number",
            question: "อายุของคุณ",
            description: "กรุณาระบุอายุเป็นปี",
            required: true,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-2",
            type: "multiple-choice",
            question: "เพศ",
            options: [
              { value: "male", label: "ชาย" },
              { value: "female", label: "หญิง" },
              { value: "not_specified", label: "ไม่ระบุ" },
            ],
            required: true,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-3",
            type: "number",
            question: "น้ำหนัก (กิโลกรัม)",
            description: "น้ำหนักปัจจุบันของคุณ",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-4",
            type: "number",
            question: "ส่วนสูง (เซนติเมตร)",
            description: "ส่วนสูงของคุณ",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-5",
            type: "multiple-choice",
            question: "หมู่เลือด",
            options: [
              { value: "A", label: "A" },
              { value: "B", label: "B" },
              { value: "AB", label: "AB" },
              { value: "O", label: "O" },
              { value: "unknown", label: "ไม่ทราบ" },
            ],
            required: false,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-6",
            type: "multi-select-combobox-with-other",
            question: "โรคประจำตัว (เลือกได้หลายข้อ)",
            options: [
              { value: "diabetes", label: "เบาหวาน" },
              { value: "hypertension", label: "ความดันโลหิตสูง" },
              { value: "hyperlipidemia", label: "ไขมันในเลือดสูง" },
              { value: "heart_disease", label: "โรคหัวใจ" },
              { value: "stroke", label: "โรคหลอดเลือดสมอง (เคยอัมพฤกษ์/อัมพาต)" },
              { value: "asthma", label: "โรคหอบหืด / ถุงลมโป่งพอง" },
              { value: "kidney_disease", label: "โรคไตเรื้อรัง" },
              { value: "liver_disease", label: "โรคตับเรื้อรัง" },
              { value: "thyroid", label: "โรคไทรอยด์ (เป็นพิษ/ขาด)" },
              { value: "allergy", label: "โรคภูมิแพ้" },
              { value: "autoimmune", label: "โรคแพ้ภูมิตนเอง (SLE, Sjogren's)" },
              { value: "epilepsy", label: "โรคลมชัก / ชักเกร็ง" },
              { value: "dementia", label: "โรคสมองเสื่อม / อัลไซเมอร์" },
              { value: "cancer", label: "โรคมะเร็ง (ระบุชนิด)" },
              { value: "hiv", label: "HIV / ภูมิคุ้มกันบกพร่อง" },
              { value: "knee_arthritis", label: "โรคข้อเข่าเสื่อม" },
              { value: "rheumatoid", label: "โรครูมาตอยด์" },
              { value: "gout", label: "โรคเกาต์" },
              { value: "osteoporosis", label: "โรคกระดูกพรุน" },
              { value: "eye_disease", label: "โรคตา (ต้อหิน, ต้อกระจก)" },
              { value: "none", label: "ไม่มีโรคประจำตัว" },
            ],
            required: true,
            category: "basic",
            weight: 3,
            riskFactors: ["เบาหวาน", "ความดันโลหิตสูง", "โรคหัวใจ"],
          },
          {
            id: "basic-7",
            type: "multi-select-combobox-with-other",
            question: "การแพ้ยา/อาหาร (เลือกได้หลายข้อ)",
            options: [
              { value: "aspirin_allergy", label: "แพ้ยาแอสไพริน" },
              { value: "antibiotic_allergy", label: "แพ้ยาปฏิชีวนะ" },
              { value: "seafood_allergy", label: "แพ้อาหารทะเล" },
              { value: "dairy_allergy", label: "แพ้นม/ผลิตภัณฑ์นม" },
              { value: "egg_allergy", label: "แพ้ไข่" },
              { value: "nut_allergy", label: "แพ้ถั่ว" },
              { value: "msg_allergy", label: "แพ้ผงชูรส" },
              { value: "no_allergy", label: "ไม่มีการแพ้" },
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-8",
            type: "multi-select-combobox-with-other",
            question: "ยาที่ใช้ประจำ",
            description: "เลือกประเภทของยาที่ใช้ประจำ หรือระบุอื่นๆ",
            options: [
              { value: "antihypertensive", label: "ยาลดความดันโลหิต" },
              { value: "antidiabetic", label: "ยาลดระดับน้ำตาลในเลือด (เบาหวาน)" },
              { value: "antilipidemic", label: "ยาลดไขมันในเลือด" },
              { value: "antiplatelet", label: "ยาป้องกันเลือดแข็งตัว / ยาต้านเกล็ดเลือด (เช่น Aspirin)" },
              { value: "heart_medication", label: "ยารักษาโรคหัวใจ (เช่น ยาเบต้า บล็อกเกอร์, ยาขยายหลอดเลือด)" },
              { value: "insulin", label: "ยาฉีดอินซูลิน" },
              { value: "asthma_medication", label: "ยารักษาโรคหอบหืด / ถุงลมโป่งพอง (เช่น ยาพ่นขยายหลอดลม)" },
              { value: "antihistamine", label: "ยาแก้แพ้ (ยาแก้คัดจมูก ผื่น ผิวหนัง)" },
              { value: "antacid", label: "ยาลดกรด / ยาโรคกระเพาะ" },
              { value: "psychiatric_medication", label: "ยาจิตเวช / ยานอนหลับ / ยากล่อมประสาท" },
              { value: "nsaid", label: "ยาแก้ปวดเรื้อรัง / ยาต้านการอักเสบ (NSAIDs)" },
              { value: "antibiotic", label: "ยาปฏิชีวนะ" },
              { value: "hormone", label: "ยาคุมกำเนิด / ฮอร์โมน" },
              { value: "vitamin", label: "วิตามินและอาหารเสริม (เช่น วิตามินดี, แคลเซียม, น้ำมันปลา)" },
              { value: "none", label: "ไม่มี" },
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
        ],
      },
      {
        id: "heart",
        title: "ประเมินหัวใจและหลอดเลือด",
        description: "ตรวจสอบความเสี่ยงโรคหัวใจ ความดันโลหิต และสุขภาพหลอดเลือดโดยรวม",
        icon: "Heart",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "heart-1",
            type: "yes-no",
            question: "คุณมีประวัติโรคหัวใจในครอบครัวหรือไม่?",
            description: "เช่น พ่อแม่หรือพี่น้องมีโรคหัวใจ",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่ใช่" },
            ],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["ประวัติครอบครัว"],
          },
          {
            id: "heart-2",
            type: "multiple-choice",
            question: "ความดันโลหิตของคุณอยู่ในระดับใด?",
            options: [
              { value: "normal", label: "ปกติ (<120/80)" },
              { value: "slightly_high", label: "สูงเล็กน้อย (120–139/80–89)" },
              { value: "high", label: "สูง (140/90 หรือมากกว่า)" },
              { value: "uncertain", label: "ไม่แน่ใจ" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["ความดันโลหิตสูง"],
          },
          {
            id: "heart-3",
            type: "rating",
            question: "คุณเหนื่อยหอบบ่อยแค่ไหนเมื่อต้องขึ้นบันได 2-3 ชั้น?",
            description: "ให้คะแนน 1-5 (1 = ไม่เคย, 5 = เสมอ)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-4",
            type: "yes-no",
            question: "คุณเคยรู้สึกเจ็บหรือแน่นหน้าอกหรือไม่?",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่ใช่" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["อาการเจ็บหน้าอก"],
          },
          {
            id: "heart-5",
            type: "yes-no",
            question: "คุณสูบบุหรี่หรือไม่?",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่ใช่" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["การสูบบุหรี่"],
          },
        ],
      },
      {
        id: "nutrition",
        title: "ประเมินไลฟ์สไตล์และโภชนาการ",
        description: "ตรวจสอบพฤติกรรมการกิน การออกกำลังกาย และการดูแลสุขภาพ",
        icon: "Apple",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "nutrition-1",
            type: "multiple-choice",
            question: "คุณทานข้าวกี่มื้อต่อวัน?",
            options: [
              { value: "1_meal", label: "1 มื้อ" },
              { value: "2_meals", label: "2 มื้อ" },
              { value: "3_meals", label: "3 มื้อ" },
              { value: "more_than_3_meals", label: "มากกว่า 3 มื้อ" },
              { value: "uncertain", label: "ไม่แน่นอน" },
            ],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-2",
            type: "rating",
            question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "nutrition",
            weight: 3,
          },
        ],
      },
      {
        id: "mental",
        title: "ประเมินสุขภาพจิต",
        description: "การตรวจสุขภาพจิต ความเครียด และสุขภาพทางอารมณ์",
        icon: "Brain",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "mental-1",
            type: "rating",
            question: "ในช่วง 2 สัปดาห์ที่ผ่านมา คุณรู้สึกเบื่อ หรือไม่มีความสนใจในสิ่งที่เคยชอบบ่อยแค่ไหน?",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "mental",
            weight: 4,
            riskFactors: ["ซึมเศร้า"],
          },
        ],
      },
      {
        id: "physical",
        title: "ประเมินสุขภาพกาย",
        description: "ตรวจสอบสุขภาพกาย ความแข็งแรง และความสามารถทางกายภาพ",
        icon: "Dumbbell",
        required: false,
        estimatedTime: 12,
        questions: [
          {
            id: "physical-1",
            type: "rating",
            question: "คุณรู้สึกปวดหลังบ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["ปวดหลังเรื้อรัง"],
          },
        ],
      },
      {
        id: "sleep",
        title: "ประเมินคุณภาพการนอน",
        description: "วิเคราะห์รูปแบบการนอนและคุณภาพการพักผ่อน",
        icon: "Moon",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "sleep-1",
            type: "multiple-choice",
            question: "คุณนอนกี่ชั่วโมงต่อคืนโดยเฉลี่ย?",
            options: [
              { value: "less_than_5", label: "น้อยกว่า 5 ชั่วโมง" },
              { value: "5_to_6", label: "5-6 ชั่วโมง" },
              { value: "7_to_8", label: "7-8 ชั่วโมง" },
              { value: "9_to_10", label: "9-10 ชั่วโมง" },
              { value: "more_than_10", label: "มากกว่า 10 ชั่วโมง" },
            ],
            required: true,
            category: "sleep",
            weight: 4,
            riskFactors: ["นอนไม่เพียงพอ"],
          },
        ],
      },
      {
        id: "phq",
        title: "ประเมินสุขภาพจิต PHQ",
        description: "แบบประเมินสุขภาพจิตแบบ PHQ-2 และ PHQ-9 สำหรับคัดกรองภาวะซึมเศร้า",
        icon: "Brain",
        required: true,
        estimatedTime: 8,
        questions: [
          // PHQ-2 Questions
          {
            id: "phq-1",
            type: "rating",
            question: "ในช่วง 2 สัปดาห์ที่ผ่านมา ความสนใจหรือความสุขในการทำสิ่งต่างๆน้อยมาก",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "phq",
            weight: 5,
            riskFactors: ["ซึมเศร้า"],
          },
          {
            id: "phq-2",
            type: "rating",
            question: "รู้สึกหดหู่ สิ้นหวังหรือหมดหวัง",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "phq",
            weight: 5,
            riskFactors: ["ซึมเศร้า"],
          },
          // PHQ-9 Additional Questions (will be shown conditionally)
          {
            id: "phq-3",
            type: "rating",
            question: "มีปัญหาในการนอนหลับ หลับไม่สนิทหรือหลับมากเกินไป",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-4",
            type: "rating",
            question: "รู้สึกเหนื่อยง่ายไม่ค่อยมีแรง",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-5",
            type: "rating",
            question: "มีอาการเบื่ออาหารหรือกินมากเกินไป",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 2,
          },
          {
            id: "phq-6",
            type: "rating",
            question: "รู้สึกแย่กับตัวเองหรือรู้สึกว่าตัวเองล้มเหลว ทำให้ครอบครัวผิดหวัง",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 4,
          },
          {
            id: "phq-7",
            type: "rating",
            question: "มีปัญหาในการจดจ่อกับสิ่งต่างๆ เช่น การอ่านหนังสือพิมพ์หรือดูโทรทัศน์",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-8",
            type: "rating",
            question: "เคลื่อนไหวหรือพูดช้ามากจนคนอื่นอาจสังเกตเห็นได้หรือตรงกันข้าม เช่น กระสับกระส่ายหรือดีดมากกว่าปกติ",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 2,
          },
          {
            id: "phq-9",
            type: "rating",
            question: "มีความคิดว่าจะดีกว่าถ้าตัวคุณเองตายไปหรือทำร้ายตัวเองในทางใดทางหนึ่ง",
            description: "ให้คะแนน 0-3 (0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 5,
            riskFactors: ["เสี่ยงทำร้ายตัวเอง", "ความคิดฆ่าตัวตาย"],
          },
        ],
      },
      {
        id: "ess",
        title: "ประเมินความง่วงในเวลากลางวัน (ESS)",
        description: "แบบประเมิน Epworth Sleepiness Scale สำหรับวัดระดับความง่วงในสถานการณ์ต่างๆ",
        icon: "Moon",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "ess-1",
            type: "rating",
            question: "รู้สึกง่วงขณะอ่านหนังสือ",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-2",
            type: "rating",
            question: "รู้สึกง่วงขณะดูทีวี",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-3",
            type: "rating",
            question: "รู้สึกง่วงขณะนั่งหรืออยู่เฉยๆในที่สาธารณะ เช่น ในโรงหนัง หรือสถานที่ประชุม",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-4",
            type: "rating",
            question: "รู้สึกง่วงขณะนั่งเฉยๆบนรถโดยสารนานเป็นชั่วโมง",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-5",
            type: "rating",
            question: "รู้สึกง่วงขณะเอนตัวลงพักผ่อนในช่วงบ่าย",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-6",
            type: "rating",
            question: "รู้สึกง่วงขณะนั่งคุยกับใครสักคน",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-7",
            type: "rating",
            question: "รู้สึกง่วงขณะนั่งเฉยๆหลังรับประทานข้าวเที่ยงเสร็จโดยไม่ดื่มแอลกอฮอลล์",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-8",
            type: "rating",
            question: "รู้สึกง่วงขณะจอดรถรอไฟแดงในรถ",
            description: "0=ไม่เลย, 1=หลายวัน, 2=มากกว่าครึ่งวัน, 3=เกือบทุกวัน",
            options: [
              { value: "0", label: "ไม่เลย", score: 0 },
              { value: "1", label: "มีบ้างนิดหน่อย", score: 1 },
              { value: "2", label: "ปานกลาง", score: 2 },
              { value: "3", label: "บ่อยครั้ง", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
            riskFactors: ["ความง่วงมากเกินไป", "ปัญหาการนอนหลับ"],
          },
        ],
      },
      {
        id: "audit",
        title: "แบบประเมิน AUDIT",
        description: "แบบประเมินพฤติกรรมการดื่มสุราและความเสี่ยงต่อปัญหาสุขภาพจากการดื่ม",
        icon: "Wine",
        required: false,
        estimatedTime: 8,
        questions: [
          {
            id: "audit-1",
            type: "radio",
            question: "คุณดื่มสุราบ่อยเพียงไร?",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "เดือนละครั้งหรือน้อยกว่า",
                score: 1,
              },
              {
                value: "2",
                label: "2-4 ครั้งต่อเดือน",
                score: 2,
              },
              {
                value: "3",
                label: "2-3 ครั้งต่อสัปดาห์",
                score: 3,
              },
              {
                value: "4",
                label: "4 ครั้งขึ้นไปต่อสัปดาห์",
                score: 4,
              },
            ],
          },
          {
            id: "audit-2",
            type: "radio",
            question: "เวลาที่คุณดื่มสุราโดยทั่วไปแล้ว คุณดื่มประมาณเท่าไรต่อวัน?",
            description: "1-2 ดื่มมาตรฐาน = 1-1.5 กระป๋องเบียร์ หรือ 2-3 ฝาเหล้า",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "1-2 ดื่มมาตรฐาน",
                score: 0,
              },
              {
                value: "1",
                label: "3-4 ดื่มมาตรฐาน",
                score: 1,
              },
              {
                value: "2",
                label: "5-6 ดื่มมาตรฐาน",
                score: 2,
              },
              {
                value: "3",
                label: "7-9 ดื่มมาตรฐาน",
                score: 3,
              },
              {
                value: "4",
                label: "ตั้งแต่ 10 ดื่มมาตรฐานขึ้นไป",
                score: 4,
              },
            ],
          },
          {
            id: "audit-3",
            type: "radio",
            question: "บ่อยครั้งเพียงไรที่คุณดื่มเบียร์ 4 กระป๋องขึ้นไป หรือเหล้าวิสกี้ 3 เป๊กขึ้นไป?",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวัน หรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-4",
            type: "radio",
            question:
              "ในช่วงหนึ่งปีที่แล้ว มีบ่อยเพียงไรที่คุณต้องรีบดื่มสุราทันทีในตอนเช้า เพื่อจะดำเนินชีวิตตามปกติ หรือถอนอาการเมาค้างจากการดื่มหนักในคืนที่ผ่านมา?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวันหรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-5",
            type: "radio",
            question: "ในช่วงหนึ่งปีที่แล้ว มีบ่อยเพียงไรที่คุณไม่ได้ทำสิ่งที่คุณควรจะทำตามปกติ เพราะคุณมัวแต่ดื่มสุราไปเสีย?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวันหรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-6",
            type: "radio",
            question:
              "ในช่วงหนึ่งปีที่แล้ว มีบ่อยเพียงไรที่คุณต้องรีบดื่มสุราทันทีในตอนเช้า เพื่อจะได้ดำเนินชีวิตตามปกติ หรือถอนอาการเมาค้างจากการดื่มหนักในคืนที่ผ่านมา?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวันหรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-7",
            type: "radio",
            question: "ในช่วงหนึ่งปีที่แล้ว มีบ่อยเพียงไรที่คุณรู้สึกไม่ดี โกรธหรือเสียใจ เนื่องจากคุณได้ทำบางสิ่งบางอย่างลงไปขณะที่คุณดื่มสุราเข้าไป?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวันหรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-8",
            type: "radio",
            question: "ในช่วงหนึ่งปีที่แล้ว มีบ่อยเพียงไรที่คุณไม่สามารถจำได้ว่าเกิดอะไรขึ้นในคืนที่ผ่านมาเพราะว่าคุณได้ดื่มสุราเข้าไป?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "1",
                label: "น้อยกว่าเดือนละครั้ง",
                score: 1,
              },
              {
                value: "2",
                label: "เดือนละครั้ง",
                score: 2,
              },
              {
                value: "3",
                label: "สัปดาห์ละครั้ง",
                score: 3,
              },
              {
                value: "4",
                label: "ทุกวันหรือเกือบทุกวัน",
                score: 4,
              },
            ],
          },
          {
            id: "audit-9",
            type: "radio",
            question: "ตัวคุณเองหรือคนอื่น เคยได้รับบาดเจ็บซึ่งเป็นผลจากการดื่มสุราของคุณหรือไม่?",
            required: true,
            category: "audit",
            weight: 3,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "2",
                label: "เคย แต่ไม่ได้เกิดขึ้นในปีที่แล้ว",
                score: 2,
              },
              {
                value: "4",
                label: "เคยเกิดขึ้นในช่วงหนึ่งปีที่แล้ว",
                score: 4,
              },
            ],
          },
          {
            id: "audit-10",
            type: "radio",
            question: "เคยมีแพทย์ หรือบุคลากรทางการแพทย์หรือเพื่อนฝูงหรือญาติพี่น้องแสดงความเป็นห่วงเป็นใยต่อการดื่มสุราของคุณหรือไม่?",
            required: true,
            category: "audit",
            weight: 3,
            options: [
              {
                value: "0",
                label: "ไม่เคยเลย",
                score: 0,
              },
              {
                value: "2",
                label: "เคย แต่ไม่ได้เกิดขึ้นในปีที่แล้ว",
                score: 2,
              },
              {
                value: "4",
                label: "เคยเกิดขึ้นในช่วงหนึ่งปีที่แล้ว",
                score: 4,
              },
            ],
          },
        ],
      },
      {
        id: "gpaq",
        title: "ประเมินกิจกรรมทางกาย (GPAQ)",
        description: "แบบประเมินกิจกรรมทางกายแบบสากล สำหรับวัดระดับการออกกำลังกายในชีวิตประจำวัน",
        icon: "Activity",
        required: false,
        estimatedTime: 10,
        questions: [
          // Work-related activities
          {
            id: "gpaq-1",
            type: "yes-no",
            question:
              "งานของคุณเกี่ยวกับกิจกรรมที่ต้องใช้แรงมากจนทำให้หายใจติดขัดหรือหัวใจเต้นเร็วมาก",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-2",
            type: "number",
            question: "ในสัปดาห์ปกติ คุณทำกิจกรรมที่ต้องออกแรงมากเป็นพิเศษในที่ทำงานกี่วัน?",
            description: "จำนวนวัน (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-3",
            type: "text",
            question: "คุณใช้เวลาในการทำกิจกรรมที่ต้องใช้แรงมากนานแค่ไหน?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 2:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-4",
            type: "yes-no",
            question:
              "งานของคุณเกี่ยวข้องกับกิจกรรมที่มีความหนักปานกลางจนทำให้หายใจแรงขึ้นเล็กน้อยหรือหัวใจเต้นเร็วขึ้นเล็กน้อย",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-5",
            type: "number",
            question: "ในสัปดาห์ปกติ คุณทำกิจกรรมที่หนักปานกลางในที่ทำงานเป็นระยะเวลากี่วัน?",
            description: "จำนวนวัน (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-6",
            type: "text",
            question: "คุณใช้เวลาในการทำกิจกรรมที่หนักปานกลางในที่ทำงานนานแค่ไหน?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 1:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Transportation activities
          {
            id: "gpaq-7",
            type: "yes-no",
            question: "คุณเดินหรือปั่นจักรยานอย่างน้อย 10 นาทีเพื่อไป-กลับจากสถานที่ต่างๆหรือไม่?",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-8",
            type: "number",
            question: "ในสัปดาห์ปกติ คุณเดินหรือปั่นจักรยานอย่างน้อย 10 นาทีเพื่อไป-กลับจากสถานที่ต่างๆเป็นระยะเวลากี่วัน?",
            description: "จำนวนวัน (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-9",
            type: "text",
            question: "คุณใช้เวลาในการเดินหรือปั่นจักรยานวันละเท่าไร?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 0:45)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Recreational activities
          {
            id: "gpaq-10",
            type: "yes-no",
            question:
              "คุณทำกิจกรรมกีฬา ฟิตเนส หรือกิจกรรมนันทนาการที่ต้องออกแรงมากเป็นพิเศษที่ทำให้หายใจแรงหรือหัวใจเต้นเร็วเป็นเวลาอย่างน้อย 10 นาทีติดต่อกันหรือไม่?",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-11",
            type: "number",
            question: "ในสัปดาห์ปกติคุณเล่นกีฬา ออกกำลังกาย หรือทำกิจกรรมนันทนาการกี่วัน?",
            description: "จำนวนวัน (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-12",
            type: "text",
            question: "คุณใช้เวลาในการเล่นกีฬา ออกกำลังกาย หรือทำกิจกรรมนันทนาการนานแค่ไหน?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 1:00)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-13",
            type: "yes-no",
            question:
              "คุณเล่นกีฬา ออกกำลังกาย หรือทำกิจกรรมนันทนาการใดๆที่ทำให้การหายใจหรืออัตราการเต้นของหัวใจเพิ่มขึ้นเล็กน้อย",
            options: [
              { value: "yes", label: "ใช่" },
              { value: "no", label: "ไม่" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-14",
            type: "number",
            question: "ในสัปดาห์ปกติคุณเล่นกีฬา ออกกำลังกาย หรือทำกิจกรรมนันทนาการที่หนักปานกลางเป็นระยะเวลากี่วัน?",
            description: "จำนวนวัน (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-15",
            type: "text",
            question: "คุณใช้เวลาในการเล่นกีฬา ออกกำลังกาย ทำกิจกรรมนันทนาการที่มีความหนักปานกลางนานแค่ไหนในแต่ละวัน?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 0:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Sedentary behavior
          {
            id: "gpaq-16",
            type: "text",
            question: "โดยปกติคุณใช้เวลาในการนั่งหรือเอนกายในแต่ละวันเท่าใด?",
            description: "ระบุเป็น ชั่วโมง:นาที (เช่น 8:00)",
            required: true,
            category: "gpaq",
            weight: 2,
            riskFactors: ["พฤติกรรมเนื่อยนิ่ง", "นั่งนานเกินไป"],
          },
        ],
      },
      {
        id: "dast",
        title: "ประเมินการใช้สารเสพติด (DAST-10)",
        description: "แบบประเมินการคัดกรองปัญหาการใช้ยาและสารเสพติด 10 ข้อ",
        icon: "AlertTriangle",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "dast-1",
            type: "yes-no",
            question: "คุณเคยใช้ยาหรือเสพสารเพื่อประโยชน์นอกเหนือจากเหตุผลทางการแพทย์หรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 1,
            riskFactors: ["การใช้สารเสพติด"],
          },
          {
            id: "dast-2",
            type: "yes-no",
            question: "คุณใช้ยาหรือเสพสารอย่างไม่เหมาะสมและอันตรายมากกว่าหนึ่งชนิดในเวลาเดียวกันหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["การใช้สารเสพติดหลายชนิด"],
          },
          {
            id: "dast-3",
            type: "yes-no",
            question: 'คุณสามารถหยุดใช้ยาเสพติดได้เสมอที่คุณต้องการหยุดหรือไม่? (ถ้าไม่เคยใช้ยาเสพติดให้ตอบว่า "ใช่")',
            options: [
              { value: "yes", label: "ใช่", score: 0 },
              { value: "no", label: "ไม่", score: 1 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["ไม่สามารถควบคุมการใช้สารได้"],
          },
          {
            id: "dast-4",
            type: "yes-no",
            question:
              "คุณเคยเกิดอาการจำช่วงขณะเมายาหรือสารไม่ได้ (Blackout) หรือเกิดอาการคล้ายช่วงเมาทั้งที่ไม่ได้เสพ (Flashbacks) อันเป็นผลเนื่องมาจากการใช้ยาหรือเสพสารหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["อาการ Blackout/Flashback"],
          },
          {
            id: "dast-5",
            type: "yes-no",
            question: 'คุณเคยรู้สึกแย่หรือรู้สึกผิดเกี่ยวกับการใช้ยาหรือเสพสารของคุณหรือไม่? (ถ้าไม่เคยใช้ยาเสพติด ตอบว่า "ไม่")',
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["ความรู้สึกผิดจากการใช้สาร"],
          },
          {
            id: "dast-6",
            type: "yes-no",
            question: "คู่สมรส (หรือพ่อแม่) ของคุณเคยบ่นเกี่ยวกับการใช้ยาหรือเสพสารของคุณหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["ปัญหาความสัมพันธ์จากการใช้สาร"],
          },
          {
            id: "dast-7",
            type: "yes-no",
            question: "คุณเคยละทิ้งไม่เอาใจใส่ครอบครัวของคุณเนื่องจากการใช้ยาหรือเสพสารหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["ละเลยครอบครัวจากการใช้สาร"],
          },
          {
            id: "dast-8",
            type: "yes-no",
            question: "คุณเคยกระทำผิดกฎหมายเพื่อให้ได้ยาหรือสารมาเสพหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 4,
            riskFactors: ["พฤติกรรมผิดกฎหมายเพื่อหาสาร"],
          },
          {
            id: "dast-9",
            type: "yes-no",
            question: "คุณเคยมีอาการถอนยา (รู้สึกไม่สบาย) เมื่อคุณหยุดใช้ยาหรือเสพสารหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["อาการถอนยา"],
          },
          {
            id: "dast-10",
            type: "yes-no",
            question:
              "คุณเคยมีปัญหาทางสุขภาพอันเป็นผลสืบเนื่องจากการใช้ยาหรือเสพสารหรือไม่? (เช่น ความจำเสื่อม, ตับอักเสบ, ชัก, เลือดออก ฯลฯ)",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 4,
            riskFactors: ["ปัญหาสุขภาพจากการใช้สาร"],
          },
        ],
      },
      {
        id: "pcptsd",
        title: "ประเมินความเครียดหลังเหตุการณ์สะเทือนใจ (PC-PTSD-5)",
        description: "แบบประเมินคัดกรองอาการความเครียดหลังเหตุการณ์สะเทือนใจ สำหรับใช้ในระบบการดูแลสุขภาพปฐมภูมิ",
        icon: "Shield",
        required: false,
        estimatedTime: 3,
        questions: [
          {
            id: "pcptsd-intro",
            type: "text",
            question: "บางครั้งสิ่งต่างๆที่เกิดขึ้นกับผู้คนอาจเป็นเหตุการณ์ที่สร้างความเครียดอย่างมาก เหตุการณ์เหล่านี้รวมถึง:",
            description:
              "• อุบัติเหตุร้ายแรงหรือไฟไหม้\n• การทำร้ายร่างกายหรือการล่วงละเมิดทางเพศ\n• แผ่นดินไหวหรือน้ำท่วม\n• สงคราม\n• เห็นคนตายหรือบาดเจ็บสาหัส\n• การที่คนที่คุณรักเสียชีวิตจากการฆาตกรรมหรือการฆ่าตัวตาย\n\nในช่วงเดือนที่ผ่านมาคุณได้:",
            required: false,
            category: "pcptsd",
            weight: 0,
          },
          {
            id: "pcptsd-1",
            type: "yes-no",
            question: "เคยฝันร้ายเกี่ยวกับเหตุการณ์ดังกล่าวหรือคิดถึงเหตุการณ์ดังกล่าวโดยที่คุณไม่อยากคิดถึงหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["ความทรงจำที่รุกราน", "ฝันร้าย"],
          },
          {
            id: "pcptsd-2",
            type: "yes-no",
            question: "พยายามอย่างหนักที่จะไม่คิดถึงเหตุการณ์ต่างๆ หรือพยายามหลีกเลี่ยงสถานการณ์ที่ทำให้คุณนึกถึงเหตุการณ์เหล่านั้นหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["การหลีกเลี่ยง", "การปฏิเสธความทรงจำ"],
          },
          {
            id: "pcptsd-3",
            type: "yes-no",
            question: "เคยระมัดระวังตัวตลอดเวลา ระแวดระวัง หรือตกใจง่ายหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["ความระแวดระวังมากเกินไป", "ตกใจง่าย"],
          },
          {
            id: "pcptsd-4",
            type: "yes-no",
            question: "รู้สึกเฉยชาหรือแยกตัวจากผู้คน กิจกรรม หรือสภาพแวดล้อมของคุณหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["ความเฉยชาทางอารมณ์", "การแยกตัว"],
          },
          {
            id: "pcptsd-5",
            type: "yes-no",
            question: "รู้สึกผิดหรือไม่สามารถหยุดโทษตัวเองหรือผู้อื่นสำหรับเหตุการณ์ต่างๆ หรือปัญหาใดๆ ที่ก่อให้เหตุการณ์เหล่านั้นเกิดขึ้น?",
            options: [
              { value: "yes", label: "ใช่", score: 1 },
              { value: "no", label: "ไม่", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["ความรู้สึกผิด", "การโทษตัวเอง", "PTSD"],
          },
        ],
      },
      {
        id: "suicide",
        title: "แบบประเมินการฆ่าตัวตาย (8Q)",
        description: "แบบประเมินเพื่อคัดกรองความเสี่ยงในการฆ่าตัวตาย",
        icon: "AlertTriangle",
        required: false,
        estimatedTime: 3,
        questions: [
          {
            id: "suicide-1",
            type: "yes-no",
            question: "คิดอยากตาย หรือ คิดว่าตายไปอาจจะดีกว่า",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "1", label: "มี", score: 1 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicidal ideation"],
          },
          {
            id: "suicide-2",
            type: "yes-no",
            question: "อยากทำร้ายตัวเอง หรือ ทำให้ตัวเองบาดเจ็บ",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "1", label: "มี", score: 1 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Self-harm"],
          },
          {
            id: "suicide-3",
            type: "yes-no",
            question: "คิดเกี่ยวกับการฆ่าตัวตาย (ในช่วง 1 เดือนที่ผ่านมารวมวันนี้)",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "6", label: "มี", score: 6 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicidal thoughts"],
          },
          {
            id: "suicide-4",
            type: "radio",
            question: "ท่านสามารถควบคุมความอยากฆ่าตัวตายที่ท่านคิดอยู่นั้นได้หรือไม่ หรือบอกได้ไหมว่าคงจะไม่ทำตามความคิดนั้นในขณะนี้ (ถ้าตอบว่าคิดเกี่ยวกับการฆ่าตัวตายให้ถามต่อ)",
            options: [
              { value: "0", label: "ได้", score: 0 },
              { value: "8", label: "ไม่ได้", score: 8 },
            ],
            required: false,
            category: "suicide",
            weight: 1,
            riskFactors: ["Loss of control over suicidal thoughts"],
          },
          {
            id: "suicide-5",
            type: "yes-no",
            question: "มีแผนการที่จะฆ่าตัวตาย (ในช่วง 1 เดือนที่ผ่านมารวมวันนี้)",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "8", label: "มี", score: 8 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide plan"],
          },
          {
            id: "suicide-6",
            type: "yes-no",
            question: "ได้เตรียมการที่จะทำร้ายตนเองหรือเตรียมการจะฆ่าตัวตายโดยตั้งใจว่าจะให้ตายจริงๆ (ในช่วง 1 เดือนที่ผ่านมารวมวันนี้)",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "9", label: "มี", score: 9 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide preparation"],
          },
          {
            id: "suicide-7",
            type: "yes-no",
            question: "ได้ทำให้ตนเองบาดเจ็บแต่ไม่ตั้งใจที่จะทำให้เสียชีวิต",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "4", label: "มี", score: 4 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Self-inflicted injury"],
          },
          {
            id: "suicide-8",
            type: "yes-no",
            question: "ได้พยายามฆ่าตัวตายโดยคาดหวัง/ตั้งใจที่จะให้ตายจริงๆ (ตลอดชีวิตที่ผ่านมา)",
            options: [
              { value: "0", label: "ไม่มี", score: 0 },
              { value: "10", label: "มี", score: 10 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide attempt"],
          },
          {
            id: "suicide-9",
            type: "yes-no",
            question: "ท่านเคยพยายามฆ่าตัวตาย",
            options: [
              { value: "0", label: "ไม่เคย", score: 0 },
              { value: "4", label: "เคย", score: 4 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Past suicide attempt"],
          },
        ],
      },
      {
        id: "thai-cv-risk",
        title: "ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด (Thai CV Risk Score)",
        description: "แบบประเมินความเสี่ยงโรคหลอดเลือดหัวใจและโรคหลอดเลือดสมองในช่วง 10 ปีข้างหน้า สำหรับคนไทย",
        icon: "Heart",
        required: false,
        estimatedTime: 8,
        questions: [
          {
            id: "thai-cv-1",
            type: "number",
            question: "อายุของคุณ",
            description: "กรุณาระบุอายุเป็นปี (20-100 ปี)",
            required: true,
            category: "thai-cv-risk",
            weight: 1,
            min: 20,
            max: 100,
          },
          {
            id: "thai-cv-2",
            type: "multiple-choice",
            question: "เพศ",
            options: [
              { value: "male", label: "ชาย", score: 1 },
              { value: "female", label: "หญิง", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 1,
          },
          {
            id: "thai-cv-3",
            type: "number",
            question: "ความดันโลหิตตัวบน (Systolic BP)",
            description: "ระบุเป็น mmHg",
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            min: 80,
            max: 250,
            unit: "mmHg",
          },
          {
            id: "thai-cv-4",
            type: "number",
            question: "ความดันโลหิตตัวล่าง (Diastolic BP)",
            description: "ระบุเป็น mmHg",
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            min: 40,
            max: 150,
            unit: "mmHg",
          },
          {
            id: "thai-cv-5",
            type: "yes-no",
            question: "คุณสูบบุหรี่หรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 2 },
              { value: "no", label: "ไม่ใช่", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            riskFactors: ["การสูบบุหรี่"],
          },
          {
            id: "thai-cv-6",
            type: "yes-no",
            question: "คุณเป็นโรคเบาหวานหรือไม่?",
            options: [
              { value: "yes", label: "ใช่", score: 2 },
              { value: "no", label: "ไม่ใช่", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            riskFactors: ["โรคเบาหวาน"],
          },
          {
            id: "thai-cv-7",
            type: "yes-no",
            question: "คุณมีผลเลือดตรวจไขมันหรือไม่?",
            description: "หากมีผลเลือด จะได้รับคำถามเพิ่มเติมเกี่ยวกับระดับไขมัน",
            options: [
              { value: "yes", label: "มี" },
              { value: "no", label: "ไม่มี" },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 1,
          },
          {
            id: "thai-cv-8",
            type: "number",
            question: "ระดับ Cholesterol รวม (Total Cholesterol)",
            description: "ระบุเป็น mg/dL (ถ้ามีผลเลือด)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 100,
            max: 400,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-9",
            type: "number",
            question: "ระดับ HDL Cholesterol",
            description: "ระบุเป็น mg/dL (ถ้ามีผลเลือด)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 20,
            max: 100,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-10",
            type: "number",
            question: "ระดับ LDL Cholesterol",
            description: "ระบุเป็น mg/dL (ถ้ามีผลเลือด)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 50,
            max: 300,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-11",
            type: "number",
            question: "ระดับ Triglycerides",
            description: "ระบุเป็น mg/dL (ถ้ามีผลเลือด)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 50,
            max: 1000,
            unit: "mg/dL",
          },
        ],
      },
      {
      "title": "แบบประเมินความวิตกกังวลทั่วไป 7 ข้อ (GAD-7)",
      "questions": [
        {
          "id": "GAD-1",
          "question": "รู้สึกกังวล วิตกกังวล หรือกระวนกระวาย",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-2",
          "question": "ไม่สามารถหยุดหรือควบคุมความกังวลได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-3",
          "question": "กังวลเกี่ยวกับสิ่งต่าง ๆ หลายเรื่องมากเกินไป",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-4",
          "question": "มีปัญหาในการผ่อนคลาย",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-5",
          "question": "ไม่สามารถอยู่นิ่งได้ รู้สึกกระสับกระส่ายจนอยู่ไม่สุข",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-6",
          "question": "รู้สึกหงุดหงิดหรือโมโหได้ง่าย",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        },
        {
          "id": "GAD-7",
          "question": "รู้สึกกลัวเหมือนมีบางสิ่งเลวร้ายจะเกิดขึ้น",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "มีบางวัน", "value": 1 },
            { "label": "กว่าครึ่งหนึ่งของวัน", "value": 2 },
            { "label": "เกือบทุกวัน", "value": 3 }
          ]
        }
      ]
      },
      {
      "title": "แบบประเมินความเครียด วิตกกังวล และซึมเศร้า 21 ข้อ (DASS-21)",
      "questions": [
        {
          "id": "DASS-21-1",
          "question": "ฉันไม่สามารถรู้สึกมีความสุขได้",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-2",
          "question": "ฉันรู้สึกว่าชีวิตไม่มีความหมาย",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-3",
          "question": "ฉันไม่สามารถกระตุ้นตัวเองได้",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-4",
          "question": "ฉันรู้สึกตัวสั่น (เช่น มือสั่น)",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-5",
          "question": "ฉันรู้สึกกลัวอย่างไม่มีเหตุผล",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-6",
          "question": "ฉันกังวลกับสถานการณ์ต่าง ๆ",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-7",
          "question": "ฉันรู้สึกยากที่จะผ่อนคลาย",
          "dimension": "Stress",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-8",
          "question": "ฉันหงุดหงิดง่าย",
          "dimension": "Stress",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-9",
          "question": "ฉันรู้สึกกังวลว่าต้องใช้ความพยายามมาก",
          "dimension": "Stress",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-10",
          "question": "ฉันรู้สึกว่าไม่มีอะไรน่าสนใจให้ทำ",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-11",
          "question": "ฉันรู้สึกว่าตัวเองไม่มีค่า",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-12",
          "question": "ฉันรู้สึกกระวนกระวายใจ",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-13",
          "question": "ฉันรู้สึกว่าตัวเองไม่สามารถทนต่อการขัดจังหวะใด ๆ ที่ทำให้กิจกรรมของฉันติดขัดได้",
          "dimension": "Stress",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-14",
          "question": "ฉันรู้สึกว่าตัวเองกำลังจะตื่นตระหนก",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-15",
          "question": "ฉันไม่สามารถตื่นเต้นได้เลย",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-16",
          "question": "ฉันรู้สึกว่าตัวเองไม่มีค่า",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-17",
          "question": "ฉันรู้สึกว่าชีวิตไม่มีความหมาย",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-18",
          "question": "ฉันหงุดหงิดง่าย",
          "dimension": "Stress",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-19",
          "question": "ฉันรู้สึกว่าตัวเองไม่มีค่า",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-20",
          "question": "ฉันรู้สึกกระวนกระวายใจ",
          "dimension": "Anxiety",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-21",
          "question": "ฉันไม่สามารถกระตุ้นตัวเองได้",
          "dimension": "Depression",
          "options": [
            { "label": "ไม่ตรงกับฉันเลย", "value": 0 },
            { "label": "ตรงกับฉันบ้างหรือบางครั้ง", "value": 1 },
            { "label": "ตรงกับฉันบ่อยครั้ง", "value": 2 },
            { "label": "ตรงกับฉันเกือบตลอดเวลา", "value": 3 }
          ]
        }
      ]
    },
      {
      "title": "แบบประเมินความเครียดที่รับรู้ (PSS)",
      "questions": [
        {
          "id": "PSS-1",
          "question": "รู้สึกว่าชีวิตเต็มไปด้วยสิ่งที่คาดเดาไม่ได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        },
        {
          "id": "PSS-2",
          "question": "รู้สึกไม่สามารถควบคุมสิ่งสำคัญในชีวิตได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        },
        {
          "id": "PSS-3",
          "question": "รู้สึกว่ากังวลหรือเครียดเกินไป",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        },
        {
          "id": "PSS-4",
          "question": "รู้สึกมั่นใจในความสามารถในการแก้ปัญหาส่วนตัว",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-5",
          "question": "รู้สึกว่าสามารถควบคุมความรำคาญได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-6",
          "question": "รู้สึกว่าสามารถรับมือกับสิ่งที่ต้องทำได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-7",
          "question": "รู้สึกควบคุมสิ่งต่าง ๆ ไม่ได้",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        },
        {
          "id": "PSS-8",
          "question": "รู้สึกโกรธเพราะสิ่งที่อยู่นอกการควบคุม",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        },
        {
          "id": "PSS-9",
          "question": "รู้สึกควบคุมได้ว่าทำสิ่งต่าง ๆ สำเร็จ",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-10",
          "question": "รู้สึกว่าปัญหาต่าง ๆ มากเกินไป",
          "options": [
            { "label": "ไม่เคยเลย", "value": 0 },
            { "label": "แทบจะไม่เคย", "value": 1 },
            { "label": "บางครั้ง", "value": 2 },
            { "label": "ค่อนข้างบ่อย", "value": 3 },
            { "label": "บ่อยมาก", "value": 4 }
          ]
        }
      ]
    },
      {
      "title": "การตรวจประเมินสภาพจิตใจแบบสั้น (MMSE)",
      "description": "แบบประเมินนี้ใช้เพื่อคัดกรองความผิดปกติของการทำงานของสมองด้านการรู้คิด (cognitive function) เช่น ความจำ, การใช้ภาษา, และความสามารถในการแก้ปัญหา",
      "questions": [
        {
          "id": "MMSE-1",
          "question": "วันนี้ วันอะไร",
          "type": "text",
          "category": "Orientation to time",
          "note": "คำตอบที่ถูกต้องคือวันปัจจุบัน"
        },
        {
          "id": "MMSE-2",
          "question": "วันที่เท่าไหร่",
          "type": "text",
          "category": "Orientation to time",
          "note": "คำตอบที่ถูกต้องคือวันที่ปัจจุบัน"
        },
        {
          "id": "MMSE-3",
          "question": "ตอนนี้อยู่ที่ไหน",
          "type": "text",
          "category": "Orientation to place",
          "note": "คำตอบที่ถูกต้องคือสถานที่ที่กำลังทำแบบประเมิน"
        },
        {
          "id": "MMSE-4",
          "question": "ทวนคำ 3 คำ",
          "type": "text",
          "category": "Registration",
          "note": "ผู้ประเมินจะให้คำ 3 คำแก่ผู้เข้ารับการประเมินเพื่อทวนซ้ำทันที"
        },
        {
          "id": "MMSE-5",
          "question": "จำคำ 3 คำ",
          "type": "text",
          "category": "Recall",
          "note": "ให้ผู้เข้ารับการประเมินทบทวนคำ 3 คำที่กล่าวไปในข้อก่อนหน้า"
        },
        {
          "id": "MMSE-6",
          "question": "ลบเลข/สะกด WORLD",
          "type": "text",
          "category": "Attention and calculation",
          "note": "เลือกการทดสอบอย่างใดอย่างหนึ่ง: ให้ผู้เข้ารับการประเมินลบเลข 7 จาก 100 ไปเรื่อยๆ หรือให้สะกดคำว่า 'WORLD' ย้อนกลับ"
        },
        {
          "id": "MMSE-7",
          "question": "บอกชื่อวัตถุ 2 ชิ้น",
          "type": "text",
          "category": "Naming",
          "note": "ผู้ประเมินจะชี้ไปที่วัตถุ 2 ชิ้น เช่น ปากกาและนาฬิกา และให้ผู้เข้ารับการประเมินบอกชื่อ"
        },
        {
          "id": "MMSE-8",
          "question": "ทำตามคำสั่ง 3 ขั้นตอน",
          "type": "text",
          "category": "Comprehension",
          "note": "ผู้ประเมินจะให้คำสั่ง 3 ขั้นตอน เช่น 'หยิบกระดาษขึ้นมา พับครึ่ง แล้ววางลงกับพื้น'"
        },
        {
          "id": "MMSE-9",
          "question": "เขียนประโยค",
          "type": "text",
          "category": "Writing",
          "note": "ให้ผู้เข้ารับการประเมินเขียนประโยคใดก็ได้"
        },
        {
          "id": "MMSE-10",
          "question": "คัดลอกรูปภาพ 5 เหลี่ยม",
          "type": "text",
          "category": "Visuospatial",
          "note": "ผู้ประเมินจะให้ผู้เข้ารับการประเมินวาดรูป 5 เหลี่ยมสองอันที่ซ้อนทับกัน"
        }
      ]
    }
  ],
},
  en: {
    categories: [
      {
        id: "basic",
        title: "Personal Information",
        description: "Important information that doctors need for diagnosis and treatment",
        icon: "User",
        required: true,
        estimatedTime: 5,
        questions: [
          {
            id: "basic-1",
            type: "number",
            question: "Your age",
            description: "Please specify your age in years",
            required: true,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-2",
            type: "multiple-choice",
            question: "Gender",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "not_specified", label: "Prefer not to say" },
            ],
            required: true,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-3",
            type: "number",
            question: "Weight (kg)",
            description: "Your current weight",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-4",
            type: "number",
            question: "Height (cm)",
            description: "Your height",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-5",
            type: "multiple-choice",
            question: "Blood type",
            options: [
              { value: "A", label: "A" },
              { value: "B", label: "B" },
              { value: "AB", label: "AB" },
              { value: "O", label: "O" },
              { value: "unknown", label: "Unknown" },
            ],
            required: false,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-6",
            type: "multi-select-combobox-with-other",
            question: "Underlying disease (select multiple)",
            options: [
              { value: "diabetes", label: "Diabetes" },
              { value: "hypertension", label: "Hypertension" },
              { value: "hyperlipidemia", label: "Hyperlipidemia" },
              { value: "heart_disease", label: "Heart disease" },
              { value: "stroke", label: "Stroke" },
              { value: "asthma", label: "Asthma" },
              { value: "kidney_disease", label: "Kidney disease" },
              { value: "liver_disease", label: "Liver disease" },
              { value: "thyroid", label: "Thyroid disease" },
              { value: "allergy", label: "Allergy" },
              { value: "autoimmune", label: "Autoimmune disease" },
              { value: "epilepsy", label: "Epilepsy" },
              { value: "dementia", label: "Dementia" },
              { value: "cancer", label: "Cancer" },
              { value: "hiv", label: "HIV" },
              { value: "knee_arthritis", label: "Knee arthritis" },
              { value: "rheumatoid", label: "Rheumatoid arthritis" },
              { value: "gout", label: "Gout" },
              { value: "osteoporosis", label: "Osteoporosis" },
              { value: "eye_disease", label: "Eye disease" },
              { value: "none", label: "None" },
            ],
            required: true,
            category: "basic",
            weight: 3,
            riskFactors: ["Diabetes", "Hypertension", "Heart disease"],
          },
          {
            id: "basic-7",
            type: "multi-select-combobox-with-other",
            question: "Drug/food allergies (select multiple)",
            options: [
              { value: "aspirin_allergy", label: "Aspirin allergy" },
              { value: "antibiotic_allergy", label: "Antibiotic allergy" },
              { value: "seafood_allergy", label: "Seafood allergy" },
              { value: "dairy_allergy", label: "Dairy allergy" },
              { value: "egg_allergy", label: "Egg allergy" },
              { value: "nut_allergy", label: "Nut allergy" },
              { value: "msg_allergy", label: "MSG allergy" },
              { value: "no_allergy", label: "No allergy" },
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-8",
            type: "multi-select-combobox-with-other",
            question: "Regular medications",
            description: "Select the type of regular medication or specify others",
            options: [
              { value: "antihypertensive", label: "Antihypertensive" },
              { value: "antidiabetic", label: "Antidiabetic" },
              { value: "antilipidemic", label: "Antilipidemic" },
              { value: "antiplatelet", label: "Antiplatelet" },
              { value: "heart_medication", label: "Heart medication" },
              { value: "insulin", label: "Insulin" },
              { value: "asthma_medication", label: "Asthma medication" },
              { value: "antihistamine", label: "Antihistamine" },
              { value: "antacid", label: "Antacid" },
              { value: "psychiatric_medication", label: "Psychiatric medication" },
              { value: "nsaid", label: "NSAID" },
              { value: "antibiotic", label: "Antibiotic" },
              { value: "hormone", label: "Hormone" },
              { value: "vitamin", label: "Vitamin" },
              { value: "none", label: "None" },
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
        ],
      },
      {
        id: "heart",
        title: "Heart and Blood Vessels Assessment",
        description: "Check heart disease risk, blood pressure, and overall blood vessel health",
        icon: "Heart",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "heart-1",
            type: "yes-no",
            question: "Do you have a family history of heart disease?",
            description: "e.g., father, mother, or sibling with heart disease",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Family history"],
          },
          {
            id: "heart-2",
            type: "multiple-choice",
            question: "What is your blood pressure level?",
            options: [
              { value: "normal", label: "Normal (<120/80)" },
              { value: "slightly_high", label: "Slightly high (120–139/80–89)" },
              { value: "high", label: "High (140/90 or higher)" },
              { value: "uncertain", label: "Uncertain" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["High blood pressure"],
          },
          {
            id: "heart-3",
            type: "rating",
            question: "How often do you feel short of breath when climbing 2-3 flights of stairs?",
            description: "Rate 1-5 (1 = Never, 5 = Always)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-4",
            type: "yes-no",
            question: "Have you ever felt chest pain or tightness?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Chest pain"],
          },
          {
            id: "heart-5",
            type: "yes-no",
            question: "Do you smoke?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Smoking"],
          },
        ],
      },
      {
        id: "nutrition",
        title: "Lifestyle and Nutrition Assessment",
        description: "Check eating habits, exercise, and overall health care",
        icon: "Apple",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "nutrition-1",
            type: "multiple-choice",
            question: "How many meals do you have per day?",
            options: [
              { value: "1_meal", label: "1 meal" },
              { value: "2_meals", label: "2 meals" },
              { value: "3_meals", label: "3 meals" },
              { value: "more_than_3_meals", label: "More than 3 meals" },
              { value: "uncertain", label: "Not sure" },
            ],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-2",
            type: "rating",
            question: "How often do you eat vegetables and fruits?",
            description: "Rate 1-5 (1 = Never, 5 = Every meal)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "nutrition",
            weight: 3,
          },
        ],
      },
      {
        id: "mental",
        title: "Mental Health Assessment",
        description: "Check mental health, stress, and emotional well-being",
        icon: "Brain",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "mental-1",
            type: "rating",
            question:
              "Over the last 2 weeks, how often have you felt bored or lost interest in things you used to enjoy?",
            description: "Rate 0-3 (0 = Not at all, 3 = Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "mental",
            weight: 4,
            riskFactors: ["Depression"],
          },
        ],
      },
      {
        id: "physical",
        title: "Physical Health Assessment",
        description: "Check physical health, strength, and overall physical ability",
        icon: "Dumbbell",
        required: false,
        estimatedTime: 12,
        questions: [
          {
            id: "physical-1",
            type: "rating",
            question: "How often do you feel back pain?",
            description: "Rate 1-5 (1 = Never, 5 = Every day)",
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["Chronic back pain"],
          },
        ],
      },
      {
        id: "sleep",
        title: "Sleep Quality Assessment",
        description: "Analyze sleep patterns and overall rest quality",
        icon: "Moon",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "sleep-1",
            type: "multiple-choice",
            question: "On average, how many hours do you sleep per night?",
            options: [
              { value: "less_than_5", label: "Less than 5 hours" },
              { value: "5_to_6", label: "5-6 hours" },
              { value: "7_to_8", label: "7-8 hours" },
              { value: "9_to_10", label: "9-10 hours" },
              { value: "more_than_10", label: "More than 10 hours" },
            ],
            required: true,
            category: "sleep",
            weight: 4,
            riskFactors: ["Insufficient sleep"],
          },
        ],
      },
      {
        id: "phq",
        title: "PHQ Mental Health Assessment",
        description: "PHQ-2 and PHQ-9 assessment for depression screening",
        icon: "Brain",
        required: true,
        estimatedTime: 8,
        questions: [
          // PHQ-2 Questions
          {
            id: "phq-1",
            type: "rating",
            question: "Over the last 2 weeks, little interest or pleasure in doing things",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "phq",
            weight: 5,
            riskFactors: ["Depression"],
          },
          {
            id: "phq-2",
            type: "rating",
            question: "Feeling down, depressed, or hopeless",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: true,
            category: "phq",
            weight: 5,
            riskFactors: ["Depression"],
          },
          // PHQ-9 Additional Questions (will be shown conditionally)
          {
            id: "phq-3",
            type: "rating",
            question: "Trouble falling or staying asleep, or sleeping too much",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-4",
            type: "rating",
            question: "Feeling tired or having little energy",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-5",
            type: "rating",
            question: "Poor appetite or overeating",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 2,
          },
          {
            id: "phq-6",
            type: "rating",
            question: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 4,
          },
          {
            id: "phq-7",
            type: "rating",
            question: "Trouble concentrating on things, such as reading the newspaper or watching television",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 3,
          },
          {
            id: "phq-8",
            type: "rating",
            question:
              "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 2,
          },
          {
            id: "phq-9",
            type: "rating",
            question: "Thoughts that you would be better off dead, or of hurting yourself in some way",
            description: "Rate 0-3 (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
            ],
            required: false,
            category: "phq",
            weight: 5,
            riskFactors: ["Suicide risk", "Self-harm thoughts"],
          },
        ],
      },
      {
        id: "ess",
        title: "Epworth Sleepiness Scale (ESS)",
        description: "Assessment to measure daytime sleepiness in various situations",
        icon: "Moon",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "ess-1",
            type: "rating",
            question: "Feeling sleepy while reading",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-2",
            type: "rating",
            question: "Feeling sleepy while watching TV",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-3",
            type: "rating",
            question: "Feeling sleepy while sitting inactive in a public place (e.g., theater, meeting)",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-4",
            type: "rating",
            question: "Feeling sleepy as a passenger in a car for an hour without a break",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-5",
            type: "rating",
            question: "Feeling sleepy while lying down to rest in the afternoon",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-6",
            type: "rating",
            question: "Feeling sleepy while sitting and talking to someone",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-7",
            type: "rating",
            question: "Feeling sleepy while sitting quietly after lunch without alcohol",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
          },
          {
            id: "ess-8",
            type: "rating",
            question: "Feeling sleepy while in a car stopped for a few minutes in traffic",
            description: "0=Never, 1=Slight chance, 2=Moderate chance, 3=High chance",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "1", label: "Slight chance", score: 1 },
              { value: "2", label: "Moderate chance", score: 2 },
              { value: "3", label: "High chance", score: 3 },
            ],
            required: true,
            category: "ess",
            weight: 1,
            riskFactors: ["Excessive daytime sleepiness", "Sleep disorders"],
          },
        ],
      },
      {
        id: "audit",
        title: "AUDIT Assessment",
        description: "Alcohol Use Disorders Identification Test - screening for alcohol-related problems",
        icon: "Wine",
        required: false,
        estimatedTime: 8,
        questions: [
          {
            id: "audit-1",
            type: "radio",
            question: "How often do you have a drink containing alcohol?",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Monthly or less",
                score: 1,
              },
              {
                value: "2",
                label: "2-4 times a month",
                score: 2,
              },
              {
                value: "3",
                label: "2-3 times a week",
                score: 3,
              },
              {
                value: "4",
                label: "4 or more times a week",
                score: 4,
              },
            ],
          },
          {
            id: "audit-2",
            type: "radio",
            question: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "1 or 2",
                score: 0,
              },
              {
                value: "1",
                label: "3 or 4",
                score: 1,
              },
              {
                value: "2",
                label: "5 or 6",
                score: 2,
              },
              {
                value: "3",
                label: "7 to 9",
                score: 3,
              },
              {
                value: "4",
                label: "10 or more",
                score: 4,
              },
            ],
          },
          {
            id: "audit-3",
            type: "radio",
            question: "How often do you have six or more drinks on one occasion?",
            required: true,
            category: "audit",
            weight: 1,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-4",
            type: "radio",
            question:
              "How often during the last year have you found that you were not able to stop drinking once you had started?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-5",
            type: "radio",
            question:
              "How often during the last year have you failed to do what was normally expected of you because of drinking?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-6",
            type: "radio",
            question:
              "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-7",
            type: "radio",
            question: "How often during the last year have you had a feeling of guilt or remorse after drinking?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-8",
            type: "radio",
            question:
              "How often during the last year have you been unable to remember what happened the night before because of your drinking?",
            required: true,
            category: "audit",
            weight: 2,
            options: [
              {
                value: "0",
                label: "Never",
                score: 0,
              },
              {
                value: "1",
                label: "Less than monthly",
                score: 1,
              },
              {
                value: "2",
                label: "Monthly",
                score: 2,
              },
              {
                value: "3",
                label: "Weekly",
                score: 3,
              },
              {
                value: "4",
                label: "Daily or almost daily",
                score: 4,
              },
            ],
          },
          {
            id: "audit-9",
            type: "radio",
            question: "Have you or someone else been injured because of your drinking?",
            required: true,
            category: "audit",
            weight: 3,
            options: [
              {
                value: "0",
                label: "No",
                score: 0,
              },
              {
                value: "2",
                label: "Yes, but not in the last year",
                score: 2,
              },
              {
                value: "4",
                label: "Yes, during the last year",
                score: 4,
              },
            ],
          },
          {
            id: "audit-10",
            type: "radio",
            question:
              "Has a relative, friend, doctor, or other health care worker been concerned about your drinking or suggested you cut down?",
            required: true,
            category: "audit",
            weight: 3,
            options: [
              {
                value: "0",
                label: "No",
                score: 0,
              },
              {
                value: "2",
                label: "Yes, but not in the last year",
                score: 2,
              },
              {
                value: "4",
                label: "Yes, during the last year",
                score: 4,
              },
            ],
          },
        ],
      },
      {
        id: "gpaq",
        title: "Global Physical Activity Questionnaire (GPAQ)",
        description:
          "Standardized questionnaire to measure physical activity levels in daily life across different domains",
        icon: "Activity",
        required: false,
        estimatedTime: 10,
        questions: [
          // Work-related activities
          {
            id: "gpaq-1",
            type: "yes-no",
            question:
              "Does your work involve vigorous activity (heavy lifting, digging, construction) for at least 10 minutes continuously?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-2",
            type: "number",
            question:
              "In a typical week, on how many days do you do vigorous-intensity activities as part of your work?",
            description: "Number of days (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-3",
            type: "number",
            question: "How much time do you spend doing vigorous-intensity activities at work on a typical day?",
            description: "Specify as hours:minutes (e.g., 2:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-4",
            type: "yes-no",
            question:
              "Does your work involve moderate activity (brisk walking, light loads) for at least 10 minutes continuously?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-5",
            type: "number",
            question:
              "In a typical week, on how many days do you do moderate-intensity activities as part of your work?",
            description: "Number of days (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-6",
            type: "number",
            question: "How much time do you spend doing moderate-intensity activities at work on a typical day?",
            description: "Specify as hours:minutes (e.g., 1:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Transportation activities
          {
            id: "gpaq-7",
            type: "yes-no",
            question: "Do you walk or use a bicycle for at least 10 minutes continuously to get to and from places?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-8",
            type: "number",
            question:
              "In a typical week, on how many days do you walk or bicycle for at least 10 minutes continuously to get to and from places?",
            description: "Number of days (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-9",
            type: "number",
            question: "How much time do you spend walking or bicycling for travel on a typical day?",
            description: "Specify as hours:minutes (e.g., 0:45)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Recreational activities
          {
            id: "gpaq-10",
            type: "yes-no",
            question:
              "Do you do vigorous sports/fitness activities for at least 10 minutes continuously?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-11",
            type: "number",
            question:
              "In a typical week, on how many days do you do vigorous-intensity sports, fitness or recreational activities?",
            description: "Number of days (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-12",
            type: "number",
            question:
              "How much time do you spend doing vigorous-intensity sports, fitness or recreational activities on a typical day?",
            description: "Specify as hours:minutes (e.g., 1:00)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-13",
            type: "yes-no",
            question:
              "Do you do moderate sports/fitness activities (walking, cycling, swimming) for at least 10 minutes continuously?",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-14",
            type: "number",
            question:
              "In a typical week, on how many days do you do moderate-intensity sports, fitness or recreational activities?",
            description: "Number of days (0-7)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          {
            id: "gpaq-15",
            type: "number",
            question:
              "How much time do you spend doing moderate-intensity sports, fitness or recreational activities on a typical day?",
            description: "Specify as hours:minutes (e.g., 0:30)",
            required: false,
            category: "gpaq",
            weight: 1,
          },
          // Sedentary behavior
          {
            id: "gpaq-16",
            type: "text",
            question: "How much time do you usually spend sitting or reclining on a typical day?",
            description: "Specify as hours:minutes (e.g., 8:00)",
            required: true,
            category: "gpaq",
            weight: 2,
            riskFactors: ["Sedentary behavior", "Excessive sitting"],
          },
        ],
      },
      {
        id: "dast",
        title: "Drug Abuse Screening Test (DAST-10)",
        description: "10-question screening tool for identifying drug abuse problems",
        icon: "AlertTriangle",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "dast-1",
            type: "yes-no",
            question: "Have you used drugs other than those required for medical reasons?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 1,
            riskFactors: ["Drug use"],
          },
          {
            id: "dast-2",
            type: "yes-no",
            question: "Do you abuse more than one drug at a time?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["Polydrug use"],
          },
          {
            id: "dast-3",
            type: "yes-no",
            question: 'Are you always able to stop using drugs when you want to? (If never used drugs, answer "Yes")',
            options: [
              { value: "yes", label: "Yes", score: 0 },
              { value: "no", label: "No", score: 1 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["Loss of control"],
          },
          {
            id: "dast-4",
            type: "yes-no",
            question: 'Have you had "blackouts" or "flashbacks" as a result of drug use?',
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["Blackouts/Flashbacks"],
          },
          {
            id: "dast-5",
            type: "yes-no",
            question: 'Do you ever feel bad or guilty about your drug use? (If never used drugs, answer "No")',
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["Guilt about drug use"],
          },
          {
            id: "dast-6",
            type: "yes-no",
            question: "Does your spouse (or parents) ever complain about your involvement with drugs?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 2,
            riskFactors: ["Relationship problems"],
          },
          {
            id: "dast-7",
            type: "yes-no",
            question: "Have you neglected your family because of your use of drugs?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["Family neglect"],
          },
          {
            id: "dast-8",
            type: "yes-no",
            question: "Have you engaged in illegal activities in order to obtain drugs?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 4,
            riskFactors: ["Illegal activities"],
          },
          {
            id: "dast-9",
            type: "yes-no",
            question: "Have you experienced withdrawal symptoms (felt sick) when you stopped taking drugs?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 3,
            riskFactors: ["Withdrawal symptoms"],
          },
          {
            id: "dast-10",
            type: "yes-no",
            question:
              "Have you had medical problems as a result of your drug use? (e.g., memory loss, hepatitis, convulsions, bleeding, etc.)",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "dast",
            weight: 4,
            riskFactors: ["Medical complications"],
          },
        ],
      },
      {
        id: "pcptsd",
        title: "PC-PTSD-5 Screening",
        description: "Primary Care PTSD Screen for DSM-5 - A brief screening tool for post-traumatic stress disorder",
        icon: "Shield",
        required: false,
        estimatedTime: 3,
        questions: [
          {
            id: "pcptsd-intro",
            type: "text",
            question:
              "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. These events include:",
            description:
              "• Serious accidents, fire, or explosion\n• Physical or sexual assault or abuse\n• Earthquake or flood\n• War\n• Seeing someone be killed or seriously injured\n• Having a loved one die through homicide or suicide\n\nIn the past month, have you:",
            required: false,
            category: "pcptsd",
            weight: 0,
          },
          {
            id: "pcptsd-1",
            type: "yes-no",
            question: "Had nightmares about the event(s) or thought about the event(s) when you did not want to?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["Intrusive memories", "Nightmares"],
          },
          {
            id: "pcptsd-2",
            type: "yes-no",
            question:
              "Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["Avoidance", "Memory suppression"],
          },
          {
            id: "pcptsd-3",
            type: "yes-no",
            question: "Been constantly on guard, watchful, or easily startled?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["Hypervigilance", "Easily startled"],
          },
          {
            id: "pcptsd-4",
            type: "yes-no",
            question: "Felt numb or detached from people, activities, or your surroundings?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["Emotional numbing", "Detachment"],
          },
          {
            id: "pcptsd-5",
            type: "yes-no",
            question:
              "Felt guilty or been unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?",
            options: [
              { value: "yes", label: "Yes", score: 1 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "pcptsd",
            weight: 1,
            riskFactors: ["Guilt", "Self-blame", "PTSD"],
          },
        ],
      },
      {
        id: "suicide",
        title: "Suicide Assessment (8Q)",
        description: "Assessment to screen for suicide risk",
        icon: "AlertTriangle",
        required: false,
        estimatedTime: 3,
        questions: [
          {
            id: "suicide-1",
            type: "yes-no",
            question: "Have you been thinking about death, or thinking that you would be better off dead?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "1", label: "Yes", score: 1 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicidal ideation"],
          },
          {
            id: "suicide-2",
            type: "yes-no",
            question: "Have you wanted to harm yourself or make yourself bleed?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "1", label: "Yes", score: 1 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Self-harm"],
          },
          {
            id: "suicide-3",
            type: "yes-no",
            question: "Have you been thinking about suicide (in the past month including today)?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "6", label: "Yes", score: 6 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicidal thoughts"],
          },
          {
            id: "suicide-4",
            type: "radio",
            question: "If you answered yes to thinking about suicide: Are you able to control your suicidal thoughts, or can you say that you probably would not act on them right now?",
            options: [
              { value: "0", label: "Yes", score: 0 },
              { value: "8", label: "No", score: 8 },
            ],
            required: false,
            category: "suicide",
            weight: 1,
            riskFactors: ["Loss of control over suicidal thoughts"],
          },
          {
            id: "suicide-5",
            type: "yes-no",
            question: "Have you been making plans for suicide (in the past month including today)?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "8", label: "Yes", score: 8 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide plan"],
          },
          {
            id: "suicide-6",
            type: "yes-no",
            question: "Have you been making arrangements to harm yourself or preparing for suicide with the intention of dying (in the past month including today)?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "9", label: "Yes", score: 9 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide preparation"],
          },
          {
            id: "suicide-7",
            type: "yes-no",
            question: "Have you been injuring yourself but without intending to cause death?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "4", label: "Yes", score: 4 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Self-inflicted injury"],
          },
          {
            id: "suicide-8",
            type: "yes-no",
            question: "Have you attempted suicide expecting/intending to die (in your lifetime)?",
            options: [
              { value: "0", label: "No", score: 0 },
              { value: "10", label: "Yes", score: 10 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Suicide attempt"],
          },
          {
            id: "suicide-9",
            type: "yes-no",
            question: "Have you ever attempted suicide?",
            options: [
              { value: "0", label: "Never", score: 0 },
              { value: "4", label: "Yes", score: 4 },
            ],
            required: true,
            category: "suicide",
            weight: 1,
            riskFactors: ["Past suicide attempt"],
          },
        ],
      },
      {
        id: "thai-cv-risk",
        title: "Thai CV Risk Score Assessment",
        description: "Assessment to predict 10-year cardiovascular disease risk for Thai population",
        icon: "Heart",
        required: false,
        estimatedTime: 8,
        questions: [
          {
            id: "thai-cv-1",
            type: "number",
            question: "Your age",
            description: "Please specify your age in years (20-100 years)",
            required: true,
            category: "thai-cv-risk",
            weight: 1,
            min: 20,
            max: 100,
          },
          {
            id: "thai-cv-2",
            type: "multiple-choice",
            question: "Gender",
            options: [
              { value: "male", label: "Male", score: 1 },
              { value: "female", label: "Female", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 1,
          },
          {
            id: "thai-cv-3",
            type: "number",
            question: "Systolic Blood Pressure",
            description: "Specify in mmHg",
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            min: 80,
            max: 250,
            unit: "mmHg",
          },
          {
            id: "thai-cv-4",
            type: "number",
            question: "Diastolic Blood Pressure",
            description: "Specify in mmHg",
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            min: 40,
            max: 150,
            unit: "mmHg",
          },
          {
            id: "thai-cv-5",
            type: "yes-no",
            question: "Do you smoke?",
            options: [
              { value: "yes", label: "Yes", score: 2 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            riskFactors: ["Smoking"],
          },
          {
            id: "thai-cv-6",
            type: "yes-no",
            question: "Do you have diabetes?",
            options: [
              { value: "yes", label: "Yes", score: 2 },
              { value: "no", label: "No", score: 0 },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 2,
            riskFactors: ["Diabetes"],
          },
          {
            id: "thai-cv-7",
            type: "yes-no",
            question: "Do you have blood test results for cholesterol?",
            description: "If yes, you will be asked additional questions about cholesterol levels",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
            required: true,
            category: "thai-cv-risk",
            weight: 1,
          },
          {
            id: "thai-cv-8",
            type: "number",
            question: "Total Cholesterol level",
            description: "Specify in mg/dL (if you have blood test results)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 100,
            max: 400,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-9",
            type: "number",
            question: "HDL Cholesterol level",
            description: "Specify in mg/dL (if you have blood test results)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 20,
            max: 100,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-10",
            type: "number",
            question: "LDL Cholesterol level",
            description: "Specify in mg/dL (if you have blood test results)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 50,
            max: 300,
            unit: "mg/dL",
          },
          {
            id: "thai-cv-11",
            type: "number",
            question: "Triglycerides level",
            description: "Specify in mg/dL (if you have blood test results)",
            required: false,
            category: "thai-cv-risk",
            weight: 1,
            min: 50,
            max: 1000,
            unit: "mg/dL",
          },
        ],
      },
      {
      "title": "Generalized Anxiety Disorder 7-item (GAD-7)",
      "questions": [
        {
          "id": "GAD-1",
          "question": "Feeling nervous, anxious, or on edge",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-2",
          "question": "Not being able to stop or control worrying",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-3",
          "question": "Worrying too much about different things",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-4",
          "question": "Trouble relaxing",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-5",
          "question": "Being so restless that it is hard to sit still",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-6",
          "question": "Becoming easily annoyed or irritable",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        },
        {
          "id": "GAD-7",
          "question": "Feeling afraid as if something awful might happen",
          "options": [
            { "label": "Not at all", "value": 0 },
            { "label": "Several days", "value": 1 },
            { "label": "More than half the days", "value": 2 },
            { "label": "Nearly every day", "value": 3 }
          ]
        }
      ]
    },
    {
      "title": "Depression, Anxiety, and Stress Scale - 21 Items (DASS-21)",
      "questions": [
        {
          "id": "DASS-21-1",
          "question": "I could not feel happy",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-2",
          "question": "I felt that life was meaningless",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-3",
          "question": "I could not motivate myself",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-4",
          "question": "I experienced trembling (e.g., in the hands)",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-5",
          "question": "I felt irrational fear",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-6",
          "question": "I was worried about different situations",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-7",
          "question": "I found it hard to relax",
          "dimension": "Stress",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-8",
          "question": "I was easily irritated",
          "dimension": "Stress",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-9",
          "question": "I felt that everything required too much effort",
          "dimension": "Stress",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-10",
          "question": "I felt that nothing was interesting to do",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-11",
          "question": "I felt worthless",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-12",
          "question": "I felt restless",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-13",
          "question": "I found it difficult to tolerate interruptions to my activities",
          "dimension": "Stress",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-14",
          "question": "I felt that I was about to panic",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-15",
          "question": "I could not get excited at all",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-16",
          "question": "I felt worthless",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-17",
          "question": "I felt that life was meaningless",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-18",
          "question": "I was easily irritated",
          "dimension": "Stress",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-19",
          "question": "I felt worthless",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-20",
          "question": "I felt restless",
          "dimension": "Anxiety",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        },
        {
          "id": "DASS-21-21",
          "question": "I could not motivate myself",
          "dimension": "Depression",
          "options": [
            { "label": "Did not apply to me at all", "value": 0 },
            { "label": "Applied to me to some degree, or some of the time", "value": 1 },
            { "label": "Applied to me a considerable degree, or a good part of the time", "value": 2 },
            { "label": "Applied to me very much, or most of the time", "value": 3 }
          ]
        }
      ]
    },
    {
      "title": "WHO-5 Well-Being Index (WHO-5 WBI)",
      "questions": [
        {
          "id": "WHO-5-WBI-1",
          "question": "I have felt cheerful and in good spirits",
          "options": [
            { "label": "At no time", "value": 0 },
            { "label": "Some of the time", "value": 1 },
            { "label": "Less than half of the time", "value": 2 },
            { "label": "More than half of the time", "value": 3 },
            { "label": "Most of the time", "value": 4 },
            { "label": "All of the time", "value": 5 }
          ]
        },
        {
          "id": "WHO-5-WBI-2",
          "question": "I have felt calm and relaxed",
          "options": [
            { "label": "At no time", "value": 0 },
            { "label": "Some of the time", "value": 1 },
            { "label": "Less than half of the time", "value": 2 },
            { "label": "More than half of the time", "value": 3 },
            { "label": "Most of the time", "value": 4 },
            { "label": "All of the time", "value": 5 }
          ]
        },
        {
          "id": "WHO-5-WBI-3",
          "question": "I have felt active and vigorous",
          "options": [
            { "label": "At no time", "value": 0 },
            { "label": "Some of the time", "value": 1 },
            { "label": "Less than half of the time", "value": 2 },
            { "label": "More than half of the time", "value": 3 },
            { "label": "Most of the time", "value": 4 },
            { "label": "All of the time", "value": 5 }
          ]
        },
        {
          "id": "WHO-5-WBI-4",
          "question": "I woke up feeling fresh and rested",
          "options": [
            { "label": "At no time", "value": 0 },
            { "label": "Some of the time", "value": 1 },
            { "label": "Less than half of the time", "value": 2 },
            { "label": "More than half of the time", "value": 3 },
            { "label": "Most of the time", "value": 4 },
            { "label": "All of the time", "value": 5 }
          ]
        },
        {
          "id": "WHO-5-WBI-5",
          "question": "My daily life has been filled with things that interest me",
          "options": [
            { "label": "At no time", "value": 0 },
            { "label": "Some of the time", "value": 1 },
            { "label": "Less than half of the time", "value": 2 },
            { "label": "More than half of the time", "value": 3 },
            { "label": "Most of the time", "value": 4 },
            { "label": "All of the time", "value": 5 }
          ]
        }
      ]
    },
    {
      "title": "Perceived Stress Scale (PSS)",
      "questions": [
        {
          "id": "PSS-1",
          "question": "Felt that your life was unpredictable",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        },
        {
          "id": "PSS-2",
          "question": "Felt unable to control important things in your life",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        },
        {
          "id": "PSS-3",
          "question": "Felt nervous or stressed",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        },
        {
          "id": "PSS-4",
          "question": "Felt confident about your ability to handle personal problems",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-5",
          "question": "Felt that you could control irritations in your life",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-6",
          "question": "Felt that you were on top of things",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-7",
          "question": "Felt that things were out of your control",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        },
        {
          "id": "PSS-8",
          "question": "Felt angry because of things beyond your control",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        },
        {
          "id": "PSS-9",
          "question": "Felt that you could control the way you accomplished things",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ],
          "reverse_score": true
        },
        {
          "id": "PSS-10",
          "question": "Felt that difficulties were piling up too high",
          "options": [
            { "label": "Never", "value": 0 },
            { "label": "Almost never", "value": 1 },
            { "label": "Sometimes", "value": 2 },
            { "label": "Fairly often", "value": 3 },
            { "label": "Very often", "value": 4 }
          ]
        }
      ]
    },
    {
      "title": "Mini-Mental State Examination (MMSE)",
      "description": "This assessment is used to screen for cognitive impairments, such as memory, language use, and problem-solving abilities.",
      "questions": [
        {
          "id": "MMSE-1",
          "question": "What day is it today?",
          "type": "text",
          "category": "Orientation to time",
          "note": "The correct answer is the current day"
        },
        {
          "id": "MMSE-2",
          "question": "What is today’s date?",
          "type": "text",
          "category": "Orientation to time",
          "note": "The correct answer is the current date"
        },
        {
          "id": "MMSE-3",
          "question": "Where are we now?",
          "type": "text",
          "category": "Orientation to place",
          "note": "The correct answer is the location where the assessment is being conducted"
        },
        {
          "id": "MMSE-4",
          "question": "Repeat 3 words",
          "type": "text",
          "category": "Registration",
          "note": "The assessor provides 3 words for the participant to repeat immediately"
        },
        {
          "id": "MMSE-5",
          "question": "Recall 3 words",
          "type": "text",
          "category": "Recall",
          "note": "Ask the participant to recall the 3 words from the previous question"
        },
        {
          "id": "MMSE-6",
          "question": "Serial 7s / Spell WORLD",
          "type": "text",
          "category": "Attention and calculation",
          "note": "Choose one test: ask the participant to subtract 7 from 100 repeatedly, or to spell the word 'WORLD' backwards"
        },
        {
          "id": "MMSE-7",
          "question": "Name 2 objects",
          "type": "text",
          "category": "Naming",
          "note": "The assessor points to 2 objects (e.g., a pen and a watch) and asks the participant to name them"
        },
        {
          "id": "MMSE-8",
          "question": "Follow a 3-step command",
          "type": "text",
          "category": "Comprehension",
          "note": "The assessor gives a 3-step instruction, e.g., 'Take the paper, fold it in half, and put it on the floor'"
        },
        {
          "id": "MMSE-9",
          "question": "Write a sentence",
          "type": "text",
          "category": "Writing",
          "note": "Ask the participant to write any sentence"
        },
        {
          "id": "MMSE-10",
          "question": "Copy the pentagons",
          "type": "text",
          "category": "Visuospatial",
          "note": "The assessor asks the participant to draw two overlapping pentagons"
        }
      ]
    },
    ],
  },
}

// Helper function to get assessment categories based on current language
export function getAssessmentCategories(locale: "th" | "en" = "th"): AssessmentCategory[] {
  return assessmentData[locale].categories as AssessmentCategory[]
}

// Export for backward compatibility (if still needed, otherwise can be removed)
export const assessmentCategories = assessmentData.th.categories as AssessmentCategory[]
