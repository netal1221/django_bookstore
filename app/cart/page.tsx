"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/lib/types"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/")
            return
          }
          throw new Error("Failed to fetch cart")
        }

        const data = await response.json()
        setCartItems(data.items)
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [router, toast])

  const handleRemoveFromCart = async (bookId: number) => {
    try {
      const response = await fetch(`/api/cart/${bookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.book.id !== bookId))
        toast({
          title: "Item removed",
          description: "Book removed from your cart",
        })
      } else {
        throw new Error("Failed to remove item")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const handleUpdateQuantity = async (bookId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const response = await fetch(`/api/cart/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems(cartItems.map((item) => (item.book.id === bookId ? { ...item, quantity: newQuantity } : item)))
      } else {
        throw new Error("Failed to update quantity")
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0).toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <p>Loading your cart...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Books
        </Button>
        <h1 className="text-3xl font-bold text-emerald-700">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6 flex flex-col items-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any books to your cart yet.</p>
            <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
              Browse Books
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.book.id} className="flex flex-col sm:flex-row gap-4 py-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.book.title}</h3>
                      <p className="text-muted-foreground">by {item.book.author}</p>
                      <p className="font-medium mt-1">${item.book.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.book.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.book.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 ml-2"
                        onClick={() => handleRemoveFromCart(item.book.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  )
}
