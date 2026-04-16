"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/Header";
import { AuthForm } from "../components/AuthForm";
import { BookForm } from "../components/BookForm";
import { BookList } from "../components/BookList";
import { PDFViewer } from "../components/PDFViewer";
import { storage, Book } from "../utils/storage";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";

type View = "login" | "library" | "add-book" | "edit-book" | "read";

export default function Page() {
  const { user, isLoading, login, logout } = useAuth();
  const [view, setView] = useState<View>("login");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        const data = await storage.getBooks(); // Added await here
        setBooks(data);
      }
    };
    fetchBooks();
  }, [user]);

  const handleLogin = (email: string, password: string) => {
    const success = login(email, password);
    if (success) {
      setView("library");
    }
    return success;
  };

  const handleLogout = () => {
    logout(); // Clears storage
    setView("login"); // Resets view state
    setEditingBook(null);
    setSelectedBook(null);
    setShowForm(false);
  };

  const handleSaveBook = () => {
    setBooks(storage.getBooks());
    setShowForm(false);
    setEditingBook(null);
    setView("library");
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
    setView("edit-book");
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await storage.deleteBook(id); // Added await here
      const data = await storage.getBooks();
      setBooks(data);
    }
  };

  const handleReadBook = (book: Book) => {
    setSelectedBook(book);
    setView("read");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === "login" || !user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (view === "read" && selectedBook) {
    return (
      <PDFViewer 
        book={selectedBook} 
        onBack={() => setView("library")} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={user.email} role={user.role} onLogout={handleLogout} />
      
      <main className="mx-auto max-w-6xl px-4 py-8">
        {user.role === "admin" ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Book Management</h2>
                <p className="text-slate-600">Upload and manage your library</p>
              </div>
              {!showForm && (
                <Button onClick={() => { setShowForm(true); setView("add-book"); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Add New Book
                </Button>
              )}
            </div>

            {(showForm || view === "add-book" || view === "edit-book") && (
              <div className="max-w-lg">
                <BookForm
                  editingBook={editingBook}
                  onSave={handleSaveBook}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingBook(null);
                    setView("library");
                  }}
                />
              </div>
            )}

            <div>
              <h3 className="mb-4 text-lg font-medium text-slate-900">
                Library ({books.length} {books.length === 1 ? "book" : "books"})
              </h3>
              <BookList
                books={books}
                isAdmin={true}
                onRead={handleReadBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your Library</h2>
                <p className="text-slate-600">Select a book to start reading</p>
              </div>
            </div>

            <BookList
              books={books}
              isAdmin={false}
              onRead={handleReadBook}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
      </main>
    </div>
  );
}