"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Video,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Star,
  MessageCircle,
  AlertCircle,
  User,
  Stethoscope,
  ClipboardList,
  BarChart3,
} from "lucide-react"

// Mock data
const mockDoctorProfile = {
  name: "นพ.สมชาย ใจดี",
  specialty: "อายุรกรรม",
  license: "12345",
  experience: "15 ปี",
  rating: 4.8,
  totalConsultations: 1234,
  avatar: "/placeholder-user.jpg",
}

const mockTodayAppointments = [
  {
    id: "1",
    time: "09:00",
    duration: "30 นาที",
    patient: {
      name: "คุณสมศรี ใจดี",
      age: 45,
      id: "1234567890123",
      avatar: "/placeholder-user.jpg",
    },
    symptoms: "ปวดท้อง, คลื่นไส้",
    status: "waiting",
    type: "follow-up",
    priority: "normal",
  },
  {
    id: "2",
    time: "09:30",
    duration: "45 นาที",
    patient: {
      name: "คุณวิชัย สุขภาพ",
      age: 52,
      id: "9876543210987",
      avatar: "/placeholder-user.jpg",
    },
    symptoms: "เจ็บหน้าอก, หายใจลำบาก",
    status: "in-progress",
    type: "new",
    priority: "high",
  },
  {
    id: "3",
    time: "10:15",
    duration: "30 นาที",
    patient: {
      name: "คุณมาลี ดีใจ",
      age: 38,
      id: "5555666677778",
      avatar: "/placeholder-user.jpg",
    },
    symptoms: "ตรวจสุขภาพประจำปี",
    status: "scheduled",
    type: "checkup",
    priority: "normal",
  },
  {
    id: "4",
    time: "11:00",
    duration: "30 นาที",
    patient: {
      name: "คุณสุดา รักษา",
      age: 29,
      id: "1111222233334",
      avatar: "/placeholder-user.jpg",
    },
    symptoms: "ปวดหัว, เวียนหัว",
    status: "scheduled",
    type: "new",
    priority: "normal",
  },
]

const mockStats = {
  todayAppointments: 8,
  completedToday: 3,
  pendingToday: 5,
  avgRating: 4.8,
  totalPatients: 1234,
  monthlyConsultations: 156,
}

export default function DoctorDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge className="bg-yellow-500">รอเข้าห้อง</Badge>
      case "in-progress":
        return <Badge className="bg-green-500 animate-pulse">กำลังปรึกษา</Badge>
      case "scheduled":
        return <Badge variant="outline">กำหนดการ</Badge>
      case "completed":
        return <Badge className="bg-gray-500">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500"
      case "medium":
        return "border-l-4 border-yellow-500"
      default:
        return "border-l-4 border-blue-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <User className="h-4 w-4 text-blue-500" />
      case "follow-up":
        return <Activity className="h-4 w-4 text-green-500" />
      case "checkup":
        return <Stethoscope className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockDoctorProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{mockDoctorProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">{mockDoctorProfile.name}</h1>
                <p className="text-blue-600 dark:text-blue-400">{mockDoctorProfile.specialty}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentTime.toLocaleDateString("th-TH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {currentTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2" />
                ข้อความ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">นัดหมายวันนี้</p>
                  <p className="text-3xl font-bold">{mockStats.todayAppointments}</p>
                  <p className="text-blue-200 text-xs">เสร็จแล้ว {mockStats.completedToday} ราย</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">ผู้ป่วยทั้งหมด</p>
                  <p className="text-3xl font-bold">{mockStats.totalPatients.toLocaleString()}</p>
                  <p className="text-green-200 text-xs">เดือนนี้ +{mockStats.monthlyConsultations} ราย</p>
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
                  <p className="text-3xl font-bold">{mockStats.avgRating}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-300 fill-current mr-1" />
                    <p className="text-purple-200 text-xs">จาก 5 คะแนน</p>
                  </div>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">ประสิทธิภาพวันนี้</p>
                  <p className="text-3xl font-bold">
                    {Math.round((mockStats.completedToday / mockStats.todayAppointments) * 100)}%
                  </p>
                  <Progress
                    value={(mockStats.completedToday / mockStats.todayAppointments) * 100}
                    className="mt-2 h-2 bg-orange-400"
                  />
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    นัดหมายวันนี้
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">{mockTodayAppointments.length} รายการ</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTodayAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className={`hover:shadow-md transition-shadow ${getPriorityColor(appointment.priority)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center min-w-[60px]">
                              <p className="text-lg font-bold text-gray-800 dark:text-white">{appointment.time}</p>
                              <p className="text-xs text-gray-500">{appointment.duration}</p>
                            </div>

                            <Avatar className="h-10 w-10">
                              <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                  {appointment.patient.name}
                                </h4>
                                <span className="text-sm text-gray-500">({appointment.patient.age} ปี)</span>
                                {getTypeIcon(appointment.type)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{appointment.symptoms}</p>
                              <p className="text-xs text-gray-500">ID: {appointment.patient.id}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(appointment.status)}

                            <div className="flex space-x-2">
                              {appointment.status === "waiting" && (
                                <Button size="sm" className="bg-green-500 hover:bg-green-600" asChild>
                                  <Link href={`/telemedicine/doctor/consultation/${appointment.id}`}>
                                    <Video className="h-3 w-3 mr-1" />
                                    เริ่มปรึกษา
                                  </Link>
                                </Button>
                              )}

                              {appointment.status === "in-progress" && (
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600" asChild>
                                  <Link href={`/telemedicine/doctor/consultation/${appointment.id}`}>
                                    <Video className="h-3 w-3 mr-1" />
                                    เข้าห้อง
                                  </Link>
                                </Button>
                              )}

                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/telemedicine/doctor/patient/${appointment.patient.id}`}>
                                  <FileText className="h-3 w-3 mr-1" />
                                  ประวัติ
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {mockTodayAppointments.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">ไม่มีนัดหมายวันนี้</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">การดำเนินการด่วน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600" asChild>
                  <Link href="/telemedicine/doctor/schedule">
                    <Calendar className="h-4 w-4 mr-2" />
                    จัดการตารางเวลา
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/telemedicine/doctor/patients">
                    <Users className="h-4 w-4 mr-2" />
                    รายชื่อผู้ป่วย
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/telemedicine/doctor/reports">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    รายงานสถิติ
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">ปรึกษาเสร็จสิ้น</p>
                      <p className="text-xs text-gray-500">คุณสมศรี ใจดี - 5 นาทีที่แล้ว</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">นัดหมายใหม่</p>
                      <p className="text-xs text-gray-500">คุณวิชัย สุขภาพ - 15 นาทีที่แล้ว</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">ได้รับคะแนน 5 ดาว</p>
                      <p className="text-xs text-gray-500">คุณมาลี ดีใจ - 1 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgent Notifications */}
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-orange-700 dark:text-orange-300">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  แจ้งเตือนสำคัญ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">ผู้ป่วยฉุกเฉิน</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">คุณวิชัย สุขภาพ - เจ็บหน้าอก</p>
                    <Button size="sm" className="mt-2 bg-red-500 hover:bg-red-600">
                      ดูทันที
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
