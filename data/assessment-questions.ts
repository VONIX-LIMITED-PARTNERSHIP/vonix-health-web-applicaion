export type AssessmentQuestion = {
  id: string
  question: string
  questionEn?: string
  type: "single" | "multiple" | "number" | "text" | "scale"
  options?: Array<{
    value: string
    valueEn?: string
    score: number
  }>
  required: boolean
  min?: number
  max?: number
  step?: number
  placeholder?: string
  placeholderEn?: string
}

export type AssessmentCategory = {
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  icon: string
  color: string
  questions: AssessmentQuestion[]
}

export type AssessmentAnswer = {
  questionId: string
  answer: string | string[] | number | null
  score: number
  isValid: boolean
}

export interface AssessmentResult {
  categoryId: string
  totalScore: number
  maxScore: number
  percentage: number
  riskLevel: "low" | "medium" | "high" | "very-high"
  riskFactors: string[]
  recommendations: string[]
}

export const assessmentCategories: AssessmentCategory[] = [
  {
    id: "basic",
    title: "ข้อมูลสุขภาพพื้นฐาน",
    titleEn: "Basic Health Information",
    description: "ข้อมูลพื้นฐานเกี่ยวกับสุขภาพและประวัติการรักษา",
    descriptionEn: "Basic information about health and medical history",
    icon: "User",
    color: "blue",
    questions: [
      {
        id: "basic-1",
        question: "อายุของคุณ",
        questionEn: "Your age",
        type: "number",
        required: true,
        min: 1,
        max: 120,
        placeholder: "กรอกอายุ",
        placeholderEn: "Enter your age",
      },
      {
        id: "basic-2",
        question: "เพศ",
        questionEn: "Gender",
        type: "single",
        required: true,
        options: [
          { value: "ชาย", valueEn: "Male", score: 0 },
          { value: "หญิง", valueEn: "Female", score: 0 },
          { value: "อื่นๆ", valueEn: "Other", score: 0 },
        ],
      },
      {
        id: "basic-3",
        question: "น้ำหนัก (กิโลกรัม)",
        questionEn: "Weight (kg)",
        type: "number",
        required: true,
        min: 20,
        max: 300,
        step: 0.1,
        placeholder: "กรอกน้ำหนัก",
        placeholderEn: "Enter your weight",
      },
      {
        id: "basic-4",
        question: "ส่วนสูง (เซนติเมตร)",
        questionEn: "Height (cm)",
        type: "number",
        required: true,
        min: 100,
        max: 250,
        placeholder: "กรอกส่วนสูง",
        placeholderEn: "Enter your height",
      },
      {
        id: "basic-5",
        question: "คุณออกกำลังกายบ่อยแค่ไหน?",
        questionEn: "How often do you exercise?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยออกกำลังกาย", valueEn: "Never exercise", score: 4 },
          { value: "นานๆ ครั้ง (น้อยกว่า 1 ครั้งต่อสัปดาห์)", valueEn: "Rarely (less than once a week)", score: 3 },
          { value: "บางครั้ง (1-2 ครั้งต่อสัปดาห์)", valueEn: "Sometimes (1-2 times per week)", score: 2 },
          { value: "สม่ำเสมอ (3-4 ครั้งต่อสัปดาห์)", valueEn: "Regularly (3-4 times per week)", score: 1 },
          { value: "ทุกวัน", valueEn: "Daily", score: 0 },
        ],
      },
      {
        id: "basic-6",
        question: "คุณมีโรคประจำตัวหรือไม่?",
        questionEn: "Do you have any chronic diseases?",
        type: "multiple",
        required: true,
        options: [
          { value: "ไม่มีโรคประจำตัว", valueEn: "No chronic diseases", score: 0 },
          { value: "เบาหวาน", valueEn: "Diabetes", score: 3 },
          { value: "ความดันโลหิตสูง", valueEn: "Hypertension", score: 2 },
          { value: "โรคหัวใจ", valueEn: "Heart disease", score: 4 },
          { value: "โรคไต", valueEn: "Kidney disease", score: 3 },
          { value: "โรคตับ", valueEn: "Liver disease", score: 3 },
          { value: "โรคปอด", valueEn: "Lung disease", score: 3 },
          { value: "โรคมะเร็ง", valueEn: "Cancer", score: 5 },
          { value: "โรคอื่นๆ", valueEn: "Other diseases", score: 2 },
        ],
      },
      {
        id: "basic-7",
        question: "คุณมีการแพ้อะไรบ้าง?",
        questionEn: "What are you allergic to?",
        type: "multiple",
        required: true,
        options: [
          { value: "ไม่มีการแพ้", valueEn: "No allergies", score: 0 },
          { value: "แพ้ยา", valueEn: "Drug allergy", score: 2 },
          { value: "แพ้อาหาร", valueEn: "Food allergy", score: 1 },
          { value: "แพ้ฝุ่น", valueEn: "Dust allergy", score: 1 },
          { value: "แพ้เกสรดอกไม้", valueEn: "Pollen allergy", score: 1 },
          { value: "แพ้สัตว์", valueEn: "Animal allergy", score: 1 },
          { value: "แพ้อื่นๆ", valueEn: "Other allergies", score: 1 },
        ],
      },
      {
        id: "basic-8",
        question: "คุณสูบบุหรี่หรือไม่?",
        questionEn: "Do you smoke?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่สูบบุหรี่", valueEn: "Non-smoker", score: 0 },
          { value: "เคยสูบแต่เลิกแล้ว", valueEn: "Former smoker", score: 1 },
          { value: "สูบบ้างไม่บ้าง", valueEn: "Occasional smoker", score: 3 },
          { value: "สูบเป็นประจำ", valueEn: "Regular smoker", score: 5 },
        ],
      },
      {
        id: "basic-9",
        question: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
        questionEn: "How often do you drink alcohol?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่ดื่มเลย", valueEn: "Never drink", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "สัปดาห์ละ 1-2 ครั้ง", valueEn: "1-2 times per week", score: 2 },
          { value: "เกือบทุกวัน", valueEn: "Almost daily", score: 4 },
          { value: "ทุกวัน", valueEn: "Daily", score: 5 },
        ],
      },
    ],
  },
  {
    id: "heart",
    title: "สุขภาพหัวใจและหลอดเลือด",
    titleEn: "Cardiovascular Health",
    description: "ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด",
    descriptionEn: "Assess cardiovascular disease risk",
    icon: "Heart",
    color: "red",
    questions: [
      {
        id: "heart-1",
        question: "คุณมีอาการเจ็บหน้าอกบ่อยไหม?",
        questionEn: "Do you often have chest pain?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยมีอาการ", valueEn: "Never have symptoms", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 2 },
          { value: "บางครั้งเมื่อออกแรง", valueEn: "Sometimes during exertion", score: 4 },
          { value: "บ่อยครั้ง", valueEn: "Frequently", score: 5 },
        ],
      },
      {
        id: "heart-2",
        question: "คุณรู้สึกหายใจลำบากเมื่อทำกิจกรรมปกติหรือไม่?",
        questionEn: "Do you feel short of breath during normal activities?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคย", valueEn: "Never", score: 0 },
          { value: "เมื่อออกแรงมาก", valueEn: "Only during intense exercise", score: 1 },
          { value: "เมื่อเดินขึ้นบันได", valueEn: "When climbing stairs", score: 3 },
          { value: "เมื่อเดินระยะสั้น", valueEn: "When walking short distances", score: 5 },
        ],
      },
      {
        id: "heart-3",
        question: "คุณมีอาการใจสั่นหรือหัวใจเต้นผิดจังหวะหรือไม่?",
        questionEn: "Do you have palpitations or irregular heartbeat?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยมี", valueEn: "Never", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 2 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Frequently", score: 5 },
        ],
      },
      {
        id: "heart-4",
        question: "คุณมีประวัติครอบครัวเป็นโรคหัวใจหรือไม่?",
        questionEn: "Do you have a family history of heart disease?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่มี", valueEn: "No", score: 0 },
          { value: "ญาติไกล", valueEn: "Distant relatives", score: 2 },
          { value: "พ่อแม่หรือพี่น้อง", valueEn: "Parents or siblings", score: 4 },
          { value: "หลายคนในครอบครัว", valueEn: "Multiple family members", score: 5 },
        ],
      },
      {
        id: "heart-5",
        question: "ระดับความเครียดในชีวิตประจำวันของคุณ",
        questionEn: "Your daily stress level",
        type: "scale",
        required: true,
        min: 1,
        max: 10,
      },
    ],
  },
  {
    id: "nutrition",
    title: "โภชนาการและการออกกำลังกาย",
    titleEn: "Nutrition and Exercise",
    description: "ประเมินพฤติกรรมการกินและการออกกำลังกาย",
    descriptionEn: "Assess eating habits and exercise behavior",
    icon: "Apple",
    color: "green",
    questions: [
      {
        id: "nutrition-1",
        question: "คุณกินผักและผลไม้วันละกี่ครั้ง?",
        questionEn: "How many servings of fruits and vegetables do you eat per day?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่กินเลย", valueEn: "None", score: 5 },
          { value: "1-2 ครั้ง", valueEn: "1-2 servings", score: 3 },
          { value: "3-4 ครั้ง", valueEn: "3-4 servings", score: 1 },
          { value: "5 ครั้งขึ้นไป", valueEn: "5 or more servings", score: 0 },
        ],
      },
      {
        id: "nutrition-2",
        question: "คุณกินอาหารจานด่วนหรืออาหารแปรรูปบ่อยแค่ไหน?",
        questionEn: "How often do you eat fast food or processed food?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยกิน", valueEn: "Never", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "สัปดาห์ละ 1-2 ครั้ง", valueEn: "1-2 times per week", score: 3 },
          { value: "เกือบทุกวัน", valueEn: "Almost daily", score: 5 },
        ],
      },
      {
        id: "nutrition-3",
        question: "คุณดื่มน้ำวันละกี่แก้ว?",
        questionEn: "How many glasses of water do you drink per day?",
        type: "single",
        required: true,
        options: [
          { value: "น้อยกว่า 4 แก้ว", valueEn: "Less than 4 glasses", score: 3 },
          { value: "4-6 แก้ว", valueEn: "4-6 glasses", score: 2 },
          { value: "7-8 แก้ว", valueEn: "7-8 glasses", score: 0 },
          { value: "มากกว่า 8 แก้ว", valueEn: "More than 8 glasses", score: 0 },
        ],
      },
      {
        id: "nutrition-4",
        question: "คุณออกกำลังกายสัปดาห์ละกี่ครั้ง?",
        questionEn: "How many times per week do you exercise?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยออกกำลังกาย", valueEn: "Never", score: 5 },
          { value: "1 ครั้ง", valueEn: "Once", score: 3 },
          { value: "2-3 ครั้ง", valueEn: "2-3 times", score: 1 },
          { value: "4 ครั้งขึ้นไป", valueEn: "4 or more times", score: 0 },
        ],
      },
      {
        id: "nutrition-5",
        question: "คุณนอนเฉลี่ยวันละกี่ชั่วโมง?",
        questionEn: "How many hours do you sleep per day on average?",
        type: "single",
        required: true,
        options: [
          { value: "น้อยกว่า 6 ชั่วโมง", valueEn: "Less than 6 hours", score: 4 },
          { value: "6-7 ชั่วโมง", valueEn: "6-7 hours", score: 2 },
          { value: "7-8 ชั่วโมง", valueEn: "7-8 hours", score: 0 },
          { value: "มากกว่า 8 ชั่วโมง", valueEn: "More than 8 hours", score: 1 },
        ],
      },
    ],
  },
  {
    id: "mental",
    title: "สุขภาพจิตและความเครียด",
    titleEn: "Mental Health and Stress",
    description: "ประเมินสุขภาพจิตและระดับความเครียด",
    descriptionEn: "Assess mental health and stress levels",
    icon: "Brain",
    color: "purple",
    questions: [
      {
        id: "mental-1",
        question: "คุณรู้สึกเครียดบ่อยแค่ไหน?",
        questionEn: "How often do you feel stressed?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยเครียด", valueEn: "Never stressed", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ตลอดเวลา", valueEn: "All the time", score: 5 },
        ],
      },
      {
        id: "mental-2",
        question: "คุณมีปัญหาการนอนหลับหรือไม่?",
        questionEn: "Do you have sleep problems?",
        type: "single",
        required: true,
        options: [
          { value: "นอนหลับสนิท", valueEn: "Sleep well", score: 0 },
          { value: "นอนยากบางครั้ง", valueEn: "Sometimes hard to fall asleep", score: 2 },
          { value: "ตื่นกลางคืนบ่อย", valueEn: "Often wake up at night", score: 3 },
          { value: "นอนไม่หลับเกือบทุกคืน", valueEn: "Insomnia almost every night", score: 5 },
        ],
      },
      {
        id: "mental-3",
        question: "คุณรู้สึกเศร้าหรือหดหู่บ่อยไหม?",
        questionEn: "Do you often feel sad or depressed?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคย", valueEn: "Never", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ตลอดเวลา", valueEn: "All the time", score: 5 },
        ],
      },
      {
        id: "mental-4",
        question: "คุณรู้สึกวิตกกังวลบ่อยไหม?",
        questionEn: "Do you often feel anxious or worried?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคย", valueEn: "Never", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ตลอดเวลา", valueEn: "All the time", score: 5 },
        ],
      },
      {
        id: "mental-5",
        question: "คุณมีกิจกรรมที่ช่วยผ่อนคลายความเครียดหรือไม่?",
        questionEn: "Do you have activities that help relieve stress?",
        type: "single",
        required: true,
        options: [
          { value: "มีหลายกิจกรรม", valueEn: "Have many activities", score: 0 },
          { value: "มีบ้าง", valueEn: "Have some", score: 1 },
          { value: "มีน้อย", valueEn: "Have few", score: 3 },
          { value: "ไม่มีเลย", valueEn: "None at all", score: 5 },
        ],
      },
    ],
  },
  {
    id: "physical",
    title: "สุขภาพกายและการเคลื่อนไหว",
    titleEn: "Physical Health and Movement",
    description: "ประเมินสุขภาพกายและความแข็งแรงของร่างกาย",
    descriptionEn: "Assess physical health and body strength",
    icon: "Dumbbell",
    color: "orange",
    questions: [
      {
        id: "physical-1",
        question: "คุณมีอาการปวดหลังหรือคอบ่อยไหม?",
        questionEn: "Do you often have back or neck pain?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยปวด", valueEn: "Never have pain", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ปวดตลอดเวลา", valueEn: "Pain all the time", score: 5 },
        ],
      },
      {
        id: "physical-2",
        question: "คุณสามารถเดินขึ้นบันได 2-3 ชั้นโดยไม่หอบได้หรือไม่?",
        questionEn: "Can you walk up 2-3 flights of stairs without getting out of breath?",
        type: "single",
        required: true,
        options: [
          { value: "ทำได้ง่าย", valueEn: "Very easy", score: 0 },
          { value: "ทำได้", valueEn: "Can do", score: 1 },
          { value: "ทำได้แต่เหนื่อย", valueEn: "Can do but tired", score: 3 },
          { value: "ทำได้ยาก", valueEn: "Difficult", score: 4 },
          { value: "ทำไม่ได้", valueEn: "Cannot do", score: 5 },
        ],
      },
      {
        id: "physical-3",
        question: "คุณมีปัญหาเรื่องการทรงตัวหรือการเดินหรือไม่?",
        questionEn: "Do you have balance or walking problems?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่มีปัญหา", valueEn: "No problems", score: 0 },
          { value: "มีปัญหาเล็กน้อย", valueEn: "Minor problems", score: 2 },
          { value: "มีปัญหาปานกลาง", valueEn: "Moderate problems", score: 4 },
          { value: "มีปัญหามาก", valueEn: "Severe problems", score: 5 },
        ],
      },
      {
        id: "physical-4",
        question: "คุณรู้สึกเหนื่อยล้าง่ายหรือไม่?",
        questionEn: "Do you get tired easily?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยเหนื่อย", valueEn: "Never tired", score: 0 },
          { value: "เหนื่อยเมื่อทำงานหนัก", valueEn: "Tired after hard work", score: 1 },
          { value: "เหนื่อยเมื่อทำงานปกติ", valueEn: "Tired after normal work", score: 3 },
          { value: "เหนื่อยง่าย", valueEn: "Get tired easily", score: 4 },
          { value: "เหนื่อยตลอดเวลา", valueEn: "Always tired", score: 5 },
        ],
      },
      {
        id: "physical-5",
        question: "คุณมีอาการปวดข้อหรือกล้ามเนื้อบ่อยไหม?",
        questionEn: "Do you often have joint or muscle pain?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยปวด", valueEn: "Never have pain", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ปวดตลอดเวลา", valueEn: "Pain all the time", score: 5 },
        ],
      },
    ],
  },
  {
    id: "sleep",
    title: "คุณภาพการนอนหลับ",
    titleEn: "Sleep Quality",
    description: "ประเมินคุณภาพการนอนและการพักผ่อน",
    descriptionEn: "Assess sleep quality and rest patterns",
    icon: "Moon",
    color: "indigo",
    questions: [
      {
        id: "sleep-1",
        question: "คุณนอนเฉลี่ยวันละกี่ชั่วโมง?",
        questionEn: "How many hours do you sleep per day on average?",
        type: "single",
        required: true,
        options: [
          { value: "น้อยกว่า 5 ชั่วโมง", valueEn: "Less than 5 hours", score: 5 },
          { value: "5-6 ชั่วโมง", valueEn: "5-6 hours", score: 3 },
          { value: "7-8 ชั่วโมง", valueEn: "7-8 hours", score: 0 },
          { value: "9-10 ชั่วโมง", valueEn: "9-10 hours", score: 1 },
          { value: "มากกว่า 10 ชั่วโมง", valueEn: "More than 10 hours", score: 2 },
        ],
      },
      {
        id: "sleep-2",
        question: "คุณใช้เวลานานแค่ไหนในการเข้านอน?",
        questionEn: "How long does it take you to fall asleep?",
        type: "single",
        required: true,
        options: [
          { value: "น้อยกว่า 15 นาที", valueEn: "Less than 15 minutes", score: 0 },
          { value: "15-30 นาที", valueEn: "15-30 minutes", score: 1 },
          { value: "30-60 นาที", valueEn: "30-60 minutes", score: 3 },
          { value: "มากกว่า 1 ชั่วโมง", valueEn: "More than 1 hour", score: 5 },
        ],
      },
      {
        id: "sleep-3",
        question: "คุณตื่นกลางคืนบ่อยไหม?",
        questionEn: "Do you often wake up during the night?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่เคยตื่น", valueEn: "Never wake up", score: 0 },
          { value: "นานๆ ครั้ง", valueEn: "Rarely", score: 1 },
          { value: "บางครั้ง", valueEn: "Sometimes", score: 3 },
          { value: "บ่อยครั้ง", valueEn: "Often", score: 4 },
          { value: "ทุกคืน", valueEn: "Every night", score: 5 },
        ],
      },
      {
        id: "sleep-4",
        question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นหรือไม่?",
        questionEn: "Do you feel refreshed when you wake up?",
        type: "single",
        required: true,
        options: [
          { value: "สดชื่นมาก", valueEn: "Very refreshed", score: 0 },
          { value: "สดชื่น", valueEn: "Refreshed", score: 1 },
          { value: "ปกติ", valueEn: "Normal", score: 2 },
          { value: "เหนื่อย", valueEn: "Tired", score: 4 },
          { value: "เหนื่อยมาก", valueEn: "Very tired", score: 5 },
        ],
      },
      {
        id: "sleep-5",
        question: "คุณกรนหรือมีปัญหาการหายใจขณะนอนหรือไม่?",
        questionEn: "Do you snore or have breathing problems while sleeping?",
        type: "single",
        required: true,
        options: [
          { value: "ไม่มีปัญหา", valueEn: "No problems", score: 0 },
          { value: "กรนเบาๆ", valueEn: "Light snoring", score: 2 },
          { value: "กรนดัง", valueEn: "Loud snoring", score: 3 },
          { value: "หยุดหายใจขณะนอน", valueEn: "Stop breathing while sleeping", score: 5 },
        ],
      },
    ],
  },
]
