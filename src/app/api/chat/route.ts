import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
  // Allow switching to Groq or other OpenAI-compatible providers via env
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(request: Request) {
  // If no API key and no mock mode, return error
  if (!process.env.OPENAI_API_KEY && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "AI API Key not configured" }, { status: 500 });
  }

  try {
    const { message, bookId } = await request.json();

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Mock response for development if API key is missing or dummy
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
      return NextResponse.json({
        reply: `[MOCK MODE] Since no API key is set, I'm simulating a response about "${book.title}". Your question was: "${message}"`
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-4o-mini",
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
    } catch (apiError: any) {
      // Handle Quota Exceeded (429)
      if (apiError.status === 429) {
        console.warn("OpenAI Quota Exceeded. Falling back to helpful error message.");
        return NextResponse.json({
          reply: "I'm sorry, the AI service is currently at its limit (Quota Exceeded). Please check your OpenAI billing or consider using a free alternative like Groq."
        });
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
