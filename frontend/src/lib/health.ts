/**
 * Calls GET /health on the backend.
 * Returns JSON like: { message: "API is running" }
 */
import { api } from "@/lib/api";
import type { HealthResponse } from "@/types/health";

export async function getHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/health");
  return response.data;
}
