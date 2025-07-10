"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Calendar,
  Clock,
  Video,
  Stethoscope,
  MessageCircle,
  ArrowRight,
  Users,
  Star,
  CalendarDays,
  History,
} from "lucide-react"

// Mock data
const mockAppointments = [
  {
    id: "1",
    doctorName: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    date: "2024-01-15",
    time: "14:00",
    status: "upcoming",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    doctorName: "นพ.สุดา รักษา",
    specialty: "โรคหัวใจ",
    date: "2024-01-10",
    time: "10:30",
    status: "completed",
    avatar: "/placeholder-user.jpg",
  },
]

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
  },
]

export default function TelemedicinePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-green-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Video className="w-4 h-4 mr-2" />
            ระบบปรึกษาแพทย์ออนไลน์
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              ปรึกษาแพทย์ออนไลน์
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            พบแพทย์ผู้เชี่ยวชาญได้ทุกที่ทุกเวลา ปลอดภัย สะดวก และเชื่อถือได้
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">แพทย์ออนไลน์</p>
                  <p className="text-2xl font-bold">24/7</p>
                </div>
                <Stethoscope className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">การปรึกษาทั้งหมด</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">คะแนนความพึงพอใจ</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">เวลาตอบสนองเฉลี่ย</p>
                  <p className="text-2xl font-bold">2 นาที</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">จองนัดหมาย</h3>
                  <p className="text-gray-600 dark:text-gray-300">เลือกแพทย์และเวลาที่สะดวก</p>
                </div>
              </div>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl">
                <Link href="/telemedicine/book-appointment">
                  จองนัดหมายใหม่
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">ประวัติการปรึกษา</h3>
                  <p className="text-gray-600 dark:text-gray-300">ดูประวัติและผลการรักษา</p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl bg-transparent"
              >
                <Link href="/telemedicine/history">
                  ดูประวัติทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              นัดหมายที่จะมาถึง
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockAppointments.filter((apt) => apt.status === "upcoming").length > 0 ? (
              <div className="space-y-4">
                {mockAppointments
                  .filter((apt) => apt.status === "upcoming")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.specialty}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {new Date(appointment.date).toLocaleDateString("th-TH")} เวลา {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          แชท
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <Video className="h-4 w-4 mr-1" />
                          เข้าห้องปรึกษา
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">ไม่มีนัดหมายที่จะมาถึง</p>
                <Button asChild className="mt-4">
                  <Link href="/telemedicine/book-appointment">จองนัดหมายใหม่</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              แพทย์แนะนำ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockDoctors.map((doctor) => (
                <Card key={doctor.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{doctor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{doctor.specialty}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">ประสบการณ์:</span>
                        <span className="font-medium">{doctor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">คะแนน:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">ค่าบริการ:</span>
                        <span className="font-medium text-green-600">฿{doctor.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant={doctor.available ? "default" : "secondary"}>
                        {doctor.available ? "ว่าง" : "ไม่ว่าง"}
                      </Badge>
                      <Button size="sm" disabled={!doctor.available} className="bg-blue-500 hover:bg-blue-600">
                        จองนัด
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
