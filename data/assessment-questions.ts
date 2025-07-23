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

// Guest assessment category - moved here and made complete
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
      type: "multiple-choice", // Changed to match existing types
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
      type: "multi-select-combobox-with-other", // Changed to match existing types
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
      type: "multiple-choice", // Changed to match existing types
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
      type: "rating", // Changed to match existing types
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q10",
      question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
      type: "rating", // Changed to match existing types
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q11",
      question: "คุณดื่มน้ำเปล่าวันละกี่แก้ว?",
      type: "multiple-choice", // Changed to match existing types
      options: ["น้อยกว่า 4 แก้ว", "4-6 แก้ว", "7-8 แก้ว", "มากกว่า 8 แก้ว"],
      required: true,
      category: "guest",
      weight: 2,
    },
    {
      id: "guest_q12",
      question: "คุณรู้สึกเครียดจากงานหรือชีวิตประจำวันแค่ไหน?",
      type: "rating", // Changed to match existing types
      description: "ให้คะแนน 1-5 (1=ไม่เครียด, 5=เครียดมาก)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q13",
      question: "คุณมีปัญหาในการนอนหลับบ่อยแค่ไหน?",
      type: "rating", // Changed to match existing types
      description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
      options: ["1", "2", "3", "4", "5"],
      required: true,
      category: "guest",
      weight: 3,
    },
    {
      id: "guest_q14",
      question: "คุณนอนกี่ชั่วโมงต่อคืนโดยเฉลี่ย?",
      type: "multiple-choice", // Changed to match existing types
      options: ["น้อยกว่า 5 ชั่วโมง", "5-6 ชั่วโมง", "7-8 ชั่วโมง", "9-10 ชั่วโมง", "มากกว่า 10 ชั่วโมง"],
      required: true,
      category: "guest",
      weight: 4,
    },
    {
      id: "guest_q15",
      question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นแค่ไหน?",
      type: "rating", // Changed to match existing types
      description: "ให้คะแนน 1-5 (1=ไม่สดชื่น, 5=สดชื่นมาก)",
      options: ["1", "2", "3", "4", "5"],
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
            type: "multi-select-combobox-with-other", // Changed to match existing types
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
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["ประวัติครอบครัว"]
          },
          {
            id: "heart-2",
            type: "multiple-choice",
            question: "ความดันโลหิตของคุณอยู่ในระดับใด?",
            options: [
              "ปกติ (<120/80)",
              "สูงเล็กน้อย (120–139/80–89)",
              "สูง (140/90 หรือมากกว่า)",
              "ไม่แน่ใจ"
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["ความดันโลหิตสูง"]
          },
          {
            id: "heart-3",
            type: "rating",
            question: "คุณเหนื่อยหอบบ่อยแค่ไหนเมื่อต้องขึ้นบันได 2-3 ชั้น?",
            description: "ให้คะแนน 1-5 (1 = ไม่เคย, 5 = เสมอ)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3
          },
          {
            id: "heart-4",
            type: "yes-no",
            question: "คุณเคยรู้สึกเจ็บหรือแน่นหน้าอกหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["อาการเจ็บหน้าอก"]
          },
          {
            id: "heart-5",
            type: "yes-no",
            question: "คุณสูบบุหรี่หรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["การสูบบุหรี่"]
          },
          {
            id: "heart-6",
            type: "multiple-choice",
            question: "คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?",
            options: [
              "ไม่ดื่มเลย",
              "นาน ๆ ครั้ง (เดือนละครั้ง)",
              "บางครั้ง (สัปดาห์ละครั้ง)",
              "บ่อย (เกือบทุกวัน)",
              "ทุกวัน"
            ],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["การดื่มแอลกอฮอล์"]
          },
          {
            id: "heart-7",
            type: "rating",
            question: "คุณออกกำลังกายเป็นประจำแค่ไหน?",
            description: "ให้คะแนน 1-5 (1 = ไม่เคย, 5 = ทุกวัน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3
          },
          {
            id: "heart-8",
            type: "multiple-choice",
            question: "ระดับความเครียดในชีวิตประจำวันของคุณเป็นอย่างไร?",
            options: [
              "ต่ำมาก",
              "ต่ำ",
              "ปานกลาง",
              "สูง",
              "สูงมาก"
            ],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["ความเครียดสูง"]
          },
          {
            id: "heart-9",
            type: "yes-no",
            question: "คุณเคยมีอาการใจสั่น หน้ามืด หรือหมดสติหรือไม่?",
            description: "อาการเหล่านี้อาจเกี่ยวข้องกับหัวใจเต้นผิดจังหวะหรือการไหลเวียนโลหิต",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["หัวใจเต้นผิดจังหวะ", "หมดสติ", "การไหลเวียนผิดปกติ"]
          },
          {
            id: "heart-10",
            type: "yes-no",
            question: "คุณเคยรู้สึกแสบร้อนหรือไม่สบายบริเวณหน้าอกหลังออกกำลังกายหรือหลังรับประทานอาหารหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["แน่นหน้าอก", "กรดไหลย้อน"]
          },
          {
            id: "heart-11",
            type: "yes-no",
            question: "ปลายเท้าหรือข้อเท้าของคุณบวมตอนเย็นบ่อยหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["ภาวะคั่งของเหลว", "ภาวะหัวใจล้มเหลว"]
          },
          {
            id: "heart-12",
            type: "yes-no",
            question: "คุณเคยตื่นกลางดึกเพราะหายใจไม่ออกหรือต้องลุกขึ้นนั่งเพื่อหายใจหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["อาการของหัวใจล้มเหลว"]
          },
          {
            id: "heart-13",
            type: "multiple-choice",
            question: "คุณให้คะแนนระดับพลังงานของคุณในแต่ละวันอย่างไร?",
            options: [
              "ต่ำมาก",
              "ต่ำ",
              "ปานกลาง",
              "สูง",
              "สูงมาก"
            ],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["อ่อนเพลีย", "ไหลเวียนโลหิตไม่ดี"]
          },
          {
            id: "heart-14",
            type: "yes-no",
            question: "คุณเป็นเบาหวานหรือเคยได้รับแจ้งว่ามีน้ำตาลในเลือดสูงหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["เบาหวาน", "ความเสี่ยงเมตาบอลิก"]
          },
          {
            id: "heart-15",
            type: "yes-no",
            question: "คุณเคยรู้สึกมือหรือเท้าเย็นหรือชาระหว่างอยู่เฉย ๆ หรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["การไหลเวียนโลหิตไม่ดี"]
          }
        ]
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
            options: ["1 มื้อ", "2 มื้อ", "3 มื้อ", "มากกว่า 3 มื้อ", "ไม่แน่นอน"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-2",
            type: "rating",
            question: "คุณทานผักและผลไม้บ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกมื้อ)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
          },
          {
            id: "nutrition-3",
            type: "multiple-choice",
            question: "คุณดื่มน้ำเปล่าวันละกี่แก้ว?",
            options: ["น้อยกว่า 4 แก้ว", "4-6 แก้ว", "7-8 แก้ว", "มากกว่า 8 แก้ว"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-4",
            type: "rating",
            question: "คุณทานอาหารหวาน ขนม เค้ก บ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
            riskFactors: ["ทานของหวานมาก"],
          },
          {
            id: "nutrition-5",
            type: "rating",
            question: "คุณทานอาหารทอด อาหารมัน บ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
            riskFactors: ["ทานอาหารมันมาก"],
          },
          {
            id: "nutrition-6",
            type: "multiple-choice",
            question: "คุณออกกำลังกายกี่ครั้งต่อสัปดาห์?",
            options: ["ไม่ออกกำลังกาย", "1-2 ครั้ง", "3-4 ครั้ง", "5-6 ครั้ง", "ทุกวัน"],
            required: true,
            category: "nutrition",
            weight: 4,
          },
          {
            id: "nutrition-7",
            type: "multiple-choice",
            question: "การออกกำลังกายแต่ละครั้งใช้เวลานานเท่าไหร่?",
            options: ["ไม่ออกกำลังกาย", "น้อยกว่า 15 นาที", "15-30 นาที", "30-60 นาที", "มากกว่า 60 นาที"],
            required: true,
            category: "nutrition",
            weight: 3,
          },
          {
            id: "nutrition-8",
            type: "multi-select-combobox-with-other", // Changed from checkbox to multi-select-combobox-with-other
            question: "ประเภทการออกกำลังกายที่คุณทำ (เลือกได้หลายข้อ)",
            options: ["เดิน/วิ่ง", "ปั่นจักรยาน", "ว่ายน้ำ", "ยิมนาสติก/ฟิตเนส", "โยคะ", "กีฬาประเภทที่ม", "ไม่ออกกำลังกาย"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-9",
            type: "rating",
            question: "คุณรู้สึกมีพลังงานในการทำกิจกรรมประจำวันแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่มีพลังงาน, 5=มีพลังงานมาก)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
        ],
      },
      {
        "id": "mental",
        "title": "ประเมินสุขภาพจิต",
        "description": "การตรวจสุขภาพจิต ความเครียด และสุขภาพทางอารมณ์",
        "icon": "Brain",
        "required": true,
        "estimatedTime": 10,
        "questions": [
          // PHQ-9 (Depression)
          {
            "id": "mental-1",
            "type": "rating",
            "question": "ในช่วง 2 สัปดาห์ที่ผ่านมา คุณรู้สึกเบื่อ หรือไม่มีความสนใจในสิ่งที่เคยชอบบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4,
            "riskFactors": ["ซึมเศร้า"]
          },
          {
            "id": "mental-2",
            "type": "rating",
            "question": "คุณรู้สึกหดหู่ ซึมเศร้า หรือหมดหวังบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4,
            "riskFactors": ["ซึมเศร้า"]
          },
          {
            "id": "mental-3",
            "type": "rating",
            "question": "คุณมีปัญหาในการนอนหลับหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-4",
            "type": "rating",
            "question": "คุณรู้สึกเหนื่อยง่าย หรือไม่มีแรงบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-5",
            "type": "rating",
            "question": "คุณเบื่ออาหาร หรือกินมากผิดปกติบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-6",
            "type": "rating",
            "question": "คุณรู้สึกแย่กับตัวเอง หรือรู้สึกล้มเหลวบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4
          },
          {
            "id": "mental-7",
            "type": "rating",
            "question": "คุณมีปัญหาในการมีสมาธิ หรือจดจ่อกับสิ่งใดสิ่งหนึ่งหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-8",
            "type": "rating",
            "question": "คุณเคลื่อนไหวหรือพูดช้าลง หรือกระสับกระส่ายผิดปกติหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-9",
            "type": "rating",
            "question": "คุณมีความคิดอยากตาย หรือทำร้ายตัวเองหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 5,
            "riskFactors": ["เสี่ยงทำร้ายตัวเอง"]
          },

          // GAD-7 (Anxiety)
          {
            "id": "mental-10",
            "type": "rating",
            "question": "คุณรู้สึกประหม่า กังวล หรือตึงเครียดบ่อยแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3,
            "riskFactors": ["วิตกกังวล"]
          },
          {
            "id": "mental-11",
            "type": "rating",
            "question": "คุณควบคุมความกังวลของตัวเองได้ดีแค่ไหน?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-12",
            "type": "rating",
            "question": "คุณกังวลเกี่ยวกับหลายเรื่องมากเกินไปหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-13",
            "type": "rating",
            "question": "คุณผ่อนคลายได้ยากหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-14",
            "type": "rating",
            "question": "คุณกระสับกระส่าย หรือรู้สึกต้องเคลื่อนไหวอยู่ตลอดเวลาหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-15",
            "type": "rating",
            "question": "คุณหงุดหงิดง่าย หรือโมโหง่ายกว่าปกติหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-16",
            "type": "rating",
            "question": "คุณกลัวว่าจะเกิดเรื่องเลวร้ายขึ้นหรือไม่?",
            "description": "ให้คะแนน 0-3 (0=ไม่เลย, 3=เกือบทุกวัน)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },

          // เสริม (บริบท)
          {
            "id": "mental-17",
            "type": "yes-no",
            "question": "คุณนอนหลับได้ดีหรือไม่?",
            "options": ["ใช่", "ไม่ใช่"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-18",
            "type": "yes-no",
            "question": "คุณมีใครที่สามารถพูดคุยหรือขอคำปรึกษาได้หรือไม่?",
            "options": ["ใช่", "ไม่ใช่"],
            "required": true,
            "category": "mental",
            "weight": 2
          }
        ]
      },
          {
            id: "physical",
            title: "ประเมินสุขภาพกาย",
            description: "ตรวจสอบสุขภาพกาย ความแข็งแรง และความสามารถทางกายภาพ",
            icon: "Dumbbell",
            required: false,
            estimatedTime: 10,
            questions: [
              {
                id: "physical-1",
                type: "rating",
                question: "คุณรู้สึกปวดหลังบ่อยแค่ไหน?",
                description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกวัน)",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 3,
                riskFactors: ["ปวดหลังเรื้อรัง"]
              },

              {
                id: "physical-2",
                type: "rating",
                question: "คุณรู้สึกปวดข้อ หรือข้อแข็งบ่อยแค่ไหน?",
                description: "1=ไม่เคย, 5=ทุกวัน",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 3,
                riskFactors: ["ปัญหาข้อ"]
              },

              {
                id: "physical-3",
                type: "multiple-choice",
                question: "คุณสามารถเดินขึ้นบันได 3 ชั้นโดยไม่หอบเหนื่อยได้หรือไม่?",
                options: [
                  "ได้อย่างง่ายดาย",
                  "ได้แต่เหนื่อยเล็กน้อย",
                  "ได้แต่เหนื่อยมาก",
                  "ทำไม่ได้"
                ],
                required: true,
                category: "physical",
                weight: 3
              },

              {
                id: "physical-4",
                type: "rating",
                question: "คุณรู้สึกว่าความแข็งแรงของกล้ามเนื้อเป็นอย่างไร?",
                description: "1 = อ่อนแอมาก, 5 = แข็งแรงมาก",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 2
              },

              {
                id: "physical-5",
                type: "rating",
                question: "คุณรู้สึกว่าความยืดหยุ่นของร่างกายเป็นอย่างไร?",
                description: "1 = แข็งมาก, 5 = ยืดหยุ่นมาก",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 2
              },

              {
                id: "physical-6",
                type: "yes-no",
                question: "คุณเคยได้รับบาดเจ็บจากการออกกำลังกายหรือไม่?",
                options: ["ใช่", "ไม่ใช่"],
                required: true,
                category: "physical",
                weight: 2
              },

              {
                id: "physical-7",
                type: "yes-no",
                question: "คุณเคยรู้สึกเจ็บเข่า ข้อเท้า หรือสะโพกขณะเดิน หรือหลังเดินระยะทางไกลหรือไม่?",
                options: ["ใช่", "ไม่ใช่"],
                required: true,
                category: "physical",
                weight: 3,
                riskFactors: ["เจ็บขณะเดิน"]
              },

              {
                id: "physical-8",
                type: "rating",
                question: "คุณสามารถยืนต่อเนื่องได้นานแค่ไหนโดยไม่รู้สึกเมื่อยล้าหรือเจ็บ?",
                description: "1=น้อยกว่า 5 นาที, 5=เกิน 30 นาที",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 2
              },

              {
                id: "physical-9",
                type: "yes-no",
                question: "คุณสามารถลุกจากเก้าอี้โดยไม่ใช้มือช่วยได้หรือไม่?",
                options: ["ใช่", "ไม่ใช่"],
                required: true,
                category: "physical",
                weight: 3,
                riskFactors: ["กล้ามเนื้ออ่อนแรง"]
              },

              {
                id: "physical-10",
                type: "yes-no",
                question: "คุณมีอาการชา หรือเหน็บชาตามมือหรือเท้าบ่อยหรือไม่?",
                options: ["ใช่", "ไม่ใช่"],
                required: true,
                category: "physical",
                weight: 2,
                riskFactors: ["ปลายประสาทอักเสบ"]
              },

              {
                id: "physical-11",
                type: "rating",
                question: "คุณสามารถเดินได้ไกลแค่ไหนโดยไม่ต้องหยุดพัก?",
                description: "1=น้อยกว่า 100 เมตร, 5=มากกว่า 1 กิโลเมตร",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                category: "physical",
                weight: 3
              },

              {
                id: "physical-12",
                type: "yes-no",
                question: "คุณเคยล้มโดยไม่ทราบสาเหตุหรือไม่?",
                options: ["ใช่", "ไม่ใช่"],
                required: true,
                category: "physical",
                weight: 3,
                riskFactors: ["เสี่ยงหกล้ม"]
              }
            ]
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
            options: ["น้อยกว่า 5 ชั่วโมง", "5-6 ชั่วโมง", "7-8 ชั่วโมง", "9-10 ชั่วโมง", "มากกว่า 10 ชั่วโมง"],
            required: true,
            category: "sleep",
            weight: 4,
            riskFactors: ["นอนไม่เพียงพอ"],
          },
          {
            id: "sleep-2",
            type: "rating",
            question: "คุณมีปัญหาในการเข้านอนบ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
            riskFactors: ["นอนไม่หลับ"],
          },
          {
            id: "sleep-3",
            type: "rating",
            question: "คุณตื่นกลางคืนบ่อยแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่เคย, 5=ทุกคืน)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
          },
          {
            id: "sleep-4",
            type: "rating",
            question: "เมื่อตื่นนอนคุณรู้สึกสดชื่นแค่ไหน?",
            description: "ให้คะแนน 1-5 (1=ไม่สดชื่น, 5=สดชื่นมาก)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
          },
          {
            id: "sleep-5",
            type: "yes-no",
            question: "คุณกรนหรือไม่?",
            options: ["ใช่", "ไม่ใช่"],
            required: true,
            category: "sleep",
            weight: 2,
            riskFactors: ["กรน"],
          },
          {
            id: "sleep-6",
            type: "multiple-choice",
            question: "คุณใช้อุปกรณ์อิเล็กทรอนิกส์ก่อนนอนหรือไม่?",
            options: ["ไม่ใช้เลย", "ใช้นาน ๆ ครั้ง", "ใช้บางครั้ง", "ใช้เกือบทุกคืน", "ใช้ทุกคืน"],
            required: true,
            category: "sleep",
            weight: 2,
          },
        ],
      },
      guestAssessmentCategory, // Include guest assessment category here
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
            
          guestAssessmentCategory, // Include guest assessment category hereid: "basic-4",
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
        title: "Cardiovascular Assessment",
        description: "Assess your risk of heart disease, blood pressure issues, and overall cardiovascular health.",
        icon: "Heart",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "heart-1",
            type: "yes-no",
            question: "Do you have a family history of heart disease?",
            description: "Such as parents or siblings with heart conditions",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Family history"]
          },

          {
            id: "heart-2",
            type: "multiple-choice",
            question: "What is your blood pressure level?",
            options: [
              "Normal (<120/80)",
              "Elevated (120–139/80–89)",
              "High (140/90 or more)",
              "Not sure"
            ],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["High blood pressure"]
          },

          {
            id: "heart-3",
            type: "rating",
            question: "How often do you feel out of breath when climbing 2-3 flights of stairs?",
            description: "Rate 1-5 (1 = Never, 5 = Always)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3
          },

          {
            id: "heart-4",
            type: "yes-no",
            question: "Have you ever felt chest pain or tightness?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Chest pain"]
          },

          {
            id: "heart-5",
            type: "yes-no",
            question: "Do you smoke?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Smoking"]
          },

          {
            id: "heart-6",
            type: "multiple-choice",
            question: "How often do you drink alcohol?",
            options: [
              "Never",
              "Occasionally (monthly)",
              "Sometimes (weekly)",
              "Frequently (almost daily)",
              "Daily"
            ],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Alcohol consumption"]
          },

          {
            id: "heart-7",
            type: "rating",
            question: "How regularly do you exercise?",
            description: "Rate 1-5 (1 = Never, 5 = Daily)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "heart",
            weight: 3
          },

          {
            id: "heart-8",
            type: "multiple-choice",
            question: "How would you describe your stress levels in daily life?",
            options: [
              "Very low",
              "Low",
              "Moderate",
              "High",
              "Very high"
            ],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["High stress"]
          },

          {
            id: "heart-9",
            type: "yes-no",
            question: "Have you ever experienced heart palpitations, dizziness, or fainting?",
            description: "These symptoms may relate to irregular heartbeat or circulation issues",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Arrhythmia", "Fainting", "Circulation issues"]
          },

          {
            id: "heart-10",
            type: "yes-no",
            question: "Have you ever felt a burning sensation or discomfort in your chest after physical activity or eating?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Possible angina", "Acid reflux"]
          },

          {
            id: "heart-11",
            type: "yes-no",
            question: "Do your ankles or feet swell at the end of the day?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Fluid retention", "Heart failure"]
          },

          {
            id: "heart-12",
            type: "yes-no",
            question: "Do you ever wake up at night short of breath or needing to sit upright to breathe?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 4,
            riskFactors: ["Heart failure symptoms"]
          },

          {
            id: "heart-13",
            type: "multiple-choice",
            question: "How would you rate your energy level throughout the day?",
            options: [
              "Very low",
              "Low",
              "Moderate",
              "High",
              "Very high"
            ],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["Fatigue", "Low circulation"]
          },

          {
            id: "heart-14",
            type: "yes-no",
            question: "Do you have diabetes or have you been told you have high blood sugar levels?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 3,
            riskFactors: ["Diabetes", "Metabolic risk"]
          },

          {
            id: "heart-15",
            type: "yes-no",
            question: "Have you noticed coldness or numbness in your hands or feet during rest?",
            options: ["Yes", "No"],
            required: true,
            category: "heart",
            weight: 2,
            riskFactors: ["Poor circulation"]
          }
        ]
      },
      {
        id: "nutrition",
        title: "Lifestyle and Nutrition Assessment",
        description: "Check eating habits, exercise, health care, and body overview",
        icon: "Apple",
        required: true,
        estimatedTime: 10,
        questions: [
          {
            id: "nutrition-1",
            type: "multiple-choice",
            question: "How many meals do you eat per day?",
            options: ["1 meal", "2 meals", "3 meals", "More than 3 meals", "Irregular"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-2",
            type: "rating",
            question: "How often do you eat vegetables and fruits?",
            description: "Rate 1-5 (1=Never, 5=Every meal)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
          },
          {
            id: "nutrition-3",
            type: "multiple-choice",
            question: "How many glasses of water do you drink per day?",
            options: ["Less than 4 glasses", "4-6 glasses", "7-8 glasses", "More than 8 glasses"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-4",
            type: "rating",
            question: "How often do you eat sweets, snacks, or cakes?",
            description: "Rate 1-5 (1=Never, 5=Daily)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
            riskFactors: ["High sugar intake"],
          },
          {
            id: "nutrition-5",
            type: "rating",
            question: "How often do you eat fried or fatty foods?",
            description: "Rate 1-5 (1=Never, 5=Daily)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 3,
            riskFactors: ["High fat intake"],
          },
          {
            id: "nutrition-6",
            type: "multiple-choice",
            question: "How many times per week do you exercise?",
            options: ["Never", "1-2 times", "3-4 times", "5-6 times", "Daily"],
            required: true,
            category: "nutrition",
            weight: 4,
          },
          {
            id: "nutrition-7",
            type: "multiple-choice",
            question: "How long do you exercise each time?",
            options: ["Never", "Less than 15 minutes", "15-30 minutes", "30-60 minutes", "More than 60 minutes"],
            required: true,
            category: "nutrition",
            weight: 3,
          },
          {
            id: "nutrition-8",
            type: "multi-select-combobox-with-other", // Changed from checkbox to multi-select-combobox-with-other
            question: "Types of exercise you do (select multiple)",
            options: ["Walking/Running", "Cycling", "Swimming", "Gym/Fitness", "Yoga", "Team sports", "No exercise"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
          {
            id: "nutrition-9",
            type: "rating",
            question: "How energetic do you feel for daily activities?",
            description: "Rate 1-5 (1=No energy, 5=Very energetic)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "nutrition",
            weight: 2,
          },
        ],
      },
      {
        "id": "mental",
        "title": "Mental Health Assessment",
        "description": "A mental health checkup covering depression, anxiety, and emotional wellbeing.",
        "icon": "Brain",
        "required": true,
        "estimatedTime": 10,
        "questions": [
          // PHQ-9 (Depression)
          {
            "id": "mental-1",
            "type": "rating",
            "question": "Little interest or pleasure in doing things?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4,
            "riskFactors": ["ซึมเศร้า"]
          },
          {
            "id": "mental-2",
            "type": "rating",
            "question": "Feeling down, depressed, or hopeless?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4,
            "riskFactors": ["ซึมเศร้า"]
          },
          {
            "id": "mental-3",
            "type": "rating",
            "question": "Trouble falling or staying asleep, or sleeping too much?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-4",
            "type": "rating",
            "question": "Feeling tired or having little energy?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-5",
            "type": "rating",
            "question": "Poor appetite or overeating?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-6",
            "type": "rating",
            "question": "Feeling bad about yourself, or feeling like a failure?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 4
          },
          {
            "id": "mental-7",
            "type": "rating",
            "question": "Trouble concentrating on things?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-8",
            "type": "rating",
            "question": "Moving or speaking slowly, or being fidgety/restless?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-9",
            "type": "rating",
            "question": "Thoughts that you'd be better off dead or of hurting yourself?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 5,
            "riskFactors": ["เสี่ยงทำร้ายตัวเอง"]
          },

          // GAD-7 (Anxiety)
          {
            "id": "mental-10",
            "type": "rating",
            "question": "Feeling nervous, anxious, or on edge?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3,
            "riskFactors": ["วิตกกังวล"]
          },
          {
            "id": "mental-11",
            "type": "rating",
            "question": "Not being able to stop or control worrying?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-12",
            "type": "rating",
            "question": "Worrying too much about different things?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },
          {
            "id": "mental-13",
            "type": "rating",
            "question": "Trouble relaxing?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-14",
            "type": "rating",
            "question": "Being so restless that it's hard to sit still?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-15",
            "type": "rating",
            "question": "Becoming easily annoyed or irritable?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-16",
            "type": "rating",
            "question": "Feeling afraid as if something awful might happen?",
            "description": "Rate 0-3 (0=Not at all, 3=Nearly every day)",
            "options": ["0", "1", "2", "3"],
            "required": true,
            "category": "mental",
            "weight": 3
          },

          // เสริม (บริบท)
          {
            "id": "mental-17",
            "type": "yes-no",
            "question": "Do you sleep well at night?",
            "options": ["Yes", "No"],
            "required": true,
            "category": "mental",
            "weight": 2
          },
          {
            "id": "mental-18",
            "type": "yes-no",
            "question": "Do you have someone you can talk to or seek support from?",
            "options": ["Yes", "No"],
            "required": true,
            "category": "mental",
            "weight": 2
          }
        ]
      },
      {
        id: "physical",
        title: "Physical Health Assessment",
        description: "A general assessment of physical well-being and mobility.",
        icon: "Dumbbell",
        required: false,
        estimatedTime: 12,
        questions: [
          {
            id: "physical-1",
            type: "rating",
            question: "How often do you experience back pain?",
            description: "Rate 1-5 (1 = Never, 5 = Every day)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["Chronic back pain"]
          },

          {
            id: "physical-2",
            type: "rating",
            question: "How often do you feel joint pain or stiffness?",
            description: "Rate 1-5 (1 = Never, 5 = Every day)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["Joint issues"]
          },

          {
            id: "physical-3",
            type: "multiple-choice",
            question: "Can you climb three flights of stairs without getting short of breath?",
            options: [
              "Easily",
              "With some effort",
              "With great effort",
              "Unable"
            ],
            required: true,
            category: "physical",
            weight: 3
          },

          {
            id: "physical-4",
            type: "rating",
            question: "How strong do you feel your muscles are?",
            description: "Rate 1-5 (1 = Very weak, 5 = Very strong)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "physical",
            weight: 2
          },

          {
            id: "physical-5",
            type: "rating",
            question: "How would you rate your body's flexibility?",
            description: "Rate 1-5 (1 = Very stiff, 5 = Very flexible)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "physical",
            weight: 2
          },

          {
            id: "physical-6",
            type: "yes-no",
            question: "Have you ever been injured while exercising?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 2
          },

          {
            id: "physical-7",
            type: "yes-no",
            question: "Have you ever felt knee, ankle, or hip pain while walking or after a long walk?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["Pain while walking"]
          },

          {
            id: "physical-8",
            type: "rating",
            question: "How long can you stand without feeling fatigue or pain?",
            description: "Rate 1-5 (1 = Less than 5 minutes, 5 = Over 30 minutes)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "physical",
            weight: 2
          },

          {
            id: "physical-9",
            type: "yes-no",
            question: "Can you rise from a chair without using your hands?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 3,
            riskFactors: ["Lower muscle strength"]
          },

          {
            id: "physical-10",
            type: "yes-no",
            question: "Can you stand on one leg for more than 10 seconds without falling?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 2,
            riskFactors: ["Poor balance"]
          },

          {
            id: "physical-11",
            type: "yes-no",
            question: "Can you fully raise both arms above your head?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 2,
            riskFactors: ["Shoulder mobility issue"]
          },

          {
            id: "physical-12",
            type: "yes-no",
            question: "Do you ever feel dizzy when standing up quickly?",
            options: ["Yes", "No"],
            required: true,
            category: "physical",
            weight: 2,
            riskFactors: ["Orthostatic hypotension"]
          }
        ]
      },

      {
        id: "sleep",
        title: "Sleep Quality Assessment",
        description: "Analyze sleep patterns and rest quality",
        icon: "Moon",
        required: false,
        estimatedTime: 5,
        questions: [
          {
            id: "sleep-1",
            type: "multiple-choice",
            question: "How many hours do you sleep per night on average?",
            options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "9-10 hours", "More than 10 hours"],
            required: true,
            category: "sleep",
            weight: 4,
            riskFactors: ["Insufficient sleep"],
          },
          {
            id: "sleep-2",
            type: "rating",
            question: "How often do you have trouble falling asleep?",
            description: "Rate 1-5 (1=Never, 5=Every night)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
            riskFactors: ["Insomnia"],
          },
          {
            id: "sleep-3",
            type: "rating",
            question: "How often do you wake up during the night?",
            description: "Rate 1-5 (1=Never, 5=Every night)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
          },
          {
            id: "sleep-4",
            type: "rating",
            question: "How refreshed do you feel when you wake up?",
            description: "Rate 1-5 (1=Not refreshed, 5=Very refreshed)",
            options: ["1", "2", "3", "4", "5"],
            required: true,
            category: "sleep",
            weight: 3,
          },
          {
            id: "sleep-5",
            type: "yes-no",
            question: "Do you snore?",
            options: ["Yes", "No"],
            required: true,
            category: "sleep",
            weight: 2,
            riskFactors: ["Snoring"],
          },
          {
            id: "sleep-6",
            type: "multiple-choice",
            question: "Do you use electronic devices before bed?",
            options: ["Never", "Rarely", "Sometimes", "Almost every night", "Every night"],
            required: true,
            category: "sleep",
            weight: 2,
          },
        ],
      },
      guestAssessmentCategory, // Include guest assessment category here
    ],
  },
}

// Helper function to get assessment categories based on current language
export function getAssessmentCategories(locale: "th" | "en" = "th"): AssessmentCategory[] {
  return assessmentData[locale].categories as AssessmentCategory[]
}

// Export for backward compatibility (if still needed, otherwise can be removed)
export const assessmentCategories = assessmentData.th.categories as AssessmentCategory[]
