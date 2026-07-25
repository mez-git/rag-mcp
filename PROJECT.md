# GitHub AI Assistant — RAG + MCP

CV / portfolio project: a **Next.js** frontend and **Express** backend that combine:

1. **RAG** — answer questions from documents you ingest (Ollama embeddings + ChromaDB + Groq)
2. **MCP** — answer questions using **live GitHub** tools (official GitHub MCP server in Docker + LangChain tool calling)

```text
Browser (Next.js :3000)
        ↓
Express API (:4000)
   ├── POST /chat     → RAG (retrieve from Chroma → Groq)
   ├── POST /agent    → MCP tools (model may call get_me → Groq)
   ├── POST /ingest   → embed + store in Chroma
   ├── GET  /health
   ├── GET  /ping     → Chroma heartbeat
   └── GET  /mcp, /mcp/me
```

---

## CV blurb (copy/paste)

**GitHub AI Assistant (RAG + MCP)** — Built a TypeScript monorepo with a Next.js UI and Express API. Implemented retrieval-augmented generation using local Ollama embeddings and ChromaDB, and integrated GitHub’s official MCP server so an LLM can call live GitHub tools (`get_me`) via LangChain. Secrets stay on the backend; Docker runs Chroma and the MCP server.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Axios |
| Backend | Node.js, Express, TypeScript, LangChain JS |
| LLM | Groq (`llama-3.3-70b-versatile` for agent; chat may use Groq too) |
| Embeddings | Ollama `nomic-embed-text` (local, free) |
| Vector DB | ChromaDB (Docker, data under `backend/chroma-data`) |
| Tools | GitHub MCP server (`ghcr.io/github/github-mcp-server`) |
| Auth secrets | `GROQ_API_KEY`, `GITHUB_TOKEN` in backend `.env` only |

---

## Repository layout

```text
rag-mcp/
├── README.md                 # Quick start
├── PROJECT.md                # This document
├── .gitignore
├── frontend/                 # UI only — no secrets
│   └── src/
│       ├── app/              # Next.js routes
│       ├── components/       # AppShell, ChatPanel, IngestPanel, BackendStatus
│       ├── lib/              # api.ts, chat.ts, health.ts
│       └── types/
└── backend/                  # AI, DB, MCP
    └── src/
        ├── server.ts         # dotenv + listen
        ├── app.ts            # Express + CORS + JSON
        ├── config/env.ts
        ├── routes/           # health, chat, ingest, ping, mcp, agent
        ├── services/         # chat, ingest, embeddings, agent
        ├── repositories/     # chroma.repository.ts
        └── mcp/github.mcp.ts # MCP client (Docker stdio)
```

**Rule:** OpenAI/Groq/GitHub keys never go in the frontend.

---

## Concepts explained

### RAG (Retrieval-Augmented Generation)

1. **Ingest:** text → embedding (vector) via Ollama → stored in Chroma with the raw text  
2. **Ask:** question → embedding → Chroma finds similar docs → those docs become **context** in a prompt → Groq answers using that context  

Use when knowledge is **your** docs (codenames, internal notes), not general internet knowledge.

### Embeddings

A list of numbers representing meaning. Similar sentences → similar vectors. That is how search works without keyword matching alone.

### ChromaDB

Vector database. Holds `(id, document, embedding)`. Runs in Docker; with a volume mount, data survives container restarts in `backend/chroma-data/`.

### MCP (Model Context Protocol)

A standard so AI apps can use **tools**. GitHub ships an MCP **server**; your Express app is an MCP **client**. Tools like `get_me` call the GitHub API with your PAT.

### Tool-calling agent

1. Bind tools to the LLM (`bindTools`)  
2. Model may return `tool_calls`  
3. Your code runs the tool (`get_me`)  
4. Tool result goes back as a `ToolMessage`  
5. Model writes the final English answer  

**Safety:** only `get_me` is allowed today (read-only). Write tools (`delete_file`, etc.) are filtered out.

### Why Groq (not paid OpenAI)?

Free-tier friendly API for demos. Model can be swapped via one string in the service.

---

## Prerequisites

- Node.js 20+
- Docker Desktop (Chroma + GitHub MCP)
- Ollama + model: `ollama pull nomic-embed-text`
- Groq API key — [console.groq.com](https://console.groq.com)
- GitHub Personal Access Token — [github.com/settings/tokens](https://github.com/settings/tokens)

---

## Environment variables

### `backend/.env`

```env
PORT=4000
GROQ_API_KEY=...
GITHUB_TOKEN=...
CHROMA_URL=http://localhost:8000
OLLAMA_URL=http://localhost:11434
CHROMA_COLLECTION=github-assistant
```

Copy from `backend/.env.example`. **Never commit `.env`.**

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Run locally

### 1. Start Chroma (persistent)

```powershell
docker run -d -p 8000:8000 --name chroma -v "C:\Users\megha\Desktop\rag-mcp\backend\chroma-data:/data" chromadb/chroma
```

Heartbeat: `http://localhost:8000/api/v2/heartbeat`

### 2. Start Ollama

Ensure `ollama list` shows `nomic-embed-text`.

### 3. Backend

```powershell
cd backend
npm install
npm run dev
```

### 4. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Demo script (for interviews / CV walkthrough)

1. **Ingest** tab → paste: `The project codename is BlueOrchid.` → Ingest  
2. **Knowledge (RAG)** tab → ask: `What is the project codename?` → should say BlueOrchid  
3. **GitHub (MCP)** tab → ask: `What is my GitHub login?` → should use MCP `get_me` and return your login  
4. Explain: RAG = private memory; MCP = live tools; secrets only on backend  

---

## API reference (Postman)

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| GET | `/health` | — | API up |
| GET | `/ping` | — | Chroma heartbeat |
| POST | `/ingest` | `{ "text": "..." }` | Embed + store |
| POST | `/chat` | `{ "message": "..." }` | RAG answer |
| GET | `/mcp` | — | List MCP tool names |
| GET | `/mcp/me` | — | Call `get_me` directly |
| POST | `/agent` | `{ "message": "..." }` | Tool-calling agent |

---

## Architecture decisions (interview talking points)

| Decision | Why |
|----------|-----|
| Separate frontend / backend | Clear ownership; AI/secrets stay server-side |
| Layered backend (routes → services → repositories / mcp) | Testable, swap Chroma/LLM without rewriting HTTP |
| Ollama embeddings | Free, local, no embedding API quota |
| Chroma in Docker + volume | Same pattern as production containers; data persists |
| Official GitHub MCP via Docker stdio | Standard tools, not hand-rolled Octokit wrappers for every endpoint |
| Filter tools to `get_me` | Least privilege — don’t let the model delete files |
| System prompt for tool trust | Instruct model to use tool results; not fabricating answers |

### Trade-offs you should mention

- Each MCP call can spawn a Docker container (`--rm`) → slow; production might reuse a process or use hosted MCP  
- Small LLMs may ignore tool results; larger Groq models + clear system prompts help  
- RAG quality depends on chunking/ingest strategy (currently whole-text ingest — simple for learning)  
- No auth on the API yet — fine for local portfolio, not for public deploy  

---

## Possible improvements (roadmap)

- [ ] More read-only MCP tools (`list_issues`, `search_repositories`)  
- [ ] Merge RAG + tools in one “smart” chat  
- [ ] Chunk large documents on ingest  
- [ ] Persist MCP client / use hosted GitHub MCP  
- [ ] Auth + rate limiting  
- [ ] Tests (unit for services, integration for `/chat`)  
- [ ] Deploy frontend (Vercel) + backend (Railway/Render) + managed vector DB  

---

## License

Private / portfolio learning project.
