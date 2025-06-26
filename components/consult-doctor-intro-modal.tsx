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
import { useTranslation } from "@/hooks/use-translation"

interface ConsultDoctorIntroModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onProceed: () => void // New prop to trigger the next step
}

export function ConsultDoctorIntroModal({ isOpen, onOpenChange, onProceed }: ConsultDoctorIntroModalProps) {
  const { t } = useTranslation(["common"])

  const handleUnderstood = () => {
    onOpenChange(false) // Close this modal
    onProceed() // Trigger the next step (open summary modal)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-2xl p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">{t("consult_doctor_modal_title")}</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">{t("consult_doctor_modal_description")}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{t("step_1_prepare_data")}</h4>
              <p className="text-sm text-gray-600">{t("step_1_prepare_data_desc")}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{t("step_2_add_details")}</h4>
              <p className="text-sm text-gray-600">{t("step_2_add_details_desc")}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{t("step_3_wait_for_contact")}</h4>
              <p className="text-sm text-gray-600">{t("step_3_wait_for_contact_desc")}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-center pt-4">
          <Button
            onClick={handleUnderstood}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("understood")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
