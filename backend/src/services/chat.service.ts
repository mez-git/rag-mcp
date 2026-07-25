/**
 * Chat business logic lives here (not in the route file).
 * Today: echo (proves the full path works).
 * Next: call OpenAI / LangChain here.
 */

import {ChatGroq} from "@langchain/groq";
import { embedText } from "./embeddings.service.js";
import { searchSimilar } from "../repositories/chroma.repository.js";                   

export async function createChatReply(message: string): Promise<string> {
  const trimmed = message.trim();
  if(!trimmed) {
    return "Please type a message.";
  }
  const embedding = await embedText(trimmed);
  const results = await searchSimilar({ embedding });
  console.log("results", results);    
  console.log(trimmed);
 
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant" as const, // fast + free-tier friendly
    apiKey: process.env.GROQ_API_KEY as string,
  });
  const docs = (results.documents?.[0] ?? []).filter(Boolean);
  const context = docs.length
    ? docs.join("\n\n")
    : "No relevant context found.";
  
  const prompt = `Use ONLY the context below to answer.
  If the answer is not in the context, say you don't know.
  
  Context:
  ${context}
  
  Question:
  ${trimmed}`;
  const response = await model.invoke(prompt);
  console.log("response", response);
  return response.content as string;
}
