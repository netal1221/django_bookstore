import { NextResponse } from "next/server"
import { books } from "@/lib/data-store"

export async function GET() {
  // In a real Django app, this would query the database
  return NextResponse.json({ books })
}
