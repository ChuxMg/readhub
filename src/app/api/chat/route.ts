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

    // Check if we have extracted text. If not, we might need to extract it now if it was an old upload.
    let contextText = book.extractedText || "";

    // If no text was found in DB, we could theoretically extract it here if we have the PDF base64,
    // but for now we'll just inform the user if it's empty.

    const isMockMode = !process.env.OPENAI_API_KEY ||
                       process.env.OPENAI_API_KEY === "dummy_key" ||
                       process.env.AI_MOCK_MODE === "true";

    if (isMockMode) {
      return NextResponse.json({
        reply: `[MOCK MODE] I'm simulating a response about "${book.title}". \n\nContent Preview: ${contextText ? contextText.substring(0, 100) + "..." : "No content extracted yet."}\n\nYour question: "${message}"`
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a highly capable AI assistant helping a reader understand a specific book.

BOOK TITLE: ${book.title}
AUTHOR: ${book.author}

ACTUAL BOOK CONTENT (EXCERPT):
---
${contextText.substring(0, 12000) || "Warning: No text content was extracted from this PDF. Please answer based on the title/author if possible, but inform the user."}
---

INSTRUCTIONS:
- Answer the user's question using the provided BOOK CONTENT.
- If the answer isn't in the provided content, use your general knowledge about the book but prioritize the excerpt.
- Be concise and helpful.`,
          },
          { role: "user", content: message },
        ],
      });

      return NextResponse.json({ reply: response.choices[0].message.content });
    } catch (apiError: any) {
      const isQuotaError = apiError.status === 429 ||
                           apiError.code === 'insufficient_quota' ||
                           (apiError.error && apiError.error.code === 'insufficient_quota');

      if (isQuotaError) {
        return NextResponse.json({
          reply: "⚠️ Quota Exceeded: Your AI provider account has run out of credits. Please check your billing or switch to a free provider like Groq."
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
