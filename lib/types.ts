export interface Book {
  id: number
  title: string
  author: string
  description: string
  price: number
  pages: number
  inStock: boolean
  category: string
  publishedDate: string
}

export interface CartItem {
  book: Book
  quantity: number
}

export interface User {
  id: number
  username: string
  email: string
}
