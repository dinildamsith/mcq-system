"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, CheckCircle, XCircle, ArrowLeft, RotateCcw } from "lucide-react"

interface QuestionResult {
  questionText: string
  options: string[]
  selectedOption: number
  correctOption: number
  isCorrect: boolean
}

interface ExamResult {
  resultId: string
  examTitle: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpent: number
  submittedAt: string
  questions: QuestionResult[]
}


export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const resultId = params.id as string

  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)

    // Check if user is logged in and fetch result on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    fetchResult()
  }, [resultId, router])

    // Fetch result data from localStorage or API
  const fetchResult = async () => {
    try {
      // First try to get from localStorage (for just submitted results)
      const lastResult = localStorage.getItem("lastResult")
      if (lastResult) {
        const parsedResult = JSON.parse(lastResult)
        if (parsedResult.resultId === resultId) {
          setResult(parsedResult)
          setLoading(false)
          return
        }
      }

      // Otherwise fetch from API
      const response = await fetch(`/api/results/${resultId}`)
      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Failed to fetch result:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

    // Helper functions for formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

    // Helper functions for score display
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

    // Helper function to determine score badge
  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { variant: "default" as const, text: "Excellent" }
    if (percentage >= 60) return { variant: "secondary" as const, text: "Good" }
    return { variant: "destructive" as const, text: "Needs Improvement" }
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

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Result not found</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const scoreBadge = getScoreBadge(result.percentage)

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
              <h1 className="text-xl font-bold text-gray-900">Exam Results</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className={`h-16 w-16 ${result.percentage >= 60 ? "text-yellow-500" : "text-gray-400"}`} />
            </div>
            <CardTitle className="text-2xl">{result.examTitle}</CardTitle>
            <CardDescription>Completed on {new Date(result.submittedAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}>
                  {result.score}/{result.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}>{result.percentage}%</div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-700">{formatTime(result.timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div>
                <Badge variant={scoreBadge.variant} className="text-sm px-3 py-1">
                  {scoreBadge.text}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                <span className="text-sm text-gray-500">{result.percentage}%</span>
              </div>
              <Progress value={result.percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Question-wise Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Question-wise Analysis</h2>

          {result.questions.map((question, index) => (
            <Card
              key={index}
              className={`border-l-4 ${question.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium">Question {index + 1}</CardTitle>
                  {question.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
                <CardDescription className="text-gray-700">{question.questionText}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = optionIndex === question.selectedOption
                    const isCorrect = optionIndex === question.correctOption

                    let className = "p-3 rounded-lg border "
                    if (isCorrect) {
                      className += "bg-green-50 border-green-200 text-green-800"
                    } else if (isSelected && !isCorrect) {
                      className += "bg-red-50 border-red-200 text-red-800"
                    } else {
                      className += "bg-gray-50 border-gray-200 text-gray-700"
                    }

                    return (
                      <div key={optionIndex} className={className}>
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          <div className="flex items-center space-x-2">
                            {isSelected && (
                              <Badge variant="outline" className="text-xs">
                                Your Answer
                              </Badge>
                            )}
                            {isCorrect && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Correct
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => router.push("/results")}>
            View All Results
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Another Exam
          </Button>
        </div>
      </main>
    </div>
  )
}
