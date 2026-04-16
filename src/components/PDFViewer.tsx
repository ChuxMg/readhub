"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, MessageSquare } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { Book } from "../utils/storage";

interface PDFViewerProps {
  book: Book;
  onBack: () => void;
}

export function PDFViewer({ book, onBack }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col z-30">
      <div className="flex items-center justify-between border-b border-gray-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block">
            <h2 className="text-white font-medium truncate max-w-md">
              {book.title}
            </h2>
            <p className="text-slate-400 text-sm">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-700 rounded-lg p-1 mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="text-white hover:bg-slate-600 h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm w-12 text-center font-mono">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="text-white hover:bg-slate-600 h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat with Book</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950 flex justify-center p-8">
        <div
          className="transition-transform duration-200 ease-out origin-top shadow-2xl"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {book.pdfBase64 ? (
            <object
              data={book.pdfBase64}
              type="application/pdf"
              className="w-[800px] h-[1131px] bg-white"
            >
              <p className="p-4 text-white text-center">
                Unable to display PDF. Please download to view.
              </p>
            </object>
          ) : (
            <div className="w-[800px] h-[1131px] bg-white flex items-center justify-center">
              <p className="text-slate-500">No PDF content available</p>
            </div>
          )}
        </div>
      </div>

      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        bookId={book.id}
        bookTitle={book.title}
        bookAuthor={book.author}
      />
    </div>
  );
}
