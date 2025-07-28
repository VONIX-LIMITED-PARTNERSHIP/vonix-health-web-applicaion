"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Share2, Printer, RotateCcw, Sparkles, Heart, Brain, Zap } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Header } from "@/components/header"
import Image from "next/image"

interface ElementalResult {
  birthMonth: number
  birthElement: "vata" | "pitta" | "kapha" | "din"
  currentElement: "vata" | "pitta" | "kapha" | "din"
  isBalanced: boolean
  elementalScores: {
    vata: number
    pitta: number
    kapha: number
    din: number
    percentages: {
      vata: number
      pitta: number
      kapha: number
      din: number
    }
    dominant: "vata" | "pitta" | "kapha" | "din"
  }
}

export default function ElementalResultsPage() {
  const router = useRouter()
  const { t, locale } = useTranslation(["common", "assessment"])
  const [result, setResult] = useState<ElementalResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const isThaiLanguage = locale === "th"

  useEffect(() => {
    const storedResult = sessionStorage.getItem("elementalResult")
    const storedAnswers = sessionStorage.getItem("elementalAnswers")

    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers))
    }

    if (!storedResult) {
      router.push("/assessment/elemental")
    }
  }, [router])

  const handleRetakeAssessment = () => {
    sessionStorage.removeItem("elementalResult")
    sessionStorage.removeItem("elementalAnswers")
    router.push("/assessment/elemental")
  }

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: isThaiLanguage ? "ผลการประเมินธาตุเจ้าเรือน" : "Elemental Assessment Results",
          text: isThaiLanguage
            ? `ธาตุเจ้าเรือนของฉัน: ${getElementInfo(result.birthElement).name} | ธาตุปัจจุบัน: ${getElementInfo(result.currentElement).name}`
            : `My birth element: ${getElementInfo(result.birthElement).nameEn} | Current element: ${getElementInfo(result.currentElement).nameEn}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getElementInfo = (element: "vata" | "pitta" | "kapha" | "din") => {
    const elementData = {
      vata: {
        name: "ธาตุลม",
        nameEn: "Vata (Wind)",
        image: "/images/elemental_wind.PNG",
        color: "from-sky-400 via-blue-500 to-cyan-600",
        bgColor:
          "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-sky-900/30 dark:via-blue-900/30 dark:to-cyan-900/30",
        borderColor: "border-sky-300 dark:border-sky-600",
        textColor: "text-sky-800 dark:text-sky-200",
        accentColor: "bg-sky-500",
        description: "ควบคุมการเคลื่อนไหว ระบบประสาท และการหายใจ",
        descriptionEn: "Controls movement, nervous system, and breathing",
        monthRange: isThaiLanguage ? "เมษายน - มิถุนายน" : "April - June",
        personality: isThaiLanguage
          ? "ผู้ที่เกิดในช่วงธาตุลมมักมีรูปร่างโปร่ง ข้อต่อหลวม ผิวหนังแห้งง่าย และทนต่อสภาพอากาศร้อนจัดหรือหนาวจัดไม่ได้ดี มีลักษณะทางอารมณ์ที่อ่อนไหวสูง จินตนาการดีเยี่ยม ชอบคิด ชอบสร้างสรรค์ สนใจเรื่องราวนามธรรม เป็นนักอุดมคติ มักคิดมากและเปลี่ยนใจง่าย พูดเก่ง เป็นนักสื่อสารโดยธรรมชาติ รักความถูกต้องและความยุติธรรม แต่บางครั้งอาจอ่อนไหวง่ายต่อคำพูดและสถานการณ์รอบตัว"
          : "People born during the wind element period tend to have a slender build, loose joints, and dry skin easily. They don't tolerate extreme hot or cold weather well. They have highly sensitive emotions, excellent imagination, love to think and create, are interested in abstract matters, are idealistic, tend to overthink and change their minds easily. They are good speakers and natural communicators who love correctness and justice, but sometimes may be easily sensitive to words and surrounding situations.",
        health: isThaiLanguage
          ? "มีแนวโน้มปวดเมื่อยกล้ามเนื้อหรือข้อต่อได้ง่าย โดยเฉพาะเมื่อร่างกายขาดการเคลื่อนไหวสม่ำเสมอ อีกทั้งยังมีปัญหาท้องผูก ระบบย่อยไม่ดี เครียดง่าย และมักเป็นโรคเกี่ยวกับเส้นประสาท เช่น อัมพฤกษ์ อัมพาต หรืออาการชาที่ปลายมือปลายเท้า รวมถึงโรคกระดูกและเส้นเอ็น"
          : "Prone to muscle or joint aches, especially when the body lacks regular movement. Also have problems with constipation, poor digestion, stress easily, and often have nerve-related diseases such as paralysis, numbness in hands and feet, including bone and tendon diseases.",
        recommendations: isThaiLanguage
          ? "การดูแลร่างกายของผู้มีธาตุลมควรเน้นอาหารที่มีฤทธิ์ร้อนและอุ่น เช่น ขิง ข่า ตะไคร้ กะเพรา เพื่อกระตุ้นการไหลเวียนของลมในร่างกาย เครื่องดื่มแนะนำคือน้ำขิง น้ำตะไคร้ หรือน้ำสมุนไพรที่อุ่นเล็กน้อย ควรหลีกเลี่ยงอาหารเย็นจัดหรือดื่มน้ำแข็งมากเกินไป และหมั่นออกกำลังกายด้วยการเคลื่อนไหวช้า ๆ เช่น โยคะ ชี่กง หรือการฝึกสมาธิ เพื่อเพิ่มความสมดุลในระบบประสาทและจิตใจ"
          : "Body care for those with wind element should focus on foods with hot and warm properties such as ginger, galangal, lemongrass, basil to stimulate wind circulation in the body. Recommended drinks are ginger water, lemongrass water, or slightly warm herbal water. Should avoid very cold food or drinking too much ice water and regularly exercise with slow movements such as yoga, qigong, or meditation to increase balance in the nervous system and mind.",
      },
      pitta: {
        name: "ธาตุไฟ",
        nameEn: "Pitta (Fire)",
        image: "/images/elemental_fire.PNG",
        color: "from-orange-400 via-red-500 to-pink-600",
        bgColor:
          "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/30 dark:via-red-900/30 dark:to-pink-900/30",
        borderColor: "border-orange-300 dark:border-orange-600",
        textColor: "text-orange-800 dark:text-orange-200",
        accentColor: "bg-orange-500",
        description: "ควบคุมการย่อยอาหาร เมตาบอลิซึม และอุณหภูมิร่างกาย",
        descriptionEn: "Controls digestion, metabolism, and body temperature",
        monthRange: isThaiLanguage ? "มกราคม - มีนาคม" : "January - March",
        personality: isThaiLanguage
          ? "ผู้ที่มีธาตุไฟเป็นธาตุเจ้าเรือนมักมีบุคลิกที่กระฉับกระเฉง กระตือรือร้น และชอบลงมือทำอย่างรวดเร็ว เป็นคนจริงจัง ทุ่มเท มุ่งมั่น และมีพลังในการขับเคลื่อนสูง จิตใจไว ใจร้อน หงุดหงิดง่าย หากเจอสถานการณ์กดดันมักตอบสนองไว พูดเสียงดังฟังชัด ผมบาง ผิวมัน และมีแนวโน้มแพ้ง่าย มักมีกลิ่นตัวหรือกลิ่นปากที่เด่นชัดง่ายกว่าคนทั่วไป"
          : "People with fire element as their birth element often have an energetic, enthusiastic personality and like to act quickly. They are serious, dedicated, determined, and have high driving power. Quick-minded, hot-tempered, easily irritated. When encountering stressful situations, they often respond quickly. They speak loudly and clearly, have thin hair, oily skin, and tend to be allergic easily. They often have body odor or bad breath that is more noticeable than average people.",
        health: isThaiLanguage
          ? "ระบบย่อยอาหารของธาตุไฟมักไวเกินไป ส่งผลให้มีอาการท้องเสียบ่อย โดยเฉพาะเวลาทานอาหารร้อนหรือเผ็ดจัด อีกปัญหาคือกรดไหลย้อนและโรคกระเพาะจากความร้อนสะสมภายในร่างกาย หากไม่ดูแลดีอาจมีการอักเสบเรื้อรังตามระบบย่อยหรือระบบผิวหนัง ปากและคอมักแห้ง กระหายน้ำบ่อย โดยเฉพาะช่วงอากาศร้อนหรือหลังออกกำลังกาย"
          : "The digestive system of fire element is often too sensitive, resulting in frequent diarrhea, especially when eating hot or very spicy food. Another problem is acid reflux and stomach disease from heat accumulation inside the body. If not well cared for, there may be chronic inflammation in the digestive system or skin system. Mouth and throat are often dry, frequently thirsty, especially during hot weather or after exercise.",
        recommendations: isThaiLanguage
          ? "ควรเลือกทานอาหารที่มีคุณสมบัติเย็นหรือช่วยลดความร้อนในร่างกาย เช่น แตงโม ฟักทอง แตงกวา มะระ และผักใบเขียวต่าง ๆ เครื่องดื่มควรเป็นน้ำแตงโม น้ำใบบัวบก น้ำเก๊กฮวย และน้ำมะพร้าว หลีกเลี่ยงอาหารเผ็ดจัด ของทอด น้ำมันเยอะ หรือเครื่องดื่มที่กระตุ้นระบบประสาท เช่น แอลกอฮอล์และกาแฟ นอกจากนี้ควรหมั่นออกกำลังกายแบบผ่อนคลาย เช่น โยคะ ว่ายน้ำ หรือเดินเล่นในที่ร่ม เพื่อลดความร้อนภายใน"
          : "Should choose foods with cooling properties or help reduce heat in the body such as watermelon, pumpkin, cucumber, bitter gourd, and various green leafy vegetables. Drinks should be watermelon juice, pennywort juice, chrysanthemum tea, and coconut water. Avoid very spicy food, fried food, oily food, or drinks that stimulate the nervous system such as alcohol and coffee. In addition, should regularly exercise in a relaxing way such as yoga, swimming, or walking indoors to reduce internal heat.",
      },
      kapha: {
        name: "ธาตุน้ำ",
        nameEn: "Kapha (Water)",
        image: "/images/elemental_water.PNG",
        color: "from-emerald-400 via-teal-500 to-blue-600",
        bgColor:
          "bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-blue-900/30",
        borderColor: "border-emerald-300 dark:border-emerald-600",
        textColor: "text-emerald-800 dark:text-emerald-200",
        accentColor: "bg-emerald-500",
        description: "ควบคุมโครงสร้างร่างกาย ภูมิคุ้มกัน และความชุ่มชื้น",
        descriptionEn: "Controls body structure, immunity, and moisture",
        monthRange: isThaiLanguage ? "กรกฎาคม - กันยายน" : "July - September",
        personality: isThaiLanguage
          ? "บุคคลธาตุน้ำมักพูดจานุ่มนวล พูดช้า มีความสุขุมและลึกซึ้งในความคิด อารมณ์มั่นคงสูง ไม่โกรธง่าย แต่ถ้าโกรธแล้วมักจะไม่หายง่าย บุคลิกเรียบง่าย ไม่ชอบความวุ่นวาย รักสันโดษ มีเสน่ห์แบบนิ่งลึก ผิวพรรณดี เปล่งปลั่ง มีความชุ่มชื้นและสดใสตามธรรมชาติ ผมดกดำเงางาม เป็นคนอดทนสูงและมีน้ำใจ"
          : "Water element people often speak gently and slowly, have wisdom and depth in thinking. High emotional stability, not easily angered, but if angry, it usually doesn't go away easily. Simple personality, don't like chaos, love solitude, have a quiet deep charm. Good complexion, radiant, naturally moist and fresh. Thick, black, shiny hair. High patience and kindness.",
        health: isThaiLanguage
          ? "ร่างกายจะไวต่อความชื้นและเย็น ทำให้เป็นหวัดบ่อย คัดจมูก น้ำมูกไหล ภูมิแพ้ขึ้นตลอดปี รวมถึงมีแนวโน้มในการสะสมของของเหลว เช่น เสมหะในระบบหายใจ หรือบวมน้ำในระบบไหลเวียน น้ำเหลืองเสียอาจก่อให้เกิดปัญหาผิวหนังได้ โรคที่มักพบคือระบบทางเดินหายใจเรื้อรัง เช่น ไอเรื้อรัง หลอดลมอักเสบ หรือไซนัส"
          : "The body is sensitive to humidity and cold, causing frequent colds, stuffy nose, runny nose, allergies throughout the year, including a tendency to accumulate fluids such as phlegm in the respiratory system or water retention in the circulatory system. Poor lymphatic drainage may cause skin problems. Common diseases are chronic respiratory system diseases such as chronic cough, bronchitis, or sinusitis.",
        recommendations: isThaiLanguage
          ? "ควรทานอาหารรสเปรี้ยวหรือขมเพื่อช่วยขับของเสียและความชื้นออกจากร่างกาย เช่น มะยม มะกอก สับปะรด หรือกะท้อน ดื่มน้ำผลไม้ที่มีฤทธิ์ขับเสมหะหรือช่วยลดความชื้น เช่น น้ำมะนาว น้ำมะเขือเทศ น้ำมะขาม หรือน้ำสับปะรด และควรหลีกเลี่ยงการอยู่ในที่ชื้นนาน ๆ หมั่นออกกำลังกายอย่างสม่ำเสมอ เช่น เดินเร็ว ว่ายน้ำ หรืออบซาวน่า เพื่อรักษาความสมดุลของระบบของเหลวในร่างกาย"
          : "Should eat sour or bitter foods to help expel waste and moisture from the body such as gooseberry, olive, pineapple, or santol. Drink fruit juices that have phlegm-expelling properties or help reduce moisture such as lime juice, tomato juice, tamarind juice, or pineapple juice. Should avoid staying in humid places for long periods and regularly exercise such as brisk walking, swimming, or sauna to maintain the balance of the body's fluid system.",
      },
      din: {
        name: "ธาตุดิน",
        nameEn: "Din (Earth)",
        image: "/images/elemental_earth.PNG",
        color: "from-amber-400 via-yellow-500 to-orange-600",
        bgColor:
          "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30",
        borderColor: "border-amber-300 dark:border-amber-600",
        textColor: "text-amber-800 dark:text-amber-200",
        accentColor: "bg-amber-500",
        description: "ควบคุมความมั่นคง โครงสร้างพื้นฐาน และความแข็งแรง",
        descriptionEn: "Controls stability, foundation, and strength",
        monthRange: isThaiLanguage ? "ตุลาคม - ธันวาคม" : "October - December",
        personality: isThaiLanguage
          ? "บุคคลที่มีธาตุดินมักมีรูปร่างใหญ่ กระดูกแข็งแรง หน้าอกและโครงสร้างกว้าง เสียงพูดชัดเจนทุ้มหนักแน่น เป็นคนใจมั่นคง มีเสถียรภาพในความคิด รักความสงบ ไม่ชอบความเปลี่ยนแปลงง่าย ๆ บุคลิกภายนอกดูน่าเชื่อถือ เป็นผู้ฟังที่ดี และมักจะให้คำปรึกษาได้ดี มีความรับผิดชอบสูงและเป็นที่พึ่งพาได้"
          : "People with earth element often have a large build, strong bones, broad chest and structure. Clear, deep, heavy voice. Stable-minded, have stability in thinking, love peace, don't like easy changes. External personality looks trustworthy, is a good listener, and often gives good advice. High responsibility and dependable.",
        health: isThaiLanguage
          ? "เนื่องจากระบบย่อยช้ากว่าธาตุอื่น ๆ ทำให้มีแนวโน้มอ้วนง่าย น้ำหนักเกิน และมีไขมันสะสม โดยเฉพาะที่หน้าท้อง เสี่ยงต่อเบาหวาน ความดัน หัวใจ และโรคเรื้อรังอื่น ๆ เช่น ไขมันพอกตับ นอกจากนี้ยังอาจมีปัญหาเรื่องการขับถ่าย เช่น ท้องผูก หรือระบบย่อยไม่ดี"
          : "Due to slower digestion than other elements, there is a tendency to gain weight easily, be overweight, and accumulate fat, especially in the abdomen. Risk of diabetes, high blood pressure, heart disease, and other chronic diseases such as fatty liver. May also have excretion problems such as constipation or poor digestion.",
        recommendations: isThaiLanguage
          ? "ควรหลีกเลี่ยงอาหารมัน ของทอด ของหวาน และแป้งมากเกินไป ควรเน้นอาหารที่ย่อยง่าย เช่น ผักลวก ต้มจืด ข้าวกล้อง และโปรตีนจากปลา เครื่องดื่มที่เหมาะสม ได้แก่ น้ำมะนาว น้ำขิง หรือน้ำสมุนไพรเพื่อช่วยเร่งการเผาผลาญ และควรออกกำลังกายอย่างสม่ำเสมอ เช่น เดินเร็ว ปั่นจักรยาน หรือออกกำลังกายแบบคาร์ดิโอเพื่อลดไขมันส่วนเกิน"
          : "Should avoid oily food, fried food, sweets, and too much starch. Should focus on easily digestible foods such as boiled vegetables, clear soup, brown rice, and protein from fish. Suitable drinks include lime water, ginger water, or herbal water to help accelerate metabolism. Should exercise regularly such as brisk walking, cycling, or cardio exercise to reduce excess fat.",
      },
    }
    return elementData[element]
  }

  const getRecommendations = (
    birthElement: "vata" | "pitta" | "kapha" | "din",
    currentElement: "vata" | "pitta" | "kapha" | "din",
    isBalanced: boolean,
  ) => {
    if (isBalanced) {
      return {
        title: isThaiLanguage ? "คำแนะนำสำหรับการรักษาสมดุล" : "Recommendations for Maintaining Balance",
        foods: isThaiLanguage
          ? ["รักษาอาหารที่เหมาะกับธาตุเจ้าเรือนของคุณ", "กินอาหารตามฤดูกาล", "หลีกเลี่ยงอาหารที่ทำให้เกิดความไม่สมดุล"]
          : [
              "Maintain foods suitable for your birth element",
              "Eat seasonal foods",
              "Avoid foods that create imbalance",
            ],
        activities: isThaiLanguage
          ? ["ออกกำลังกายสม่ำเสมอตามธาตุของคุณ", "ฝึกสมาธิหรือโยคะ", "รักษาจังหวะการนอนหลับ"]
          : ["Exercise regularly according to your element", "Practice meditation or yoga", "Maintain sleep rhythm"],
      }
    }

    // Recommendations to balance back to birth element
    const recommendations = {
      vata: {
        title: isThaiLanguage ? "คำแนะนำสำหรับการปรับสู่ธาตุลม" : "Recommendations to Balance to Vata",
        foods: isThaiLanguage
          ? ["กินอาหารอุ่น ๆ และมีน้ำมัน", "หลีกเลี่ยงอาหารเย็น แห้ง และขม", "กินอาหารเป็นเวลา อย่าข้ามมื้อ", "ดื่มน้ำอุ่นหรือชาสมุนไพร"]
          : [
              "Eat warm and oily foods",
              "Avoid cold, dry, and bitter foods",
              "Eat on time, don't skip meals",
              "Drink warm water or herbal tea",
            ],
        activities: isThaiLanguage
          ? [
              "ออกกำลังกายเบา ๆ เช่น โยคะ เดิน",
              "หลีกเลี่ยงความเครียดและกิจกรรมที่เร่งรีบ",
              "นอนหลับให้เพียงพอ 7-8 ชั่วโมง",
              "ทำกิจกรรมที่ผ่อนคลาย เช่น นวด สมาธิ",
            ]
          : [
              "Light exercise like yoga, walking",
              "Avoid stress and rushed activities",
              "Get adequate sleep 7-8 hours",
              "Do relaxing activities like massage, meditation",
            ],
      },
      pitta: {
        title: isThaiLanguage ? "คำแนะนำสำหรับการปรับสู่ธาตุไฟ" : "Recommendations to Balance to Pitta",
        foods: isThaiLanguage
          ? ["กินอาหารเย็น หวาน และมีรสขม", "หลีกเลี่ยงอาหารเผ็ด เปรี้ยว และเค็ม", "ดื่มน้ำเย็นและน้ำผลไม้", "กินผักใบเขียวและผลไม้หวาน"]
          : [
              "Eat cool, sweet, and bitter foods",
              "Avoid spicy, sour, and salty foods",
              "Drink cool water and fruit juices",
              "Eat green leafy vegetables and sweet fruits",
            ],
        activities: isThaiLanguage
          ? [
              "ออกกำลังกายในที่เย็น หลีกเลี่ยงแดดแรง",
              "หลีกเลี่ยงการแข่งขันที่รุนแรง",
              "ทำกิจกรรมที่ผ่อนคลาย เช่น ว่ายน้ำ",
              "หลีกเลี่ยงความโกรธและความเครียด",
            ]
          : [
              "Exercise in cool places, avoid strong sun",
              "Avoid intense competition",
              "Do relaxing activities like swimming",
              "Avoid anger and stress",
            ],
      },
      kapha: {
        title: isThaiLanguage ? "คำแนะนำสำหรับการปรับสู่ธาตุน้ำ" : "Recommendations to Balance to Kapha",
        foods: isThaiLanguage
          ? ["กินอาหารเผ็ด ขม และมีรสฝาด", "หลีกเลี่ยงอาหารหวาน เค็ม และมันเยอะ", "กินอาหารอุ่น ๆ และแห้ง", "ดื่มน้ำอุ่นและชาสมุนไพร"]
          : [
              "Eat spicy, bitter, and astringent foods",
              "Avoid sweet, salty, and oily foods",
              "Eat warm and dry foods",
              "Drink warm water and herbal tea",
            ],
        activities: isThaiLanguage
          ? ["ออกกำลังกายหนัก เช่น วิ่ง ยกน้ำหนัก", "ตื่นเช้าและนอนไม่ดึก", "ทำกิจกรรมที่กระตุ้นและท้าทาย", "หลีกเลี่ยงการนอนกลางวัน"]
          : [
              "Heavy exercise like running, weight lifting",
              "Wake up early and don't sleep late",
              "Do stimulating and challenging activities",
              "Avoid daytime naps",
            ],
      },
      din: {
        title: isThaiLanguage ? "คำแนะนำสำหรับการปรับสู่ธาตุดิน" : "Recommendations to Balance to Earth Element",
        foods: isThaiLanguage
          ? ["กินอาหารเบา ๆ และย่อยง่าย", "หลีกเลี่ยงอาหารหนักและมันเยอะ", "กินผักใบเขียวและผลไม้สด", "ดื่มน้ำมากและชาสมุนไพร"]
          : [
              "Eat light and easily digestible foods",
              "Avoid heavy and oily foods",
              "Eat green leafy vegetables and fresh fruits",
              "Drink plenty of water and herbal tea",
            ],
        activities: isThaiLanguage
          ? [
              "ออกกำลังกายสม่ำเสมอ เช่น เดิน วิ่งเบา ๆ",
              "ทำกิจกรรมที่กระตุ้นความคิดสร้างสรรค์",
              "หลีกเลี่ยงการนั่งนิ่งนานเกินไป",
              "ทำกิจกรรมกลางแจ้ง",
            ]
          : [
              "Regular exercise like walking, light jogging",
              "Do creative and stimulating activities",
              "Avoid sitting still for too long",
              "Do outdoor activities",
            ],
      },
    }

    return recommendations[birthElement]
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              {isThaiLanguage ? "กำลังโหลดผลลัพธ์..." : "Loading results..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const birthElementInfo = getElementInfo(result.birthElement)
  const currentElementInfo = getElementInfo(result.currentElement)
  const recommendations = getRecommendations(result.birthElement, result.currentElement, result.isBalanced)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/assessment/elemental")}
            className="mb-8 hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm transition-all duration-300 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {isThaiLanguage ? "ย้อนกลับ" : "Back"}
          </Button>

          {/* HERO RESULT SECTION */}
          <div className="text-center mb-16">
            {/* Birth Element - Hero Section */}
            <div className="relative mb-12">
              {/* Animated Background */}
              <div className="absolute inset-0 animate-pulse">
                <div className={`bg-gradient-to-r ${birthElementInfo.color} opacity-10 rounded-[3rem] blur-3xl`}></div>
              </div>

              <div
                className={`relative ${birthElementInfo.bgColor} border-4 ${birthElementInfo.borderColor} rounded-[3rem] p-12 shadow-2xl backdrop-blur-sm overflow-hidden`}
              >
                {/* Decorative Elements */}
                <div className="absolute top-6 right-6">
                  <Sparkles className={`h-8 w-8 ${birthElementInfo.textColor} animate-pulse`} />
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className={`w-4 h-4 ${birthElementInfo.accentColor} rounded-full animate-bounce`}></div>
                </div>

                {/* Element Image */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${birthElementInfo.color} opacity-20 rounded-full blur-2xl animate-pulse`}
                    ></div>
                    <Image
                      src={birthElementInfo.image || "/placeholder.svg"}
                      alt={isThaiLanguage ? birthElementInfo.name : birthElementInfo.nameEn}
                      width={320}
                      height={320}
                      className="relative object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Element Title */}
                <div className="space-y-4">
                  <h1
                    className={`text-7xl font-black mb-6 bg-gradient-to-r ${birthElementInfo.color} bg-clip-text text-transparent animate-gradient`}
                  >
                    {isThaiLanguage ? birthElementInfo.name : birthElementInfo.nameEn}
                  </h1>

                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className={`w-2 h-2 ${birthElementInfo.accentColor} rounded-full animate-pulse`}></div>
                    <p className={`text-2xl font-bold ${birthElementInfo.textColor}`}>
                      {isThaiLanguage ? "ธาตุเจ้าเรือนของคุณ" : "Your Birth Element"}
                    </p>
                    <div className={`w-2 h-2 ${birthElementInfo.accentColor} rounded-full animate-pulse`}></div>
                  </div>

                  <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3">
                    <Heart className={`h-5 w-5 ${birthElementInfo.textColor}`} />
                    <p className={`text-xl font-semibold ${birthElementInfo.textColor}`}>
                      {birthElementInfo.monthRange}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Status */}
            {result.isBalanced ? (
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 dark:from-emerald-800/30 dark:via-green-800/30 dark:to-teal-800/30 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>

                <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/40 dark:to-green-900/40 backdrop-blur-sm rounded-3xl p-10 border-4 border-emerald-300 dark:border-emerald-600 shadow-2xl">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <Sparkles className="h-12 w-12 text-emerald-600 animate-spin" />
                    <div className="text-6xl animate-bounce delay-100">✨</div>
                  </div>

                  <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent">
                    {isThaiLanguage ? "สมดุลแล้ว!" : "PERFECTLY BALANCED!"}
                  </h2>

                  <p className="text-xl text-emerald-700 dark:text-emerald-300 font-semibold">
                    {isThaiLanguage ? "ธาตุของคุณอยู่ในสภาวะสมดุลที่สมบูรณ์แบบ" : "Your elements are in perfect harmony"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 mb-12">
                {/* Imbalance Warning */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-red-200 to-pink-200 dark:from-orange-800/30 dark:via-red-800/30 dark:to-pink-800/30 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>

                  <div className="relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-900/40 backdrop-blur-sm rounded-3xl p-10 border-4 border-orange-300 dark:border-orange-600 shadow-2xl">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="text-5xl animate-pulse">⚠️</div>
                      <Zap className="h-10 w-10 text-orange-600 animate-bounce" />
                    </div>

                    <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
                      {isThaiLanguage ? "ไม่สมดุล!" : "IMBALANCED!"}
                    </h2>
                  </div>
                </div>

                {/* VS Section */}
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-6xl font-black text-red-500 dark:text-red-400 animate-pulse">VS</div>
                </div>

                {/* Current Element */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${currentElementInfo.color} opacity-15 rounded-3xl blur-xl`}
                  ></div>

                  <div
                    className={`relative ${currentElementInfo.bgColor} ${currentElementInfo.borderColor} border-3 rounded-3xl p-8 shadow-xl backdrop-blur-sm`}
                  >
                    <p
                      className={`text-xl font-bold ${currentElementInfo.textColor} mb-6 flex items-center justify-center space-x-2`}
                    >
                      <Brain className="h-6 w-6" />
                      <span>{isThaiLanguage ? "ธาตุปัจจุบันจากพฤติกรรม:" : "Current Element from Behavior:"}</span>
                    </p>

                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${currentElementInfo.color} opacity-20 rounded-full blur-xl animate-pulse`}
                        ></div>
                        <Image
                          src={currentElementInfo.image || "/placeholder.svg"}
                          alt={isThaiLanguage ? currentElementInfo.name : currentElementInfo.nameEn}
                          width={160}
                          height={160}
                          className="relative object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <h3 className={`text-4xl font-bold ${currentElementInfo.textColor}`}>
                      {isThaiLanguage ? currentElementInfo.name : currentElementInfo.nameEn}
                    </h3>
                  </div>
                </div>

                {/* Action Required */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-800/30 dark:to-amber-800/30 rounded-3xl blur-xl opacity-60"></div>

                  <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40 border-3 border-yellow-300 dark:border-yellow-600 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="text-3xl animate-bounce">💡</div>
                      <p className="text-2xl font-black text-yellow-800 dark:text-yellow-200">
                        {isThaiLanguage ? "จำเป็นต้องปรับปรุง!" : "Action Required!"}
                      </p>
                    </div>

                    <p className="text-lg text-yellow-700 dark:text-yellow-300 font-semibold leading-relaxed">
                      {isThaiLanguage
                        ? `คุณต้องปรับเปลี่ยนพฤติกรรมให้กลับสู่ ${birthElementInfo.name} เพื่อความสมดุลของร่างกายและจิตใจ`
                        : `You need to adjust your behavior back to ${birthElementInfo.nameEn} for body and mind balance`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Element Details Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Birth Element Details */}
            <Card
              className={`${birthElementInfo.bgColor} ${birthElementInfo.borderColor} border-3 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group`}
            >
              <CardHeader className="relative">
                <div className="absolute top-4 right-4">
                  <Sparkles
                    className={`h-6 w-6 ${birthElementInfo.textColor} group-hover:animate-spin transition-all duration-500`}
                  />
                </div>
                <CardTitle
                  className={`text-center text-3xl font-black ${birthElementInfo.textColor} flex items-center justify-center space-x-3`}
                >
                  <Heart className="h-8 w-8" />
                  <span>{isThaiLanguage ? "รายละเอียดธาตุเจ้าเรือน" : "Birth Element Details"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personality */}
                <div className="space-y-4">
                  <h3 className={`text-2xl font-bold ${birthElementInfo.textColor} flex items-center space-x-3`}>
                    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
                      <Brain className="h-6 w-6" />
                    </div>
                    <span>{isThaiLanguage ? "บุคลิกภาพ" : "Personality"}</span>
                  </h3>
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {birthElementInfo.personality}
                    </p>
                  </div>
                </div>

                {/* Health */}
                <div className="space-y-4">
                  <h3 className={`text-2xl font-bold ${birthElementInfo.textColor} flex items-center space-x-3`}>
                    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
                      <Heart className="h-6 w-6" />
                    </div>
                    <span>{isThaiLanguage ? "สุขภาพ" : "Health"}</span>
                  </h3>
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {birthElementInfo.health}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h3 className={`text-2xl font-bold ${birthElementInfo.textColor} flex items-center space-x-3`}>
                    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <span>{isThaiLanguage ? "คำแนะนำ" : "Recommendations"}</span>
                  </h3>
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {birthElementInfo.recommendations}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-3 border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-black text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <span>{isThaiLanguage ? "คะแนนรายละเอียด" : "Detailed Scores"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {Object.entries(result.elementalScores.percentages).map(([element, percentage]) => {
                  const elementInfo = getElementInfo(element as "vata" | "pitta" | "kapha" | "din")
                  const isBirthElement = element === result.birthElement
                  return (
                    <div
                      key={element}
                      className={`space-y-4 transition-all duration-300 hover:scale-105 ${
                        isBirthElement
                          ? "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl p-6 border-3 border-yellow-300 dark:border-yellow-600 shadow-lg"
                          : "bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${elementInfo.color} opacity-20 rounded-full blur-lg`}
                            ></div>
                            <Image
                              src={elementInfo.image || "/placeholder.svg"}
                              alt={isThaiLanguage ? elementInfo.name : elementInfo.nameEn}
                              width={56}
                              height={56}
                              className="relative object-contain"
                            />
                          </div>
                          <div>
                            <span
                              className={`font-bold text-xl ${isBirthElement ? "text-yellow-800 dark:text-yellow-200" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {isThaiLanguage ? elementInfo.name : elementInfo.nameEn}
                            </span>
                            {isBirthElement && (
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-sm bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-bold">
                                  {isThaiLanguage ? "ธาตุเจ้าเรือน" : "Birth Element"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-2xl font-black ${isBirthElement ? "text-yellow-800 dark:text-yellow-200" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress
                          value={percentage}
                          className={`h-6 ${isBirthElement ? "bg-yellow-200 dark:bg-yellow-800" : "bg-gray-200 dark:bg-gray-700"}`}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${elementInfo.color} opacity-30 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Balance Recommendations */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 backdrop-blur-sm border-3 border-indigo-200 dark:border-indigo-700 shadow-2xl mb-12">
            <CardHeader>
              <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
                <span>{recommendations.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Food Recommendations */}
                <div className="space-y-6">
                  <h4 className="font-black text-2xl text-emerald-700 dark:text-emerald-400 flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                      <Heart className="h-6 w-6" />
                    </div>
                    <span>{isThaiLanguage ? "คำแนะนำด้านอาหาร" : "Food Recommendations"}</span>
                  </h4>
                  <div className="space-y-4">
                    {recommendations.foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 bg-emerald-50 dark:bg-emerald-900/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="p-2 bg-emerald-500 rounded-full group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-base text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed">
                          {food}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Recommendations */}
                <div className="space-y-6">
                  <h4 className="font-black text-2xl text-blue-700 dark:text-blue-400 flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span>{isThaiLanguage ? "คำแนะนำด้านกิจกรรม" : "Activity Recommendations"}</span>
                  </h4>
                  <div className="space-y-4">
                    {recommendations.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="p-2 bg-blue-500 rounded-full group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-base text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-800/30 dark:to-orange-800/30 rounded-2xl blur-xl opacity-60"></div>
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border-3 border-amber-300 dark:border-amber-600 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl animate-pulse">⚠️</div>
                    <p className="text-lg text-amber-800 dark:text-amber-200 font-semibold leading-relaxed">
                      {isThaiLanguage
                        ? "คำแนะนำนี้เป็นเพียงแนวทางเบื้องต้น ควรปรึกษาผู้เชี่ยวชาญด้านการแพทย์แผนไทยหรือแพทย์อายุรเวทสำหรับคำแนะนำที่เฉพาะเจาะจง"
                        : "These recommendations are general guidelines. Please consult with a Thai traditional medicine practitioner or Ayurvedic doctor for personalized advice."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Button
              onClick={handleRetakeAssessment}
              variant="outline"
              className="min-w-[180px] bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-lg py-6 px-8 border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-105 transition-all duration-300 group"
            >
              <RotateCcw className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
              {isThaiLanguage ? "ทำแบบประเมินใหม่" : "Retake Assessment"}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="min-w-[180px] bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-lg py-6 px-8 border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-105 transition-all duration-300 group"
            >
              <Share2 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {isThaiLanguage ? "แชร์ผลลัพธ์" : "Share Results"}
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="min-w-[180px] bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-lg py-6 px-8 border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-105 transition-all duration-300 group"
            >
              <Printer className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {isThaiLanguage ? "พิมพ์ผลลัพธ์" : "Print Results"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
