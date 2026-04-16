import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";

// Ensure PDF engine works in Node.js
import "pdfjs-dist/build/pdf.worker.mjs";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}

async function extractTextFromPDF(pdfBase64: string): Promise<string> {
  try {
    const dataBuffer = Buffer.from(pdfBase64.split(",")[1], "base64");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(dataBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText +=
        textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return fullText.trim();
  } catch (error) {
    console.error("Extraction failed:", error);
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const { id, title, author, pdfBase64 } = await request.json();
    let extractedText = undefined;

    if (pdfBase64) {
      extractedText = await extractTextFromPDF(pdfBase64);
    }

    let book;
    if (id) {
      // UPDATE existing book
      book = await prisma.book.update({
        where: { id },
        data: {
          title,
          author,
          ...(pdfBase64 ? { pdfBase64, extractedText } : {}),
        },
      });
    } else {
      // CREATE new book
      book = await prisma.book.create({
        data: {
          title,
          author,
          pdfBase64: pdfBase64 || "",
          extractedText: extractedText || "",
        },
      });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save book" }, { status: 500 });
  }
}
