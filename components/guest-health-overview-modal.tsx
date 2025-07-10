"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type RiskLevel, getRiskLevelBadgeClass, getRiskLevelText } from "@/utils/risk-level"

/**
 * Props for <GuestHealthOverviewModal />.
 *
 * If you have more data to surface (e.g. BMI, blood pressure),
 * extend this interface and update the JSX below.
 */
interface GuestHealthOverviewModalProps {
  riskLevel: RiskLevel
}

export function GuestHealthOverviewModal({ riskLevel }: GuestHealthOverviewModalProps) {
  const [open, setOpen] = useState(false)

  const badgeClass = getRiskLevelBadgeClass(riskLevel)
  const riskTextEn = getRiskLevelText(riskLevel, "en")
  const riskTextTh = getRiskLevelText(riskLevel, "th")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90">
          View Health Overview
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{"Health Overview"}</DialogTitle>
          <DialogDescription>{"Summary of your latest guest assessment"}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{"Risk Level:"}</span>
            <Badge className={badgeClass}>{riskTextEn}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">{`(TH) ${riskTextTh}`}</p>

          {/* Extra content could be shown here such as charts or metrics */}
        </div>

        <DialogClose asChild>
          <button type="button" className="mt-6 w-full rounded-md border border-input px-4 py-2 text-sm">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
