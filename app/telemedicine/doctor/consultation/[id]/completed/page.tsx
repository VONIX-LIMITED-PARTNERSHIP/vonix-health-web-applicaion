"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  FileText,
  Download,
  Send,
  Stethoscope,
  Pill,
  ArrowLeft,
  Heart,
  AlertTriangle,
  Copy,
  Mail,
  MessageCircle,
} from "lucide-react"

// Mock data
const mockCompletedConsultation = {
  consultationId: "TM-2024-001",
  date: "15 ม.ค. 2567",
  time: "09:00 - 09:45",
  duration: "45 นาที",
  patient: {
    name: "คุณสมศรี ใจดี",
    age: 45,
    id: "1234567890123",
    phone: "081-234-5678",
    email: "somsi@email.com",
    avatar: "/placeholder-user.jpg",
  },
  doctor: {
    name: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    license: "12345",
    avatar: "/placeholder-user.jpg",
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
  notes: "ผู้ป่วยให้ความร่วมมือดี มีความเข้าใจในการรักษา",
  cost: 500,
  status: "completed",
}

export default function CompletedConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendToPatient = () => {
    setIsSent(true)
    // Send to patient logic
    setTimeout(() => {
      router.push("/telemedicine/doctor")
    }, 2000)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(mockCompletedConsultation.consultationId)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/telemedicine/doctor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับ Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">การปรึกษาเสร็จสิ้น</h1>
                <p className="text-gray-600 dark:text-gray-300">สรุปผลการรักษาและส่งให้ผู้ป่วย</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                เสร็จสิ้น
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {isSent && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">ส่งผลการรักษาเรียบร้อยแล้ว</h3>
                    <p className="text-green-600 text-sm">ผู้ป่วยจะได้รับผลการรักษาทางอีเมลและในระบบ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consultation Summary Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  สรุปการปรึกษา
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">#{mockCompletedConsultation.consultationId}</span>
                  <Button size="sm" variant="ghost" onClick={handleCopyId}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockCompletedConsultation.patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockCompletedConsultation.patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {mockCompletedConsultation.patient.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">{mockCompletedConsultation.patient.age} ปี</p>
                      <p className="text-sm text-gray-500">ID: {mockCompletedConsultation.patient.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">วันที่</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{mockCompletedConsultation.date}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">เวลา</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{mockCompletedConsultation.time}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockCompletedConsultation.doctor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{mockCompletedConsultation.doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {mockCompletedConsultation.doctor.name}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400">{mockCompletedConsultation.doctor.specialty}</p>
                      <p className="text-sm text-gray-500">ใบอนุญาต: {mockCompletedConsultation.doctor.license}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">ระยะเวลาการปรึกษา</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{mockCompletedConsultation.duration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Diagnosis & Treatment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  การวินิจฉัยและการรักษา
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">การวินิจฉัย</h5>
                  <p className="text-red-700 dark:text-red-400 font-medium">{mockCompletedConsultation.diagnosis}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">อาการที่พบ</h5>
                  <ul className="space-y-1">
                    {mockCompletedConsultation.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-2">การรักษา</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mockCompletedConsultation.treatment}</p>
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  ใบสั่งยา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompletedConsultation.medications.map((med, index) => (
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

          {/* Recommendations & Follow-up */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                คำแนะนำและการติดตาม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-3">คำแนะนำการดูแลตนเอง</h5>
                  <ul className="space-y-2">
                    {mockCompletedConsultation.recommendations.map((rec, index) => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-300">{mockCompletedConsultation.followUp}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-2">หมายเหตุ</h6>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{mockCompletedConsultation.notes}</p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <h6 className="font-semibold text-gray-800 dark:text-white mb-2">ค่าบริการ</h6>
                    <p className="text-2xl font-bold text-green-600">฿{mockCompletedConsultation.cost}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" className="h-12 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              ดาวน์โหลด PDF
            </Button>

            <Button variant="outline" className="h-12 bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              ส่งอีเมล
            </Button>

            <Button variant="outline" className="h-12 bg-transparent">
              <MessageCircle className="mr-2 h-4 w-4" />
              ส่งข้อความ
            </Button>
          </div>

          {/* Send to Patient */}
          {!isSent ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">พร้อมส่งผลการรักษาให้ผู้ป่วยแล้ว</h3>
                  <p className="text-gray-600 mb-6">
                    ผู้ป่วยจะได้รับผลการรักษา ใบสั่งยา และคำแนะนำทางอีเมล {mockCompletedConsultation.patient.email}
                  </p>
                  <Button onClick={handleSendToPatient} className="bg-blue-500 hover:bg-blue-600 px-8 py-3">
                    <Send className="mr-2 h-4 w-4" />
                    ส่งผลการรักษาให้ผู้ป่วย
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">ส่งผลการรักษาเรียบร้อยแล้ว</h3>
                  <p className="text-green-600 mb-4">ผู้ป่วยได้รับผลการรักษาแล้ว กำลังนำคุณกลับสู่หน้า Dashboard...</p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild variant="outline">
                      <Link href="/telemedicine/doctor">กลับ Dashboard</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/telemedicine/doctor/patients">ดูรายชื่อผู้ป่วย</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
