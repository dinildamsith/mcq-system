import { type NextRequest, NextResponse } from "next/server"

// Mock storage for results - In a real app, this would be in a database
const results: any[] = []

// Mock questions data (same as in [id]/route.ts)
const examQuestions = {
  "1": {
    id: "1",
    title: "JavaScript Fundamentals",
    questions: [
      {
        id: "q1",
        questionText: "What is the correct way to declare a variable in JavaScript?",
        options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
        correctOption: 0,
      },
      {
        id: "q2",
        questionText: "Which method is used to add an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correctOption: 1,
      },
      {
        id: "q3",
        questionText: "What does '===' operator do in JavaScript?",
        options: ["Assigns a value", "Compares values only", "Compares values and types", "Creates a variable"],
        correctOption: 2,
      },
      {
        id: "q4",
        questionText: "How do you create a function in JavaScript?",
        options: ["function myFunction() {}", "create myFunction() {}", "def myFunction() {}", "func myFunction() {}"],
        correctOption: 0,
      },
      {
        id: "q5",
        questionText: "What is the DOM in JavaScript?",
        options: ["Data Object Model", "Document Object Model", "Dynamic Object Model", "Display Object Model"],
        correctOption: 1,
      },
    ],
  },
  "2": {
    id: "2",
    title: "React Development",
    questions: [
      {
        id: "q6",
        questionText: "What is JSX in React?",
        options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
        correctOption: 0,
      },
      {
        id: "q7",
        questionText: "Which hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctOption: 1,
      },
      {
        id: "q8",
        questionText: "What is the purpose of useEffect hook?",
        options: ["To manage state", "To handle side effects", "To create components", "To style components"],
        correctOption: 1,
      },
      {
        id: "q9",
        questionText: "How do you pass data from parent to child component?",
        options: ["Through state", "Through props", "Through context", "Through refs"],
        correctOption: 1,
      },
      {
        id: "q10",
        questionText: "What is the virtual DOM?",
        options: ["A copy of the real DOM", "A JavaScript representation of the DOM", "A database", "A server"],
        correctOption: 1,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Data Structures & Algorithms",
    questions: [
      {
        id: "q11",
        questionText: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctOption: 1,
      },
      {
        id: "q12",
        questionText: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctOption: 1,
      },
      {
        id: "q13",
        questionText: "What is the worst-case time complexity of quicksort?",
        options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
        correctOption: 2,
      },
      {
        id: "q14",
        questionText: "In a binary tree, what is a leaf node?",
        options: ["Root node", "Node with no children", "Node with one child", "Node with two children"],
        correctOption: 1,
      },
      {
        id: "q15",
        questionText: "What does BFS stand for in graph traversal?",
        options: ["Best First Search", "Breadth First Search", "Binary First Search", "Backward First Search"],
        correctOption: 1,
      },
    ],
  },
}

/**
 * Handles exam submission requests.
 * Expects a JSON body with 'examId', 'userId', 'answers', and 'timeSpent'.
 * Returns the exam result including score, percentage, and question details.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response object containing the exam result or error message.
 */
export async function POST(request: NextRequest) {
  try {
    const { examId, userId, answers, timeSpent } = await request.json()

    const exam = examQuestions[examId as keyof typeof examQuestions]
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    // Calculate score
    let score = 0
    const questionResults = exam.questions.map((question) => {
      const selectedOption = answers[question.id]
      const isCorrect = selectedOption === question.correctOption
      if (isCorrect) score++

      return {
        questionText: question.questionText,
        options: question.options,
        selectedOption: selectedOption ?? -1,
        correctOption: question.correctOption,
        isCorrect,
      }
    })

    const percentage = Math.round((score / exam.questions.length) * 100)
    const resultId = `result_${Date.now()}_${userId}`

    const result = {
      resultId,
      examId,
      userId,
      examTitle: exam.title,
      score,
      totalQuestions: exam.questions.length,
      percentage,
      timeSpent,
      submittedAt: new Date().toISOString(),
      questions: questionResults,
    }

    // Store result
    results.push(result)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit exam" }, { status: 500 })
  }
}
