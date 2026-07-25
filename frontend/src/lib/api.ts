/**
 * Shared axios client.
 * All frontend API calls should use this, so the base URL lives in ONE place.
 */
import axios from "axios";

export const api = axios.create({
  // From .env.local, or fall back to local backend
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
});
