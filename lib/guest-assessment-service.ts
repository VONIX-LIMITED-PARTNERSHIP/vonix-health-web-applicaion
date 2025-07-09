import type { AssessmentAnswer, AssessmentResult, AssessmentCategory } from "@/types/assessment"
import { getAssessmentQuestions } from "@/data/assessment-questions"
import { getRiskLevelTranslation } from "@/utils/risk-level"

interface GuestUser {
  id: string
  createdAt: string
}

interface GuestAssessmentData {
  [userId: string]: {
    [category: string]: AssessmentResult
  }
}

// This is a mock in-memory storage for guest assessment data.
// In a real application, this would be a database or a more persistent storage.
const guestAssessmentData: GuestAssessmentData = {}

export const GuestAssessmentService = {
  /**
   * Simulates submitting a guest assessment.
   * Stores the assessment result in memory.
   * @param userId The ID of the guest user.
   * @param category The category of the assessment.
   * @param answers The answers provided by the guest user.
   * @returns The generated AssessmentResult.
   */
  submitGuestAssessment: (
    userId: string,
    category: AssessmentCategory,
    answers: AssessmentAnswer[],
  ): AssessmentResult => {
    // Simulate AI analysis and score calculation
    const score = Math.floor(Math.random() * 100) // Random score for demonstration
    const riskLevels: Array<AssessmentResult["riskLevel"]> = ["low", "medium", "high", "very-high"]
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]

    const aiAnalysis = GuestAssessmentService.generateMockAiAnalysis(category, answers, riskLevel)

    const result: AssessmentResult = {
      id: `guest-assessment-${userId}-${category}-${Date.now()}`,
      userId: userId,
      category: category,
      completedAt: new Date().toISOString(),
      answers: answers,
      score: score,
      riskLevel: riskLevel,
      aiAnalysis: aiAnalysis,
    }

    if (!guestAssessmentData[userId]) {
      guestAssessmentData[userId] = {}
    }
    guestAssessmentData[userId][category] = result
    return result
  },

  /**
   * Retrieves a specific guest assessment by user ID and category.
   * @param userId The ID of the guest user.
   * @param category The category of the assessment.
   * @returns The AssessmentResult if found, otherwise undefined.
   */
  getAssessmentByCategory: (category: AssessmentCategory): AssessmentResult | undefined => {
    // For guest mode, we assume there's only one "guest user" session
    // and we retrieve the latest assessment for the given category.
    // In a real app, you'd pass the guestUser.id from the client.
    // For simplicity, we'll just return the last submitted assessment for that category.
    const guestUserId = "mock-guest-user-id" // This should ideally come from a guest session
    return guestAssessmentData[guestUserId]?.[category]
  },

  /**
   * Retrieves the latest assessment results for a given guest user across all categories.
   * @param userId The ID of the guest user.
   * @returns An array of the latest AssessmentResult for each category.
   */
  getLatestAssessments: (userId: string): AssessmentResult[] => {
    const userAssessments = guestAssessmentData[userId]
    if (!userAssessments) {
      return []
    }
    return Object.values(userAssessments)
  },

  /**
   * Generates mock AI analysis based on the assessment category and risk level.
   * @param category The assessment category.
   * @param answers The answers provided.
   * @param riskLevel The calculated risk level.
   * @returns Mock AI analysis summary and recommendations.
   */
  generateMockAiAnalysis: (
    category: AssessmentCategory,
    answers: AssessmentAnswer[],
    riskLevel: AssessmentResult["riskLevel"],
  ) => {
    const questions = getAssessmentQuestions("en")[category] // Use English for mock generation
    const answeredQuestions = answers.map((answer) => {
      const question = questions.find((q) => q.answers.some((a) => a.id === answer.id))
      return {
        questionText: question ? question.question.en : "Unknown question",
        answerText:
          answer.type === "other"
            ? answer.value
            : questions.find((q) => q.answers.some((a) => a.id === answer.id))?.answers.find((a) => a.id === answer.id)
                ?.text.en || "No answer",
      }
    })

    let summary = `Based on your ${category} assessment, your overall health risk is ${getRiskLevelTranslation(riskLevel, "en").toLowerCase()}.`
    const recommendations: string[] = []

    if (riskLevel === "low") {
      summary += " Your responses indicate good health habits in this area."
      recommendations.push("Continue maintaining your excellent health habits.")
    } else if (riskLevel === "medium") {
      summary += " There are some areas that could be improved."
      recommendations.push("Consider improving your lifestyle and health behaviors.")
    } else if (riskLevel === "high" || riskLevel === "very-high") {
      summary += " This indicates a significant risk that requires attention."
      recommendations.push("Consult a doctor for further examination.")
      recommendations.push("Make serious lifestyle changes as advised by a medical professional.")
    }

    if (answeredQuestions.length > 0) {
      summary += ` You answered ${answeredQuestions.length} questions.`
    }

    return {
      summary: summary,
      recommendations: recommendations,
    }
  },
}
