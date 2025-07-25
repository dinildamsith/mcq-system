import { NextResponse } from "next/server"

// Mock exam data
const exams = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
    duration: 15,
    totalQuestions: 5,
    difficulty: "Easy",
    subject: "Programming",
  },
  {
    id: "2",
    title: "React Development",
    description: "Assess your understanding of React components, hooks, and state management.",
    duration: 20,
    totalQuestions: 5,
    difficulty: "Medium",
    subject: "Web Development",
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    description: "Challenge yourself with questions on arrays, linked lists, sorting, and searching algorithms.",
    duration: 25,
    totalQuestions: 5,
    difficulty: "Hard",
    subject: "Computer Science",
  },
]

// This route returns a list of available exams
export async function GET() {
  return NextResponse.json({ exams })
}
