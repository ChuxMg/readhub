import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import * as pdf from "pdf-parse";

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

export async function POST(request: Request) {
  try {
    const { title, author, pdfBase64 } = await request.json();

    // Extract text for AI context
    let extractedText = "";
    try {
      const dataBuffer = Buffer.from(pdfBase64.split(",")[1], "base64");
      // pdf-parse might need to be imported differently depending on the environment
      const pdfParse = (pdf as any).default || pdf;
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } catch (e) {
      console.error("Text extraction failed:", e);
    }

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
