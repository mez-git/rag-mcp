# GitHub AI Assistant (RAG + MCP)

TypeScript monorepo: **Next.js + Tailwind** UI and an **Express + LangChain** API.

- **RAG:** ingest text → Ollama embeddings → ChromaDB → Groq answers from your docs  
- **MCP:** GitHub’s official MCP server (Docker) → tool calling (`get_me`) → natural-language answers  

> Full explanation, architecture, demo script, and interview talking points: **[PROJECT.md](./PROJECT.md)**

---

## Quick start

**Needs:** Node 20+, Docker, Ollama (`nomic-embed-text`), Groq key, GitHub PAT.

```powershell
# Chroma (persistent)
docker run -d -p 8000:8000 --name chroma -v "${PWD}/backend/chroma-data:/data" chromadb/chroma

# Backend
cd backend
copy .env.example .env   # fill GROQ_API_KEY + GITHUB_TOKEN
npm install
npm run dev

# Frontend (new terminal)
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

- UI: http://localhost:3000  
- API: http://localhost:4000/health  

**Tabs in the UI:** Knowledge (RAG) · GitHub (MCP) · Ingest  

---

## CV one-liner

Built a RAG + MCP GitHub assistant: Next.js/Tailwind frontend, Express/LangChain backend, Chroma + Ollama for retrieval, and GitHub MCP for live tool use—with secrets confined to the server.

---

## Status

- [x] RAG ingest + chat  
- [x] GitHub MCP client + tool-calling agent  
- [x] Tailwind demo UI  
- [ ] Extra MCP tools / production deploy (see PROJECT.md roadmap)
