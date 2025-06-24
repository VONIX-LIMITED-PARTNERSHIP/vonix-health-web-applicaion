"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Calendar,
  FileText,
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"

interface AssessmentResultsProps {
  categoryId: string
  assessmentResult: AssessmentResult
  answers: AssessmentAnswer[]
  aiAnalysis?: any
}

export function AssessmentResults({ categoryId, assessmentResult, answers, aiAnalysis }: AssessmentResultsProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)

  // กำหนดสีและไอคอนตามระดับความเสี่ยง
  const getRiskLevelInfo = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label: "ความเสี่ยงต่ำ",
          description: "ผลการประเมินของคุณอยู่ในเกณฑ์ดี",
        }
      case "medium":
      case "ปานกลาง":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: AlertTriangle,
          label: "ความเสี่ยงปานกลาง",
          description: "ควรให้ความสำคัญและติดตามอาการ",
        }
      case "high":
      case "สูง":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label: "ความเสี่ยงสูง",
          description: "แนะนำให้ปรึกษาแพทย์เพื่อการตรวจสอบเพิ่มเติม",
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: FileText,
          label: "ไม่ระบุ",
          description: "ผลการประเมิน",
        }
    }
  }

  const riskInfo = getRiskLevelInfo(assessmentResult.riskLevel)
  const RiskIcon = riskInfo.icon

  // แปลงชื่อหมวดหมู่
  const getCategoryTitle = (categoryId: string) => {
    switch (categoryId) {
      case "basic":
        return "ข้อมูลส่วนตัว"
      case "mental":
        return "สุขภาพจิต"
      case "physical":
        return "สุขภาพกาย"
      case "lifestyle":
        return "วิถีชีวิต"
      default:
        return "แบบประเมิน"
    }
  }

  const categoryTitle = getCategoryTitle(categoryId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              แชร์ผลลัพธ์
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              ดาวน์โหลด PDF
            </Button>
          </div>
        </div>

        {/* ผลการประเมินหลัก */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${riskInfo.bgColor} ${riskInfo.borderColor} border-2`}>
                <RiskIcon className={`h-12 w-12 ${riskInfo.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">ผลการประเมิน{categoryTitle}</CardTitle>
            <p className="text-gray-600">{riskInfo.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* คะแนนและระดับความเสี่ยง */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-800">
                  {assessmentResult.percentage}
                  <span className="text-2xl text-gray-500">%</span>
                </div>
                <div className="text-sm text-gray-500">
                  คะแนน {assessmentResult.totalScore} จาก {assessmentResult.maxScore} คะแนน
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <Progress value={assessmentResult.percentage} className="h-3" />
              </div>

              <Badge variant="secondary" className={`${riskInfo.color} ${riskInfo.bgColor} text-lg px-4 py-2`}>
                {riskInfo.label}
              </Badge>
            </div>

            <Separator />

            {/* ปัจจัยเสี่ยงและคำแนะนำ */}
            {(assessmentResult.riskFactors?.length > 0 || assessmentResult.recommendations?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* ปัจจัยเสี่ยง */}
                {assessmentResult.riskFactors?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ปัจจัยเสี่ยงที่พบ
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {assessmentResult.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}

                {/* คำแนะนำ */}
                {assessmentResult.recommendations?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      คำแนะนำ
                    </h3>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {assessmentResult.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {/* ข้อมูลเพิ่มเติม */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  วันที่ทำแบบประเมิน
                </span>
                <span className="font-medium">{new Date().toLocaleDateString("th-TH")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  จำนวนคำถาม
                </span>
                <span className="font-medium">{answers.length} ข้อ</span>
              </div>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => router.push(`/assessment/${categoryId}`)} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                ทำแบบประเมินใหม่
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                {showDetails ? "ซ่อนรายละเอียด" : "ดูรายละเอียดคำตอบ"}
              </Button>
            </div>

            {/* รายละเอียดคำตอบ */}
            {showDetails && answers.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator />
                <h3 className="font-semibold text-gray-800">รายละเอียดคำตอบ</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          คำถามที่ {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600">
                          คำตอบ: {Array.isArray(answer.value) ? answer.value.join(", ") : answer.value}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">คะแนน: {answer.score}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* คำแนะนำเพิ่มเติม */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>หมายเหตุ:</strong> ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้
            หากมีข้อสงสัยหรือมีอาการที่น่ากังวล แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
