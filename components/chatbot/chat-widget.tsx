"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  typing?: boolean
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  content: "สวัสดีครับ! 👋 ผม VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวของคุณมีอะไรให้ผมช่วยดูแลสุขภาพของคุณในวันนี้ไหมครับ? 😊",
  sender: "bot",
  timestamp: new Date(),
}

const QUICK_REPLIES = ["วิธีใช้งานแอพ", "ทำแบบประเมินยังไง", "ดูผลลัพธ์ที่ไหน", "อยากคุยเรื่องสุขภาพ"]

export function ChatWidget() {
  const { user, profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Show notification when chat is closed and bot sends message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!isOpen && lastMessage?.sender === "bot" && lastMessage.id !== "welcome") {
      setHasNewMessage(true)
    }
  }, [messages, isOpen])

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const message = userMessage.toLowerCase()
    const userName = profile?.full_name || user?.email?.split("@")[0] || "คุณ"

    // === การใช้งานแอพ VONIX ===

    // วิธีใช้งานแอพ
    if (
      message.includes("วิธีใช้") ||
      message.includes("ใช้งาน") ||
      message.includes("เริ่มต้น") ||
      message.includes("แอพใช้ยังไง")
    ) {
      return `🎯 **คู่มือใช้งาน VONIX**

📱 **เริ่มต้นใช้งาน**:
1. สมัครสมาชิก/เข้าสู่ระบบ
2. กรอกข้อมูลส่วนตัว
3. เลือกแบบประเมินที่ต้องการ
4. ตอบคำถามตามความจริง
5. รับผลการวิเคราะห์จาก AI

🔍 **แบบประเมินที่มี**:
• ข้อมูลพื้นฐาน - ข้อมูลทั่วไปของคุณ
• สุขภาพกาย - การออกกำลังกาย อาหาร
• สุขภาพจิต - ความเครียด อารมณ์
• การนอนหลับ - คุณภาพการพักผ่อน

💡 **เคล็ดลับ**: เริ่มจาก "ข้อมูลพื้นฐาน" ก่อนนะครับ!`
    }

    // การสมัครสมาชิก
    if (message.includes("สมัคร") || message.includes("ลงทะเบียน") || message.includes("register")) {
      return `📝 **วิธีสมัครสมาชิก VONIX**

1. **คลิกปุ่ม "สมัครสมาชิก"** ที่มุมขวาบน
2. **กรอกข้อมูล**:
   • อีเมล
   • รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
   • ชื่อ-นามสกุล
3. **ยืนยันอีเมล** - ตรวจสอบกล่องจดหมาย
4. **เข้าสู่ระบบ** - ใช้อีเมลและรหัสผ่าน

🔒 **ความปลอดภัย**: ข้อมูลของคุณเข้ารหัสและปลอดภัย 100%

มีปัญหาการสมัครสมาชิกไหมครับ?`
    }

    // การเข้าสู่ระบบ
    if (message.includes("เข้าสู่ระบบ") || message.includes("ล็อกอิน") || message.includes("login")) {
      return `🔐 **วิธีเข้าสู่ระบบ VONIX**

1. **คลิกปุ่ม "เข้าสู่ระบบ"** ที่มุมขวาบน
2. **กรอกข้อมูล**:
   • อีเมลที่ลงทะเบียน
   • รหัสผ่าน
3. **คลิก "เข้าสู่ระบบ"**

❓ **ลืมรหัสผ่าน?**
• คลิก "ลืมรหัสผ่าน"
• กรอกอีเมล
• ตรวจสอบลิงก์รีเซ็ตในอีเมล

⚠️ **เข้าสู่ระบบไม่ได้?** ตรวจสอบ:
• อีเมลถูกต้องไหม
• รหัสผ่านถูกต้องไหม
• ยืนยันอีเมลแล้วหรือยัง`
    }

    // การทำแบบประเมิน
    if (message.includes("ประเมิน") || message.includes("แบบทดสอบ") || message.includes("คำถาม")) {
      return `📋 **วิธีทำแบบประเมิน**

🎯 **ขั้นตอน**:
1. **เลือกหมวดหมู่** - คลิกการ์ดที่ต้องการ
2. **อ่านคำแนะนำ** - เข้าใจวิธีการตอบ
3. **ตอบคำถาม** - ตอบตามความจริง
4. **ส่งคำตอบ** - คลิก "ส่งคำตอบ"
5. **รอผลลัพธ์** - AI จะวิเคราะห์ให้

💡 **เคล็ดลับการตอบ**:
• ตอบตามความจริง
• อย่าคิดมาก ตอบตามสัญชาตญาณ
• ถ้าไม่แน่ใจ เลือก "ปานกลาง"

⏱️ **เวลา**: แต่ละแบบประเมินใช้เวลา 5-10 นาที`
    }

    // การดูผลลัพธ์
    if (message.includes("ผลลัพธ์") || message.includes("ผลการประเมิน") || message.includes("คะแนน")) {
      return `📊 **วิธีดูผลการประเมิน**

🎨 **สีความเสี่ยง**:
🟢 **เขียว** (0-25%) - สุขภาพดีมาก
🟡 **เหลือง** (26-50%) - ควรดูแลเพิ่ม
🟠 **ส้ม** (51-75%) - ต้องปรับปรุง
🔴 **แดง** (76-100%) - ควรพบแพทย์

🤖 **คำแนะนำ AI**:
• วิเคราะห์เฉพาะบุคคล
• แนะนำการปรับปรุง
• เคล็ดลับดูแลสุขภาพ

📈 **ติดตามความก้าวหน้า**:
• ทำแบบประเมินซ้ำทุก 1-3 เดือน
• เปรียบเทียบผลลัพธ์
• ดูการพัฒนาของตัวเอง`
    }

    // การบันทึกข้อมูล
    if (message.includes("บันทึก") || message.includes("เซฟ") || message.includes("save")) {
      return `💾 **การบันทึกข้อมูล**

✅ **ข้อมูลที่บันทึกอัตโนมัติ**:
• ผลการประเมินทั้งหมด
• ประวัติการทำแบบทดสอบ
• คำแนะนำจาก AI
• ข้อมูลส่วนตัว

📱 **เข้าถึงได้ทุกที่**:
• เข้าสู่ระบบด้วยอีเมลเดิม
• ดูประวัติย้อนหลัง
• ติดตามความก้าวหน้า

🔒 **ความปลอดภัย**:
• ข้อมูลเข้ารหัส
• เก็บในระบบปลอดภัย
• คุณเท่านั้นที่เข้าถึงได้`
    }

    // การแก้ไขข้อมูล
    if (message.includes("แก้ไข") || message.includes("เปลี่ยน") || message.includes("อัพเดท")) {
      return `✏️ **การแก้ไขข้อมูล**

👤 **ข้อมูลส่วนตัว**:
• คลิกไอคอนโปรไฟล์มุมขวาบน
• เลือก "แก้ไขโปรไฟล์"
• อัพเดทข้อมูลที่ต้องการ

🔄 **ทำแบบประเมินใหม่**:
• กลับไปหน้าหลัก
• เลือกแบบประเมินที่ต้องการ
• ทำใหม่ได้ตลอดเวลา

🔐 **เปลี่ยนรหัสผ่าน**:
• ไปที่ "ตั้งค่าบัญชี"
• คลิก "เปลี่ยนรหัสผ่าน"
• กรอกรหัสผ่านเก่าและใหม่

💡 ข้อมูลใหม่จะอัพเดททันที!`
    }

    // การใช้งานบนมือถือ
    if (message.includes("มือถือ") || message.includes("โทรศัพท์") || message.includes("mobile")) {
      return `📱 **การใช้งานบนมือถือ**

✅ **รองรับทุกอุปกรณ์**:
• iPhone, iPad
• Android Phone, Tablet
• เว็บเบราว์เซอร์ทุกชนิด

🎯 **เคล็ดลับการใช้งาน**:
• หมุนหน้าจอเป็นแนวตั้ง
• ใช้ Chrome หรือ Safari
• เชื่อมต่ออินเทอร์เน็ตที่เสถียร

📶 **ใช้งานออฟไลน์**:
• ดาวน์โหลดข้อมูลเก่า
• ทำแบบประเมินออฟไลน์
• ซิงค์เมื่อมีเน็ต

🔄 **ซิงค์ข้อมูล**: ข้อมูลซิงค์ระหว่างอุปกรณ์อัตโนมัติ`
    }

    // === อาการและปัญหาสุขภาพ ===

    // ปวดหัว
    if (message.includes("ปวดหัว") || message.includes("ปวดศีรษะ") || message.includes("หัวปวด")) {
      return `วิธีแก้ปวดหัวเบื้องต้น 🤕

💧 **ดื่มน้ำ** - อาจเป็นเพราะขาดน้ำ
😴 **พักผ่อน** - นอนหลับให้เพียงพอ
🧘 **ผ่อนคลาย** - นวดขมับเบาๆ
🌡️ **ประคบเย็น** - ประคบหน้าผาก
🚫 **หลีกเลี่ยง** - แสงจ้า เสียงดัง

⚠️ หากปวดหัวรุนแรงหรือบ่อย ควรพบแพทย์นะครับ!`
    }

    // ปวดท้อง
    if (message.includes("ปวดท้อง") || message.includes("ท้องปวด") || message.includes("ปวดหน้าท้อง")) {
      return `การดูแลเมื่อปวดท้อง 🤱

🍵 **ชาสมุนไพร** - ชาขิง ชาเปปเปอร์มิ้นท์
🌡️ **ประคบอุ่น** - ประคบท้องด้วยผ้าอุ่น
💧 **ดื่มน้ำอุ่น** - ช่วยผ่อนคลายกล้ามเนื้อ
🥣 **อาหารอ่อน** - โจ๊ก ข้าวต้ม
🚫 **หลีกเลี่ยง** - อาหารเผ็ด มัน เปรี้ยว

⚠️ หากปวดท้องรุนแรง มีไข้ ควรรีบพบแพทย์!`
    }

    // ปวดหลัง
    if (message.includes("ปวดหลัง") || message.includes("หลังปวด") || message.includes("เมื่อยหลัง")) {
      return `วิธีดูแลปวดหลัง 🏃‍♂️

🧘 **ยืดเหยียด** - ยืดกล้ามเนื้อหลังเบาๆ
🌡️ **ประคบ** - ประคบร้อน-เย็นสลับกัน
💺 **ท่านั่ง** - นั่งให้หลังตรง มีพนักพิง
🛏️ **นอน** - นอนที่นอนแข็งพอดี
🏃 **ออกกำลังกาย** - เดิน ว่ายน้ำ โยคะ

⚠️ หากปวดหลังเรื้อรัง ควรปรึกษากายภาพบำบัด!`
    }

    // นอนไม่หลับ
    if (message.includes("นอนไม่หลับ") || message.includes("อนิทรา") || message.includes("หลับยาก")) {
      return `เคล็ดลับหลับง่าย 😴

🕘 **เวลานอน** - นอน-ตื่นเวลาเดิมทุกวัน
📱 **หลีกเลี่ยงหน้าจอ** - ปิดมือถือก่อนนอน 1 ชม.
🛁 **อาบน้ำอุ่น** - ช่วยผ่อนคลายร่างกาย
🍵 **ชาสมุนไพร** - ชาคาโมมายล์ ลาเวนเดอร์
🌡️ **อุณหภูมิ** - ห้องเย็นสบาย 20-22°C
📖 **อ่านหนังสือ** - แทนการดูโทรทัศน์

💤 การนอนหลับดีช่วยเสริมภูมิคุ้มกันนะครับ!`
    }

    // === อาหารและโภชนาการ ===

    // ผลไม้
    if (message.includes("ผลไม้") || message.includes("ผลไม้ดี") || message.includes("กินผลไม้")) {
      return `ผลไม้ดีต่อสุขภาพ 🍎

🍊 **ส้ม** - วิตามินซี เสริมภูมิคุ้มกัน
🍌 **กล้วย** - โพแทสเซียม ช่วยหัวใจ
🍎 **แอปเปิ้ล** - ไฟเบอร์ ช่วยย่อย
🥝 **กีวี่** - วิตามินซี สูงกว่าส้ม
🍇 **องุ่น** - แอนติออกซิแดนท์
🥭 **มะม่วง** - วิตามินเอ บำรุงสายตา

💡 **เคล็ดลับ**: กินผลไม้ 5 สีต่างกัน จะได้สารอาหารครบถ้วน!`
    }

    // ผัก
    if (message.includes("ผัก") || message.includes("ผักดี") || message.includes("กินผัก")) {
      return `ผักดีต่อสุขภาพ 🥬

🥬 **ผักใบเขียว** - เหล็ก โฟเลต บำรุงเลือด
🥕 **แครอท** - เบต้าแคโรทีน บำรุงสายตา
🥦 **บรอกโคลี** - วิตามินซี ป้องกันมะเร็ง
🍅 **มะเขือเทศ** - ไลโคปีน ต้านอนุมูลอิสระ
🧄 **กระเทียม** - ต้านแบคทีเรีย เสริมภูมิคุ้มกัน
🌶️ **พริก** - แคปไซซิน เผาผลาญไขมัน

🌈 **กินผัก 5 สี** จะได้สารอาหารหลากหลาย!`
    }

    // น้ำ
    if (message.includes("ดื่มน้ำ") || message.includes("น้ำ") || message.includes("กินน้ำ")) {
      return `ความสำคัญของการดื่มน้ำ 💧

✨ **ประโยชน์**:
• ขับของเสียออกจากร่างกาย
• ช่วยย่อยอาหาร
• ควบคุมอุณหภูมิร่างกาย
• บำรุงผิวพรรณ
• ป้องกันนิ่วในไต

📏 **ปริมาณ**: 8-10 แก้ว/วัน (2-2.5 ลิตร)

⏰ **เวลาดี**:
• ตื่นนอน - 1-2 แก้ว
• ก่อนอาหาร - 30 นาที
• หลังออกกำลังกาย

💡 ดื่มน้ำเปล่าดีที่สุด หลีกเลี่ยงน้ำหวาน!`
    }

    // === การออกกำลังกาย ===

    if (message.includes("ออกกำลังกาย") || message.includes("เล่นกีฬา") || message.includes("ฟิตเนส")) {
      return `การออกกำลังกายที่ดี 💪

🏃 **คาร์ดิโอ** (3-4 ครั้ง/สัปดาห์):
• เดิน วิ่ง ปั่นจักรยาน
• ว่ายน้ำ เต้นแอโรบิค
• 30-45 นาที/ครั้ง

🏋️ **ความแข็งแรง** (2-3 ครั้ง/สัปดาห์):
• ยกน้ำหนัก พุชอัพ
• สควอท ลันจ์
• 20-30 นาที/ครั้ง

🧘 **ยืดหยุ่น**:
• โยคะ พิลาทิส
• ยืดเหยียดกล้ามเนื้อ

⚠️ เริ่มเบาๆ ค่อยเพิ่มความหนักทีละน้อย!`
    }

    // === ความเครียด ===

    if (message.includes("เครียด") || message.includes("ความเครียด") || message.includes("สเตรส")) {
      return `วิธีจัดการความเครียด 🧘‍♀️

🫁 **หายใจลึก**:
• หายใจเข้า 4 วินาที
• กลั้น 4 วินาที  
• หายใจออก 6 วินาที

🧘 **สมาธิ**:
• นั่งสมาธิ 10-15 นาที/วัน
• ฟังเพลงเบาๆ
• เดินในธรรมชาติ

💪 **ออกกำลังกาย**:
• ช่วยปล่อยเอนดอร์ฟิน
• ลดฮอร์โมนความเครียด

😴 **พักผ่อน**:
• นอนหลับเพียงพอ
• ทำกิจกรรมที่ชอบ

💬 ถ้าเครียดมาก ปรึกษาคนใกล้ชิดหรือผู้เชี่ยวชาญนะครับ!`
    }

    // === การแก้ไขปัญหาการใช้งาน ===

    if (message.includes("ปัญหา") || message.includes("ใช้ไม่ได้") || message.includes("error")) {
      return `🔧 **แก้ไขปัญหาการใช้งาน**

🌐 **ปัญหาการเชื่อมต่อ**:
• ตรวจสอบอินเทอร์เน็ต
• รีเฟรชหน้าเว็บ (F5)
• ลองเบราว์เซอร์อื่น

🔐 **เข้าสู่ระบบไม่ได้**:
• ตรวจสอบอีเมล/รหัสผ่าน
• ลองรีเซ็ตรหัสผ่าน
• ล้างแคช (Ctrl+Shift+Del)

📱 **ปัญหาบนมือถือ**:
• อัพเดทเบราว์เซอร์
• ปิด-เปิดแอพใหม่
• รีสตาร์ทมือถือ

❓ **ยังแก้ไม่ได้?** ติดต่อทีมสนับสนุน:
• อีเมล: support@vonix.com
• แชท: คลิกไอคอนช่วยเหลือ`
    }

    // === Personal data questions ===
    if (message.includes("ข้อมูล") || message.includes("ความปลอดภัย") || message.includes("เก็บ")) {
      return `VONIX ให้ความสำคัญกับความปลอดภัยข้อมูล 🔒

✅ เข้ารหัสข้อมูลทั้งหมด
✅ ปฏิบัติตาม PDPA
✅ ไม่แชร์ข้อมูลกับบุคคลที่ 3
✅ คุณควบคุมข้อมูลเอง

ข้อมูลใช้เพื่อการวิเคราะห์และให้คำแนะนำเท่านั้นครับ! 🛡️`
    }

    // === Greeting responses ===
    if (message.includes("สวัสดี") || message.includes("หวัดดี") || message.includes("ดี") || message.includes("เป็นไงบ้าง")) {
      return `สวัสดีครับ ${userName}! 😊

ยินดีที่ได้เป็นผู้ช่วยของคุณ วันนี้มีอะไรให้ช่วยไหมครับ?

🎯 **ผมช่วยได้เรื่อง**:
• การใช้งานแอพ VONIX
• คำแนะนำสุขภาพ
• แก้ไขปัญหาการใช้งาน
• คำถามทั่วไปเกี่ยวกับสุขภาพ

มีอะไรสงสัยถามได้เลยครับ! 💚`
    }

    // === Thank you responses ===
    if (message.includes("ขอบคุณ") || message.includes("ขอบใจ") || message.includes("แสงค์")) {
      return `ยินดีครับ ${userName}! 😊

ดีใจที่ได้ช่วยเหลือคุณ หากมีคำถามอื่นๆ เกี่ยวกับ:
• การใช้งานแอพ
• สุขภาพและการดูแลตัวเอง
• ปัญหาการใช้งาน

สามารถถามได้ตลอดเวลานะครับ! ผมพร้อมช่วยเหลือ 24/7 🌟`
    }

    // === Motivation and encouragement ===
    if (message.includes("เหนื่อย") || message.includes("ท้อ") || message.includes("เศร้า") || message.includes("ไม่ไหว")) {
      return `เข้าใจความรู้สึกของคุณครับ 🤗

การดูแลสุขภาพเป็นเรื่องที่ต้องใช้เวลา อย่าเพิ่งท้อนะครับ! 

💪 **เริ่มจากสิ่งเล็กๆ**:
• ทำแบบประเมินใน VONIX
• เดินเล่น 10 นาที
• ดื่มน้ำเพิ่ม 1 แก้ว
• หายใจลึกๆ 5 ครั้ง

📱 **ใช้ VONIX ช่วย**:
• ติดตามความก้าวหน้า
• รับคำแนะนำเฉพาะตัว
• สร้างแรงจูงใจ

คุณทำได้แน่นอน! ผมเชื่อในตัวคุณ ✨`
    }

    // === General health questions ===
    if (message.includes("สุขภาพ") || message.includes("ดูแลตัวเอง") || message.includes("สุขภาพดี")) {
      return `การดูแลสุขภาพเป็นสิ่งสำคัญครับ ${userName}! 💚

ผมสามารถให้คำแนะนำเบื้องต้นเกี่ยวกับ:
• **อาหาร**: กินอะไรดี, ผลไม้, ผัก
• **ออกกำลังกาย**: คาร์ดิโอ, เวทเทรนนิ่ง, โยคะ
• **การนอนหลับ**: เคล็ดลับการนอน
• **การจัดการความเครียด**: วิธีผ่อนคลาย

คุณสนใจเรื่องไหนเป็นพิเศษไหมครับ?`
    }

    // === What can you do? ===
    if (message.includes("ทำอะไรได้บ้าง") || message.includes("ช่วยอะไรได้บ้าง") || message.includes("ความสามารถ")) {
      return `ผมเป็น VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวของคุณครับ! 🤖

ผมสามารถช่วยคุณได้ในเรื่องเหล่านี้:
• **การใช้งานแอป VONIX**: เช่น วิธีทำแบบประเมิน, การดูผลลัพธ์, การแก้ไขปัญหาการใช้งาน
• **คำแนะนำสุขภาพเบื้องต้น**: เช่น อาหาร, การออกกำลังกาย, การนอนหลับ, การจัดการความเครียด
• **ข้อมูลทั่วไป**: เช่น ความปลอดภัยของข้อมูล, การติดต่อทีมสนับสนุน

มีอะไรที่ผมช่วยคุณได้ในวันนี้ไหมครับ? 😊`
    }

    // === ตรวจสอบคำถามที่ไม่เกี่ยวกับสุขภาพหรือแอพ (ปรับให้ยืดหยุ่นขึ้น) ===
    const healthAppKeywords = [
      "สุขภาพ",
      "อาหาร",
      "ออกกำลังกาย",
      "นอน",
      "หลับ",
      "ปวด",
      "เจ็บ",
      "ไม่สบาย",
      "อาการ",
      "โรค",
      "ยา",
      "แพทย์",
      "หมอ",
      "โรงพยาบาล",
      "ผัก",
      "ผลไม้",
      "น้ำ",
      "วิตามิน",
      "โปรตีน",
      "คาร์โบไฮเดรต",
      "เครียด",
      "ความเครียด",
      "จิตใจ",
      "อารมณ์",
      "ซึมเศร้า",
      "ผิวพรรณ",
      "ผิว",
      "ผม",
      "เล็บ",
      "ฟัน",
      "ตา",
      "หู",
      "จมูก",
      "vonix",
      "แอพ",
      "ใช้งาน",
      "สมัคร",
      "ลงทะเบียน",
      "เข้าสู่ระบบ",
      "ประเมิน",
      "ผลลัพธ์",
      "บันทึก",
      "แก้ไข",
      "ปัญหา",
      "ช่วยเหลือ",
      "ข้อมูล",
      "ความปลอดภัย",
      "เก็บ",
      "ทำอะไรได้บ้าง",
      "ช่วยอะไรได้บ้าง",
      "สวัสดี",
      "ขอบคุณ",
      "เหนื่อย",
      "ท้อ",
      "เศร้า",
      "เป็นไงบ้าง",
      "ดูแลตัวเอง",
      "สุขภาพดี",
    ]

    const isRelevant = healthAppKeywords.some((keyword) => message.includes(keyword))

    // ถ้าไม่เกี่ยวกับสุขภาพหรือแอพ ให้ชวนคุยเรื่องที่เกี่ยวข้อง
    if (!isRelevant) {
      const redirectResponses = [
        `ผมเป็น VONIX Assistant ผู้ช่วยด้านสุขภาพและการใช้งานแอพครับ! 🤖

แทนที่จะคุยเรื่องนั้น มาคุยเรื่องที่ผมช่วยได้ดีกว่า:

🏥 **เรื่องสุขภาพ**:
• มีอาการไม่สบายไหม?
• อยากทราบเรื่องอาหารเพื่อสุขภาพ?
• สนใจการออกกำลังกาย?

📱 **การใช้งาน VONIX**:
• วิธีทำแบบประเมิน
• ดูผลการวิเคราะห์
• แก้ไขปัญหาการใช้งาน`,

        `ขอโทษครับ ผมเชี่ยวชาญเฉพาะเรื่องสุขภาพและ VONIX เท่านั้น 🩺

มาคุยเรื่องที่ผมช่วยได้ดีกว่านะครับ:

💚 **สุขภาพ**: ปวดหัว ปวดท้อง การกิน การนอน
📱 **VONIX**: วิธีใช้ แก้ปัญหา ดูผลประเมิน
🤖 **AI**: คำแนะนำเฉพาะบุคคล

ถามอะไรก็ได้เกี่ยวกับเรื่องเหล่านี้นะครับ! 😊`,

        `ผมเป็นผู้ช่วยอัจฉริยะของ VONIX ครับ! 🌟

ลองถามผมเรื่องเหล่านี้ดูสิ:

🎯 **การใช้งาน**:
• "แอพใช้ยังไง?"
• "ทำแบบประเมินยังไง?"
• "ดูผลลัพธ์ที่ไหน?"

💊 **สุขภาพ**:
• "ปวดหัวแก้ยังไง?"
• "ผลไม้อะไรดี?"
• "ออกกำลังกายแบบไหนดี?"

ผมพร้อมช่วยเหลือ 24/7! 🚀`,
      ]

      return redirectResponses[Math.floor(Math.random() * redirectResponses.length)]
    }

    // === Default responses ===
    const defaultResponses = [
      `ขอโทษครับ ผมไม่แน่ใจว่าเข้าใจคำถามของคุณถูกต้องไหม 🤔

ลองถามเกี่ยวกับ:

📱 **การใช้งาน VONIX**:
• วิธีสมัครสมาชิก
• การทำแบบประเมิน
• ดูผลการวิเคราะห์

🏥 **สุขภาพ**:
• อาการไม่สบายต่างๆ
• อาหารเพื่อสุขภาพ
• การออกกำลังกาย

หรือคุณสามารถใช้ปุ่มด่วนด้านล่างได้ครับ! 😊`,

      `ผมเป็นผู้ช่วยอัจฉริยะของ VONIX ครับ! 🤖

พร้อมช่วยเหลือเรื่อง:
• การใช้งานแอพทุกขั้นตอน
• คำแนะนำสุขภาพเฉพาะตัว
• แก้ไขปัญหาการใช้งาน
• ตอบคำถามทั่วไป

มีอะไรให้ช่วยไหมครับ? ถามได้เลย! 💙`,

      `หากมีคำถามซับซ้อนเกี่ยวกับสุขภาพ แนะนำให้ปรึกษาแพทย์นะครับ 👨‍⚕️

ส่วนเรื่องทั่วไปเกี่ยวกับ:
• การดูแลสุขภาพประจำวัน
• การใช้งาน VONIX
• คำแนะนำเบื้องต้น

ผมช่วยได้เต็มที่! พร้อมให้บริการ 24/7 😊`,
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const botResponse = await generateBotResponse(userMessage.content)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "ขอโทษครับ เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้งนะครับ 😅",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessage(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20",
            isOpen
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 pulse-glow",
          )}
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}

          {/* New message indicator */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] sm:max-w-[calc(100vw-3rem)] flex flex-col">
          <Card className="h-full bg-card dark:bg-card-foreground backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 shadow-lg flex flex-row items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-3 border-white/30 shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=48&width=48&text=🤖" />
                    <AvatarFallback className="bg-white/20 text-white text-lg font-bold backdrop-blur-sm">
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-wide">ผู้ช่วยอัจฉริยะ</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">พร้อมช่วยเหลือ 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "flex items-start space-x-3 max-w-[85%]",
                              message.sender === "user" ? "flex-row-reverse space-x-reverse" : "",
                            )}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              {message.sender === "bot" ? (
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={cn(
                                "rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-md",
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200 dark:shadow-blue-900/50"
                                  : "bg-muted dark:bg-secondary text-foreground dark:text-foreground border border-border dark:border-border shadow-sm",
                              )}
                            >
                              <div className="whitespace-pre-wrap font-medium">{message.content}</div>
                              <div
                                className={cn(
                                  "text-xs mt-3 opacity-75 font-medium",
                                  message.sender === "user" ? "text-white/80" : "text-muted-foreground",
                                )}
                              >
                                {message.timestamp.toLocaleTimeString("th-TH", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-3 max-w-[85%]">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted dark:bg-secondary border border-border rounded-2xl px-5 py-4 shadow-sm">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Quick Replies */}
                  {messages.length <= 1 && (
                    <div className="px-6 py-4 bg-accent/20 dark:bg-accent/30 border-t border-border flex-shrink-0">
                      <div className="text-sm text-foreground mb-3 font-semibold">💡 คำถามยอดนิยม</div>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_REPLIES.map((reply, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-xs px-3 py-2 rounded-xl bg-secondary dark:bg-secondary border border-border text-center justify-center h-auto text-secondary-foreground font-medium shadow-sm hover:shadow-md"
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Input Area */}
                <div className="p-6 bg-card dark:bg-card-foreground border-t border-border flex-shrink-0">
                  <div className="flex items-end space-x-4">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 rounded-2xl border-2 border-input focus:border-primary px-5 py-4 bg-background focus:bg-background transition-all duration-200 resize-none min-h-[52px] text-foreground placeholder:text-muted-foreground"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-4 h-[52px] w-[52px] shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                    >
                      {isTyping ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4 text-center leading-relaxed font-medium"></div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
