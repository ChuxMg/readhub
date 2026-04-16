import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Upload } from "lucide-react";
import { storage, Book } from "../utils/storage";

interface BookFormProps {
  editingBook?: Book | null;
  onSave: () => void;
  onCancel: () => void;
}

export function BookForm({ editingBook, onSave, onCancel }: BookFormProps) {
  const [title, setTitle] = useState(editingBook?.title || "");
  const [author, setAuthor] = useState(editingBook?.author || "");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setIsUploading(true);
    try {
      let base64Result: string | undefined = undefined;

      // Only convert to base64 if a new file was selected
      if (pdfFile) {
        base64Result = await storage.fileToBase64(pdfFile);
      } else if (!editingBook) {
        // If not editing and no file, we can't create a book
        setIsUploading(false);
        return;
      }

      const bookData: Partial<Book> = {
        id: editingBook?.id,
        title: title.trim(),
        author: author.trim(),
        // Only include pdfBase64 if we actually have a new one
        pdfBase64: base64Result,
      };

      await storage.saveBook(bookData);
      onSave();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          {editingBook ? "Edit Book" : "Add New Book"}
        </CardTitle>
        <CardDescription className="text-slate-500">
          {editingBook
            ? "Update book details or replace PDF"
            : "Upload a new PDF to the library"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="author"
              className="text-sm font-medium text-slate-700"
            >
              Author
            </Label>
            <Input
              id="author"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf" className="text-sm font-medium text-slate-700">
              PDF File
            </Label>
            <div className="relative">
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="h-10 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              />
              <Upload className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {editingBook && !pdfFile && (
              <p className="text-xs text-slate-500">
                Leave empty to keep existing PDF
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Saving..." : editingBook ? "Update" : "Add Book"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
