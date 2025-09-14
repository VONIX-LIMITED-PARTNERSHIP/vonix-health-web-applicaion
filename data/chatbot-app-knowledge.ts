export interface AppKnowledgeEntry {
  keywords: string[]
  response: string
}

export const appKnowledgeBase: AppKnowledgeEntry[] = [
  // Getting Started
  //-------------------------
  {
    keywords: ["วิธีใช้", "ใช้งาน", "เริ่มต้น", "แอพใช้ยังไง"],
    response: `🎯 คู่มือใช้งาน VONIX\n\n📱 เริ่มต้นใช้งาน:\n1. สมัครสมาชิก/เข้าสู่ระบบ\n2. กรอกข้อมูลส่วนตัว\n3. เลือกแบบประเมินที่ต้องการ\n4. ตอบคำถามตามความจริง\n5. รับผลการวิเคราะห์จาก AI\n\n🔍 แบบประเมินที่มี:\n• ข้อมูลพื้นฐาน\n• สุขภาพกาย\n• สุขภาพจิต\n• การนอนหลับ\n\n💡 เคล็ดลับ: เริ่มจาก "ข้อมูลพื้นฐาน" ก่อนนะครับ!`,
  },
  {
    keywords: ["how to use", "get started", "start", "how does app work"],
    response: `🎯 VONIX User Guide\n\n📱 Getting Started:\n1. Sign up / Log in\n2. Fill in personal details\n3. Choose the assessment you want\n4. Answer questions honestly\n5. Receive AI analysis\n\n🔍 Available Assessments:\n• Basic info\n• Physical health\n• Mental health\n• Sleep quality\n\n💡 Tip: Start with "Basic Info" first!`,
  },

  // Sign Up
  //-------------------------
  {
    keywords: ["สมัคร", "ลงทะเบียน"],
    response: `📝 วิธีสมัครสมาชิก VONIX\n\n1. คลิกปุ่ม "สมัครสมาชิก"\n2. กรอกข้อมูล:\n• อีเมล\n• รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)\n• ชื่อ-นามสกุล\n3. ยืนยันอีเมล\n4. เข้าสู่ระบบด้วยบัญชีใหม่\n\n🔒 ข้อมูลปลอดภัย 100%`,
  },
  {
    keywords: ["sign up", "register", "create account", "join"],
    response: `📝 How to Sign Up for VONIX\n\n1. Click the "Sign Up" button\n2. Fill in:\n• Email\n• Password (at least 8 characters)\n• Full name\n3. Verify your email\n4. Log in with your new account\n\n🔒 Your data is 100% secure`,
  },

  // Login
  //-------------------------
  {
    keywords: ["เข้าสู่ระบบ", "ล็อกอิน"],
    response: `🔐 วิธีเข้าสู่ระบบ VONIX\n\n1. คลิกปุ่ม "เข้าสู่ระบบ"\n2. กรอกอีเมลและรหัสผ่าน\n3. คลิก "เข้าสู่ระบบ"\n\n❓ ลืมรหัสผ่าน?\n• คลิก "ลืมรหัสผ่าน"\n• กรอกอีเมล\n• ตรวจสอบลิงก์รีเซ็ตในอีเมล`,
  },
  {
    keywords: ["login", "sign in", "log in", "enter app"],
    response: `🔐 How to Log In to VONIX\n\n1. Click the "Login" button\n2. Enter your email and password\n3. Click "Login"\n\n❓ Forgot password?\n• Click "Forgot Password"\n• Enter your email\n• Check your email for reset link`,
  },

  // Assessments
  //-------------------------
  {
    keywords: ["ประเมิน", "แบบทดสอบ", "คำถาม"],
    response: `📋 วิธีทำแบบประเมิน\n\n1. เลือกหมวดหมู่\n2. อ่านคำแนะนำ\n3. ตอบคำถามตามความจริง\n4. คลิก "ส่งคำตอบ"\n5. รอผลลัพธ์จาก AI\n\n⏱️ ใช้เวลา 5-10 นาที`,
  },
  {
    keywords: ["assessment", "test", "questions", "quiz"],
    response: `📋 How to Take an Assessment\n\n1. Choose a category\n2. Read the instructions\n3. Answer honestly\n4. Click "Submit"\n5. Wait for AI results\n\n⏱️ Each assessment takes about 5–10 minutes`,
  },

  // Results
  //-------------------------
  {
    keywords: ["ผลลัพธ์", "ผลการประเมิน", "คะแนน"],
    response: `📊 วิธีดูผลการประเมิน\n\n🟢 0-25% = สุขภาพดีมาก\n🟡 26-50% = ควรดูแลเพิ่ม\n🟠 51-75% = ต้องปรับปรุง\n🔴 76-100% = ควรพบแพทย์\n\n🤖 AI จะให้คำแนะนำเฉพาะบุคคล\n📈 ติดตามผลได้ทุก 1-3 เดือน`,
  },
  {
    keywords: ["results", "assessment results", "score", "report"],
    response: `📊 How to Read Your Results\n\n🟢 0-25% = Very good health\n🟡 26-50% = Needs more care\n🟠 51-75% = Should improve\n🔴 76-100% = Consider seeing a doctor\n\n🤖 AI provides personalized tips\n📈 Repeat every 1–3 months to track progress`,
  },

  // Saving Data
  //-------------------------
  {
    keywords: ["บันทึก", "เซฟ", "เก็บข้อมูล"],
    response: `💾 การบันทึกข้อมูล\n\n✅ บันทึกอัตโนมัติ:\n• ผลการประเมิน\n• ประวัติแบบทดสอบ\n• ข้อมูลส่วนตัว\n\n🔒 ข้อมูลปลอดภัยและเข้ารหัส`,
  },
  {
    keywords: ["save", "store", "data"],
    response: `💾 Saving Data\n\n✅ Automatically saved:\n• Assessment results\n• Test history\n• Personal information\n\n🔒 All data is encrypted and secure`,
  },

  // Editing Data
  //-------------------------
  {
    keywords: ["แก้ไข", "เปลี่ยน", "อัพเดท"],
    response: `✏️ การแก้ไขข้อมูล\n\n👤 โปรไฟล์:\n• คลิกไอคอนโปรไฟล์ > "แก้ไขโปรไฟล์"\n\n🔄 แบบประเมิน:\n• เลือกใหม่และทำซ้ำได้เสมอ\n\n🔐 รหัสผ่าน:\n• ไปที่ "ตั้งค่า" > "เปลี่ยนรหัสผ่าน"`,
  },
  {
    keywords: ["edit", "update", "change", "modify"],
    response: `✏️ Editing Information\n\n👤 Profile:\n• Click profile icon > "Edit Profile"\n\n🔄 Assessments:\n• Retake anytime\n\n🔐 Password:\n• Go to "Settings" > "Change Password"`,
  },

  // Mobile
  //-------------------------
  {
    keywords: ["มือถือ", "โทรศัพท์", "แท็บเล็ต"],
    response: `📱 การใช้งานบนมือถือ\n\n✅ รองรับ iPhone, Android, Tablet\n🎯 ใช้ Chrome หรือ Safari\n📶 ข้อมูลซิงค์อัตโนมัติ`,
  },
  {
    keywords: ["mobile", "phone", "tablet", "ios", "android"],
    response: `📱 Mobile Usage\n\n✅ Works on iPhone, Android, Tablet\n🎯 Use Chrome or Safari\n📶 Data syncs automatically`,
  },

  // Troubleshooting
  
  {
    keywords: ["ปัญหา", "ใช้ไม่ได้", "ค้าง", "error"],
    response: `🔧 การแก้ปัญหา\n\n🌐 เชื่อมต่ออินเทอร์เน็ตใหม่\n🔐 ตรวจสอบอีเมล/รหัสผ่าน\n📱 อัพเดทเบราว์เซอร์หรือรีสตาร์ทเครื่อง\n\n❓ ยังแก้ไม่ได้? ติดต่อ support@vonix.com`,
  },
  {
    keywords: ["problem", "error", "not working", "bug", "issue"],
    response: `🔧 Troubleshooting\n\n🌐 Check your internet connection\n🔐 Verify email/password\n📱 Update browser or restart device\n\n❓ Still stuck? Contact support@vonix.com`,
  },

  // Privacy & Security
  //-------------------------
  {
    keywords: ["ข้อมูล", "ความปลอดภัย", "pdpa"],
    response: `🛡️ VONIX ให้ความสำคัญกับข้อมูลของคุณ\n\n✅ เข้ารหัสทั้งหมด\n✅ ปฏิบัติตาม PDPA\n✅ ไม่แชร์กับบุคคลที่ 3`,
  },
  {
    keywords: ["privacy", "security", "safe", "data"],
    response: `🛡️ VONIX protects your data\n\n✅ Fully encrypted\n✅ PDPA compliant\n✅ Never shared with third parties`,
  },

  // General Help
  //-------------------------
  {
    keywords: ["ทำอะไรได้บ้าง", "ช่วยอะไรได้บ้าง", "ความสามารถ"],
    response: `🤖 ผมคือ VONIX Assistant\n\nผมช่วยได้:\n• การใช้งานแอพ\n• คำแนะนำสุขภาพเบื้องต้น\n• ติดต่อทีมสนับสนุน\n\nวันนี้อยากให้ช่วยอะไรครับ?`,
  },
  {
    keywords: ["what can you do", "help", "abilities", "support"],
    response: `🤖 I am VONIX Assistant\n\nI can help with:\n• Using the app\n• Basic health advice\n• Contacting support\n\nHow can I assist you today?`,
  },
]


// ORIGINAL VERSION
// export interface AppKnowledgeEntry {
//   keywords: string[]
//   response: string
// }

// export const appKnowledgeBase: AppKnowledgeEntry[] = [
//   {
//     keywords: ["วิธีใช้", "ใช้งาน", "เริ่มต้น", "แอพใช้ยังไง"],
//     response: `🎯 คู่มือใช้งาน VONIX\n\n📱 เริ่มต้นใช้งาน:\n1. สมัครสมาชิก/เข้าสู่ระบบ\n2. กรอกข้อมูลส่วนตัว\n3. เลือกแบบประเมินที่ต้องการ\n4. ตอบคำถามตามความจริง\n5. รับผลการวิเคราะห์จาก AI\n\n🔍 แบบประเมินที่มี:\n• ข้อมูลพื้นฐาน - ข้อมูลทั่วไปของคุณ\n• สุขภาพกาย - การออกกำลังกาย อาหาร\n• สุขภาพจิต - ความเครียด อารมณ์\n• การนอนหลับ - คุณภาพการพักผ่อน\n\n💡 เคล็ดลับ: เริ่มจาก "ข้อมูลพื้นฐาน" ก่อนนะครับ!`,
//   },
//   {
//     keywords: ["สมัคร", "ลงทะเบียน", "register"],
//     response: `📝 วิธีสมัครสมาชิก VONIX\n\n1. คลิกปุ่ม "สมัครสมาชิก" ที่มุมขวาบน\n2. กรอกข้อมูล:\n• อีเมล\n• รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)\n• ชื่อ-นามสกุล\n3. ยืนยันอีเมล - ตรวจสอบกล่องจดหมาย\n4. เข้าสู่ระบบ - ใช้อีเมลและรหัสผ่าน\n\n🔒 ความปลอดภัย: ข้อมูลของคุณเข้ารหัสและปลอดภัย 100%\n\nมีปัญหาการสมัครสมาชิกไหมครับ?`,
//   },
//   {
//     keywords: ["เข้าสู่ระบบ", "ล็อกอิน", "login"],
//     response: `🔐 วิธีเข้าสู่ระบบ VONIX\n\n1. คลิกปุ่ม "เข้าสู่ระบบ" ที่มุมขวาบน\n2. กรอกข้อมูล:\n• อีเมลที่ลงทะเบียน\n• รหัสผ่าน\n3. คลิก "เข้าสู่ระบบ"\n\n❓ ลืมรหัสผ่าน?\n• คลิก "ลืมรหัสผ่าน"\n• กรอกอีเมล\n• ตรวจสอบลิงก์รีเซ็ตในอีเมล\n\n⚠️ เข้าสู่ระบบไม่ได้? ตรวจสอบ:\n• อีเมลถูกต้องไหม\n• รหัสผ่านถูกต้องไหม\n• ยืนยันอีเมลแล้วหรือยัง`,
//   },
//   {
//     keywords: ["ประเมิน", "แบบทดสอบ", "คำถาม"],
//     response: `📋 วิธีทำแบบประเมิน\n\n🎯 ขั้นตอน:\n1. เลือกหมวดหมู่ - คลิกการ์ดที่ต้องการ\n2. อ่านคำแนะนำ - เข้าใจวิธีการตอบ\n3. ตอบคำถาม - ตอบตามความจริง\n4. ส่งคำตอบ - คลิก "ส่งคำตอบ"\n5. รอผลลัพธ์ - AI จะวิเคราะห์ให้\n\n💡 เคล็ดลับการตอบ:\n• ตอบตามความจริง\n• อย่าคิดมาก ตอบตามสัญชาตญาณ\n• ถ้าไม่แน่ใจ เลือก "ปานกลาง"\n\n⏱️ เวลา: แต่ละแบบประเมินใช้เวลา 5-10 นาที`,
//   },
//   {
//     keywords: ["ผลลัพธ์", "ผลการประเมิน", "คะแนน"],
//     response: `📊 วิธีดูผลการประเมิน\n\n🎨 สีความเสี่ยง:\n🟢 เขียว (0-25%) - สุขภาพดีมาก\n🟡 เหลือง (26-50%) - ควรดูแลเพิ่ม\n🟠 ส้ม (51-75%) - ต้องปรับปรุง\n🔴 แดง (76-100%) - ควรพบแพทย์\n\n🤖 คำแนะนำ AI:\n• วิเคราะห์เฉพาะบุคคล\n• แนะนำการปรับปรุง\n• เคล็ดลับดูแลสุขภาพ\n\n📈 ติดตามความก้าวหน้า:\n• ทำแบบประเมินซ้ำทุก 1-3 เดือน\n• เปรียบเทียบผลลัพธ���\n• ดูการพัฒนาของตัวเอง`,
//   },
//   {
//     keywords: ["บันทึก", "เซฟ", "save"],
//     response: `💾 การบันทึกข้อมูล\n\n✅ ข้อมูลที่บันทึกอัตโนมัติ:\n• ผลการประเมินทั้งหมด\n• ประวัติการทำแบบทดสอบ\n• คำแนะนำจาก AI\n• ข้อมูลส่วนตัว\n\n📱 เข้าถึงได้ทุกที่:\n• เข้าสู่ระบบด้วยอีเมลเดิม\n• ดูประวัติย้อนหลัง\n• ติดตามความก้าวหน้า\n\n🔒 ความปลอดภัย:\n• ข้อมูลเข้ารหัส\n• เก็บในระบบปลอดภัย\n• คุณเท่านั้นที่เข้าถึงได้`,
//   },
//   {
//     keywords: ["แก้ไข", "เปลี่ยน", "อัพเดท"],
//     response: `✏️ การแก้ไขข้อมูล\n\n👤 ข้อมูลส่วนตัว:\n• คลิกไอคอนโปรไฟล์มุมขวาบน\n• เลือก "แก้ไขโปรไฟล์"\n• อัพเดทข้อมูลที่ต้องการ\n\n🔄 ทำแบบประเมินใหม่:\n• กลับไปหน้าหลัก\n• เลือกแบบประเมินที่ต้องการ\n• ทำใหม่ได้ตลอดเวลา\n\n🔐 เปลี่ยนรหัสผ่าน:\n• ไปที่ "ตั้งค่าบัญชี"\n• คลิก "เปลี่ยนรหัสผ่าน"\n• กรอกรหัสผ่านเก่าและใหม่\n\n💡 ข้อมูลใหม่จะอัพเดททันที!`,
//   },
//   {
//     keywords: ["มือถือ", "โทรศัพท์", "mobile"],
//     response: `📱 การใช้งานบนมือถือ\n\n✅ รองรับทุกอุปกรณ์:\n• iPhone, iPad\n• Android Phone, Tablet\n• เว็บเบราว์เซอร์ทุกชนิด\n\n🎯 เคล็ดลับการใช้งาน:\n• หมุนหน้าจอเป็นแนวตั้ง\n• ใช้ Chrome หรือ Safari\n• เชื่อมต่ออินเทอร์เน็ตที่เสถียร\n\n📶 ใช้งานออฟไลน์:\n• ดาวน์โหลดข้อมูลเก่า\n• ทำแบบประเมินออฟไลน์\n• ซิงค์เมื่อมีเน็ต\n\n🔄 ซิงค์ข้อมูล: ข้อมูลซิงค์ระหว่างอุปกรณ์อัตโนมัติ`,
//   },
//   {
//     keywords: ["ปัญหา", "ใช้ไม่ได้", "error"],
//     response: `🔧 แก้ไขปัญหาการใช้งาน\n\n🌐 ปัญหาการ��ชื่อมต่อ:\n• ตรวจสอบอินเทอร์เน็ต\n• รีเฟรชหน้าเว็บ (F5)\n• ลองเบราว์เซอร์อื่น\n\n🔐 เข้าสู่ระบบไม่ได้:\n• ตรวจสอบอีเมล/รหัสผ่าน\n• ลองรีเซ็ตรหัสผ่าน\n• ล้างแคช (Ctrl+Shift+Del)\n\n📱 ปัญหาบนมือถือ:\n• อัพเดทเบราว์เซอร์\n• ปิด-เปิดแอพใหม่\n• รีสตาร์ทมือถือ\n\n❓ ยังแก้ไม่ได้? ติดต่อทีมสนับสนุน:\n• อีเมล: support@vonix.com\n• แชท: คลิกไอคอนช่วยเหลือ`,
//   },
//   {
//     keywords: ["ข้อมูล", "ความปลอดภัย", "เก็บ"],
//     response: `VONIX ให้ความสำคัญกับความปลอดภัยข้อมูล 🔒\n\n✅ เข้ารหัสข้อมูลทั้งหมด\n✅ ปฏิบัติตาม PDPA\n✅ ไม่แชร์ข้อมูลกับบุคคลที่ 3\n✅ คุณควบคุมข้อมูลเอง\n\nข้อมูลใช้เพื่อการวิเคราะห์และให้คำแนะนำเท่านั้นครับ! 🛡️`,
//   },
//   {
//     keywords: ["ทำอะไรได้บ้าง", "ช่วยอะไรได้บ้าง", "ความสามารถ"],
//     response: `ผมเป็น VONIX Assistant ผู้ช่วยด้านสุขภาพส่วนตัวของคุณครับ! 🤖\n\nผมสามารถช่วยคุณได้ในเรื่องเหล่านี้:\n• การใช้งานแอป VONIX: เช่น วิธีทำแบบประเมิน, การดูผลลัพธ์, การแก้ไขปัญหาการใช้งาน\n• คำแนะนำสุขภาพเบื้องต้น: เช่น อาหาร, การออกกำลังกาย, การนอนหลับ, การจัดการความเครียด\n• ข้อมูลทั่วไป: เช่น ความปลอดภัยของข้อมูล, การติดต่อทีมสนับสนุน\n\nมีอะไรที่ผมช่วยคุณได้ในวันนี้ไหมครับ? 😊`,
//   },
// ]
