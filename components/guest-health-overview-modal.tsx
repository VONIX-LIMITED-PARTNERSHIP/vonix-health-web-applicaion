"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRiskLevelTranslation, getRiskLevelBadgeClass, type RiskLevel } from "@/utils/risk-level"

interface GuestHealthOverviewModalProps {
  /** Overall risk level for the latest guest assessment. */
  overallRisk?: RiskLevel | null
}

export function GuestHealthOverviewModal({ overallRisk = "unknown" }: GuestHealthOverviewModalProps) {
  const { getRiskLevelLabel, getRiskLevelDescription } = useRiskLevelTranslation()

  const badgeClass = getRiskLevelBadgeClass(overallRisk)
  const label = getRiskLevelLabel(overallRisk)
  const desc = getRiskLevelDescription(overallRisk)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Badge className={badgeClass}>{label}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* default export for `import GuestHealthOverviewModal from ...` */
export default GuestHealthOverviewModal
