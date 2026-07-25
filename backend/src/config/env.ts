export const env = {
    PORT: Number(process.env.PORT) || 4000,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    CHROMA_URL: process.env.CHROMA_URL,
    OLLAMA_URL: process.env.OLLAMA_URL,
    CHROMA_COLLECTION: process.env.CHROMA_COLLECTION
}