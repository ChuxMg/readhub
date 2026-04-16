import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(request: Request) {
  try {
    const { message, bookId } = await request.json();

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key_for_build") {
      return NextResponse.json(
        { error: "API Key Missing", details: "Please set OPENAI_API_KEY in your .env file." },
        { status: 401 }
      );
    }

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
