"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageCircle,
  Settings,
  Send,
  Paperclip,
  User,
  Clock,
  Activity,
  Pill,
  Save,
  SendIcon,
  AlertTriangle,
  Heart,
  Thermometer,
  Weight,
  Plus,
  X,
} from "lucide-react"

// Mock data
const mockConsultation = {
  id: "1",
  patient: {
    name: "คุณสมศรี ใจดี",
    age: 45,
    id: "1234567890123",
    avatar: "/placeholder-user.jpg",
    phone: "081-234-5678",
    email: "somsi@email.com",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
    bloodType: "O+",
    allergies: ["ยาปฏิชีวนะ Penicillin", "อาหารทะเล"],
    chronicDiseases: ["เบาหวาน", "ความดันโลหิตสูง"],
    currentMedications: ["Metformin 500mg", "Amlodipine 5mg"],
  },
  doctor: {
    name: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    avatar: "/placeholder-user.jpg",
  },
  startTime: "09:00",
  duration: "00:15:30",
  status: "active",
  symptoms: "ปวดท้องส่วนบน, แสบร้อนหลังอาหาร, คลื่นไส้เล็กน้อย",
  chiefComplaint: "ปวดท้องมา 2 วัน",
}

const mockVitalSigns = {
  bloodPressure: "140/90",
  heartRate: "78",
  temperature: "36.5",
  weight: "65",
  height: "160",
  bmi: "25.4",
}

const mockMessages = [
  {
    id: 1,
    sender: "doctor",
    message: "สวัสดีครับ วันนี้มีอาการอะไรบ้างครับ",
    time: "09:00",
  },
  {
    id: 2,
    sender: "patient",
    message: "สวัสดีค่ะ หนูมีอาการปวดท้องมา 2 วันแล้วค่ะ",
    time: "09:01",
  },
]

export default function DoctorConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [showPatientInfo, setShowPatientInfo] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [duration, setDuration] = useState("00:15:30")

  // Medical form states
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")
  const [medications, setMedications] = useState([{ name: "", dosage: "", duration: "", instructions: "" }])
  const [recommendations, setRecommendations] = useState("")
  const [followUp, setFollowUp] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      // Update duration logic here
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "doctor",
        message: newMessage,
        time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", duration: "", instructions: "" }])
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = medications.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    setMedications(updated)
  }

  const handleSaveDraft = () => {
    // Save draft logic
    console.log("Draft saved")
  }

  const handleCompleteConsultation = () => {
    // Complete consultation logic
    router.push(`/telemedicine/doctor/consultation/${params.id}/completed`)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockConsultation.patient.avatar || "/placeholder.svg"} />
              <AvatarFallback>{mockConsultation.patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{mockConsultation.patient.name}</h2>
              <p className="text-sm text-gray-400">
                {mockConsultation.patient.age} ปี | ID: {mockConsultation.patient.id}
              </p>
            </div>
            <Badge className="bg-green-500">
              <Activity className="h-3 w-3 mr-1" />
              กำลังปรึกษา
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <Button variant="outline" onClick={() => setShowPatientInfo(!showPatientInfo)} className="bg-transparent">
              <User className="h-4 w-4 mr-2" />
              ข้อมูลผู้ป่วย
            </Button>
            <Button variant="destructive" onClick={handleCompleteConsultation} className="bg-red-600 hover:bg-red-700">
              <Phone className="h-4 w-4 mr-2" />
              จบการปรึกษา
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-800 relative">
            {/* Patient Video (Main) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={mockConsultation.patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-4xl">{mockConsultation.patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{mockConsultation.patient.name}</h3>
                <p className="text-gray-400">{mockConsultation.patient.age} ปี</p>
                {!isVideoOn && (
                  <Badge className="mt-2 bg-gray-600">
                    <VideoOff className="h-3 w-3 mr-1" />
                    วิดีโอปิด
                  </Badge>
                )}
              </div>
            </div>

            {/* Doctor Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={mockConsultation.doctor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{mockConsultation.doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">คุณหมอ</p>
                  {!isVideoOn && <VideoOff className="h-4 w-4 mx-auto mt-1 text-gray-400" />}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3">
                <Button
                  size="sm"
                  variant={isVideoOn ? "default" : "destructive"}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button
                  size="sm"
                  variant={isAudioOn ? "default" : "destructive"}
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className="rounded-full w-12 h-12"
                >
                  {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button size="sm" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs defaultValue="patient-info" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="patient-info" className="text-xs">
                ข้อมูลผู้ป่วย
              </TabsTrigger>
              <TabsTrigger value="medical-form" className="text-xs">
                บันทึกการรักษา
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                แชท
              </TabsTrigger>
            </TabsList>

            {/* Patient Info Tab */}
            <TabsContent value="patient-info" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">ข้อมูลพื้นฐาน</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-400">ชื่อ:</p>
                          <p className="text-white">{mockConsultation.patient.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">อายุ:</p>
                          <p className="text-white">{mockConsultation.patient.age} ปี</p>
                        </div>
                        <div>
                          <p className="text-gray-400">หมู่เลือด:</p>
                          <p className="text-white">{mockConsultation.patient.bloodType}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">โทรศัพท์:</p>
                          <p className="text-white">{mockConsultation.patient.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vital Signs */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        สัญญาณชีพ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-3 w-3 text-red-400" />
                          <div>
                            <p className="text-gray-400">ความดัน</p>
                            <p className="text-white font-medium">{mockVitalSigns.bloodPressure} mmHg</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-3 w-3 text-green-400" />
                          <div>
                            <p className="text-gray-400">ชีพจร</p>
                            <p className="text-white font-medium">{mockVitalSigns.heartRate} bpm</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-3 w-3 text-blue-400" />
                          <div>
                            <p className="text-gray-400">อุณหภูมิ</p>
                            <p className="text-white font-medium">{mockVitalSigns.temperature}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Weight className="h-3 w-3 text-purple-400" />
                          <div>
                            <p className="text-gray-400">น้ำหนัก</p>
                            <p className="text-white font-medium">{mockVitalSigns.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chief Complaint */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">อาการสำคัญ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white text-sm">{mockConsultation.chiefComplaint}</p>
                      <p className="text-gray-400 text-xs mt-2">อาการ: {mockConsultation.symptoms}</p>
                    </CardContent>
                  </Card>

                  {/* Allergies */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                        ประวัติแพ้ยา/อาหาร
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {mockConsultation.patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs mr-1 mb-1">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Medications */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center">
                        <Pill className="h-4 w-4 mr-2" />
                        ยาที่ใช้อยู่
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {mockConsultation.patient.currentMedications.map((med, index) => (
                          <p key={index} className="text-white text-sm">
                            {med}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Medical Form Tab */}
            <TabsContent value="medical-form" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {/* Diagnosis */}
                  <div>
                    <Label className="text-white text-sm">การวินิจฉัย</Label>
                    <Textarea
                      placeholder="ระบุการวินิจฉัยโรค..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  {/* Treatment */}
                  <div>
                    <Label className="text-white text-sm">การรักษา</Label>
                    <Textarea
                      placeholder="แผนการรักษา..."
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  {/* Medications */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white text-sm">ใบสั่งยา</Label>
                      <Button size="sm" onClick={addMedication} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-3 w-3 mr-1" />
                        เพิ่มยา
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {medications.map((med, index) => (
                        <Card key={index} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white text-sm font-medium">ยาที่ {index + 1}</span>
                              {medications.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeMedication(index)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Input
                                placeholder="ชื่อยา"
                                value={med.name}
                                onChange={(e) => updateMedication(index, "name", e.target.value)}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                              />
                              <Input
                                placeholder="ขนาดยา"
                                value={med.dosage}
                                onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                              />
                              <Input
                                placeholder="ระยะเวลา"
                                value={med.duration}
                                onChange={(e) => updateMedication(index, "duration", e.target.value)}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                              />
                              <Input
                                placeholder="วิธีใช้"
                                value={med.instructions}
                                onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <Label className="text-white text-sm">คำแนะนำ</Label>
                    <Textarea
                      placeholder="คำแนะนำสำหรับผู้ป่วย..."
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  {/* Follow-up */}
                  <div>
                    <Label className="text-white text-sm">การติดตาม</Label>
                    <Input
                      placeholder="นัดติดตาม..."
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-white text-sm">หมายเหตุ</Label>
                    <Textarea
                      placeholder="หมายเหตุเพิ่มเติม..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSaveDraft} variant="outline" className="flex-1 bg-transparent">
                      <Save className="h-3 w-3 mr-1" />
                      บันทึกแบบร่าง
                    </Button>
                    <Button onClick={handleCompleteConsultation} className="flex-1 bg-green-600 hover:bg-green-700">
                      <SendIcon className="h-3 w-3 mr-1" />
                      ส่งผลการรักษา
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender === "doctor" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="พิมพ์ข้อความ..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[100px] bg-gray-700 border-gray-600 text-white resize-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-transparent">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      className="w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
