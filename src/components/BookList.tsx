import { Book } from "../utils/storage";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Edit, Trash2, FileText, Calendar } from "lucide-react";

interface BookListProps {
  books: Book[];
  isAdmin: boolean;
  onRead: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookList({ books, isAdmin, onRead, onEdit, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-700">No books yet</h3>
        <p className="mt-1 text-slate-500">
          {isAdmin ? "Upload your first book to get started" : "Check back later for new content"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-1 truncate text-lg font-semibold text-slate-900">
              {book.title}
            </h3>
            <p className="mb-3 text-sm text-slate-600">{book.author}</p>
            <div className="mb-4 flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              {new Date(book.uploadedAt).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onRead(book)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isAdmin ? "View" : "Read"}
              </Button>
              {isAdmin && (
                <>
                  <Button variant="outline" size="icon" onClick={() => onEdit(book)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(book.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}