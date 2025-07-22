import { type NextRequest, NextResponse } from "next/server"

// Mock storage for results - In a real app, this would be in a database
// This should be the same array as in submit/route.ts
const results: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Filter results for the specific user
    const userResults = results
      .filter((result) => result.userId === userId)
      .map((result) => ({
        resultId: result.resultId,
        examTitle: result.examTitle,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        timeSpent: result.timeSpent,
        submittedAt: result.submittedAt,
      }))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ results: userResults })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
