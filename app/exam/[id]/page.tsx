"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, ArrowLeft, ArrowRight, Send } from "lucide-react"

interface Question {
  id: string
  questionText: string
  options: string[]
  correctOption: number
}

interface Exam {
  id: string
  title: string
  description: string
  duration: number
  questions: Question[]
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<Exam | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

    // Fetch exam data and user authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    fetchExam()
  }, [examId, router])

    // Handle countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && exam) {
      handleSubmit()
    }
  }, [timeLeft, exam])

    // Fetch exam data from the API
  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`)
      const data = await response.json()
      setExam(data.exam)
      setTimeLeft(data.exam.duration * 60) // Convert minutes to seconds
    } catch (error) {
      console.error("Failed to fetch exam:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

    // Handle answer selection
  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

    // Handle exam submission
  const handleSubmit = async () => {
    if (submitting) return

    setSubmitting(true)

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          userId: userData.id,
          answers,
          timeSpent: exam!.duration * 60 - timeLeft,
        }),
      })

      const result = await response.json()

      // Store result for results page
      localStorage.setItem("lastResult", JSON.stringify(result))
      router.push(`/results/${result.resultId}`)
    } catch (error) {
      console.error("Failed to submit exam:", error)
      alert("Failed to submit exam. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

    // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = exam ? ((currentQuestion + 1) / exam.questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Exam not found</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentQ = exam.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-red-600 font-mono text-lg">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {exam.questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base text-gray-700">{currentQ.questionText}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, Number.parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {exam.questions.length}
          </div>

          {currentQuestion === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Exam"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Warning for unanswered questions */}
        {Object.keys(answers).length < exam.questions.length && (
          <Alert className="mt-6">
            <AlertDescription>
              You have {exam.questions.length - Object.keys(answers).length} unanswered questions. Make sure to answer
              all questions before submitting.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
