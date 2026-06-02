# AI Study Assistant Platform
An intelligent, full-stack learning platform combining Document Chat (RAG), Active Recall Flashcards (spaced repetition scheduler), Adaptive Quiz generation, and AI-driven Study Planner schedules.

**Developer:** PODUGU MUKESH  
**Role:** Full Stack Developer & AI Integration Engineer  
**Project Vision:** *"To help students learn more effectively by combining modern AI technologies with practical study tools such as note generation, document analysis, quizzes, flashcards, and personalized study planning."*

---

## 🌐 Live Deployments
- **Frontend Client (Vercel):** [https://ai-study-assistant-frontend-fvcn1b7k8-podugu-mukeshs-projects.vercel.app](https://ai-study-assistant-frontend-fvcn1b7k8-podugu-mukeshs-projects.vercel.app)
- **Backend API Server (Render):** [https://ai-study-assistant-backend-d2wp.onrender.com](https://ai-study-assistant-backend-d2wp.onrender.com)

---

## 🏗️ Project Architecture

The application is structured as a full-stack JavaScript/TypeScript project, organizing frontend layout rendering separate from api controller routes.

```mermaid
graph TD
    A[Next.js Frontend Client] <-->|JSON REST APIs| B[Express.js Server]
    B <-->|ORM Queries| C[(PostgreSQL Database via Prisma)]
    B <-->|Semantic Embedding Vectors| D[Gemini Embedding API]
    B <-->|Cosine Index Queries| E[(Pinecone Vector DB)]
    B <-->|Structured JSON Prompts| F[Gemini 1.5 Flash Model]
```

### Folder Directories Structure
```
ai-study-assistant/
├── package.json               # Root monorepo configuration workspace
├── .gitignore                 # Environment and module exclusions
├── backend/                   # Node/Express API Server
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma      # DB definitions (Users, Docs, Quizzes, Flashcards)
│   └── src/
│       ├── server.ts          # Server listener initialization
│       ├── controllers/       # Routing handlers (Document, Quiz, Flashcard, Planner)
│       ├── routes/            # Express API endpoint structures
│       └── services/
│           ├── gemini.service.ts # Structured prompts interface to Google Gemini
│           └── rag.service.ts    # Character overlaps chunking & Pinecone integration
└── frontend/                  # Next.js SPA Client
    ├── package.json
    ├── tailwind.config.js     # Glassmorphism styling configuration theme
    ├── tsconfig.json
    └── src/
        └── app/
            ├── layout.tsx     # Navigation sidebar context
            ├── page.tsx       # Landing showcase portal
            ├── dashboard/     # Student performance metrics dashboard (Recharts)
            ├── pdf-chat/      # PDF upload workspace (Parsing log simulators + RAG chat)
            ├── flashcards/    # SM-2 Spaced Repetition flashcards
            ├── quizzes/       # Dynamic Quiz Generation workspace
            └── planner/       # Schedule roadmap kanban
```

---

## ⚡ Tech Stack Specs

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Multer file upload
- **Database:** PostgreSQL (Relation schema matching Prisma targets)
- **Vector Database:** Pinecone (similarity coordinates index mapping)
- **AI Integrations:** Google Gemini API (model `gemini-1.5-flash` for summary and JSON schema quizzes; model `text-embedding-004` for vectors)

---

## ⚙️ Mathematical & Logical Specifications

### 1. Spaced Repetition Algorithm (SuperMemo SM-2)
Flashcards calculate review queues using the SuperMemo SM-2 formulas based on confidence scores $q$ ranging from 0 (forgot) to 5 (excellent):

- **If recall score $q < 3$ (Failed card):**
  - Reset consecutive correct repetition index: $R \leftarrow 0$
  - Reset interval $I \leftarrow 1$ day
- **If recall score $q \ge 3$ (Passed card):**
  - Increment repetitions: $R \leftarrow R + 1$
  - Calculate next review interval in days:
    $$I(R) = \begin{cases} 
      1 & \text{if } R = 1 \\
      6 & \text{if } R = 2 \\
      \text{round}(I(R-1) \times EF) & \text{if } R > 2 
    \end{cases}$$
- **Ease Factor ($EF$) Recalculation:**
  $$EF' = EF + \left(0.1 - (5 - q) \times \left(0.08 + (5 - q) \times 0.02\right)\right)$$
  *(Enforced floor clamping $EF' \ge 1.3$)*

### 2. Retrieval-Augmented Generation (RAG)
- **Chunking Heuristics:** Document texts are processed by dividing string arrays into segments of 600 characters using a sliding overlap index boundary of 120 characters to keep sentence context borders active.
- **Similarity Search:** Query sentences are mapped to 768-dimension vectors and evaluated against document indices in Pinecone using **Cosine Similarity**:
  $$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database
- Gemini API Key (obtained from Google AI Studio)
- Pinecone API Key

### Step-by-Step Instructions

1. **Clone the repository and access workspace:**
   ```bash
   cd C:\Users\mukes\.gemini\antigravity\scratch\ai-study-assistant
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/omnistudy?schema=public"
   GEMINI_API_KEY="your_gemini_api_key"
   PINECONE_API_KEY="your_pinecone_api_key"
   PINECONE_INDEX="ai-study-assistant"
   CLIENT_URL="http://localhost:3000"
   ```

3. **Install dependencies (monorepo style):**
   ```bash
   npm run install:all
   ```

4. **Initialize database schema via Prisma migrations:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start backend and frontend workspaces concurrently:**
   From the root directory:
   ```bash
   # In terminal 1 (starts backend Express server on port 5000)
   npm run dev:backend

   # In terminal 2 (starts Next.js frontend client on port 3000)
   npm run dev:frontend
   ```

6. Open your browser and navigate to `http://localhost:3000` to interact with the dashboard.

---

## 📅 Project Milestones & Git Commits

Recommended git checkpoint sequence during development:

| Milestone Index | Scope | Recommended Git Commit Message |
|---|---|---|
| **01** | Core skeleton setup | `feat: initial project setup (next.js frontend + express backend skeleton)` |
| **02** | Prisma Database | `db: add postgresql schema with prisma models for users, docs, quizzes, and tasks` |
| **03** | Text Ingestion | `feat: implement pdf parsing and text chunking pipeline in backend` |
| **04** | Vector Database | `feat: integrate pinecone vector db and gemini embeddings for document indexing` |
| **05** | Grounded Q&A | `feat: add rag-based chat API for document Q&A` |
| **06** | AI Generation | `feat: add quiz and flashcard generation endpoints using gemini api` |
| **07** | Theme Layout | `feat: design responsive frontend dashboard and core layout` |
| **08** | PDF chat panel | `feat: implement interactive pdf workspace with rag chat in frontend` |
| **09** | Card Reviews | `feat: build flashcard study mode and quiz interface with score tracking` |
| **10** | Tasks Planner | `feat: add AI-powered study planner and progress analytics` |
| **11** | Auth Security | `feat: implement user authentication and route guards` |
| **12** | Documentation | `docs: create comprehensive readme and developer portfolio documentation` |

---

## 🎓 Technical Challenges & Engineering Tradeoffs

Detailed design tradeoffs evaluated during development:

1. **PDF Text Stream Noise:** Raw character coordinates in PDFs often interleave column content. Writing a custom parser layer checking line height variance minimized column collisions before chunk boundary insertions.
2. **Pinecone Index Overlap Costs:** To reduce vector similarity search computation costs, metadata attributes are appended to vector upsert structures. This allows index lookups to partition namespaces by `userId` and `documentId`.
3. **HTTP-only Cookie Authentication:** Standard local storage is vulnerable to XSS token theft. Using signed JSON Web Tokens (JWT) inside HTTP-only cookies guarantees stateless authentication security without exposing keys to clients.
