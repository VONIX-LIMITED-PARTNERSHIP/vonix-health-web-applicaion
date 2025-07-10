"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { History, Search, Filter, Calendar, Clock, Download, Eye, Star, Stethoscope, ArrowLeft } from "lucide-react"

// Mock data
const mockHistory = [
  {
    id: "TM-2024-001",
    date: "15 ม.ค. 2567",
    time: "14:00",
    doctor: {
      name: "นพ.สมชาย ใจดี",
      specialty: "อายุรกรรม",
      avatar: "/placeholder-user.jpg",
    },
    diagnosis: "โรคกรดไหลย้อน (GERD)",
    status: "completed",
    rating: 5,
    cost: 500,
    duration: "45 นาที",
  },
  {
    id: "TM-2024-002",
    date: "10 ม.ค. 2567",
    time: "10:30",
    doctor: {
      name: "นพ.สุดา รักษา",
      specialty: "โรคหัวใจ",
      avatar: "/placeholder-user.jpg",
    },
    diagnosis: "ตรวจสุขภาพทั่วไป",
    status: "completed",
    rating: 4,
    cost: 600,
    duration: "30 นาที",
  },
  {
    id: "TM-2024-003",
    date: "5 ม.ค. 2567",
    time: "16:00",
    doctor: {
      name: "นพ.วิชัย สุขภาพ",
      specialty: "ศัลยกรรม",
      avatar: "/placeholder-user.jpg",
    },
    diagnosis: "ปรึกษาก่อนผ่าตัด",
    status: "completed",
    rating: 5,
    cost: 800,
    duration: "60 นาที",
  },
  {
    id: "TM-2024-004",
    date: "20 ม.ค. 2567",
    time: "09:00",
    doctor: {
      name: "นพ.สมชาย ใจดี",
      specialty: "อายุรกรรม",
      avatar: "/placeholder-user.jpg",
    },
    diagnosis: "นัดติดตาม",
    status: "upcoming",
    rating: null,
    cost: 500,
    duration: "30 นาที",
  },
]

export default function ConsultationHistoryPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredHistory, setFilteredHistory] = useState(mockHistory)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let filtered = mockHistory

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredHistory(filtered)
  }, [searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">เสร็จสิ้น</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500">กำลังจะมาถึง</Badge>
      case "cancelled":
        return <Badge variant="destructive">ยกเลิก</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400 text-sm">ยังไม่ได้ประเมิน</span>

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-green-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/telemedicine">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ย้อนกลับ
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">ประวัติการปรึกษา</h1>
              <p className="text-gray-600 dark:text-gray-300">ดูประวัติการปรึกษาแพทย์ทั้งหมด</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหาด้วยชื่อแพทย์, การวินิจฉัย, หรือรหัส..."
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
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                    <SelectItem value="upcoming">กำลังจะมาถึง</SelectItem>
                    <SelectItem value="cancelled">ยกเลิก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {mockHistory.filter((h) => h.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">การปรึกษาทั้งหมด</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {mockHistory.filter((h) => h.status === "upcoming").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">นัดที่จะมาถึง</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {mockHistory.filter((h) => h.rating).reduce((acc, h) => acc + (h.rating || 0), 0) /
                    mockHistory.filter((h) => h.rating).length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">คะแนนเฉลี่ย</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ฿{mockHistory.filter((h) => h.status === "completed").reduce((acc, h) => acc + h.cost, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ค่าใช้จ่ายรวม</div>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <div className="space-y-6">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={consultation.doctor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{consultation.doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{consultation.doctor.name}</h4>
                            {getStatusBadge(consultation.status)}
                          </div>

                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            {consultation.doctor.specialty}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{consultation.diagnosis}</p>

                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {consultation.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {consultation.time}
                            </div>
                            <div className="flex items-center">
                              <Stethoscope className="h-3 w-3 mr-1" />
                              {consultation.duration}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:items-end space-y-2">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">฿{consultation.cost}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">#{consultation.id}</p>
                        </div>

                        {consultation.status === "completed" && (
                          <div className="mb-2">{renderStars(consultation.rating)}</div>
                        )}

                        <div className="flex space-x-2">
                          {consultation.status === "completed" && (
                            <>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/telemedicine/consultation/${consultation.id}/summary`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  ดูรายละเอียด
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                PDF
                              </Button>
                            </>
                          )}

                          {consultation.status === "upcoming" && (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600" asChild>
                              <Link href={`/telemedicine/consultation/${consultation.id}`}>เข้าห้องปรึกษา</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">ไม่พบประวัติการปรึกษา</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                  <Button asChild>
                    <Link href="/telemedicine/book-appointment">จองนัดหมายใหม่</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination would go here if needed */}
        </div>
      </main>

      <Footer />
    </div>
  )
}
