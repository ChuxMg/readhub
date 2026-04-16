export interface Book {
  id: string;
  title: string;
  author: string;
  pdfBase64: string;
  uploadedAt: string;
  extractedText?: string;
}

export const storage = {
  getBooks: async (): Promise<Book[]> => {
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  saveBook: async (bookData: Partial<Book>): Promise<void> => {
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  },

  deleteBook: async (id: string): Promise<void> => {
    await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  chatWithBook: async (bookId: string, message: string): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, message }),
      });
      if (!res.ok) throw new Error("Failed to chat");
      const data = await res.json();
      return data.reply;
    } catch (error) {
      console.error(error);
      return "Sorry, I couldn't connect to the AI.";
    }
  },
};