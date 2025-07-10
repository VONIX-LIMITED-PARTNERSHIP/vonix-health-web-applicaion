"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Clock,
  User,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  ArrowLeft,
  Phone,
  MapPin,
  Activity,
  Thermometer,
  Weight,
  Pill,
  Video,
} from "lucide-react"

// Mock data
const mockPendingCases = [
  {
    id: "case-001",
    patient: {
      name: "คุณสมหญิง รักสุขภาพ",
      age: 34,
      gender: "หญิง",
      avatar: "/placeholder-user.jpg",
      phone: "081-234-5678",
      location: "กรุงเทพฯ",
    },
    symptoms: {
      chief: "ปวดท้องรุนแรง",
      details: "ปวดท้องส่วนล่างด้านขวา, คลื่นไส้, อาเจียน",
      duration: "6 ชั่วโมง",
    },
    severity: "high",
    urgency: "urgent",
    requestedTime: "14:30",
    estimatedDuration: "45 นาที",
    fee: "800 บาท",
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: "95",
      temperature: "37.8",
      weight: "58",
    },
    medicalHistory: {
      chronicDiseases: ["ไม่มี"],
      allergies: ["ยาปฏิชีวนะ Penicillin"],
      currentMedications: ["ไม่มี"],
    },
    submittedAt: "13:45",
  },
  {
    id: "case-002",
    patient: {
      name: "คุณประยุทธ์ สุขใจ",
      age: 45,
      gender: "ชาย",
      avatar: "/placeholder-user.jpg",
      phone: "082-345-6789",
      location: "นนทบุรี",
    },
    symptoms: {
      chief: "เจ็บหน้าอก",
      details: "เจ็บหน้าอกกลาง, หายใจลำบาก, เหงื่อออก",
      duration: "2 ชั่วโมง",
    },
    severity: "high",
    urgency: "urgent",
    requestedTime: "15:00",
    estimatedDuration: "60 นาที",
    fee: "1,000 บาท",
    vitalSigns: {
      bloodPressure: "160/95",
      heartRate: "110",
      temperature: "36.8",
      weight: "75",
    },
    medicalHistory: {
      chronicDiseases: ["ความดันโลหิตสูง", "เบาหวาน"],
      allergies: ["ไม่มี"],
      currentMedications: ["Amlodipine 5mg", "Metformin 500mg"],
    },
    submittedAt: "14:15",
  },
  {
    id: "case-003",
    patient: {
      name: "คุณมาลี ใจดี",
      age: 28,
      gender: "หญิง",
      avatar: "/placeholder-user.jpg",
      phone: "083-456-7890",
      location: "ปทุมธานี",
    },
    symptoms: {
      chief: "ปวดหัวและไข้",
      details: "ปวดหัวมาก, ไข้สูง, ปวดเมื่อยตัว",
      duration: "1 วัน",
    },
    severity: "medium",
    urgency: "normal",
    requestedTime: "16:00",
    estimatedDuration: "30 นาที",
    fee: "600 บาท",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "88",
      temperature: "38.5",
      weight: "52",
    },
    medicalHistory: {
      chronicDiseases: ["ไม่มี"],
      allergies: ["ไม่มี"],
      currentMedications: ["Paracetamol 500mg"],
    },
    submittedAt: "14:30",
  },
]

const mockAcceptedCases = [
  {
    id: "case-004",
    patient: {
      name: "คุณสมชาย ดีใจ",
      age: 52,
      gender: "ชาย",
      avatar: "/placeholder-user.jpg",
    },
    symptoms: {
      chief: "ตรวจสุขภาพประจำปี",
      details: "ตรวจสุขภาพทั่วไป, ปรึกษาเรื่องการออกกำลังกาย",
    },
    severity: "low",
    scheduledTime: "10:00",
    status: "scheduled",
    acceptedAt: "09:30",
  },
]

export default function DoctorCasesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [selectedCase, setSelectedCase] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">รุนแรง</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">ปานกลาง</Badge>
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">เล็กน้อย</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white animate-pulse">ด่วน</Badge>
      case "normal":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            ปกติ
          </Badge>
        )
      default:
        return <Badge variant="secondary">{urgency}</Badge>
    }
  }

  const handleAcceptCase = (caseId: string) => {
    console.log("Accept case:", caseId)
    // Handle accept case logic
  }

  const handleRejectCase = (caseId: string) => {
    console.log("Reject case:", caseId)
    // Handle reject case logic
  }

  const filteredCases = mockPendingCases.filter((case_) => {
    const matchesSearch =
      case_.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.symptoms.chief.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || case_.severity === severityFilter
    const matchesUrgency = urgencyFilter === "all" || case_.urgency === urgencyFilter

    return matchesSearch && matchesSeverity && matchesUrgency
  })

  if (!mounted) {
    return null
  }

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setSelectedCase(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">รายละเอียดเคส</h1>
                <p className="text-blue-100 text-sm">ID: {selectedCase.id}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Basic Info */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center text-gray-800">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    ข้อมูลผู้ป่วย
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-4 border-blue-200">
                      <AvatarImage src={selectedCase.patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                        {selectedCase.patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{selectedCase.patient.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-500">อายุ</p>
                          <p className="font-medium text-gray-800">{selectedCase.patient.age} ปี</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">เพศ</p>
                          <p className="font-medium text-gray-800">{selectedCase.patient.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">เบอร์โทร</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-blue-600" />
                            {selectedCase.patient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ที่อยู่</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                            {selectedCase.patient.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Symptoms */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center text-gray-800">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    อาการและประวัติ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">อาการหลัก</p>
                    <p className="font-medium text-gray-800 text-lg">{selectedCase.symptoms.chief}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">รายละเอียดอาการ</p>
                    <p className="text-gray-700">{selectedCase.symptoms.details}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedCase.symptoms.duration}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedCase.patient.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedCase.requestedTime}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center text-gray-800">
                    <Heart className="h-5 w-5 mr-2 text-green-600" />
                    สัญญาณชีพ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ความดันโลหิต</p>
                        <p className="font-bold text-gray-800">{selectedCase.vitalSigns.bloodPressure} mmHg</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ชีพจร</p>
                        <p className="font-bold text-gray-800">{selectedCase.vitalSigns.heartRate} bpm</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Thermometer className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">อุณหภูมิ</p>
                        <p className="font-bold text-gray-800">{selectedCase.vitalSigns.temperature}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Weight className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">น้ำหนัก</p>
                        <p className="font-bold text-gray-800">{selectedCase.vitalSigns.weight} kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center text-gray-800">
                    <Pill className="h-5 w-5 mr-2 text-purple-600" />
                    ประวัติการแพทย์
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">โรคประจำตัว</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.medicalHistory.chronicDiseases.map((disease: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">ประวัติแพ้ยา</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.medicalHistory.allergies.map((allergy: string, index: number) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-700 border-red-300">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">ยาที่ใช้อยู่</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.medicalHistory.currentMedications.map((medication: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Case Details & Actions */}
            <div className="space-y-6">
              {/* Case Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                  <CardTitle className="text-gray-800">สรุปเคส</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">เวลาที่ต้องการ</p>
                    <p className="font-medium text-gray-800 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      {selectedCase.requestedTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ระยะเวลาโดยประมาณ</p>
                    <p className="font-medium text-gray-800">{selectedCase.estimatedDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ค่าบริการ</p>
                    <p className="font-bold text-green-600 text-lg">{selectedCase.fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ส่งเคสเมื่อ</p>
                    <p className="font-medium text-gray-800">{selectedCase.submittedAt}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                  <CardTitle className="text-gray-800">การดำเนินการ</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAcceptCase(selectedCase.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    รับเคสนี้
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={() => handleRejectCase(selectedCase.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    ปฏิเสธเคส
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    ติดต่อผู้ป่วย
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">จัดการเคส</h1>
                <p className="text-blue-100 text-sm">ดูและพิจารณาเคสผู้ป่วย</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link href="/telemedicine/doctor">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับหน้าหลัก
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              เคสที่รอพิจารณา ({filteredCases.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              เคสที่รับแล้ว ({mockAcceptedCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="ค้นหาชื่อผู้ป่วยหรืออาการ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300"
                      />
                    </div>
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full md:w-48 border-gray-300">
                      <SelectValue placeholder="ความรุนแรง" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกระดับ</SelectItem>
                      <SelectItem value="high">รุนแรง</SelectItem>
                      <SelectItem value="medium">ปานกลาง</SelectItem>
                      <SelectItem value="low">เล็กน้อย</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="w-full md:w-48 border-gray-300">
                      <SelectValue placeholder="ความเร่งด่วน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภท</SelectItem>
                      <SelectItem value="urgent">ด่วน</SelectItem>
                      <SelectItem value="normal">ปกติ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Cases List */}
            <div className="space-y-4">
              {filteredCases.map((case_) => (
                <Card
                  key={case_.id}
                  className={`shadow-lg border-0 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    case_.urgency === "urgent" ? "border-l-4 border-l-red-500 bg-red-50" : "bg-white"
                  }`}
                  onClick={() => setSelectedCase(case_)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                          <AvatarImage src={case_.patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                            {case_.patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-800 text-lg">{case_.patient.name}</h4>
                            <span className="text-sm text-gray-500">({case_.patient.age} ปี)</span>
                            <span className="text-sm text-gray-500">{case_.patient.gender}</span>
                          </div>
                          <p className="text-red-600 font-medium mb-1">{case_.symptoms.chief}</p>
                          <p className="text-sm text-gray-600 mb-2">{case_.symptoms.details}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {case_.symptoms.duration}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {case_.patient.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {case_.requestedTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex space-x-2">
                          {getSeverityBadge(case_.severity)}
                          {getUrgencyBadge(case_.urgency)}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{case_.fee}</p>
                          <p className="text-sm text-gray-500">{case_.estimatedDuration}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCase(case_)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCases.length === 0 && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">ไม่มีเคสที่รอพิจารณา</p>
                    <p className="text-gray-400 text-sm">เคสใหม่จะปรากฏที่นี่เมื่อมีผู้ป่วยส่งคำขอ</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-6">
            <div className="space-y-4">
              {mockAcceptedCases.map((case_) => (
                <Card key={case_.id} className="shadow-lg border-0 bg-green-50 border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={case_.patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                            {case_.patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-gray-800">{case_.patient.name}</h4>
                          <p className="text-sm text-gray-600">{case_.symptoms.chief}</p>
                          <p className="text-xs text-gray-500">รับเคสเมื่อ: {case_.acceptedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">รับแล้ว</Badge>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <Link href={`/telemedicine/doctor/consultation/${case_.id}`}>
                            <Video className="h-3 w-3 mr-1" />
                            เข้าห้องปรึกษา
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockAcceptedCases.length === 0 && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">ยังไม่มีเคสที่รับ</p>
                    <p className="text-gray-400 text-sm">เคสที่คุณรับจะปรากฏที่นี่</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
