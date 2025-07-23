export interface ElementalQuestion {
  id: string
  question: {
    th: string
    en: string
  }
  options: {
    text: {
      th: string
      en: string
    }
    element: "vata" | "pitta" | "kapha"
    score: number
  }[]
}

export interface ElementalResult {
  vata: number
  pitta: number
  kapha: number
  dominant: "vata" | "pitta" | "kapha"
  percentage: number
  total: number
}

// Based on the Excel data provided - Complete 32 questions with bilingual support
export const elementalQuestions: ElementalQuestion[] = [
  {
    id: "1",
    question: {
      th: "กิจกรรมการทำงานของคุณเป็นอย่างไร?",
      en: "How is your work activity?",
    },
    options: [
      { text: { th: "เร็ว", en: "Fast" }, element: "vata", score: 3 },
      { text: { th: "ริเริ่ม", en: "Initiative" }, element: "pitta", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "2",
    question: {
      th: "การตื่นเต้นของคุณเป็นอย่างไร?",
      en: "How is your excitement level?",
    },
    options: [
      { text: { th: "เกิดง่ายมาก", en: "Very easily excited" }, element: "vata", score: 3 },
      { text: { th: "ง่าย", en: "Easy" }, element: "pitta", score: 3 },
      { text: { th: "ช้า", en: "Slow" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "3",
    question: {
      th: "การเรียนรู้สิ่งใหม่ของคุณเป็นอย่างไร?",
      en: "How do you learn new things?",
    },
    options: [
      { text: { th: "เร็วมาก", en: "Very fast" }, element: "vata", score: 3 },
      { text: { th: "เร็ว", en: "Fast" }, element: "pitta", score: 3 },
      { text: { th: "ช้า", en: "Slow" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "4",
    question: {
      th: "ความจำของคุณเป็นอย่างไร?",
      en: "How is your memory?",
    },
    options: [
      { text: { th: "จำได้ระยะสั้น", en: "Short-term memory" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "นาน", en: "Long-term" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "5",
    question: {
      th: "การย่อยอาหารของคุณเป็นอย่างไร?",
      en: "How is your digestion?",
    },
    options: [
      { text: { th: "ไม่แน่นอน", en: "Irregular" }, element: "vata", score: 3 },
      { text: { th: "ย่อยได้เร็ว", en: "Fast digestion" }, element: "pitta", score: 3 },
      { text: { th: "ช้า", en: "Slow" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "6",
    question: {
      th: "ความหิวกระหายของคุณเป็นอย่างไร?",
      en: "How is your hunger and thirst?",
    },
    options: [
      { text: { th: "ไม่แน่นอน", en: "Irregular" }, element: "vata", score: 3 },
      { text: { th: "หิวบ่อย", en: "Frequent hunger" }, element: "pitta", score: 3 },
      { text: { th: "ไม่ค่อยหิว", en: "Rarely hungry" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "7",
    question: {
      th: "ปริมาณอาหารที่คุณกินเป็นอย่างไร?",
      en: "How much do you eat?",
    },
    options: [
      { text: { th: "ไม่แน่นอน", en: "Irregular" }, element: "vata", score: 3 },
      { text: { th: "กินจุ", en: "Large portions" }, element: "pitta", score: 3 },
      { text: { th: "กินได้น้อย", en: "Small portions" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "8",
    question: {
      th: "รสอาหารที่คุณชอบคืออะไร?",
      en: "What food tastes do you prefer?",
    },
    options: [
      { text: { th: "หวาน เปรี้ยว เค็ม", en: "Sweet, sour, salty" }, element: "vata", score: 3 },
      { text: { th: "หวาน ขม ฝาด", en: "Sweet, bitter, astringent" }, element: "pitta", score: 3 },
      { text: { th: "เผ็ด ขม ฝาด", en: "Spicy, bitter, astringent" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "9",
    question: {
      th: "อุณหภูมิที่คุณทนไม่ได้คืออะไร?",
      en: "What temperature can't you tolerate?",
    },
    options: [
      { text: { th: "ความหนาว", en: "Cold" }, element: "vata", score: 3 },
      { text: { th: "ความร้อน", en: "Heat" }, element: "pitta", score: 3 },
      { text: { th: "เย็น และ ชื้น", en: "Cold and humid" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "10",
    question: {
      th: "การนอนหลับของคุณเป็นอย่างไร?",
      en: "How is your sleep?",
    },
    options: [
      { text: { th: "ไม่ดี ตื่นกลางคืนบ่อย", en: "Poor, wake up frequently" }, element: "vata", score: 3 },
      { text: { th: "หลับได้สนิท", en: "Sound sleep" }, element: "pitta", score: 3 },
      { text: { th: "หลับได้สนิทมากกว่า 8 ชั่วโมง", en: "Deep sleep over 8 hours" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "11",
    question: {
      th: "ความฝันของคุณมักเป็นเรื่องอะไร?",
      en: "What do you usually dream about?",
    },
    options: [
      {
        text: { th: "ฝันตื่นเต้น วิ่งหนี ต้นไม้ ภูเขา", en: "Exciting dreams, running, trees, mountains" },
        element: "vata",
        score: 3,
      },
      { text: { th: "ฝันเรื่องฟ้าผ่า ไฟไหม้ พระอาทิตย์ ทองคำ", en: "Lightning, fire, sun, gold" }, element: "pitta", score: 3 },
      {
        text: { th: "ฝันเรื่องสงบ ทะเล นก เมฆ ความรัก", en: "Peaceful dreams, sea, birds, clouds, love" },
        element: "kapha",
        score: 3,
      },
    ],
  },
  {
    id: "12",
    question: {
      th: "การถ่ายอุจจาระของคุณเป็นอย่างไร?",
      en: "How are your bowel movements?",
    },
    options: [
      { text: { th: "ไม่สม่ำเสมอ", en: "Irregular" }, element: "vata", score: 3 },
      { text: { th: "1-2 ครั้งต่อวัน", en: "1-2 times per day" }, element: "pitta", score: 3 },
      { text: { th: "สม่ำเสมอ", en: "Regular" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "13",
    question: {
      th: "ลักษณะอุจจาระของคุณเป็นอย่างไร?",
      en: "What is the nature of your stool?",
    },
    options: [
      { text: { th: "แห้งแข็ง ท้องผูก", en: "Dry, hard, constipated" }, element: "vata", score: 3 },
      { text: { th: "อ่อนเหลว เป็นมัน", en: "Soft, loose, oily" }, element: "pitta", score: 3 },
      { text: { th: "เป็นก้อนปกติ", en: "Normal, well-formed" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "14",
    question: {
      th: "เหงื่อของคุณออกอย่างไร?",
      en: "How do you sweat?",
    },
    options: [
      { text: { th: "ออกน้อย", en: "Little sweating" }, element: "vata", score: 3 },
      { text: { th: "ออกเยอะ มีกลิ่น", en: "Heavy sweating with odor" }, element: "pitta", score: 3 },
      { text: { th: "ปกติ", en: "Normal" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "15",
    question: {
      th: "ภาวะอารมณ์ของคุณเป็นอย่างไร?",
      en: "What is your emotional state?",
    },
    options: [
      { text: { th: "ขี้กลัว ไม่มั่นใจ ไม่แน่ใจ", en: "Fearful, insecure, uncertain" }, element: "vata", score: 3 },
      { text: { th: "จริงใจ อ่อนไหว อิจฉา", en: "Sincere, sensitive, jealous" }, element: "pitta", score: 3 },
      { text: { th: "สงบ ตระหนี่ ยึดมั่น", en: "Calm, greedy, attached" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "16",
    question: {
      th: "การผจญปัญหาของคุณเป็นอย่างไร?",
      en: "How do you handle problems?",
    },
    options: [
      {
        text: { th: "วิตกกังวล จิตไม่มั่น เสียการควบคุมตัวเองง่าย", en: "Anxious, unstable mind, lose self-control easily" },
        element: "vata",
        score: 3,
      },
      {
        text: {
          th: "แก้ปัญหาช้า เอาชนะอารมณ์ได้ โกรธหงุดหงิดง่าย แต่แน่นอน",
          en: "Slow problem solving, can control emotions, easily irritated but determined",
        },
        element: "pitta",
        score: 3,
      },
      { text: { th: "จิตใจคงกระจ่าง", en: "Mind remains clear" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "17",
    question: {
      th: "การเคลื่อนไหวของคุณเป็นอย่างไร?",
      en: "How is your movement?",
    },
    options: [
      { text: { th: "เร็ว", en: "Fast" }, element: "vata", score: 3 },
      { text: { th: "แม่นยำตรงเป้า", en: "Precise and targeted" }, element: "pitta", score: 3 },
      { text: { th: "ช้า", en: "Slow" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "18",
    question: {
      th: "การพูดของคุณเป็นอย่างไร?",
      en: "How is your speech?",
    },
    options: [
      { text: { th: "เร็ว ฟุ้ง พูดมาก", en: "Fast, scattered, talkative" }, element: "vata", score: 3 },
      { text: { th: "พูดเก่ง ใช้คำคม", en: "Good speaker, sharp words" }, element: "pitta", score: 3 },
      { text: { th: "หวาน พูดอ่อน เสียงกังวาน", en: "Sweet, soft speech, melodious voice" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "19",
    question: {
      th: "ฐานะทางเศรษฐกิจของคุณเป็นอย่างไร?",
      en: "What is your economic status?",
    },
    options: [
      { text: { th: "จนใช้เงินเก่ง ฟุ่มเฟือย", en: "Poor but good at spending, extravagant" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง ฟุ่มเฟือย", en: "Moderate, extravagant" }, element: "pitta", score: 3 },
      {
        text: { th: "รวย เก็บเงิน ใช้เงินแบบมีเหตุผล", en: "Rich, saves money, spends reasonably" },
        element: "kapha",
        score: 3,
      },
    ],
  },
  {
    id: "20",
    question: {
      th: "รูปร่างของคุณเป็นอย่างไร?",
      en: "What is your body shape?",
    },
    options: [
      { text: { th: "บางสูงเล็ก", en: "Thin, tall, small" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "ท้วมใหญ่", en: "Heavy, large" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "21",
    question: {
      th: "น้ำหนักของคุณเป็นอย่างไร?",
      en: "How is your weight?",
    },
    options: [
      { text: { th: "น้อย", en: "Light" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "มาก", en: "Heavy" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "22",
    question: {
      th: "อุณหภูมิของผิวหนังหน้าผากของคุณเป็นอย่างไร?",
      en: "What is the temperature of your forehead skin?",
    },
    options: [
      { text: { th: "ต่ำและมือเท้าเย็นกว่า", en: "Low and hands/feet are colder" }, element: "vata", score: 3 },
      { text: { th: "สูงกว่าหน้าผาก", en: "Higher than forehead" }, element: "pitta", score: 3 },
      { text: { th: "ต่ำเท่าๆกัน", en: "Low and equal" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "23",
    question: {
      th: "ลักษณะผิวหนังของคุณเป็นอย่างไร?",
      en: "What is your skin like?",
    },
    options: [
      { text: { th: "แห้ง หยาบ ไม่เรียบ", en: "Dry, rough, uneven" }, element: "vata", score: 3 },
      { text: { th: "นุ่มเป็นมันเล็กน้อย", en: "Soft, slightly oily" }, element: "pitta", score: 3 },
      { text: { th: "เป็นมันนุ่มเรียบ", en: "Oily, soft, smooth" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "24",
    question: {
      th: "สีผิวของคุณเป็นอย่างไร?",
      en: "What is your skin color?",
    },
    options: [
      { text: { th: "คล้ำ", en: "Dark" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "ขาวใส", en: "Fair, clear" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "25",
    question: {
      th: "ดวงตาของคุณเป็นอย่างไร?",
      en: "What are your eyes like?",
    },
    options: [
      { text: { th: "คล้ำ", en: "Dark" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "ใหญ่ มีแววสุข", en: "Large, bright" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "26",
    question: {
      th: "เยื่อบุตาของคุณเป็นอย่างไร?",
      en: "What is your eye membrane like?",
    },
    options: [
      { text: { th: "สีฟ้า หรือสีน้ำตาล", en: "Blue or brown" }, element: "vata", score: 3 },
      { text: { th: "เหลืองแดง", en: "Yellow-red" }, element: "pitta", score: 3 },
      { text: { th: "ขาวใส", en: "Clear white" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "27",
    question: {
      th: "ฟันของคุณเป็นอย่างไร?",
      en: "What are your teeth like?",
    },
    options: [
      {
        text: { th: "เล็กมากหรือใหญ่ ไม่เรียบ หรือ เก", en: "Very small or large, uneven or protruding" },
        element: "vata",
        score: 3,
      },
      { text: { th: "ปานกลางมีสีเหลือง", en: "Moderate with yellow color" }, element: "pitta", score: 3 },
      { text: { th: "ขาว แข็งแรง", en: "White, strong" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "28",
    question: {
      th: "ข้อต่อของคุณเป็นอย่างไร?",
      en: "What are your joints like?",
    },
    options: [
      { text: { th: "หลวม มีเสียง โก่ง", en: "Loose, noisy, bent" }, element: "vata", score: 3 },
      { text: { th: "หลวม ไม่แข็งแรง", en: "Loose, not strong" }, element: "pitta", score: 3 },
      { text: { th: "แน่น แข็งแรง", en: "Tight, strong" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "29",
    question: {
      th: "เส้นเอ็นของคุณเป็นอย่างไร?",
      en: "What are your tendons like?",
    },
    options: [
      { text: { th: "เห็นชัด", en: "Clearly visible" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "ไม่เห็น", en: "Not visible" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "30",
    question: {
      th: "หลอดเลือดดำของคุณเป็นอย่างไร?",
      en: "What are your veins like?",
    },
    options: [
      { text: { th: "เห็นชัด", en: "Clearly visible" }, element: "vata", score: 3 },
      { text: { th: "ปานกลางมีสีเหลือง", en: "Moderate with yellow color" }, element: "pitta", score: 3 },
      { text: { th: "ไม่เด่น", en: "Not prominent" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "31",
    question: {
      th: "ลักษณะช่องท้องของคุณเป็นอย่างไร?",
      en: "What is your abdomen like?",
    },
    options: [
      { text: { th: "บาง", en: "Thin" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "หนา", en: "Thick" }, element: "kapha", score: 3 },
    ],
  },
  {
    id: "32",
    question: {
      th: "ความรู้สึกเวลากดช่องท้องของคุณเป็นอย่างไร?",
      en: "How does it feel when you press your abdomen?",
    },
    options: [
      { text: { th: "แข็ง", en: "Hard" }, element: "vata", score: 3 },
      { text: { th: "ปานกลาง", en: "Moderate" }, element: "pitta", score: 3 },
      { text: { th: "นุ่ม", en: "Soft" }, element: "kapha", score: 3 },
    ],
  },
]

export const elementalInfo = {
  vata: {
    name: "ธาตุลม",
    nameEn: "Vata",
    emoji: "🌬️",
    tagline: "นักคิดผู้ว่องไว – ร่างบางแต่ใจแรง!",
    color: "from-blue-400 to-cyan-500",
    description: {
      th: "ผู้ที่มีธาตุลมเป็นธาตุเจ้าเรือนมักมีลักษณะผอมบาง ผิวแห้ง ผมบาง เคลื่อนไหวเร็ว พูดเก่ง อารมณ์แปรปรวนง่าย และมักมีความวิตกกังวลสูง พวกเขามักหลับยากและขี้กลัว ธาตุลมเกี่ยวข้องกับการเคลื่อนไหวภายในร่างกาย เช่น การหายใจ ระบบประสาท และการย่อยอาหาร",
      en: "People with a dominant Vata element tend to have a slender body, dry skin, and fine hair. They often move and speak quickly, are curious, and prone to anxiety, restlessness, and insomnia. Vata governs movement in the body — such as respiration, circulation, and the nervous system.",
    },
    symptoms: {
      th: "หากธาตุลมกำเริบ อาจมีอาการท้องอืด ปวดศีรษะ วิงเวียน หรือปวดกล้ามเนื้อได้",
      en: "When unbalanced, it can lead to bloating, headaches, dizziness, or joint pain.",
    },
    care: {
      th: "การดูแลสุขภาพที่เหมาะสมคือการพักผ่อนให้เพียงพอ หลีกเลี่ยงการเครียด และเลือกอาหารที่มีรสเผ็ดร้อน เช่น น้ำขิง ต้มยำ หรืออาหารที่ช่วยกระตุ้นการไหลเวียนโลหิต",
      en: "To maintain balance, Vata types should prioritize rest, manage stress, and eat warm, spiced foods like ginger tea, tom yum soup, or basil chicken to stimulate internal flow.",
    },
  },
  pitta: {
    name: "ธาตุไฟ",
    nameEn: "Pitta",
    emoji: "🔥",
    tagline: "ผู้นำพลังแรง – ใจร้อนแต่มีเสน่ห์!",
    color: "from-red-400 to-orange-500",
    description: {
      th: "บุคคลธาตุไฟมักมีรูปร่างสมส่วน ผิวขาวเหลือง ผมหงอกก่อนวัย พูดชัด เสียงดัง และมีพลังงานสูง พวกเขาหิวบ่อย ขี้หงุดหงิด และโกรธง่าย ธาตุไฟควบคุมการเผาผลาญ การย่อยอาหาร และอุณหภูมิภายในร่างกาย",
      en: "Pitta-dominant individuals usually have a moderate build, fair to yellowish skin, and strong features. They speak clearly, have a sharp intellect, and are energetic but easily irritated or angered. Pitta governs digestion, metabolism, and internal heat.",
    },
    symptoms: {
      th: "หากธาตุไฟเสียสมดุล จะเกิดอาการร้อนใน ท้องเสีย กรดไหลย้อน หรือสิวผื่นได้",
      en: "When out of balance, it may cause heartburn, diarrhea, skin rashes, or inflammation.",
    },
    care: {
      th: "การดูแลควรหลีกเลี่ยงอาหารรสจัดหรือแอลกอฮอล์ หันมาทานอาหารเย็น เช่น แกงจืด แตงโม หรือน้ำเก๊กฮวย พร้อมทั้งหาวิธีผ่อนคลายอารมณ์ เช่น การอยู่ในที่เย็น อาบน้ำ หรือพักผ่อนอย่างสม่ำเสมอ",
      en: "To stay balanced, they should avoid overly spicy or acidic foods and instead eat cooling dishes like clear soups, cucumbers, or watermelon. Keeping calm, staying cool, and avoiding direct sunlight also help to regulate excess fire in the body.",
    },
  },
  kapha: {
    name: "ธาตุน้ำ",
    nameEn: "Kapha",
    emoji: "💧",
    tagline: "ผู้อดทนแกร่งกล้า – ใจเย็นแต่มั่นคง!",
    color: "from-green-400 to-blue-500",
    description: {
      th: "ผู้ที่มีธาตุน้ำมักมีรูปร่างอวบ ผิวขาว ตาโต ผมดกสวย และมีบุคลิกนิ่ง สุขุม ใจเย็น เคลื่อนไหวและพูดช้ากว่าคนทั่วไป พวกเขามักมีแรงต้านทานสูง แต่หากธาตุน้ำมากเกิน อาจนำไปสู่การเกิดโรคอ้วน ภูมิแพ้ เสมหะในระบบทางเดินหายใจ หรืออาการเฉื่อยชาได้",
      en: "Kapha types usually have a sturdy or heavy build, smooth fair skin, large expressive eyes, and thick hair. They are calm, compassionate, and deliberate in their actions and speech. While naturally strong and resilient, excess Kapha can lead to weight gain, congestion, sluggishness, or emotional stagnation.",
    },
    symptoms: {
      th: "หากธาตุน้ำมากเกิน อาจนำไปสู่การเกิดโรคอ้วน ภูมิแพ้ เสมหะในระบบทางเดินหายใจ หรืออาการเฉื่อยชาได้",
      en: "Excess Kapha can lead to weight gain, congestion, sluggishness, or emotional stagnation.",
    },
    care: {
      th: "การดูแลสุขภาพควรเน้นอาหารรสขมหรือเผ็ดเล็กน้อย เช่น แกงส้มดอกแค มะระ น้ำใบบัวบก รวมถึงการอบสมุนไพร และออกกำลังกายเบา ๆ เพื่อกระตุ้นระบบไหลเวียนและลดความชื้นในร่างกาย",
      en: "Maintaining balance involves stimulating activity, herbal steam therapies, and consuming bitter or spicy foods like bitter melon, herbal teas, or tamarind-based dishes. Light exercise and reducing sugary or oily foods can help balance water and mucus in the body.",
    },
  },
}

export function calculateElementalResult(answers: Record<string, string>): ElementalResult {
  const scores = { vata: 0, pitta: 0, kapha: 0 }

  Object.entries(answers).forEach(([questionId, selectedOption]) => {
    const question = elementalQuestions.find((q) => q.id === questionId)
    if (question) {
      const option = question.options.find((opt) => opt.text.th === selectedOption || opt.text.en === selectedOption)
      if (option) {
        scores[option.element] += option.score
      }
    }
  })

  const total = scores.vata + scores.pitta + scores.kapha
  const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha)

  let dominant: "vata" | "pitta" | "kapha" = "vata"
  if (scores.pitta === maxScore) dominant = "pitta"
  else if (scores.kapha === maxScore) dominant = "kapha"

  const percentage = total > 0 ? Math.round((maxScore / total) * 100) : 0

  return {
    vata: scores.vata,
    pitta: scores.pitta,
    kapha: scores.kapha,
    dominant,
    percentage,
    total,
  }
}
