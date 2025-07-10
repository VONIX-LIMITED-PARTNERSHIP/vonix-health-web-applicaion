"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageCircle,
  Settings,
  Maximize,
  Minimize,
  Send,
  Paperclip,
  User,
  Clock,
  Activity,
  PhoneOff,
} from "lucide-react"

// Mock data
const mockConsultation = {
  id: "1",
  doctor: {
    name: "นพ.สมชาย ใจดี",
    specialty: "อายุรกรรม",
    avatar: "/placeholder-user.jpg",
    license: "12345",
    experience: "15 ปี",
    rating: 4.8,
  },
  patient: {
    name: "คุณสมศรี ใจดี",
    age: 45,
    avatar: "/placeholder-user.jpg",
  },
  startTime: "14:00",
  duration: "00:15:30",
  status: "active",
  appointmentTime: "14:00 - 14:30",
  fee: "800 บาท",
}

const mockMessages = [
  {
    id: 1,
    sender: "doctor",
    message: "สวัสดีครับ วันนี้มีอาการอะไรบ้างครับ",
    time: "14:00",
  },
  {
    id: 2,
    sender: "patient",
    message: "สวัสดีค่ะ หนูมีอาการปวดท้องมา 2 วันแล้วค่ะ",
    time: "14:01",
  },
  {
    id: 3,
    sender: "doctor",
    message: "ปวดท้องส่วนไหนครับ ปวดแบบไหน มีอาการอื่นร่วมด้วยไหมครับ",
    time: "14:02",
  },
  {
    id: 4,
    sender: "patient",
    message: "ปวดท้องส่วนบนค่ะ เป็นแบบแสบร้อน แล้วก็คลื่นไส้เล็กน้อย",
    time: "14:03",
  },
]

export default function PatientConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [duration, setDuration] = useState("00:15:30")

  useEffect(() => {
    setMounted(true)

    // Mock timer for consultation duration
    const timer = setInterval(() => {
      // Update duration logic here
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "patient",
        message: newMessage,
        time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleEndCall = () => {
    router.push(`/telemedicine/consultation/${params.id}/summary`)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-blue-200">
                <AvatarImage src={mockConsultation.doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {mockConsultation.doctor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-gray-800">{mockConsultation.doctor.name}</h2>
                <p className="text-sm text-blue-600">{mockConsultation.doctor.specialty}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>ใบอนุญาต: {mockConsultation.doctor.license}</span>
                  <span>•</span>
                  <span>ประสบการณ์: {mockConsultation.doctor.experience}</span>
                </div>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                <Activity className="h-3 w-3 mr-1" />
                กำลังปรึกษา
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">เวลาปรึกษา: {mockConsultation.appointmentTime}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-800">{duration}</span>
                </div>
              </div>
              <Button variant="destructive" onClick={handleEndCall} className="bg-red-500 hover:bg-red-600">
                <PhoneOff className="h-4 w-4 mr-2" />
                จบการปรึกษา
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Doctor Video (Main) */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={mockConsultation.doctor.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">
                    {mockConsultation.doctor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-white">{mockConsultation.doctor.name}</h3>
                <p className="text-blue-200">{mockConsultation.doctor.specialty}</p>
                {!isVideoOn && (
                  <Badge className="mt-2 bg-gray-600">
                    <VideoOff className="h-3 w-3 mr-1" />
                    วิดีโอปิด
                  </Badge>
                )}
              </div>
            </div>

            {/* Patient Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white">
                    <AvatarImage src={mockConsultation.patient.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {mockConsultation.patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-white">คุณ</p>
                  {!isVideoOn && <VideoOff className="h-4 w-4 mx-auto mt-1 text-gray-400" />}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
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

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowChat(!showChat)}
                  className="rounded-full w-12 h-12 bg-white/80"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="rounded-full w-12 h-12 bg-white/80"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>

                <Button size="sm" variant="outline" className="rounded-full w-12 h-12 bg-white/80">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h3 className="font-semibold flex items-center text-gray-800">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                แชทระหว่างปรึกษา
              </h3>
              <p className="text-xs text-gray-500 mt-1">สื่อสารกับแพทย์ได้ตลอดเวลา</p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                        message.sender === "patient" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 border"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.sender === "patient" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="พิมพ์ข้อความ..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[100px] resize-none border-gray-300 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-gray-300 bg-transparent">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage} className="w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Info Panel (Hidden by default, can be toggled) */}
      <div className="hidden">
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <User className="h-4 w-4 mr-2" />
              ข้อมูลแพทย์
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <div className="space-y-2">
              <p>
                <strong>ชื่อ:</strong> {mockConsultation.doctor.name}
              </p>
              <p>
                <strong>ความเชี่ยวชาญ:</strong> {mockConsultation.doctor.specialty}
              </p>
              <p>
                <strong>ประสบการณ์:</strong> {mockConsultation.doctor.experience}
              </p>
              <p>
                <strong>คะแนน:</strong> {mockConsultation.doctor.rating}/5.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
