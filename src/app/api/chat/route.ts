import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(request: Request) {
  try {
    const { message, bookId } = await request.json();

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Force Mock Mode if requested or if key is dummy
    const isMockMode = !process.env.OPENAI_API_KEY ||
                       process.env.OPENAI_API_KEY === "dummy_key" ||
                       process.env.AI_MOCK_MODE === "true";

    if (isMockMode) {
      return NextResponse.json({
        reply: `[MOCK MODE] I'm simulating a response about "${book.title}". In a real scenario with a valid API key, I would analyze the book content and answer your question: "${message}"`
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
      // Robust check for Quota Exceeded or Billing issues
      const isQuotaError = apiError.status === 429 ||
                           apiError.code === 'insufficient_quota' ||
                           (apiError.error && apiError.error.code === 'insufficient_quota');

      if (isQuotaError) {
        return NextResponse.json({
          reply: "⚠️ Quota Exceeded: Your OpenAI account has run out of credits or reached its limit. \n\nRecommendation: \n1. Check your billing at platform.openai.com \n2. Switch to a free provider like Groq (see README for steps)."
        });
      }
      throw apiError;
    }
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({
      error: "Failed to get AI response",
      details: error.message
    }, { status: 500 });
  }
}
