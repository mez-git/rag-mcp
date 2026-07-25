"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/lib/health";

export function BackendStatus() {
  const [label, setLabel] = useState("Checking backend…");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getHealth()
      .then((data) => {
        setOk(true);
        setLabel(data.message || "API is running");
      })
      .catch(() => {
        setOk(false);
        setLabel("Backend offline — start npm run dev in /backend");
      });
  }, []);

  return (
    <p
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${
        ok
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-sm ${ok ? "bg-[var(--accent)]" : "bg-red-500"}`}
        aria-hidden
      />
      {label}
    </p>
  );
}
