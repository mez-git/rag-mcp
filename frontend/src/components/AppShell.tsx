"use client";

import { useState } from "react";
import { BackendStatus } from "@/components/BackendStatus";
import { ChatPanel } from "@/components/ChatPanel";
import { IngestPanel } from "@/components/IngestPanel";

type Tab = "rag" | "agent" | "ingest";

const tabs: { id: Tab; label: string }[] = [
  { id: "rag", label: "Knowledge (RAG)" },
  { id: "agent", label: "GitHub (MCP)" },
  { id: "ingest", label: "Ingest" },
];

export function AppShell() {
  const [tab, setTab] = useState<Tab>("rag");

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:py-12">
      <header className="mb-8">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest text-[var(--accent)] uppercase">
          Portfolio project
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          GitHub AI Assistant
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          RAG over your docs (Chroma + Ollama) and live GitHub tools via MCP —
          Next.js UI, Express + LangChain backend.
        </p>
        <div className="mt-5">
          <BackendStatus />
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[var(--line)] pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--muted)] hover:bg-white/80 hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)]/90 p-4 shadow-sm sm:p-6">
        {tab === "rag" && <ChatPanel mode="rag" />}
        {tab === "agent" && <ChatPanel mode="agent" />}
        {tab === "ingest" && <IngestPanel />}
      </div>

      <footer className="mt-auto pt-10 text-center text-xs text-[var(--muted)]">
        Local demo: Chroma + Ollama + Groq + GitHub MCP (Docker)
      </footer>
    </div>
  );
}
