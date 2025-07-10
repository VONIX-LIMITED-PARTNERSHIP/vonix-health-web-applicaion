"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getRiskLevelBadgeClass, getRiskLevelLabel, useRiskLevelTranslation } from "@/utils/risk-level"

interface Props {
  overallRisk?: string | null
  lang?: "en" | "th"
}

export function GuestHealthOverviewModal({ overallRisk, lang = "en" }: Props) {
  const [open, setOpen] = useState(false)
  const { getRiskLevelDescription } = useRiskLevelTranslation(lang)

  const badgeClass = getRiskLevelBadgeClass(overallRisk)
  const riskLabel = getRiskLevelLabel(overallRisk, lang)
  const riskDesc = getRiskLevelDescription(overallRisk)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{lang === "th" ? "ดูภาพรวมสุขภาพ" : "View Health Overview"}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{lang === "th" ? "ภาพรวมสุขภาพ" : "Health Overview"}</DialogTitle>
          <DialogDescription>
            {lang === "th" ? "ผลการประเมินสุขภาพสำหรับผู้ใช้งานชั่วคราว" : "Guest user health-assessment summary"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>{riskLabel}</span>
            <span className="text-sm text-muted-foreground">{riskDesc}</span>
          </div>
          {/* Extra stats / recommendations could go here */}
        </div>

        <DialogClose asChild>
          <Button className="mt-6 w-full">{lang === "th" ? "ปิด" : "Close"}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default GuestHealthOverviewModal
