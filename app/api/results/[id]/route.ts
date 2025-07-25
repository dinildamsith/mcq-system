import { type NextRequest, NextResponse } from "next/server"

// Mock storage for results - In a real app, this would be in a database
const results: any[] = []

// Mock results data
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resultId = params.id

    const result = results.find((r) => r.resultId === resultId)

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
