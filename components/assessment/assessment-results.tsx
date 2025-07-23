"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Heart,
  Shield,
  Target,
  Sparkles,
  Award,
  Activity,
} from "lucide-react"
import type { AssessmentAnswer, AssessmentResult } from "@/types/assessment"
import { useRiskLevelTranslation } from "@/utils/risk-level"
import { ScoreInfoPopover } from "./score-info-popover"

interface AssessmentResultsProps {
  categoryId: string
  assessmentResult: AssessmentResult
  answers: AssessmentAnswer[]
  aiAnalysis?: any
}

export function AssessmentResults({ categoryId, assessmentResult, answers, aiAnalysis }: AssessmentResultsProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const { getRiskLevelLabel, getRiskLevelDescription } = useRiskLevelTranslation()

  // Animation effect
  useState(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  })

  const getRiskLevelInfo = (riskLevel: string) => {
    const label = getRiskLevelLabel(riskLevel)
    const description = getRiskLevelDescription(riskLevel)

    switch (riskLevel?.toLowerCase()) {
      case "low":
      case "ต่ำ":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          gradientFrom: "from-emerald-400",
          gradientTo: "to-green-500",
          icon: CheckCircle,
          label,
          description,
          percentage: 85,
        }
      case "medium":
      case "ปานกลาง":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          gradientFrom: "from-amber-400",
          gradientTo: "to-orange-500",
          icon: AlertTriangle,
          label,
          description,
          percentage: 60,
        }
      case "high":
      case "สูง":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          gradientFrom: "from-red-400",
          gradientTo: "to-rose-500",
          icon: XCircle,
          label,
          description,
          percentage: 30,
        }
      case "very-high":
      case "very_high":
      case "สูงมาก":
        return {
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          gradientFrom: "from-red-500",
          gradientTo: "to-red-700",
          icon: XCircle,
          label,
          description,
          percentage: 15,
        }
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          gradientFrom: "from-gray-400",
          gradientTo: "to-gray-500",
          icon: FileText,
          label,
          description,
          percentage: 50,
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

  // Calculate score percentage for animation
  const scorePercentage = Math.min(Math.max(((assessmentResult.score || 0) / 10) * 100, 0), 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Animated Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:bg-white/80 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white/80 transition-all duration-200 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              แชร์ผลลัพธ์
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white/80 transition-all duration-200 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              ดาวน์โหลด PDF
            </Button>
          </div>
        </div>

        {/* Main Results Card with Enhanced Design */}
        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden animate-fade-in-up animation-delay-200">
          {/* Gradient Header */}
          <div
            className={`bg-gradient-to-r ${riskInfo.gradientFrom} ${riskInfo.gradientTo} p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm animate-pulse-slow">
                  <RiskIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">ผลการประเมิน{categoryTitle}</h1>
                <p className="text-white/90 text-lg">{riskInfo.description}</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Heart className="h-6 w-6" />
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {/* Score Visualization */}
            <div className="text-center space-y-6">
              {/* Circular Progress */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (isAnimating ? 0 : riskInfo.percentage / 100))}`}
                      className="transition-all duration-2000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={riskInfo.gradientFrom.replace("from-", "stop-")} />
                        <stop offset="100%" className={riskInfo.gradientTo.replace("to-", "stop-")} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${riskInfo.color} animate-count-up`}>
                        {isAnimating ? 0 : riskInfo.percentage}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 justify-center">
                        คะแนนสุขภาพ
                        <ScoreInfoPopover />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="flex justify-center">
                <Badge
                  className={`${riskInfo.color} ${riskInfo.bgColor} text-xl px-8 py-4 rounded-full font-semibold shadow-lg animate-bounce-subtle`}
                >
                  <Award className="h-5 w-5 mr-2" />
                  {riskInfo.label}
                </Badge>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 text-center">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{answers.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">คำถามทั้งหมด</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{assessmentResult.riskFactors?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ปัจจัยเสี่ยง</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 text-center">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {assessmentResult.recommendations?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">คำแนะนำ</div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Enhanced Risk Factors and Recommendations */}
            {(assessmentResult.riskFactors?.length > 0 || assessmentResult.recommendations?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Risk Factors */}
                {assessmentResult.riskFactors?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      ปัจจัยเสี่ยงที่พบ
                    </h3>
                    <div className="space-y-3">
                      {assessmentResult.riskFactors.map((factor, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl p-4 border-l-4 border-orange-400 animate-slide-in-left"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{factor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {assessmentResult.recommendations?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      คำแนะนำสำหรับคุณ
                    </h3>
                    <div className="space-y-3">
                      {assessmentResult.recommendations.map((recommendation, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border-l-4 border-green-400 animate-slide-in-right"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assessment Info Card */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ข้อมูลการประเมิน
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    วันที่ทำแบบประเมิน
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {new Date().toLocaleDateString("th-TH")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    จำนวนคำถาม
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{answers.length} ข้อ</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => router.push(`/assessment/${categoryId}`)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                ทำแบบประเมินใหม่
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                {showDetails ? "ซ่อนรายละเอียด" : "ดูรายละเอียดคำตอบ"}
              </Button>
            </div>

            {/* Detailed Answers */}
            {showDetails && answers.length > 0 && (
              <div className="mt-8 space-y-4 animate-fade-in">
                <Separator />
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">รายละเอียดคำตอบ</h3>
                <ScrollArea className="h-80">
                  <div className="space-y-4 pr-4">
                    {answers.map((answer, index) => (
                      <div
                        key={answer.questionId}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          คำถามที่ {index + 1}: {answer.questionId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          คำตอบ: {Array.isArray(answer.answer) ? answer.answer.join(", ") : answer.answer}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">คะแนน: {answer.score}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Disclaimer */}
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800 rounded-2xl animate-fade-in-up animation-delay-400">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            <strong className="text-amber-700 dark:text-amber-400">หมายเหตุสำคัญ:</strong>{" "}
            ผลการประเมินนี้เป็นเพียงข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางการแพทย์ได้ หากมีข้อสงสัยหรือมีอาการที่น่ากังวล
            แนะนำให้ปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อการตรวจสอบและรักษาที่เหมาะสม
          </AlertDescription>
        </Alert>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .transition-all {
          transition-property: all;
        }
        
        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </div>
  )
}
