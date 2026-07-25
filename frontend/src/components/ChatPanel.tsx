"use client";

import { FormEvent, useState } from "react";
import { sendAgentMessage, sendChatMessage } from "@/lib/chat";
import type { ChatMessage } from "@/types/chat";

type Mode = "rag" | "agent";

type ChatPanelProps = {
  mode: Mode;
};

export function ChatPanel({ mode }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const title = mode === "rag" ? "Ask your knowledge base" : "Ask GitHub (MCP)";
  const placeholder =
    mode === "rag"
      ? "e.g. What is the project codename?"
      : "e.g. What is my GitHub login?";
  const hint =
    mode === "rag"
      ? "Uses Chroma + Ollama embeddings, then Groq answers from retrieved docs."
      : "Uses GitHub MCP tools (model may call get_me), then Groq answers.";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const reply =
        mode === "rag"
          ? await sendChatMessage(text)
          : await sendAgentMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Request failed. Is the backend running on port 4000?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[420px] flex-col">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
      </header>

      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-lg border border-[var(--line)] bg-white/70 p-4">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            No messages yet. Type below and press Send.
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-[var(--ink)] text-white"
                : "mr-auto bg-[var(--accent-soft)] text-[var(--ink)]"
            }`}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {msg.role === "user" ? "You" : "Assistant"}
            </p>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-[var(--muted)]">Working… (MCP may take a few seconds)</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
