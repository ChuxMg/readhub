import { useState } from "react";
import { Button } from "./ui/button";
import { Book } from "../utils/storage";
import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";

interface PDFViewerProps {
  book: Book;
  onBack: () => void;
}

export function PDFViewer({ book, onBack }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-base font-semibold text-white">{book.title}</h2>
            <p className="text-xs text-slate-400">{book.author}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="h-7 w-7 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-[3rem] text-center text-sm font-medium text-white">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="h-7 w-7 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <object
            data={book.pdfBase64}
            type="application/pdf"
            className="h-[calc(100vh-180px)] w-full rounded-lg shadow-2xl"
          >
            <div className="flex h-96 items-center justify-center text-slate-400">
              <p>Unable to display PDF. Please try a different browser.</p>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}