"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ArrowLeft, Clock, Plus, Settings, Save, Users, CheckCircle, X } from "lucide-react"

// Mock data
const mockSchedule = {
  monday: {
    available: true,
    slots: [
      { time: "09:00", duration: 30, booked: true, patient: "คุณสมศรี ใจดี" },
      { time: "09:30", duration: 30, booked: false, patient: null },
      { time: "10:00", duration: 30, booked: true, patient: "คุณวิชัย สุขภาพ" },
      { time: "10:30", duration: 30, booked: false, patient: null },
      { time: "14:00", duration: 45, booked: false, patient: null },
      { time: "14:45", duration: 30, booked: false, patient: null },
      { time: "15:15", duration: 30, booked: false, patient: null },
    ],
  },
  tuesday: {
    available: true,
    slots: [
      { time: "09:00", duration: 30, booked: false, patient: null },
      { time: "09:30", duration: 30, booked: false, patient: null },
      { time: "10:00", duration: 30, booked: false, patient: null },
      { time: "14:00", duration: 30, booked: false, patient: null },
      { time: "14:30", duration: 30, booked: false, patient: null },
    ],
  },
  wednesday: {
    available: true,
    slots: [
      { time: "09:00", duration: 30, booked: true, patient: "คุณมาลี ดีใจ" },
      { time: "09:30", duration: 30, booked: false, patient: null },
      { time: "10:00", duration: 30, booked: false, patient: null },
      { time: "14:00", duration: 30, booked: false, patient: null },
    ],
  },
  thursday: {
    available: true,
    slots: [
      { time: "09:00", duration: 30, booked: false, patient: null },
      { time: "09:30", duration: 30, booked: false, patient: null },
      { time: "14:00", duration: 30, booked: false, patient: null },
      { time: "14:30", duration: 30, booked: false, patient: null },
    ],
  },
  friday: {
    available: true,
    slots: [
      { time: "09:00", duration: 30, booked: false, patient: null },
      { time: "09:30", duration: 30, booked: false, patient: null },
      { time: "10:00", duration: 30, booked: false, patient: null },
    ],
  },
  saturday: {
    available: false,
    slots: [],
  },
  sunday: {
    available: false,
    slots: [],
  },
}

const dayNames = {
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
  sunday: "อาทิตย์",
}

export default function DoctorSchedulePage() {
  const [mounted, setMounted] = useState(false)
  const [schedule, setSchedule] = useState(mockSchedule)
  const [selectedDay, setSelectedDay] = useState("monday")

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDayAvailability = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
      },
    }))
  }

  const addTimeSlot = (day: string) => {
    const newSlot = { time: "09:00", duration: 30, booked: false, patient: null }
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, newSlot],
      },
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTimeSlot = (day: string, index: number, field: string, value: any) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const getTotalSlots = () => {
    return Object.values(schedule).reduce((total, day) => total + day.slots.length, 0)
  }

  const getBookedSlots = () => {
    return Object.values(schedule).reduce((total, day) => total + day.slots.filter((slot) => slot.booked).length, 0)
  }

  const getAvailableSlots = () => {
    return getTotalSlots() - getBookedSlots()
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
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">จัดการตารางเวลา</h1>
                <p className="text-gray-600 dark:text-gray-300">กำหนดเวลาว่างสำหรับการปรึกษาออนไลน์</p>
              </div>
            </div>

            <Button className="bg-green-500 hover:bg-green-600">
              <Save className="h-4 w-4 mr-2" />
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{getTotalSlots()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ช่วงเวลาทั้งหมด</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{getAvailableSlots()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">ช่วงเวลาว่าง</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{getBookedSlots()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">มีการจองแล้ว</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Object.values(schedule).filter((day) => day.available).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">วันที่เปิดให้บริการ</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Day Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">เลือกวัน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(dayNames).map(([day, name]) => (
                    <div
                      key={day}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDay === day
                          ? "bg-blue-100 border-blue-300 border-2"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{name}</span>
                        <div className="flex items-center space-x-2">
                          {schedule[day].available ? (
                            <Badge className="bg-green-500 text-xs">เปิด</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              ปิด
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{schedule[day].slots.length} ช่วง</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Schedule Management */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      ตารางเวลาวัน{dayNames[selectedDay]}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={schedule[selectedDay].available}
                          onCheckedChange={() => toggleDayAvailability(selectedDay)}
                        />
                        <Label className="text-sm">เปิดให้บริการ</Label>
                      </div>
                      {schedule[selectedDay].available && (
                        <Button size="sm" onClick={() => addTimeSlot(selectedDay)}>
                          <Plus className="h-3 w-3 mr-1" />
                          เพิ่มช่วงเวลา
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {schedule[selectedDay].available ? (
                    <div className="space-y-4">
                      {schedule[selectedDay].slots.length > 0 ? (
                        schedule[selectedDay].slots.map((slot, index) => (
                          <Card
                            key={index}
                            className={`${slot.booked ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <Select
                                      value={slot.time}
                                      onValueChange={(value) => updateTimeSlot(selectedDay, index, "time", value)}
                                      disabled={slot.booked}
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 20 }, (_, i) => {
                                          const hour = Math.floor(i / 2) + 8
                                          const minute = (i % 2) * 30
                                          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                                          return (
                                            <SelectItem key={time} value={time}>
                                              {time}
                                            </SelectItem>
                                          )
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">ระยะเวลา:</span>
                                    <Select
                                      value={slot.duration.toString()}
                                      onValueChange={(value) =>
                                        updateTimeSlot(selectedDay, index, "duration", Number.parseInt(value))
                                      }
                                      disabled={slot.booked}
                                    >
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="15">15 นาที</SelectItem>
                                        <SelectItem value="30">30 นาที</SelectItem>
                                        <SelectItem value="45">45 นาที</SelectItem>
                                        <SelectItem value="60">60 นาที</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {slot.booked ? (
                                    <div className="flex items-center space-x-2">
                                      <Badge className="bg-orange-500">
                                        <Users className="h-3 w-3 mr-1" />
                                        จองแล้ว
                                      </Badge>
                                      <span className="text-sm font-medium">{slot.patient}</span>
                                    </div>
                                  ) : (
                                    <Badge className="bg-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      ว่าง
                                    </Badge>
                                  )}
                                </div>

                                {!slot.booked && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeTimeSlot(selectedDay, index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 mb-4">ยังไม่มีช่วงเวลาสำหรับวันนี้</p>
                          <Button onClick={() => addTimeSlot(selectedDay)}>
                            <Plus className="h-4 w-4 mr-2" />
                            เพิ่มช่วงเวลาแรก
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">วันนี้ปิดให้บริการ</p>
                      <p className="text-sm text-gray-400">เปิดสวิตช์ด้านบนเพื่อเริ่มกำหนดตารางเวลา</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>การดำเนินการด่วน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-12 bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  คัดลอกตารางจากสัปดาห์ที่แล้ว
                </Button>

                <Button variant="outline" className="h-12 bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  ตั้งค่าเวลาเริ่มต้น
                </Button>

                <Button variant="outline" className="h-12 bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  ดูการจองทั้งหมด
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
