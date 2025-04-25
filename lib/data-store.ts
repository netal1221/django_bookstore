import type { Book, CartItem } from "@/lib/types"

// Shared book database that will be used across all API routes
export const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    price: 12.99,
    pages: 180,
    inStock: true,
    category: "Fiction",
    publishedDate: "1925-04-10",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "The story of young Scout Finch, her brother Jem, and their father Atticus, as they navigate issues of race and class in their small Southern town during the Great Depression.",
    price: 14.99,
    pages: 281,
    inStock: true,
    category: "Fiction",
    publishedDate: "1960-07-11",
  },
  {
    id: 3,
    title: "Python Crash Course",
    author: "Eric Matthes",
    description:
      "A fast-paced, thorough introduction to programming with Python that will have you writing programs, solving problems, and making things that work in no time.",
    price: 29.99,
    pages: 544,
    inStock: true,
    category: "Programming",
    publishedDate: "2019-05-03",
  },
  {
    id: 4,
    title: "Dune",
    author: "Frank Herbert",
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    price: 18.99,
    pages: 412,
    inStock: true,
    category: "Science Fiction",
    publishedDate: "1965-08-01",
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep.",
    price: 15.99,
    pages: 310,
    inStock: true,
    category: "Fantasy",
    publishedDate: "1937-09-21",
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
    price: 9.99,
    pages: 279,
    inStock: false,
    category: "Classic",
    publishedDate: "1813-01-28",
  },
  {
    id: 7,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the "phoniness" of the adult world.',
    price: 11.99,
    pages: 234,
    inStock: true,
    category: "Fiction",
    publishedDate: "1951-07-16",
  },
  {
    id: 8,
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
    price: 34.99,
    pages: 464,
    inStock: true,
    category: "Programming",
    publishedDate: "2008-08-01",
  },
]

// In-memory cart storage - in a real app, this would be in your Django session
export const carts: Record<string, CartItem[]> = {}

// Helper function to get cart from session
export function getCart(sessionId: string): CartItem[] {
  if (!carts[sessionId]) {
    carts[sessionId] = []
  }
  return carts[sessionId]
}
