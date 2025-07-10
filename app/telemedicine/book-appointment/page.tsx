"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Clock, Star, CheckCircle, CalendarIcon, User, CreditCard, Stethoscope } from "lucide-react"

// Mock data
const mockDoctors = [
  {
    id: "1",
    name: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    rating: 4.8,
    experience: "15 ปี",
    price: 500,
    avatar: "/placeholder-user.jpg",
    available: true,
    description: "ผู้เชี่ยวชาญด้านโรคภายใน มีประสบการณ์การรักษาผู้ป่วยมากว่า 15 ปี",
  },
  {
    id: "2",
    name: "นพ.สุดา รักษา",
    specialty: "โรคหัวใจ",
    rating: 4.9,
    experience: "12 ปี",
    price: 600,
    avatar: "/placeholder-user.jpg",
    available: true,
    description: "ผู้เชี่ยวชาญด้านโรคหัวใจและหลอดเลือด เชี่ยวชาญการรักษาโรคหัวใจ",
  },
  {
    id: "3",
    name: "นพ.วิชัย สุขภาพ",
    specialty: "ศัลยกรรม",
    rating: 4.7,
    experience: "20 ปี",
    price: 800,
    avatar: "/placeholder-user.jpg",
    available: false,
    description: "ผู้เชี่ยวชาญด้านศัลยกรรมทั่วไป มีประสบการณ์การผ่าตัดมากว่า 20 ปี",
  },
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
]

export default function BookAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [symptoms, setSymptoms] = useState("")

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleConfirmBooking = () => {
    // Mock booking confirmation
    router.push("/telemedicine/booking-confirmed")
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          {step > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
        </div>
        <div className={`w-12 h-1 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          {step > 2 ? <CheckCircle className="h-4 w-4" /> : "2"}
        </div>
        <div className={`w-12 h-1 ${step >= 3 ? "bg-blue-500" : "bg-gray-200"}`}></div>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          "3"
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-green-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => (step > 1 ? setStep(step - 1) : router.back())} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ย้อนกลับ
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">จองนัดหมาย</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {step === 1 && "เลือกแพทย์ที่ต้องการปรึกษา"}
                {step === 2 && "เลือกวันและเวลาที่สะดวก"}
                {step === 3 && "ยืนยันการจองนัดหมาย"}
              </p>
            </div>
          </div>

          {renderStepIndicator()}

          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    เลือกแพทย์
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockDoctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${!doctor.available ? "opacity-50" : ""}`}
                        onClick={() => doctor.available && handleDoctorSelect(doctor)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-800 dark:text-white">{doctor.name}</h4>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{doctor.description}</p>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span className="text-sm font-medium">{doctor.rating}</span>
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">{doctor.experience}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">฿{doctor.price}</p>
                                  <Badge variant={doctor.available ? "default" : "secondary"}>
                                    {doctor.available ? "ว่าง" : "ไม่ว่าง"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedDoctor && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    แพทย์ที่เลือก
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-xl">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{selectedDoctor.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400">{selectedDoctor.specialty}</p>
                      <p className="text-green-600 font-medium">฿{selectedDoctor.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      เลือกวันที่
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      เลือกเวลา
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className="h-12"
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedDoctor && selectedDate && selectedTime && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    ยืนยันการจองนัดหมาย
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Doctor Info */}
                  <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-xl">
                    <h4 className="font-semibold mb-3">ข้อมูลแพทย์</h4>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h5 className="font-semibold text-gray-800 dark:text-white">{selectedDoctor.name}</h5>
                        <p className="text-blue-600 dark:text-blue-400">{selectedDoctor.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-4 bg-green-50 dark:bg-gray-800 rounded-xl">
                    <h4 className="font-semibold mb-3">รายละเอียดนัดหมาย</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">วันที่:</span>
                        <span className="font-medium">{selectedDate.toLocaleDateString("th-TH")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">เวลา:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">ค่าบริการ:</span>
                        <span className="font-medium text-green-600">฿{selectedDoctor.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      อาการเบื้องต้น (ไม่บังคับ)
                    </label>
                    <Textarea
                      placeholder="กรุณาอธิบายอาการที่ต้องการปรึกษา..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Payment Info */}
                  <div className="p-4 bg-yellow-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
                      <h4 className="font-semibold">การชำระเงิน</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ชำระเงินหลังจากการปรึกษาเสร็จสิ้น ผ่านระบบออนไลน์ที่ปลอดภัย
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      แก้ไข
                    </Button>
                    <Button onClick={handleConfirmBooking} className="flex-1 bg-green-500 hover:bg-green-600">
                      ยืนยันการจอง
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
