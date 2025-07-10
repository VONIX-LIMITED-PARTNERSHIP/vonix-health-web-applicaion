"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, Calendar, Clock, User, MessageCircle, Video, ArrowRight, Phone } from "lucide-react"

export default function BookingConfirmedPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">จองนัดหมายสำเร็จ!</h1>
            <p className="text-gray-600 dark:text-gray-300">เราได้ส่งข้อมูลการจองไปยังอีเมลของคุณแล้ว</p>
          </div>

          {/* Booking Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                รายละเอียดการจอง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">นพ.สมชาย ใจดี</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">อายุรกรรม</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">15 ม.ค. 2567</p>
                  <p className="text-sm text-blue-600">14:00 น.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">หมายเลขการจอง</p>
                  <p className="font-semibold text-gray-800 dark:text-white">#TM-2024-001</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">ค่าบริการ</p>
                  <p className="font-semibold text-green-600">฿500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>ขั้นตอนต่อไป</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">เตรียมตัวก่อนการปรึกษา</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">เข้าห้องปรึกษาได้ 15 นาทีก่อนเวลานัด</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">สามารถแชทกับแพทย์ได้</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">หากมีคำถามเพิ่มเติมก่อนการปรึกษา</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                <Video className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">ตรวจสอบอุปกรณ์</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ทดสอบกล้องและไมโครโฟนก่อนเวลานัด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 h-12">
              <Link href="/telemedicine">
                <ArrowRight className="mr-2 h-4 w-4" />
                กลับสู่หน้าหลัก
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                แชทกับแพทย์
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <Phone className="mr-2 h-4 w-4" />
                ติดต่อสนับสนุน
              </Button>
            </div>
          </div>

          {/* Important Notes */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">หมายเหตุสำคัญ</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• หากต้องการยกเลิกนัด กรุณาแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง</li>
                <li>• การชำระเงินจะเกิดขึ้นหลังจากการปรึกษาเสร็จสิ้น</li>
                <li>• สามารถดูประวัติการปรึกษาได้ในหน้าประวัติ</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
