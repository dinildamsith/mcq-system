"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, LogOut, Trophy, Play } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

interface Exam {
  id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  difficulty: string
  subject: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in and fetch exams on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    fetchExams()
  }, [router])

  // Fetch available exams from the API
  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams")
      const data = await response.json()
      setExams(data.exams)
    } catch (error) {
      console.error("Failed to fetch exams:", error)
    } finally {
      setLoading(false)
    }
  }

    // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

    // Start an exam by navigating to the exam page
  const startExam = (examId: string) => {
    router.push(`/exam/${examId}`)
  }

  // View results by navigating to the results page
  const viewResults = () => {
    router.push("/results")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">MCQ Exam System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Exams</p>
                  <p className="text-3xl font-bold text-gray-900">{exams.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {exams.reduce((sum, exam) => sum + exam.totalQuestions, 0)}
                  </p>
                </div>
                <Users className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={viewResults}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">View Results</p>
                  <p className="text-lg font-semibold text-blue-600">Click to view</p>
                </div>
                <Trophy className="h-12 w-12 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Exams */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Mock Exams</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <Badge
                      variant={
                        exam.difficulty === "Easy"
                          ? "secondary"
                          : exam.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {exam.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {exam.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Questions: {exam.totalQuestions}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Subject: {exam.subject}
                    </div>
                    <Button className="w-full mt-4" onClick={() => startExam(exam.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
