"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  CheckCircle,
  FileText,
  Download,
  Star,
  Stethoscope,
  Pill,
  Calendar,
  ArrowRight,
  MessageCircle,
  Heart,
  AlertTriangle,
} from "lucide-react"

// Mock data
const mockSummary = {
  consultationId: "TM-2024-001",
  date: "15 ม.ค. 2567",
  time: "14:00 - 14:45",
  duration: "45 นาที",
  doctor: {
    name: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    license: "12345",
    avatar: "/placeholder-user.jpg",
  },
  patient: {
    name: "คุณสมศรี ใจดี",
    age: 45,
    id: "1234567890123",
  },
  diagnosis: "โรคกรดไหลย้อน (GERD)",
  symptoms: ["ปวดท้องส่วนบน", "แสบร้อนหลังอาหาร", "คลื่นไส้เล็กน้อย"],
  treatment: "แนะนำการปรับพฤติกรรมการกิน และให้ยาลดกรด",
  medications: [
    {
      name: "Omeprazole 20mg",
      dosage: "วันละ 1 เม็ด ก่อนอาหารเช้า",
      duration: "14 วัน",
      instructions: "กินก่อนอาหาร 30 นาที",
    },
    {
      name: "Domperidone 10mg",
      dosage: "วันละ 3 เม็ด ก่อนอาหาร",
      duration: "7 วัน",
      instructions: "กินก่อนอาหาร 15 นาที",
    },
  ],
  recommendations: [
    "หลีกเลี่ยงอาหารเผ็ด เปรี้ยว และมัน",
    "กินอาหารเป็นเวลา และเคี้ยวให้ละเอียด",
    "หลีกเลี่ยงการนอนหลังอาหารทันที",
    "ลดน้ำหนักหากมีน้ำหนักเกิน",
  ],
  followUp: "นัดติดตาม 2 สัปดาห์ หากอาการไม่ดีขึ้น",
  cost: 500,
  rating: null,
}

export default function ConsultationSummaryPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRating = (value: number) => {
    setRating(value)
  }

  const handleSubmitFeedback = () => {
    // Submit feedback logic
    console.log("Rating:", rating, "Feedback:", feedback)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">การปรึกษาเสร็จสิ้น</h1>
            <p className="text-gray-600 dark:text-gray-300">ผลสรุปการปรึกษาและใบสั่งยา</p>
          </div>

          {/* Consultation Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ข้อมูลการปรึกษา
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockSummary.doctor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockSummary.doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{mockSummary.doctor.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400">{mockSummary.doctor.specialty}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">ใบอนุญาต: {mockSummary.doctor.license}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">วันที่</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{mockSummary.date}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">เวลา</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{mockSummary.time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-gray-800 dark:text-white mb-2">ข้อมูลผู้ป่วย</h5>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">ชื่อ:</span> {mockSummary.patient.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">อายุ:</span> {mockSummary.patient.age} ปี
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">รหัสประจำตัว:</span> {mockSummary.patient.id}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">หมายเลขการปรึกษา</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{mockSummary.consultationId}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis & Treatment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  การวินิจฉัย
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">โรคที่วินิจฉัย</h5>
                  <p className="text-red-700 dark:text-red-400 font-medium">{mockSummary.diagnosis}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">อาการที่พบ</h5>
                  <ul className="space-y-1">
                    {mockSummary.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">การรักษา</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mockSummary.treatment}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  ใบสั่งยา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSummary.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <h6 className="font-semibold text-gray-800 dark:text-white">{med.name}</h6>
                      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p>
                          <strong>ขนาด:</strong> {med.dosage}
                        </p>
                        <p>
                          <strong>ระยะเวลา:</strong> {med.duration}
                        </p>
                        <p>
                          <strong>วิธีใช้:</strong> {med.instructions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                คำแนะนำ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-3">คำแนะนำการดูแลตนเอง</h5>
                  <ul className="space-y-2">
                    {mockSummary.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-gray-800 rounded-lg">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-2">การติดตาม</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{mockSummary.followUp}</p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-2">ค่าบริการ</h6>
                    <p className="text-2xl font-bold text-green-600">฿{mockSummary.cost}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ชำระเงินเรียบร้อยแล้ว</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating & Feedback */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                ประเมินการบริการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">กรุณาให้คะแนนการบริการของเรา</p>

                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`p-2 rounded-full transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="max-w-md mx-auto">
                    <textarea
                      placeholder="ความคิดเห็นเพิ่มเติม (ไม่บังคับ)"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                    />
                    <Button onClick={handleSubmitFeedback} className="mt-3 bg-blue-500 hover:bg-blue-600">
                      ส่งความคิดเห็น
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button className="h-12 bg-blue-500 hover:bg-blue-600">
              <Download className="mr-2 h-4 w-4" />
              ดาวน์โหลด PDF
            </Button>

            <Button variant="outline" className="h-12 bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              จองนัดติดตาม
            </Button>

            <Button variant="outline" className="h-12 bg-transparent">
              <MessageCircle className="mr-2 h-4 w-4" />
              ติดต่อแพทย์
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/telemedicine/history">ดูประวัติทั้งหมด</Link>
            </Button>

            <Button asChild className="bg-green-500 hover:bg-green-600">
              <Link href="/telemedicine">
                <ArrowRight className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
