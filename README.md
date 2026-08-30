# Bharat Benefits Navigator

AI-assisted Government Benefits Navigator for Indian citizens. Combines a deterministic eligibility rule engine, verified scheme database, **RAG-powered AI copilot** (Gemini), benefit compatibility checks, document guidance, and rejection analysis.

## Architecture

```
bharat-benefits-navigator/
├── frontend/          # React + Vite + Tailwind (SPA)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # 14 page components
│   │   ├── context/       # AppContext (state management)
│   │   ├── services/      # Client-side engines
│   │   └── data/          # Scheme data (offline fallback)
│   └── ...
│
├── backend/           # Express API + RAG Pipeline
│   ├── src/
│   │   ├── routes/        # Modular API route handlers
│   │   ├── rag/           # RAG pipeline (chunker, embeddings, vectorStore, retriever, generator)
│   │   ├── services/      # Business logic engines
│   │   └── data/          # Master scheme database
│   └── scripts/
│       └── ingest.ts      # One-time RAG ingestion script
└── ...
```

## Features

- Personalized eligibility matching from citizen profile inputs
- Transparent rule-by-rule explanations for eligibility
- **RAG-powered AI Copilot** with Gemini embeddings and generation
- Official document checklist, deadlines, estimated benefits, and application links
- Benefit combination compatibility checker
- Rejection analysis and appeal guidance
- Offline-safe frontend fallbacks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY
```

### 3. Run RAG Ingestion (one-time)

```bash
npm run ingest
```

This chunks all scheme data, generates embeddings, and saves the vector store.

### 4. Start Development

```bash
# Terminal 1: Backend API (port 3000)
npm run dev:backend

# Terminal 2: Frontend dev server (port 5173, proxies API to backend)
npm run dev:frontend
```

Open `http://localhost:5173`.

## Production Build

```bash
npm run build
npm start
```

The production server serves the frontend `dist/` and all `/api/*` routes.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/schemes` | List schemes (filterable) |
| GET | `/api/schemes/:id` | Get scheme details |
| POST | `/api/eligibility/check` | Check eligibility |
| POST | `/api/combination/check` | Check benefit compatibility |
| POST | `/api/rejection/analyze` | Analyze rejection |
| POST | `/api/copilot/chat` | AI copilot (RAG) |

## RAG Pipeline

The copilot uses a 5-stage RAG pipeline:

1. **Chunking** — Each scheme is split into 6 semantic chunks (overview, eligibility, documents, application, benefits, combination)
2. **Embedding** — Gemini `text-embedding-004` generates 768-dim vectors (hash fallback if no API key)
3. **Vector Store** — In-memory store with JSON persistence
4. **Retrieval** — Cosine similarity search + profile-aware re-ranking
5. **Generation** — Gemini 2.0 Flash generates grounded answers with citations

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Express server port |
| `GEMINI_API_KEY` | Yes* | — | Gemini API key for embeddings + generation |
| `EMBEDDING_MODEL` | No | `text-embedding-004` | Gemini embedding model |
| `GENERATION_MODEL` | No | `gemini-2.0-flash` | Gemini generation model |

\* Without a Gemini key, the copilot falls back to keyword matching and hash-based embeddings.
