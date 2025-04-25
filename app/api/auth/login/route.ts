import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - in a real app, this would be in your Django backend
const users = [
  { id: 1, username: "demo", password: "demo123", email: "demo@example.com" },
  { id: 2, username: "user", password: "password", email: "user@example.com" },
]

export async function POST(request: Request) {
  const cookieStore = cookies()
  const { username, password } = await request.json()

  // Find user (in a real app, this would be a database query)
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
  }

  // Create session (in a real app, this would create a Django session)
  const sessionId = `session_${user.id}_${Date.now()}`

  // Set session cookie
  cookieStore.set("sessionId", sessionId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "strict",
  })

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  })
}
