import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCart } from "@/lib/data-store"

export async function PUT(request: Request, { params }: { params: { bookId: string } }) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const bookId = Number.parseInt(params.bookId)
  const { quantity } = await request.json()

  if (isNaN(bookId) || quantity < 1) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  const cart = getCart(sessionId)
  const itemIndex = cart.findIndex((item) => item.book.id === bookId)

  if (itemIndex === -1) {
    return NextResponse.json({ message: "Book not found in cart" }, { status: 404 })
  }

  cart[itemIndex].quantity = quantity

  return NextResponse.json({ message: "Cart updated", items: cart })
}

export async function DELETE(request: Request, { params }: { params: { bookId: string } }) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const bookId = Number.parseInt(params.bookId)

  if (isNaN(bookId)) {
    return NextResponse.json({ message: "Invalid book ID" }, { status: 400 })
  }

  const cart = getCart(sessionId)
  const itemIndex = cart.findIndex((item) => item.book.id === bookId)

  if (itemIndex === -1) {
    return NextResponse.json({ message: "Book not found in cart" }, { status: 404 })
  }

  cart.splice(itemIndex, 1)

  return NextResponse.json({ message: "Book removed from cart", items: cart })
}
