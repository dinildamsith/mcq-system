import { type NextRequest, NextResponse } from "next/server"

// Mock user data - In a real app, this would be in a database
const users = [
  {
    id: "1",
    name: "John Student",
    email: "student@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
  },
]

/**
 * Handles user login requests.
 * Expects a JSON body with 'email' and 'password'.
 * Returns user data if login is successful, otherwise returns an error.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response object containing user data or error message.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
