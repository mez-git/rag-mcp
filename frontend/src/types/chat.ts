export type ChatRequest = {
  message: string;
};

export type ChatResponse = {
  reply: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
