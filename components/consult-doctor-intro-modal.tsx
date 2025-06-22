"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Stethoscope, Info, CheckCircle, MessageSquare, Clock } from "lucide-react"

interface ConsultDoctorIntroModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ConsultDoctorIntroModal({ isOpen, onOpenChange }: ConsultDoctorIntroModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-2xl p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">ปรึกษาแพทย์ออนไลน์</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">ขั้นตอนง่ายๆ ในการส่งเคสของคุณให้แพทย์พิจารณา</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">1. เตรียมข้อมูล</h4>
              <p className="text-sm text-gray-600">ระบบจะรวบรวมผลการประเมินสุขภาพล่าสุดของคุณโดยอัตโนมัติ</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">2. เพิ่มรายละเอียด (ถ้ามี)</h4>
              <p className="text-sm text-gray-600">คุณสามารถเพิ่มข้อสงสัยหรืออาการเพิ่มเติมที่ต้องการปรึกษาแพทย์ได้</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">3. รอการติดต่อกลับ</h4>
              <p className="text-sm text-gray-600">แพทย์จะพิจารณาเคสของคุณและติดต่อกลับภายใน 24-48 ชั่วโมง</p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-center pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            เข้าใจแล้ว
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
