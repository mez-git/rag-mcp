# GitHub AI Assistant (RAG + MCP)

Learning project: a production-shaped **monorepo** with a Next.js frontend and an Express backend. The long-term goal is a GitHub assistant using **LangChain**, **OpenAI**, **ChromaDB**, and the **GitHub MCP server**.

## Architecture

```text
rag-mcp/
├── frontend/     # Next.js (TypeScript) — UI only
└── backend/      # Express (TypeScript) — API, later AI / RAG / MCP
```

| App | Responsibility | Default URL |
|-----|----------------|-------------|
| `frontend` | Chat UI, call the API | http://localhost:3000 |
| `backend` | Business logic, AI, tools, data | http://localhost:4000 |

The browser never holds secrets (OpenAI / GitHub tokens). Those belong on the **backend** only.

## Frontend structure (kept simple on purpose)

```text
frontend/src/
├── app/page.tsx                 # Home screen
├── components/BackendStatus.tsx # Calls /health and shows result
├── lib/api.ts                   # Axios base URL (port 4000)
├── lib/health.ts                # getHealth() helper
└── types/health.ts              # Type for the health JSON
```

**Flow:** `page` → `BackendStatus` → `getHealth` → `api` → backend `/health`

## Backend structure

```text
backend/src/
├── server.ts         # Process boot (listen)
├── app.ts            # Express app (middleware + routes)
├── config/           # Env & settings
├── routes/           # URL definitions
├── controllers/      # HTTP in/out (later)
├── services/         # Business / AI logic (later)
├── repositories/     # Chroma / DB access (later)
├── mcp/              # MCP clients (later)
├── middleware/       # Errors, logging, validation
├── schemas/          # Request validation (later)
├── types/            # Shared types
├── utils/            # Helpers
└── errors/           # App error types
```

## Prerequisites

- Node.js 20+ recommended
- npm

## Setup

```bash
# Backend
cd backend
npm install
copy .env.example .env   # Windows; or: cp .env.example .env

# Frontend
cd ../frontend
npm install
copy .env.example .env.local
```

## Run (two terminals)

```bash
# Terminal 1 — API
cd backend
npm run dev

# Terminal 2 — UI
cd frontend
npm run dev
```

- Backend health: http://localhost:4000/health  
- Frontend: http://localhost:3000  

You should see the backend health message on the home page.

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend` | `npm run dev` | Express with `tsx watch` |
| `frontend` | `npm run dev` | Next.js dev server |
| `frontend` | `npm run build` | Production build |

## Current status

- [x] Monorepo layout (`frontend` + `backend`)
- [x] Express health route + config/env
- [x] Next.js UI calling `/health` (simple useEffect — no TanStack Query yet)
- [x] Chat loop (UI ↔ POST `/chat` ↔ echo reply)
- [ ] Real LLM (OpenAI via LangChain)
- [ ] RAG (embeddings + ChromaDB)
- [ ] GitHub MCP integration

## Git

- One repo at the **root** (not separate repos per app)
- Never commit `.env`, `.env.local`, or `node_modules/`

## License

Private / learning project.
