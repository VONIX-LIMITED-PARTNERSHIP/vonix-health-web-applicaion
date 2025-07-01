import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 API: Starting assessment analysis...")

    const body = await request.json()
    const { answers, categoryId, language = "th" } = body

    console.log("🔍 API: Received request with language:", language)
    console.log("🔍 API: Category ID:", categoryId)
    console.log("🔍 API: Number of answers:", answers?.length || 0)

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.error("❌ API: No answers provided")
      return NextResponse.json({ error: "No answers provided" }, { status: 400 })
    }

    if (!categoryId) {
      console.error("❌ API: No category ID provided")
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    // Create system prompts for different languages and categories
    const getSystemPrompt = (categoryId: string, language: string) => {
      const isEnglish = language === "en"

      console.log("🤖 API: Using system prompt for language:", language)

      if (categoryId === "heart") {
        if (isEnglish) {
          return `You are a cardiologist with 20 years of experience. You will analyze cardiovascular health data of patients.

Your responsibilities:
- Assess cardiovascular disease risk
- Identify important risk factors
- Provide specific medical recommendations
- Calculate risk levels based on clinical guidelines

You must respond ONLY in English.

Response format (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["factor1", "factor2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "summary": "detailed analysis summary"
}`
        } else {
          return `คุณเป็นแพทย์หัวใจที่มีประสบการณ์ 20 ปี คุณจะวิเคราะห์ข้อมูลสุขภาพหัวใจและหลอดเลือดของผู้ป่วย

หน้าที่ของคุณ:
- ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด
- ระบุปัจจัยเสี่ยงที่สำคัญ
- ให้คำแนะนำทางการแพทย์เฉพาะเจาะจง
- คำนวณระดับความเสี่ยงตามแนวทางคลินิก

คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น

รูปแบบการตอบ (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["ปัจจัยเสี่ยง1", "ปัจจัยเสี่ยง2", ...],
  "recommendations": ["คำแนะนำ1", "คำแนะนำ2", ...],
  "summary": "สรุปการวิเคราะห์โดยละเอียด"
}`
        }
      } else if (categoryId === "mental") {
        if (isEnglish) {
          return `You are a psychiatrist with 15 years of experience. You will analyze mental health assessment data.

Your responsibilities:
- Assess mental health status and psychological well-being
- Identify stress factors and emotional concerns
- Provide mental health recommendations
- Evaluate risk levels for mental health conditions

You must respond ONLY in English.

Response format (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["factor1", "factor2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "summary": "detailed mental health analysis"
}`
        } else {
          return `คุณเป็นจิตแพทย์ที่มีประสบการณ์ 15 ปี คุณจะวิเคราะห์ข้อมูลการประเมินสุขภาพจิต

หน้าที่ของคุณ:
- ประเมินสถานะสุขภาพจิตและความเป็นอยู่ทางจิตใจ
- ระบุปัจจัยความเครียดและความกังวลทางอารมณ์
- ให้คำแนะนำด้านสุขภาพจิต
- ประเมินระดับความเสี่ยงของภาวะสุขภาพจิต

คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น

รูปแบบการตอบ (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["ปัจจัยเสี่ยง1", "ปัจจัยเสี่ยง2", ...],
  "recommendations": ["คำแนะนำ1", "คำแนะนำ2", ...],
  "summary": "สรุปการวิเคราะห์สุขภาพจิตโดยละเอียด"
}`
        }
      } else if (categoryId === "nutrition") {
        if (isEnglish) {
          return `You are a nutritionist and lifestyle medicine specialist with 12 years of experience. You will analyze nutrition and lifestyle assessment data.

Your responsibilities:
- Assess nutritional status and dietary habits
- Evaluate lifestyle factors affecting health
- Provide nutrition and lifestyle recommendations
- Calculate health risk levels based on lifestyle factors

You must respond ONLY in English.

Response format (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["factor1", "factor2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "summary": "detailed nutrition and lifestyle analysis"
}`
        } else {
          return `คุณเป็นนักโภชนาการและผู้เชี่ยวชาญด้านการแพทย์วิถีชีวิตที่มีประสบการณ์ 12 ปี คุณจะวิเคราะห์ข้อมูลการประเมินโภชนาการและวิถีชีวิต

หน้าที่ของคุณ:
- ประเมินสถานะโภชนาการและพฤติกรรมการกิน
- ประเมินปัจจัยวิถีชีวิตที่ส่งผลต่อสุขภาพ
- ให้คำแนะนำด้านโภชนาการและวิถีชีวิต
- คำนวณระดับความเสี่ยงต่อสุขภาพจากปัจจัยวิถีชีวิต

คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น

รูปแบบการตอบ (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["ปัจจัยเสี่ยง1", "ปัจจัยเสี่ยง2", ...],
  "recommendations": ["คำแนะนำ1", "คำแนะนำ2", ...],
  "summary": "สรุปการวิเคราะห์โภชนาการและวิถีชีวิตโดยละเอียด"
}`
        }
      } else {
        // Default for other categories
        if (isEnglish) {
          return `You are a healthcare professional with extensive experience. You will analyze health assessment data.

Your responsibilities:
- Assess overall health status
- Identify important health risk factors
- Provide appropriate health recommendations
- Calculate risk levels based on assessment data

You must respond ONLY in English.

Response format (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["factor1", "factor2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "summary": "detailed health analysis"
}`
        } else {
          return `คุณเป็นผู้เชี่ยวชาญด้านสุขภาพที่มีประสบการณ์มากมาย คุณจะวิเคราะห์ข้อมูลการประเมินสุขภาพ

หน้าที่ของคุณ:
- ประเมินสถานะสุขภาพโดยรวม
- ระบุปัจจัยเสี่ยงด้านสุขภาพที่สำคัญ
- ให้คำแนะนำด้านสุขภาพที่เหมาะสม
- คำนวณระดับความเสี่ยงจากข้อมูลการประเมิน

คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น

รูปแบบการตอบ (JSON):
{
  "riskLevel": "low|medium|high|very-high",
  "riskFactors": ["ปัจจัยเสี่ยง1", "ปัจจัยเสี่ยง2", ...],
  "recommendations": ["คำแนะนำ1", "คำแนะนำ2", ...],
  "summary": "สรุปการวิเคราะห์สุขภาพโดยละเอียด"
}`
        }
      }
    }

    const systemPrompt = getSystemPrompt(categoryId, language)
    console.log("🤖 API: System prompt:", systemPrompt.substring(0, 200) + "...")

    // Create user prompt with answers
    const answersText = answers
      .map((answer, index) => {
        const value = Array.isArray(answer.value) ? answer.value.join(", ") : answer.value
        return `${index + 1}. Question: ${answer.questionId}\n   Answer: ${value}`
      })
      .join("\n\n")

    const userPrompt =
      language === "en"
        ? `Please analyze the following health assessment answers and provide a comprehensive analysis:

${answersText}

IMPORTANT: All responses must be in English only.

Please provide your analysis in the exact JSON format specified in the system prompt.`
        : `กรุณาวิเคราะห์คำตอบการประเมินสุขภาพต่อไปนี้และให้การวิเคราะห์ที่ครอบคลุม:

${answersText}

สำคัญ: คำตอบทั้งหมดต้องเป็นภาษาไทยเท่านั้น

กรุณาให้การวิเคราะห์ในรูปแบบ JSON ตามที่ระบุในระบบพรอมต์`

    console.log("🤖 API: Generating AI analysis...")
    console.log("🤖 API: User prompt length:", userPrompt.length)

    // Generate AI analysis
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3,
      maxTokens: 2000,
    })

    console.log("✅ API: Analysis completed successfully")
    console.log("🔍 API: Raw AI response length:", text.length)

    // Parse the JSON response
    let analysisResult
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("❌ API: Failed to parse AI response as JSON:", parseError)
      console.log("🔍 API: Raw response:", text)

      // Fallback response
      analysisResult = {
        riskLevel: "medium",
        riskFactors: language === "en" ? ["Unable to parse detailed analysis"] : ["ไม่สามารถวิเคราะห์รายละเอียดได้"],
        recommendations:
          language === "en"
            ? ["Please consult with a healthcare professional for proper assessment"]
            : ["กรุณาปรึกษาผู้เชี่ยวชาญด้านสุขภาพเพื่อการประเมินที่เหมาะสม"],
        summary:
          language === "en"
            ? "Analysis could not be completed due to technical issues. Please try again or consult a healthcare professional."
            : "ไม่สามารถทำการวิเคราะห์ได้เนื่องจากปัญหาทางเทคนิค กรุณาลองใหม่อีกครั้งหรือปรึกษาผู้เชี่ยวชาญด้านสุขภาพ",
      }
    }

    // Log sample of the analysis result
    console.log("🔍 API: Sample analysis result:", {
      riskLevel: analysisResult.riskLevel,
      riskFactorsCount: analysisResult.riskFactors?.length || 0,
      recommendationsCount: analysisResult.recommendations?.length || 0,
      summaryLength: analysisResult.summary?.length || 0,
    })

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })
  } catch (error) {
    console.error("❌ API: Assessment analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
