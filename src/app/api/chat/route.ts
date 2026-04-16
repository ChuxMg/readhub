import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";

import "pdfjs-dist/build/pdf.worker.mjs";

// Initialize OpenAI client (configured for Groq)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
  try {
    const { message, bookId } = await request.json();
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that helps readers understand the book: "${book.title}" by ${book.author}.
          Here is some content from the book to help you answer:

          ${book.extractedText?.substring(0, 10000) || "No content available."}`,
        },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "AI Error", details: error.message },
      { status: 500 },
    );
  }
}
