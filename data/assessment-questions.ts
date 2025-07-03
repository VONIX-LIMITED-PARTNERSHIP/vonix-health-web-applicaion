import type { AssessmentCategory } from "@/types/assessment"

// Define the guest assessment category with its questions
export const guestAssessmentCategory: AssessmentCategory = {
  id: "guest-assessment",
  title: {
    th: "แบบประเมินสุขภาพเบื้องต้น (สำหรับผู้เยี่ยมชม)",
    en: "Basic Health Assessment (Guest)",
  },
  description: {
    th: "ประเมินสุขภาพพื้นฐานของคุณโดยไม่ต้องเข้าสู่ระบบ",
    en: "Assess your basic health without logging in.",
  },
  estimatedTime: {
    th: "5 นาที",
    en: "5 min",
  },
  required: false,
  questions: [
    {
      id: "guest-1",
      question: {
        th: "คุณอายุเท่าไหร่?",
        en: "How old are you?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 17], score: 10 },
        { range: [18, 30], score: 0 },
        { range: [31, 50], score: 5 },
        { range: [51, 100], score: 15 },
      ],
    },
    {
      id: "guest-2",
      question: {
        th: "เพศของคุณคืออะไร?",
        en: "What is your gender?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "male", label: { th: "ชาย", en: "Male" }, score: 0 },
        { value: "female", label: { th: "หญิง", en: "Female" }, score: 0 },
        { value: "other", label: { th: "อื่น ๆ", en: "Other" }, score: 0 },
      ],
    },
    {
      id: "guest-3",
      question: {
        th: "น้ำหนักของคุณ (กิโลกรัม)?",
        en: "What is your weight (kg)?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 40], score: 10 },
        { range: [41, 80], score: 0 },
        { range: [81, 150], score: 10 },
      ],
    },
    {
      id: "guest-4",
      question: {
        th: "ส่วนสูงของคุณ (เซนติเมตร)?",
        en: "What is your height (cm)?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 140], score: 10 },
        { range: [141, 190], score: 0 },
        { range: [191, 250], score: 10 },
      ],
    },
    {
      id: "guest-5",
      question: {
        th: "คุณมีโรคประจำตัวอะไรบ้าง? (เลือกได้หลายข้อ)",
        en: "Do you have any chronic diseases? (Select all that apply)",
      },
      type: "multiple-choice",
      required: false,
      options: [
        { value: "เบาหวาน", label: { th: "เบาหวาน", en: "Diabetes" }, score: 10 },
        { value: "ความดันโลหิตสูง", label: { th: "ความดันโลหิตสูง", en: "Hypertension" }, score: 10 },
        { value: "โรคหัวใจ", label: { th: "โรคหัวใจ", en: "Heart Disease" }, score: 15 },
        { value: "โรคไต", label: { th: "โรคไต", en: "Kidney Disease" }, score: 15 },
        { value: "โรคหอบหืด", label: { th: "โรคหอบหืด", en: "Asthma" }, score: 5 },
        { value: "ไม่มีโรคประจำตัว", label: { th: "ไม่มีโรคประจำตัว", en: "None" }, score: 0 },
      ],
    },
    {
      id: "guest-6",
      question: {
        th: "คุณมีประวัติการแพ้ยาหรืออาหารหรือไม่? (เลือกได้หลายข้อ)",
        en: "Do you have any drug or food allergies? (Select all that apply)",
      },
      type: "multiple-choice",
      required: false,
      options: [
        { value: "แพ้ยา", label: { th: "แพ้ยา", en: "Drug allergy" }, score: 5 },
        { value: "แพ้อาหาร", label: { th: "แพ้อาหาร", en: "Food allergy" }, score: 5 },
        { value: "ไม่มีการแพ้", label: { th: "ไม่มีการแพ้", en: "None" }, score: 0 },
      ],
    },
    {
      id: "guest-7",
      question: {
        th: "คุณออกกำลังกายบ่อยแค่ไหน?",
        en: "How often do you exercise?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่เคย", label: { th: "ไม่เคย", en: "Never" }, score: 10 },
        { value: "1-2 ครั้ง/สัปดาห์", label: { th: "1-2 ครั้ง/สัปดาห์", en: "1-2 times/week" }, score: 5 },
        { value: "3-4 ครั้ง/สัปดาห์", label: { th: "3-4 ครั้ง/สัปดาห์", en: "3-4 times/week" }, score: 0 },
        { value: "ทุกวัน", label: { th: "ทุกวัน", en: "Daily" }, score: 0 },
      ],
    },
    {
      id: "guest-8",
      question: {
        th: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
        en: "How often do you drink alcohol?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่ดื่ม", label: { th: "ไม่ดื่ม", en: "Never" }, score: 0 },
        { value: "นานๆ ครั้ง", label: { th: "นานๆ ครั้ง", en: "Rarely" }, score: 2 },
        { value: "1-2 ครั้ง/สัปดาห์", label: { th: "1-2 ครั้ง/สัปดาห์", en: "1-2 times/week" }, score: 5 },
        { value: "ทุกวัน", label: { th: "ทุกวัน", en: "Daily" }, score: 10 },
      ],
    },
    {
      id: "guest-9",
      question: {
        th: "คุณสูบบุหรี่หรือไม่?",
        en: "Do you smoke?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่สูบ", label: { th: "ไม่สูบ", en: "No" }, score: 0 },
        { value: "เคยสูบแต่เลิกแล้ว", label: { th: "เคยสูบแต่เลิกแล้ว", en: "Used to, but quit" }, score: 5 },
        { value: "สูบเป็นครั้งคราว", label: { th: "สูบเป็นครั้งคราว", en: "Occasionally" }, score: 10 },
        { value: "สูบเป็นประจำ", label: { th: "สูบเป็นประจำ", en: "Regularly" }, score: 15 },
      ],
    },
    {
      id: "guest-10",
      question: {
        th: "คุณนอนหลับเพียงพอหรือไม่? (7-9 ชั่วโมงต่อคืน)",
        en: "Do you get enough sleep? (7-9 hours per night)",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "เพียงพอ", label: { th: "เพียงพอ", en: "Yes" }, score: 0 },
        { value: "ไม่เพียงพอ", label: { th: "ไม่เพียงพอ", en: "No" }, score: 5 },
      ],
    },
  ],
}

const basicAssessmentCategory: AssessmentCategory = {
  id: "basic",
  title: {
    th: "แบบประเมินสุขภาพพื้นฐาน",
    en: "Basic Health Assessment",
  },
  description: {
    th: "ประเมินข้อมูลสุขภาพพื้นฐานของคุณเพื่อเริ่มต้นการดูแลสุขภาพ",
    en: "Assess your basic health information to start your health journey.",
  },
  estimatedTime: {
    th: "5 นาที",
    en: "5 min",
  },
  required: true,
  questions: [
    {
      id: "basic-1",
      question: {
        th: "คุณอายุเท่าไหร่?",
        en: "How old are you?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 17], score: 10 },
        { range: [18, 30], score: 0 },
        { range: [31, 50], score: 5 },
        { range: [51, 100], score: 15 },
      ],
    },
    {
      id: "basic-2",
      question: {
        th: "เพศของคุณคืออะไร?",
        en: "What is your gender?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "male", label: { th: "ชาย", en: "Male" }, score: 0 },
        { value: "female", label: { th: "หญิง", en: "Female" }, score: 0 },
        { value: "other", label: { th: "อื่น ๆ", en: "Other" }, score: 0 },
      ],
    },
    {
      id: "basic-3",
      question: {
        th: "น้ำหนักของคุณ (กิโลกรัม)?",
        en: "What is your weight (kg)?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 40], score: 10 },
        { range: [41, 80], score: 0 },
        { range: [81, 150], score: 10 },
      ],
    },
    {
      id: "basic-4",
      question: {
        th: "ส่วนสูงของคุณ (เซนติเมตร)?",
        en: "What is your height (cm)?",
      },
      type: "number",
      required: true,
      options: [],
      scoreMapping: [
        { range: [0, 140], score: 10 },
        { range: [141, 190], score: 0 },
        { range: [191, 250], score: 10 },
      ],
    },
    {
      id: "basic-5",
      question: {
        th: "คุณมีโรคประจำตัวอะไรบ้าง? (เลือกได้หลายข้อ)",
        en: "Do you have any chronic diseases? (Select all that apply)",
      },
      type: "multiple-choice",
      required: false,
      options: [
        { value: "เบาหวาน", label: { th: "เบาหวาน", en: "Diabetes" }, score: 10 },
        { value: "ความดันโลหิตสูง", label: { th: "ความดันโลหิตสูง", en: "Hypertension" }, score: 10 },
        { value: "โรคหัวใจ", label: { th: "โรคหัวใจ", en: "Heart Disease" }, score: 15 },
        { value: "โรคไต", label: { th: "โรคไต", en: "Kidney Disease" }, score: 15 },
        { value: "โรคหอบหืด", label: { th: "โรคหอบหืด", en: "Asthma" }, score: 5 },
        { value: "ไม่มีโรคประจำตัว", label: { th: "ไม่มีโรคประจำตัว", en: "None" }, score: 0 },
      ],
    },
    {
      id: "basic-6",
      question: {
        th: "คุณมีประวัติการแพ้ยาหรืออาหารหรือไม่? (เลือกได้หลายข้อ)",
        en: "Do you have any drug or food allergies? (Select all that apply)",
      },
      type: "multiple-choice",
      required: false,
      options: [
        { value: "แพ้ยา", label: { th: "แพ้ยา", en: "Drug allergy" }, score: 5 },
        { value: "แพ้อาหาร", label: { th: "แพ้อาหาร", en: "Food allergy" }, score: 5 },
        { value: "ไม่มีการแพ้", label: { th: "ไม่มีการแพ้", en: "None" }, score: 0 },
      ],
    },
    {
      id: "basic-7",
      question: {
        th: "คุณออกกำลังกายบ่อยแค่ไหน?",
        en: "How often do you exercise?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่เคย", label: { th: "ไม่เคย", en: "Never" }, score: 10 },
        { value: "1-2 ครั้ง/สัปดาห์", label: { th: "1-2 ครั้ง/สัปดาห์", en: "1-2 times/week" }, score: 5 },
        { value: "3-4 ครั้ง/สัปดาห์", label: { th: "3-4 ครั้ง/สัปดาห์", en: "3-4 times/week" }, score: 0 },
        { value: "ทุกวัน", label: { th: "ทุกวัน", en: "Daily" }, score: 0 },
      ],
    },
    {
      id: "basic-8",
      question: {
        th: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
        en: "How often do you drink alcohol?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่ดื่ม", label: { th: "ไม่ดื่ม", en: "Never" }, score: 0 },
        { value: "นานๆ ครั้ง", label: { th: "นานๆ ครั้ง", en: "Rarely" }, score: 2 },
        { value: "1-2 ครั้ง/สัปดาห์", label: { th: "1-2 ครั้ง/สัปดาห์", en: "1-2 times/week" }, score: 5 },
        { value: "ทุกวัน", label: { th: "ทุกวัน", en: "Daily" }, score: 10 },
      ],
    },
    {
      id: "basic-9",
      question: {
        th: "คุณสูบบุหรี่หรือไม่?",
        en: "Do you smoke?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "ไม่สูบ", label: { th: "ไม่สูบ", en: "No" }, score: 0 },
        { value: "เคยสูบแต่เลิกแล้ว", label: { th: "เคยสูบแต่เลิกแล้ว", en: "Used to, but quit" }, score: 5 },
        { value: "สูบเป็นครั้งคราว", label: { th: "สูบเป็นครั้งคราว", en: "Occasionally" }, score: 10 },
        { value: "สูบเป็นประจำ", label: { th: "สูบเป็นประจำ", en: "Regularly" }, score: 15 },
      ],
    },
    {
      id: "basic-10",
      question: {
        th: "คุณนอนหลับเพียงพอหรือไม่? (7-9 ชั่วโมงต่อคืน)",
        en: "Do you get enough sleep? (7-9 hours per night)",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "เพียงพอ", label: { th: "เพียงพอ", en: "Yes" }, score: 0 },
        { value: "ไม่เพียงพอ", label: { th: "ไม่เพียงพอ", en: "No" }, score: 5 },
      ],
    },
  ],
}

const heartAssessmentCategory: AssessmentCategory = {
  id: "heart",
  title: {
    th: "แบบประเมินสุขภาพหัวใจ",
    en: "Heart Health Assessment",
  },
  description: {
    th: "ประเมินความเสี่ยงและสุขภาพหัวใจของคุณ",
    en: "Assess your risk and heart health.",
  },
  estimatedTime: {
    th: "10 นาที",
    en: "10 min",
  },
  required: true,
  questions: [
    {
      id: "heart-1",
      question: {
        th: "คุณมีประวัติครอบครัวเป็นโรคหัวใจหรือไม่?",
        en: "Do you have a family history of heart disease?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "yes", label: { th: "มี", en: "Yes" }, score: 10 },
        { value: "no", label: { th: "ไม่มี", en: "No" }, score: 0 },
      ],
    },
    {
      id: "heart-2",
      question: {
        th: "คุณมีอาการเจ็บหน้าอกหรือไม่?",
        en: "Do you experience chest pain?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "yes", label: { th: "มี", en: "Yes" }, score: 15 },
        { value: "no", label: { th: "ไม่มี", en: "No" }, score: 0 },
      ],
    },
    {
      id: "heart-3",
      question: {
        th: "คุณมีอาการเหนื่อยง่ายผิดปกติหรือไม่?",
        en: "Do you experience unusual fatigue?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "yes", label: { th: "มี", en: "Yes" }, score: 10 },
        { value: "no", label: { th: "ไม่มี", en: "No" }, score: 0 },
      ],
    },
  ],
}

const nutritionAssessmentCategory: AssessmentCategory = {
  id: "nutrition",
  title: {
    th: "แบบประเมินโภชนาการ",
    en: "Nutrition Assessment",
  },
  description: {
    th: "ประเมินพฤติกรรมการกินและโภชนาการของคุณ",
    en: "Assess your eating habits and nutrition.",
  },
  estimatedTime: {
    th: "8 นาที",
    en: "8 min",
  },
  required: true,
  questions: [
    {
      id: "nutrition-1",
      question: {
        th: "คุณรับประทานผักและผลไม้เพียงพอหรือไม่ (อย่างน้อย 5 ส่วนต่อวัน)?",
        en: "Do you eat enough fruits and vegetables (at least 5 servings per day)?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "yes", label: { th: "เพียงพอ", en: "Yes" }, score: 0 },
        { value: "no", label: { th: "ไม่เพียงพอ", en: "No" }, score: 10 },
      ],
    },
    {
      id: "nutrition-2",
      question: {
        th: "คุณดื่มน้ำเปล่าเพียงพอหรือไม่ (อย่างน้อย 8 แก้วต่อวัน)?",
        en: "Do you drink enough plain water (at least 8 glasses per day)?",
      },
      type: "single-choice",
      required: true,
      options: [
        { value: "yes", label: { th: "เพียงพอ", en: "Yes" }, score: 0 },
        { value: "no", label: { th: "ไม่เพียงพอ", en: "No" }, score: 5 },
      ],
    },
  ],
}

export const assessmentData = {
  th: {
    categories: [
      guestAssessmentCategory, // Include guest assessment here
      basicAssessmentCategory,
      heartAssessmentCategory,
      nutritionAssessmentCategory,
    ],
  },
  en: {
    categories: [
      guestAssessmentCategory, // Include guest assessment here
      basicAssessmentCategory,
      heartAssessmentCategory,
      nutritionAssessmentCategory,
    ],
  },
}

export const getAssessmentCategories = (locale: "th" | "en") => {
  return assessmentData[locale].categories
}

// Back-compat: keep the original named export other files expect.
export const assessmentCategories = assessmentData.th.categories as AssessmentCategory[]
