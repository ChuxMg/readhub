import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { storage } from "../utils/storage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  bookId: string;
}

export function ChatInterface({ bookId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! Ask me anything about this book." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const reply = await storage.chatWithBook(bookId, userMessage.content);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-xl">
      <div className="border-b bg-slate-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Chat with Book</h3>
        <p className="text-xs text-slate-500">Ask the AI questions about content</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              m.role === "user" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
            }`}>
              {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`rounded-2xl px-4 py-2 text-sm ${
              m.role === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-slate-100 text-slate-800 rounded-tl-none"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Bot size={16} />
            </div>
            <div className="flex items-center rounded-2xl bg-slate-100 px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
