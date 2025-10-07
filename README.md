<!-- # IdeaBoard – Marketing + Live Idea Board

A two-part project showcasing rapid, pragmatic full‑stack execution:
- Landing page (Next.js + TailwindCSS)
- Mini-app “Idea Board” with anonymous submissions and upvotes
- Backend API (Express.js)
- Database (PostgreSQL)
- All requests via Axios; long polling with SWR `refreshInterval`
- Containerized with commented Dockerfiles and docker-compose

## Architecture
- Frontend: Next.js App Router, TailwindCSS tokens, shadcn/ui, toasts for errors/add/update.
- Backend: Express.js with CORS, `pg` pool, endpoints:
  - `GET /ideas` → list ideas
  - `POST /ideas { text }` → add idea (≤ 280 chars)
  - `POST /ideas/:id/upvote` → increment votes
  - `GET /health` → health check
- Database: PostgreSQL storing `ideas(id, text, votes, created_at)`

## Run with Docker Compose
1. docker-compose up
2. Open http://localhost:3000 (frontend)
3. API runs at http://localhost:4000
4. Postgres at localhost:5432 (db: ideaboard / postgres / postgres)

Environment variables are set in `docker-compose.yml`. Override as needed.

## Development Notes
- Axios instance: `lib/api.ts` uses `NEXT_PUBLIC_API_BASE_URL`.
- Long polling: SWR `refreshInterval: 2000ms` + optimistic updates on upvote.
- Notifications: global Toaster wired in `app/layout.tsx`.
- Images: placed in `public/images/`.

## Trade-offs
- For simplicity, authentication is omitted (brief focuses on anonymous posting).
- Rate limiting/anti-spam can be added at the API (e.g., IP-based throttling).
- The Next preview environment may run without a Node build step; Dockerfiles handle production.

## Optional (Kubernetes)
Add manifests under `k8s/` (not required). Compose remains the single-command local setup. -->


# IdeaBoard – Marketing + Live Idea Board

A two-part project showcasing rapid, pragmatic full‑stack execution:
- Landing page (Next.js + TailwindCSS)
- Mini-app “Idea Board” with anonymous submissions and upvotes
- Backend API (Express.js)
- Database (PostgreSQL)
- All requests via Axios; long polling with SWR `refreshInterval`
- Containerized with commented Dockerfiles and docker-compose

## Architecture
- Frontend: Next.js App Router, TailwindCSS tokens, shadcn/ui, toasts for errors/add/update.
- Backend: Express.js with CORS, `pg` pool, endpoints:
  - `GET /ideas` → list ideas
  - `POST /ideas { text }` → add idea (≤ 280 chars)
  - `POST /ideas/:id/upvote` → increment votes
  - `GET /health` → health check
- Database: PostgreSQL storing `ideas(id, text, votes, created_at)`

## Run with Docker Compose
1. docker-compose up
2. Open http://localhost:3000 (frontend)
3. API runs at http://localhost:4000
4. Postgres at localhost:5432 (db: ideaboard / postgres / postgres)

Environment variables are set in `docker-compose.yml`. Override as needed.

## Setup for Collaborators

To safely allow others to run this project:

1. **Use example env files**  
   Each service includes a `.env.example` file:

   - `db/.env.example`
   - `backend/.env.example`
   - `frontend/.env.example`

2. **Copy the example files to real `.env` files**  
   ```bash
   cp db/.env.example db/.env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env


3. **Fill in your own values**  
Set `POSTGRES_PASSWORD` or other variables as needed.  
Keep `PGHOST=db` and `NEXT_PUBLIC_API_BASE_URL=http://backend:4000` for Docker.

- Ensure `.env` files are ignored in Git:


# .gitignore
.env
*/.env


## Run Docker Compose

To start everything with Docker Compose:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Development Notes

- Axios instance: `lib/api.ts` uses `NEXT_PUBLIC_API_BASE_URL`.
- Long polling: SWR `refreshInterval: 2000ms` + optimistic updates on upvote.
- Notifications: global Toaster wired in `app/layout.tsx`.
- Images: placed in `public/images/`.
