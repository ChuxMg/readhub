export interface Book {
  id: string;
  title: string;
  author: string;
  pdfBase64: string;
  uploadedAt: string;
}

export interface AuthUser {
  role: "admin" | "reader";
  email: string;
}

const BOOKS_KEY = "readhub_books";
const AUTH_KEY = "readhub_auth";

export const storage = {
  getBooks: (): Book[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(BOOKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveBook: (book: Book): void => {
    if (typeof window === "undefined") return;
    const books = storage.getBooks();
    const existingIndex = books.findIndex((b) => b.id === book.id);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  deleteBook: (id: string): void => {
    if (typeof window === "undefined") return;
    const books = storage.getBooks().filter((b) => b.id !== id);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};