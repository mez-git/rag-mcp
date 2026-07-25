import { api } from "@/lib/api";
import type { ChatResponse } from "@/types/chat";

export async function sendChatMessage(message: string): Promise<string> {
  const response = await api.post<ChatResponse>("/chat", { message });
  return response.data.reply;
}

export async function sendAgentMessage(message: string): Promise<string> {
  const response = await api.post<ChatResponse>("/agent", { message });
  return response.data.reply;
}

export async function ingestText(text: string): Promise<string> {
  const response = await api.post<{ id: string }>("/ingest", { text });
  return response.data.id;
}
