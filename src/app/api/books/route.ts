import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import * as pdfjs from "pdfjs-dist";

// Fix for pdfjs worker
if (typeof window === "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

async function extractTextFromPDF(pdfBase64: string): Promise<string> {
  try {
    const dataBuffer = Buffer.from(pdfBase64.split(",")[1], "base64");
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(dataBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Text extraction failed:", error);
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const { title, author, pdfBase64 } = await request.json();

    const extractedText = await extractTextFromPDF(pdfBase64);

    const book = await prisma.book.create({
      data: {
        title,
        author,
        pdfBase64,
        extractedText,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save book" }, { status: 500 });
  }
}
