import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { books, getCart } from "@/lib/data-store"

export async function GET() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const cart = getCart(sessionId)

  return NextResponse.json({ items: cart })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { bookId, quantity } = await request.json()

  // Find book
  const book = books.find((b) => b.id === bookId)

  if (!book) {
    console.log(`Book not found: ID ${bookId}`)
    return NextResponse.json({ message: "Book not found" }, { status: 404 })
  }

  if (!book.inStock) {
    return NextResponse.json({ message: "Book is out of stock" }, { status: 400 })
  }

  const cart = getCart(sessionId)

  // Check if book is already in cart
  const existingItem = cart.find((item) => item.book.id === bookId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      book,
      quantity,
    })
  }

  return NextResponse.json({ message: "Book added to cart", items: cart })
}
