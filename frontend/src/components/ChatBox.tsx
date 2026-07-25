"use client";

/**
 * Simple chat UI.
 * User types → we call sendChatMessage → we show Echo reply.
 * Later the same UI will show real AI answers.
 */
import { FormEvent, useState } from "react";
import { sendChatMessage } from "@/lib/chat";
import type { ChatMessage } from "@/types/chat";

export function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not reach the backend." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Chat</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
        {loading && <p>Thinking…</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          style={{ width: "70%", marginRight: "0.5rem" }}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </section>
  );
}
