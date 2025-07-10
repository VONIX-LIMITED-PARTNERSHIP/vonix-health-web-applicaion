"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Users,
  Calendar,
  Star,
  ArrowLeft,
  Eye,
  MessageCircle,
  Phone,
  AlertTriangle,
  Activity,
  Heart,
} from "lucide-react"

// Mock data
const mockPatients = [
  {
    id: "1",
    name: "คุณสมศรี ใจดี",
    age: 45,
    gender: "หญิง",
    phone: "081-234-5678",
    email: "somsi@email.com",
    avatar: "/placeholder-user.jpg",
    lastVisit: "15 ม.ค. 2567",
    totalVisits: 5,
    status: "active",
    priority: "normal",
    conditions: ["เบาหวาน", "ความดันโลหิตสูง"],
    allergies: ["Penicillin"],
    nextAppointment: "22 ม.ค. 2567",
    rating: 5,
  },
  {
    id: "2",
    name: "คุณวิชัย สุขภาพ",
    age: 52,
    gender: "ชาย",
    phone: "082-345-6789",
    email: "wichai@email.com",
    avatar: "/placeholder-user.jpg",
    lastVisit: "10 ม.ค. 2567",
    totalVisits: 3,
    status: "follow-up",
    priority: "high",
    conditions: ["โรคหัวใจ"],
    allergies: [],
    nextAppointment: "17 ม.ค. 2567",
    rating: 4,
  },
  {
    id: "3",
    name: "คุณมาลี ดีใจ",
    age: 38,
    gender: "หญิง",
    phone: "083-456-7890",
    email: "malee@email.com",
    avatar: "/placeholder-user.jpg",
    lastVisit: "8 ม.ค. 2567",
    totalVisits: 2,
    status: "new",
    priority: "normal",
    conditions: [],
    allergies: ["อาหารทะเล"],
    nextAppointment: null,
    rating: 5,
  },
  {
    id: "4",
    name: "คุณสุดา รักษา",
    age: 29,
    gender: "หญิง",
    phone: "084-567-8901",
    email: "suda@email.com",
    avatar: "/placeholder-user.jpg",
    lastVisit: "5 ม.ค. 2567",
    totalVisits: 1,
    status: "inactive",
    priority: "normal",
    conditions: [],
    allergies: [],
    nextAppointment: null,
    rating: null,
  },
]

export default function DoctorPatientsPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let filtered = mockPatients

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.includes(searchTerm),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((patient) => patient.priority === priorityFilter)
    }

    setFilteredPatients(filtered)
  }, [searchTerm, statusFilter, priorityFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">ใช้งานอยู่</Badge>
      case "follow-up":
        return <Badge className="bg-blue-500">ติดตาม</Badge>
      case "new":
        return <Badge className="bg-purple-500">ใหม่</Badge>
      case "inactive":
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>
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

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400 text-sm">ยังไม่ได้ประเมิน</span>

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-3 w-3 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
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
              <Button variant="ghost" asChild>
                <Link href="/telemedicine/doctor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับ Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">รายชื่อผู้ป่วย</h1>
                <p className="text-gray-600 dark:text-gray-300">จัดการข้อมูลผู้ป่วยและประวัติการรักษา</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหาด้วยชื่อ, โทรศัพท์, อีเมล, หรือ ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="active">ใช้งานอยู่</SelectItem>
                    <SelectItem value="follow-up">ติดตาม</SelectItem>
                    <SelectItem value="new">ใหม่</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="ความสำคัญ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="high">สูง</SelectItem>
                    <SelectItem value="medium">ปานกลาง</SelectItem>
                    <SelectItem value="normal">ปกติ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{mockPatients.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ผู้ป่วยทั้งหมด</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {mockPatients.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ใช้งานอยู่</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {mockPatients.filter((p) => p.status === "follow-up").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ต้องติดตาม</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {mockPatients.filter((p) => p.priority === "high").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ความสำคัญสูง</div>
              </CardContent>
            </Card>
          </div>

          {/* Patients List */}
          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`hover:shadow-lg transition-shadow duration-300 ${getPriorityColor(patient.priority)}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{patient.name}</h4>
                            {getStatusBadge(patient.status)}
                            {patient.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-2 w-2 mr-1" />
                                สำคัญ
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {patient.age} ปี ({patient.gender})
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {patient.phone}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              เยี่ยมล่าสุด: {patient.lastVisit}
                            </div>
                            <div className="flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              {patient.totalVisits} ครั้ง
                            </div>
                          </div>

                          {/* Conditions & Allergies */}
                          <div className="mt-2 space-y-1">
                            {patient.conditions.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-gray-600">โรคประจำตัว:</span>
                                {patient.conditions.map((condition, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {patient.allergies.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-gray-600">แพ้:</span>
                                {patient.allergies.map((allergy, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {allergy}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:items-end space-y-2">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {patient.id}</p>
                          {patient.nextAppointment && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              นัดถัดไป: {patient.nextAppointment}
                            </p>
                          )}
                        </div>

                        <div className="mb-2">{renderStars(patient.rating)}</div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/telemedicine/doctor/patient/${patient.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              ดูประวัติ
                            </Link>
                          </Button>

                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            แชท
                          </Button>

                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            นัดหมาย
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">ไม่พบผู้ป่วย</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
