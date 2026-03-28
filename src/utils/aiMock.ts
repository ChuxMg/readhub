export interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Simulates an AI response based on the book context.
 * In production, replace this with a call to an LLM API (e.g., OpenAI).
 */
export async function simulateAIResponse(
  userMessage: string,
  bookTitle: string,
  bookAuthor: string,
): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerMessage = userMessage.toLowerCase();

  // Simple keyword matching for demo purposes
  if (lowerMessage.includes("summary") || lowerMessage.includes("about")) {
    return `Based on "${bookTitle}" by ${bookAuthor}, this book explores key themes relevant to its genre. It provides a comprehensive overview of the subject matter, structured to guide the reader from fundamental concepts to advanced topics. Would you like me to elaborate on any specific chapter?`;
  }

  if (lowerMessage.includes("author") || lowerMessage.includes("who wrote")) {
    return `This book was written by ${bookAuthor}. They are known for their insightful contributions to this field.`;
  }

  if (lowerMessage.includes("chapter") || lowerMessage.includes("page")) {
    return `I can help you navigate the content. Since I'm currently analyzing the text of "${bookTitle}", could you specify which topic or concept within the chapter you're interested in?`;
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return `Hello! I'm your reading assistant for "${bookTitle}". Feel free to ask me questions about the content, request summaries, or clarify concepts as you read.`;
  }

  // Default generic response
  return `That's an interesting question regarding "${bookTitle}". While I analyze the full context, I can tell you that the author, ${bookAuthor}, addresses this topic in detail throughout the manuscript. Is there a specific aspect you'd like to explore further?`;
}
