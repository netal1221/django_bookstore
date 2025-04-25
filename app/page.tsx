"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from "lucide-react"
import BookList from "@/components/book-list"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in from session
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/check-auth")
        const data = await response.json()

        if (data.isLoggedIn) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      }
    }

    checkLoginStatus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsLoggedIn(true)
        toast({
          title: "Login successful",
          description: "Welcome to the Bookstore!",
        })
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setIsLoggedIn(false)
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700">Bookstore</h1>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
                View Cart
              </Button>
              <Button
                variant="outline"
                className="text-rose-600 border-rose-600 hover:bg-rose-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-emerald-700">Login to Bookstore</CardTitle>
              <CardDescription>Enter your credentials to access the bookstore</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Login
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">Demo credentials: username: demo, password: demo123</p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <BookList />
      )}
    </main>
  )
}
