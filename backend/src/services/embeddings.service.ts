import { OllamaEmbeddings } from "@langchain/ollama";
import { env } from "../config/env.js";

const embedding =new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: env.OLLAMA_URL || "http://localhost:11434" 
});


export async function embedText(text: string):Promise<number[]> {
    return embedding.embedQuery(text);
   
}
