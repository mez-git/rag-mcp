import { api } from "@/lib/api";
import type { ChatResponse } from "@/types/chat";

/** Sends one user message to POST /chat and returns the reply text. */
export async function sendChatMessage(message: string): Promise<string> {
  const response = await api.post<ChatResponse>("/chat", { message });
  return response.data.reply;
}
