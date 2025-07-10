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
  AlertCircle,
  User,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Eye,
  Bell,
  Settings,
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
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">รอเข้าห้อง</Badge>
      case "in-progress":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white animate-pulse">กำลังปรึกษา</Badge>
      case "scheduled":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            กำหนดการ
          </Badge>
        )
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">เสร็จสิ้น</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50"
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50"
      default:
        return "border-l-4 border-blue-500 bg-blue-50"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <User className="h-4 w-4 text-blue-600" />
      case "follow-up":
        return <Activity className="h-4 w-4 text-green-600" />
      case "checkup":
        return <Stethoscope className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Blue Header */}
      <div className="bg-blue-600 shadow-lg border-b border-blue-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VONIX Health - Doctor Portal</h1>
                <p className="text-blue-100 text-sm">ระบบจัดการแพทย์ออนไลน์</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-blue-100 text-sm">
                  {currentTime.toLocaleDateString("th-TH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg font-semibold text-white">
                  {currentTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Bell className="h-4 w-4 mr-2" />
                แจ้งเตือน
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                ตั้งค่า
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Profile Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-blue-200">
              <AvatarImage src={mockDoctorProfile.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                {mockDoctorProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{mockDoctorProfile.name}</h2>
              <p className="text-blue-600 font-medium">{mockDoctorProfile.specialty}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">ใบอนุญาต: {mockDoctorProfile.license}</span>
                <span className="text-sm text-gray-600">ประสบการณ์: {mockDoctorProfile.experience}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium text-gray-700">{mockDoctorProfile.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">นัดหมายวันนี้</p>
                  <p className="text-3xl font-bold">{mockStats.todayAppointments}</p>
                  <p className="text-blue-200 text-xs">เสร็จแล้ว {mockStats.completedToday} ราย</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">ผู้ป่วยทั้งหมด</p>
                  <p className="text-3xl font-bold">{mockStats.totalPatients.toLocaleString()}</p>
                  <p className="text-emerald-200 text-xs">เดือนนี้ +{mockStats.monthlyConsultations} ราย</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">คะแนนความพึงพอใจ</p>
                  <p className="text-3xl font-bold">{mockStats.avgRating}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-300 fill-current mr-1" />
                    <p className="text-purple-200 text-xs">จาก 5 คะแนน</p>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">ประสิทธิภาพวันนี้</p>
                  <p className="text-3xl font-bold">
                    {Math.round((mockStats.completedToday / mockStats.todayAppointments) * 100)}%
                  </p>
                  <Progress
                    value={(mockStats.completedToday / mockStats.todayAppointments) * 100}
                    className="mt-2 h-2 bg-orange-400"
                  />
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800">นัดหมายวันนี้</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {mockTodayAppointments.length} รายการ
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockTodayAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className={`hover:shadow-md transition-all duration-200 ${getPriorityColor(
                        appointment.priority,
                      )} border-0`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center min-w-[70px] bg-white rounded-lg p-2 shadow-sm">
                              <p className="text-lg font-bold text-gray-800">{appointment.time}</p>
                              <p className="text-xs text-gray-500">{appointment.duration}</p>
                            </div>

                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gray-100 text-gray-700">
                                {appointment.patient.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-800">{appointment.patient.name}</h4>
                                <span className="text-sm text-gray-500">({appointment.patient.age} ปี)</span>
                                {getTypeIcon(appointment.type)}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{appointment.symptoms}</p>
                              <p className="text-xs text-gray-500">ID: {appointment.patient.id}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-3">
                            {getStatusBadge(appointment.status)}

                            <div className="flex space-x-2">
                              {appointment.status === "waiting" && (
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white shadow-sm"
                                  asChild
                                >
                                  <Link href={`/telemedicine/doctor/consultation/${appointment.id}`}>
                                    <Video className="h-3 w-3 mr-1" />
                                    เริ่มปรึกษา
                                  </Link>
                                </Button>
                              )}

                              {appointment.status === "in-progress" && (
                                <Button
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                                  asChild
                                >
                                  <Link href={`/telemedicine/doctor/consultation/${appointment.id}`}>
                                    <Video className="h-3 w-3 mr-1" />
                                    เข้าห้อง
                                  </Link>
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50 bg-transparent"
                                asChild
                              >
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
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">ไม่มีนัดหมายวันนี้</p>
                    <p className="text-gray-400 text-sm">คุณสามารถพักผ่อนหรือตรวจสอบเคสใหม่ได้</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Professional Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-lg text-gray-800">การดำเนินการด่วน</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white shadow-sm" asChild>
                  <Link href="/telemedicine/doctor/schedule">
                    <Calendar className="h-4 w-4 mr-3" />
                    จัดการตารางเวลา
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  asChild
                >
                  <Link href="/telemedicine/doctor/patients">
                    <Users className="h-4 w-4 mr-3" />
                    รายชื่อผู้ป่วย
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  asChild
                >
                  <Link href="/telemedicine/doctor/cases">
                    <Eye className="h-4 w-4 mr-3" />
                    จัดการเคส
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  asChild
                >
                  <Link href="/telemedicine/doctor/reports">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    รายงานสถิติ
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="text-lg text-gray-800">กิจกรรมล่าสุด</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">ปรึกษาเสร็จสิ้น</p>
                      <p className="text-xs text-gray-500">คุณสมศรี ใจดี - 5 นาทีที่แล้ว</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">นัดหมายใหม่</p>
                      <p className="text-xs text-gray-500">คุณวิชัย สุขภาพ - 15 นาทีที่แล้ว</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">ได้รับคะแนน 5 ดาว</p>
                      <p className="text-xs text-gray-500">คุณมาลี ดีใจ - 1 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgent Notifications */}
            <Card className="shadow-lg border-0 border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b">
                <CardTitle className="text-lg flex items-center text-orange-800">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  แจ้งเตือนสำคัญ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">ผู้ป่วยฉุกเฉิน</p>
                        <p className="text-xs text-gray-600 mb-2">คุณวิชัย สุขภาพ - เจ็บหน้าอก</p>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                          ดูทันที
                        </Button>
                      </div>
                    </div>
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
