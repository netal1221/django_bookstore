import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")

  // In a real Django app, this would verify the session with the backend
  const isLoggedIn = !!sessionId

  return NextResponse.json({ isLoggedIn })
}
