"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Info, FlaskConical } from "lucide-react"
import { AssessmentForm } from "@/components/assessment/assessment-form"
import { guestAssessmentCategory } from "@/data/assessment-questions"
import { useTranslation } from "@/hooks/use-translation" // Import useTranslation

export default function GuestAssessmentPage() {
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { t } = useTranslation() // Use translation hook

  const handleStartAssessment = () => {
    if (agreedToDisclaimer) {
      setShowForm(true)
    }
  }

  if (showForm) {
    return <AssessmentForm categoryId={guestAssessmentCategory.id} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader className="pb-4">
          <Button variant="ghost" asChild className="mb-4 self-start hover:bg-white/80 dark:hover:bg-gray-700/80">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("home")}
            </Link>
          </Button>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <FlaskConical className="h-8 w-8 text-purple-600" />
            {t("guest_assessment_title")}
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">{t("guest_assessment_description")}</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-4 rounded-lg flex items-start gap-3 mb-6">
            <Info className="h-5 w-5 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-lg mb-1">{t("guest_assessment_disclaimer_title")}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{t("guest_assessment_disclaimer_1")}</li>
                <li>{t("guest_assessment_disclaimer_2")}</li>
                <li>{t("guest_assessment_disclaimer_3")}</li>
                <li>{t("guest_assessment_disclaimer_4")}</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-8">
            <Checkbox
              id="disclaimer-agree"
              checked={agreedToDisclaimer}
              onCheckedChange={(checked) => setAgreedToDisclaimer(!!checked)}
              className="data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
            />
            <Label htmlFor="disclaimer-agree" className="text-base text-gray-700 dark:text-gray-300 cursor-pointer">
              {t("i_understand_disclaimer")}
            </Label>
          </div>

          <Button
            onClick={handleStartAssessment}
            disabled={!agreedToDisclaimer}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-lg"
          >
            {t("start_guest_assessment")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
