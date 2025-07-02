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
  options?: string[]
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
  isValid: boolean
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

// Multilingual assessment data
export const assessmentData = {
  th: {
    categories: [
      {
        id: "basic",
        title: "ข้อมูลส่วนตัว",
        description: "ข้อมูลสำคัญที่แพทย์ต้องการเพื่อการวินิจฉัยและรักษา",
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
            options: ["ชาย", "หญิง", "ไม่ระบุ"],
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
            options: ["A", "B", "AB", "O", "ไม่ทราบ"],
            required: false,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-6",
            type: "multi-select-combobox-with-other",
            question: "โรคประจำตัว (เลือกได้หลายข้อ)",
            options: [
              "เบาหวาน",
              "ความดันโลหิตสูง",
              "ไขมันในเลือดสูง",
              "โรคหัวใจ",
              "โรคหลอดเลือดสมอง (เคยอัมพฤกษ์/อัมพาต)",
              "โรคหอบหืด / ถุงลมโป่งพอง",
              "โรคไตเรื้อรัง",
              "โรคตับเรื้อรัง",
              "โรคไทรอยด์ (เป็นพิษ/ขาด)",
              "โรคภูมิแพ้",
              "โรคแพ้ภูมิตนเอง (SLE, Sjogren's)",
              "โรคซึมเศร้า / วิตกกังวล",
              "โรคลมชัก / ชักเกร็ง",
              "โรคสมองเสื่อม / อัลไซเมอร์",
              "โรคมะเร็ง (ระบุชนิด)",
              "HIV / ภูมิคุ้มกันบกพร่อง",
              "โรคข้อเข่าเสื่อม",
              "โรครูมาตอยด์",
              "โรคเกาต์",
              "โรคกระดูกพรุน",
              "โรคตา (ต้อหิน, ต้อกระจก)",
              "ไม่มีโรคประจำตัว",
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
              "แพ้ยาแอสไพริน",
              "แพ้ยาปฏิชีวนะ",
              "แพ้อาหารทะเล",
              "แพ้นม/ผลิตภัณฑ์นม",
              "แพ้ไข่",
              "แพ้ถั่ว",
              "แพ้ผงชูรส",
              "ไม่มีการแพ้",
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
              "ยาลดความดันโลหิต",
              "ยาลดระดับน้ำตาลในเลือด (เบาหวาน)",
              "ยาลดไขมันในเลือด",
              "ยาป้องกันเลือดแข็งตัว / ยาต้านเกล็ดเลือด (เช่น Aspirin)",
              "ยารักษาโรคหัวใจ (เช่น ยาเบต้า บล็อกเกอร์, ยาขยายหลอดเลือด)",
              "ยาฉีดอินซูลิน",
              "ยารักษาโรคหอบหืด / ถุงลมโป่งพอง (เช่น ยาพ่นขยายหลอดลม)",
              "ยาแก้แพ้ (ยาแก้คัดจมูก ผื่น ผิวหนัง)",
              "ยาลดกรด / ยาโรคกระเพาะ",
              "ยาจิตเวช / ยานอนหลับ / ยากล่อมประสาท",
              "ยาแก้ปวดเรื้อรัง / ยาต้านการอักเสบ (NSAIDs)",
              "ยาปฏิชีวนะ",
              "ยาคุมกำเนิด / ฮอร์โมน",
              "วิตามินและอาหารเสริม (เช่น วิตามินดี, แคลเซียม, น้ำมันปลา)",
              "ไม่มี",
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
        description: "ตรวจสอบความเสี่ยงหัวใจ ความดันโลหิต และสุขภาพหลอดเลือด",
        icon: "Heart",
        required: true,
        estimatedTime: 8,
        questions: [
          {
            id: "heart-1",
            type: "yes-no",
            question: "คุณมีประวัติโรคหัวใจในครอบครัวหรือไม่?",
            description: "พ่อ แม่ พี่น้อง ที่เป็นโรคหัวใจ",
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["ประวัติครอบครัว"],
          },
          {
            id: "heart-2",
            type: "multiple-choice",
            question: "ความดันโลหิตของคุณเป็นอย่างไร?",
            options: ["ปกติ (น้อยกว่า 120/80)", "สูงเล็กน้อย (120-139/80-89)", "สูง (140/90 ขึ้นไป)", "ไม่ทราบ"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["ความดันสูง"],
          },
          {
            id: "heart-3",
            type: "rating",
            question: "คุณรู้สึกเหนื่อยหอบเมื่อขึ้นบันได 2-3 ชั้นบ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=เสมอ)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-4",
            type: "yes-no",
            question: "คุณเคยรู้สึกเจ็บแน่นหน้าอกหรือไม่?",
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["อาการเจ็บหน้าอก"],
          },
          {
            id: "heart-5",
            type: "yes-no",
            question: "คุณสูบบุหรี่หรือไม่?",
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["สูบบุหรี่"],
          },
          {
            id: "heart-6",
            type: "multiple-choice",
            question: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
            options: ["ไม่ดื่มเลย", "นาน ๆ ครั้ง (เดือนละครั้ง)", "บางครั้ง (สัปดาห์ละครั้ง)", "บ่อย (เกือบทุกวัน)", "ทุกวัน"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["ดื่มแอลกอฮอล์มาก"],
          },
          {
            id: "heart-7",
            type: "rating",
            question: "คุณออกกำลังกายสม่ำเสมอแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-8",
            type: "multiple-choice",
            question: "ระดับความเครียดในชีวิตประจำวัน",
            options: ["ต่ำมาก", "ต่ำ", "ปานกลาง", "สูง", "สูงมาก"],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["ความเครียดสูง"],
          },
        ],
      },
      // เพิ่มหมวดอื่นๆ ต่อไป...
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
            options: ["Male", "Female", "Prefer not to say"],
            required: true,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-3",
            type: "number",
            question: "Weight (kilograms)",
            description: "Your current weight",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-4",
            type: "number",
            question: "Height (centimeters)",
            description: "Your height",
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-5",
            type: "multiple-choice",
            question: "Blood type",
            options: ["A", "B", "AB", "O", "Unknown"],
            required: false,
            category: "basic",
            weight: 1,
          },
          {
            id: "basic-6",
            type: "multi-select-combobox-with-other",
            question: "Chronic diseases (select multiple)",
            options: [
              "Diabetes",
              "High blood pressure",
              "High cholesterol",
              "Heart disease",
              "Stroke/Cerebrovascular disease",
              "Asthma/COPD",
              "Chronic kidney disease",
              "Chronic liver disease",
              "Thyroid disease",
              "Allergies",
              "Autoimmune disease (SLE, Sjogren's)",
              "Depression/Anxiety",
              "Epilepsy/Seizures",
              "Dementia/Alzheimer's",
              "Cancer (specify type)",
              "HIV/Immunodeficiency",
              "Osteoarthritis",
              "Rheumatoid arthritis",
              "Gout",
              "Osteoporosis",
              "Eye disease (glaucoma, cataracts)",
              "No chronic diseases",
            ],
            required: true,
            category: "basic",
            weight: 3,
            riskFactors: ["Diabetes", "High blood pressure", "Heart disease"],
          },
          {
            id: "basic-7",
            type: "multi-select-combobox-with-other",
            question: "Drug/Food allergies (select multiple)",
            options: [
              "Aspirin allergy",
              "Antibiotic allergy",
              "Seafood allergy",
              "Milk/Dairy allergy",
              "Egg allergy",
              "Nut allergy",
              "MSG allergy",
              "No allergies",
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
          {
            id: "basic-8",
            type: "multi-select-combobox-with-other",
            question: "Regular medications",
            description: "Select types of medications you take regularly or specify others",
            options: [
              "Blood pressure medications",
              "Diabetes medications",
              "Cholesterol medications",
              "Blood thinners/Antiplatelet drugs (e.g., Aspirin)",
              "Heart medications (e.g., beta blockers, vasodilators)",
              "Insulin injections",
              "Asthma/COPD medications (e.g., bronchodilator inhalers)",
              "Allergy medications (antihistamines, nasal sprays)",
              "Acid reducers/Stomach medications",
              "Psychiatric/Sleep/Anxiety medications",
              "Chronic pain/Anti-inflammatory medications (NSAIDs)",
              "Antibiotics",
              "Birth control/Hormones",
              "Vitamins and supplements (e.g., Vitamin D, Calcium, Fish oil)",
              "None",
            ],
            required: true,
            category: "basic",
            weight: 2,
          },
        ],
      },
      {
        id: "heart",
        title: "Heart and Cardiovascular Assessment",
        description: "Check heart risk, blood pressure, and cardiovascular health",
        icon: "Heart",
        required: true,
        estimatedTime: 8,
        questions: [
          {
            id: "heart-1",
            type: "yes-no",
            question: "Do you have a family history of heart disease?",
            description: "Parents, siblings with heart disease",
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Family history"],
          },
          {
            id: "heart-2",
            type: "multiple-choice",
            question: "What is your blood pressure like?",
            options: [
              "Normal (less than 120/80)",
              "Slightly high (120-139/80-89)",
              "High (140/90 or higher)",
              "Unknown",
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["High blood pressure"],
          },
          {
            id: "heart-3",
            type: "rating",
            question: "How often do you feel tired or short of breath when climbing 2-3 flights of stairs?",
            description: "Rate 1-5 (1=Never, 5=Always)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-4",
            type: "yes-no",
            question: "Have you ever experienced chest pain or tightness?",
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Chest pain symptoms"],
          },
          {
            id: "heart-5",
            type: "yes-no",
            question: "Do you smoke?",
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Smoking"],
          },
          {
            id: "heart-6",
            type: "multiple-choice",
            question: "How often do you drink alcohol?",
            options: ["Never", "Rarely (once a month)", "Sometimes (once a week)", "Often (almost daily)", "Daily"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Heavy alcohol consumption"],
          },
          {
            id: "heart-7",
            type: "rating",
            question: "How regularly do you exercise?",
            description: "Rate 1-5 (1=Never, 5=Daily)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3,
          },
          {
            id: "heart-8",
            type: "multiple-choice",
            question: "Stress level in daily life",
            options: ["Very low", "Low", "Moderate", "High", "Very high"],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["High stress"],
          },
        ],
      },
      // เพิ่มหมวดอื่นๆ ต่อไป...
    ],
  },
}

// Helper function to get assessment categories based on current language
export function getAssessmentCategories(locale: "th" | "en" = "th"): AssessmentCategory[] {
  return assessmentData[locale].categories as AssessmentCategory[]
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
    // คำถามสำหรับ guest assessment...
  ],
}

// Export for backward compatibility
export const assessmentCategories = assessmentData.th.categories as AssessmentCategory[]
