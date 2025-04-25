import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()

  // Delete session cookie
  cookieStore.delete("sessionId")

  return NextResponse.json({ message: "Logged out successfully" })
}
