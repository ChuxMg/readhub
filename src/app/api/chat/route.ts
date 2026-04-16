import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/src/lib/prisma";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";

// Import worker correctly for Node.js environment
import "pdfjs-dist/build/pdf.worker.mjs";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "dummy_key",
  baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
});

async function extractTextOnTheFly(pdfBase64: string): Promise<string> {
  try {
    if (!pdfBase64) return "";
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
      fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return fullText.trim();
  } catch (error) {
    console.error("[AI] On-the-fly repair failed:", error);
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const { message, bookId } = await request.json();
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    let contextText = book.extractedText || "";
    if (!contextText && book.pdfBase64) {
      console.log(`[AI] Repairing missing text for "${book.title}"...`);
      contextText = await extractTextOnTheFly(book.pdfBase64);
      if (contextText) {
        await prisma.book.update({
          where: { id: bookId },
          data: { extractedText: contextText },
        });
        console.log(`[AI] Successfully repaired and saved text for "${book.title}".`);
      }
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant helping a reader understand this book.
          BOOK TITLE: ${book.title}
          AUTHOR: ${book.author}
          ACTUAL CONTENT: ${contextText.substring(0, 15000) || "Warning: No text content available."}

          INSTRUCTIONS:
          - Answer using the provided CONTENT.
          - Be concise and accurate.`,
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
