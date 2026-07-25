"use client";

/**
 * This component talks to our Express backend.
 *
 * Flow:
 * 1. Page loads
 * 2. useEffect runs once
 * 3. We call getHealth() → GET http://localhost:4000/health
 * 4. We show loading, then success or error
 */
import { useEffect, useState } from "react";
import { getHealth } from "@/lib/health";

export function BackendStatus() {
  // What we show on screen
  const [message, setMessage] = useState("Checking backend…");

  // Run this once when the component first appears
  useEffect(() => {
    getHealth()
      .then((data) => {
        // Backend answered OK
        setMessage(data.message);
      })
      .catch(() => {
        // Backend is down or request failed
        setMessage("API is not running");
      });
  }, []); // [] = run only once

  return <p>{message}</p>;
}
