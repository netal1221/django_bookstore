"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/types"

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")

        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }

        const data = await response.json()
        setBooks(data.books)
      } catch (error) {
        console.error("Error fetching books:", error)
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [toast])

  const handleAddToCart = async (bookId: number) => {
    try {
      console.log(`Adding book to cart: ID ${bookId}`)

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, quantity: 1 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart")
      }

      toast({
        title: "Added to cart",
        description: "Book added to your cart successfully",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add book to cart",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <Card key={book.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{book.title}</CardTitle>
              {book.inStock ? (
                <Badge className="bg-emerald-600">In Stock</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Out of Stock
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground mb-2">by {book.author}</p>
            <p className="text-sm mb-4 line-clamp-3">{book.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{book.pages} pages</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div className="font-bold text-lg">${book.price.toFixed(2)}</div>
            <Button
              onClick={() => handleAddToCart(book.id)}
              disabled={!book.inStock}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
