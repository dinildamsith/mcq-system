"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Clock, Eye } from "lucide-react"

interface ResultSummary {
  resultId: string
  examTitle: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpent: number
  submittedAt: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ResultSummary[]>([])
  const [loading, setLoading] = useState(true)

    // Check if user is logged in and fetch results on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    fetchResults()
  }, [router])

    // Fetch results from the API or localStorage
  const fetchResults = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`/api/results?userId=${userData.id}`)
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error("Failed to fetch results:", error)
    } finally {
      setLoading(false)
    }
  }

    // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

    // Get score badge based on percentage
  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { variant: "default" as const, text: "Excellent", color: "text-green-600" }
    if (percentage >= 60) return { variant: "secondary" as const, text: "Good", color: "text-yellow-600" }
    return { variant: "destructive" as const, text: "Needs Improvement", color: "text-red-600" }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900">My Results</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {results.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't taken any exams yet. Start with your first exam to see results here.
              </p>
              <Button onClick={() => router.push("/dashboard")}>Take Your First Exam</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Exam History</h2>
              <p className="text-gray-600">
                {results.length} exam{results.length !== 1 ? "s" : ""} completed
              </p>
            </div>

            <div className="grid gap-6">
              {results.map((result) => {
                const scoreBadge = getScoreBadge(result.percentage)

                return (
                  <Card key={result.resultId} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{result.examTitle}</CardTitle>
                          <CardDescription>
                            Completed on {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                            {new Date(result.submittedAt).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${scoreBadge.color}`}>
                            {result.score}/{result.totalQuestions}
                          </div>
                          <div className="text-sm text-gray-600">Score</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${scoreBadge.color}`}>{result.percentage}%</div>
                          <div className="text-sm text-gray-600">Percentage</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                            <Clock className="h-5 w-5 mr-1" />
                            {formatTime(result.timeSpent)}
                          </div>
                          <div className="text-sm text-gray-600">Time Spent</div>
                        </div>
                        <div className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/results/${result.resultId}`)}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
