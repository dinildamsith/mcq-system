import { type NextRequest, NextResponse } from "next/server"

// Mock questions data
const examQuestions = {
  "1": {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    duration: 15,
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
    description: "Test your React knowledge",
    duration: 20,
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
    description: "Test your DSA knowledge",
    duration: 25,
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const examId = params.id
  const exam = examQuestions[examId as keyof typeof examQuestions]

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 })
  }

  return NextResponse.json({ exam })
}
