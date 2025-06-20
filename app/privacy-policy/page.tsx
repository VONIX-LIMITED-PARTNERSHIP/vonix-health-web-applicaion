import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl p-8 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">นโยบายความเป็นส่วนตัว</h1>
          <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-800 transition-colors">
            <Link href="/register" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              กลับ
            </Link>
          </Button>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p>
            VONIX ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน เรามุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณอย่างสูงสุด
            นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลของคุณ
          </p>
          <h2>1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p>เราอาจเก็บรวบรวมข้อมูลประเภทต่างๆ เพื่อให้บริการและปรับปรุงประสบการณ์ของคุณ:</p>
          <ul>
            <li>
              <strong>ข้อมูลส่วนตัว:</strong> ชื่อ-นามสกุล, อีเมล, วันเกิด, เพศ, เบอร์โทรศัพท์
            </li>
            <li>
              <strong>ข้อมูลสุขภาพพื้นฐาน:</strong> น้ำหนัก, ส่วนสูง, หมู่เลือด, BMI
            </li>
            <li>
              <strong>ประวัติการแพทย์:</strong> การแพ้ยา, อาหาร, สิ่งแวดล้อม
            </li>
            <li>
              <strong>ประวัติสุขภาพ:</strong> โรคประจำตัว, ยาที่ใช้, ประวัติครอบครัว
            </li>
            <li>
              <strong>ข้อมูลการประเมิน:</strong> คำตอบแบบประเมินสุขภาพ, ผลการวิเคราะห์
            </li>
          </ul>
          <h2>2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p>เราใช้ข้อมูลที่เก็บรวบรวมเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
          <ul>
            <li>ให้บริการประเมินสุขภาพและสร้างรายงานสำหรับแพทย์</li>
            <li>ปรับปรุงและพัฒนาบริการของเรา</li>
            <li>สื่อสารกับคุณเกี่ยวกับการบริการและข้อมูลที่เกี่ยวข้อง</li>
            <li>ปฏิบัติตามข้อกำหนดทางกฎหมาย</li>
          </ul>
          <h2>3. การเปิดเผยข้อมูล</h2>
          <p>เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สาม เว้นแต่จะได้รับความยินยอมจากคุณ หรือตามที่กฎหมายกำหนด</p>
          <h2>4. การรักษาความปลอดภัยของข้อมูล</h2>
          <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึง การใช้ หรือการเปิดเผยโดยไม่ได้รับอนุญาต</p>
          <h2>5. สิทธิของคุณ</h2>
          <p>คุณมีสิทธิในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ตลอดเวลา</p>
          <p>หากมีข้อสงสัยเพิ่มเติมเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราผ่านช่องทางที่ระบุไว้ในเว็บไซต์</p>
        </div>
      </div>
    </div>
  )
}
