"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, TrendingUp, ArrowLeft, Globe } from "lucide-react"
import { AssessmentService } from "@/lib/assessment-service"
import { createClientComponentClient } from "@/lib/supabase"
import { useTranslation } from "@/hooks/use-translation"
import type { Database } from "@/types/database"

type AssessmentRow = Database["public"]["Tables"]["assessments"]["Row"]

interface LocalizedAssessmentData {
  riskLevel: string
  riskFactors: string[]
  recommendations: string[]
  summary: string | null
}

export function AssessmentResults() {
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get("id")
  const { t, language } = useTranslation()

  const [assessment, setAssessment] = useState<AssessmentRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!assessmentId) {
      setError("ไม่พบรหัสการประเมิน")
      setLoading(false)
      return
    }

    loadAssessment()
  }, [assessmentId])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      const supabase = createClientComponentClient()

      const { data, error: fetchError } = await AssessmentService.getAssessment(supabase, assessmentId!)

      if (fetchError) {
        throw new Error(fetchError)
      }

      if (!data) {
        throw new Error("ไม่พบข้อมูลการประเมิน")
      }

      setAssessment(data)
    } catch (err) {
      console.error("❌ Failed to load assessment:", err)
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  const getLocalizedData = (assessment: AssessmentRow): LocalizedAssessmentData => {
    if (language === "en") {
      return {
        riskLevel: assessment.risk_level,
        riskFactors: assessment.risk_factors_en || assessment.risk_factors,
        recommendations: assessment.recommendations_en || assessment.recommendations,
        summary: assessment.summary_en || assessment.summary,
      }
    } else {
      return {
        riskLevel: assessment.risk_level,
        riskFactors: assessment.risk_factors,
        recommendations: assessment.recommendations,
        summary: assessment.summary,
      }
    }
  }

  const getRiskLevelConfig = (riskLevel: string) => {
    const configs = {
      low: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: language === "en" ? "Low Risk" : "ความเสี่ยงต่ำ",
        description:
          language === "en" ? "Your health indicators are within normal ranges" : "ตัวชี้วัดสุขภาพของคุณอยู่ในเกณฑ์ปกติ",
      },
      moderate: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Info,
        label: language === "en" ? "Moderate Risk" : "ความเสี่ยงปานกลาง",
        description: language === "en" ? "Some areas need attention and monitoring" : "มีบางด้านที่ต้องให้ความสนใจและติดตาม",
      },
      high: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: TrendingUp,
        label: language === "en" ? "High Risk" : "ความเสี่ยงสูง",
        description:
          language === "en"
            ? "Several health concerns require immediate attention"
            : "มีปัญหาสุขภาพหลายด้านที่ต้องได้รับการดูแลทันที",
      },
      critical: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertTriangle,
        label: language === "en" ? "Critical Risk" : "ความเสี่ยงวิกฤต",
        description:
          language === "en" ? "Urgent medical consultation is strongly recommended" : "แนะนำให้ปรึกษาแพทย์อย่างเร่งด่วน",
      },
    }
    return configs[riskLevel as keyof typeof configs] || configs.low
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{language === "en" ? "Loading results..." : "กำลังโหลดผลลัพธ์..."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">{language === "en" ? "Error" : "เกิดข้อผิดพลาด"}</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "en" ? "Go Back" : "กลับ"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const localizedData = getLocalizedData(assessment)
  const riskConfig = getRiskLevelConfig(localizedData.riskLevel)
  const RiskIcon = riskConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4 hover:bg-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back" : "กลับ"}
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "en" ? "Assessment Results" : "ผลการประเมิน"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {assessment.category_title} •{" "}
                {new Date(assessment.created_at).toLocaleDateString(language === "en" ? "en-US" : "th-TH")}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              {language === "en" ? "English" : "ไทย"}
            </Badge>
          </div>
        </div>

        {/* Risk Level Card */}
        <Card className={`mb-8 border-2 ${riskConfig.color} bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl`}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${riskConfig.color}`}>
                <RiskIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">{riskConfig.label}</CardTitle>
                <p className="text-sm opacity-80">{riskConfig.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Summary */}
          {localizedData.summary && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>{language === "en" ? "Summary" : "สรุปผลการประเมิน"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{localizedData.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>{language === "en" ? "Risk Factors" : "ปัจจัยเสี่ยง"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {localizedData.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 dark:text-gray-300">{factor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>{language === "en" ? "Recommendations" : "คำแนะนำ"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {localizedData.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.print()} variant="outline" className="bg-transparent">
                {language === "en" ? "Print Results" : "พิมพ์ผลลัพธ์"}
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {language === "en" ? "Back to Home" : "กลับหน้าหลัก"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
