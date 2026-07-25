"use client";

import { FormEvent, useState } from "react";
import { ingestText } from "@/lib/chat";

export function IngestPanel() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value || loading) return;

    setLoading(true);
    setStatus("");
    try {
      const id = await ingestText(value);
      setStatus(`Saved to Chroma. Document id: ${id}`);
      setText("");
    } catch {
      setStatus("Ingest failed. Check backend, Chroma (Docker), and Ollama.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Ingest knowledge</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Store text in Chroma via Ollama embeddings. Then ask about it in the
          Knowledge tab.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder='e.g. The project codename is BlueOrchid.'
          disabled={loading}
          className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving…" : "Ingest text"}
        </button>
      </form>

      {status && (
        <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
          {status}
        </p>
      )}
    </section>
  );
}
