import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ API Key not configured" }, { status: 500 });
  }

  try {
    const { message, bookId } = await request.json();

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
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
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
