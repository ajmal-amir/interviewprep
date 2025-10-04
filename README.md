# ParishConnect – Group Coding Assessment Starter

This repo contains a minimal full‑stack starter you can use to practice a **group coding assessment** (React + Express + SQLite).

## Quick Start

### 1) API (server)
```bash
cd server
npm install
npm run start     # http://localhost:4000
npm run seed      # optional sample data
```

### 2) Frontend (React + Vite)
```bash
cd parishconnect
npm install
# If needed, copy .env.example to .env and set VITE_API_URL
npm run dev       # http://localhost:5173
```

### Notes
- API base: `http://localhost:4000/api`
- Frontend env: `VITE_API_URL` (defaults to the above)
- SQLite file: `server/parish.db` (auto-created)
- Routes implemented:
  - `GET/POST/PUT/DELETE /api/parishes` (+ cascade delete)
  - `GET /api/parishes/:id/parishioners?search=&role=`
  - `POST /api/parishes/:id/parishioners`
  - `PUT/DELETE /api/parishioners/:pid`

## Practice Ideas
- Add create/edit/delete forms on the frontend
- Add loading & error states
- Add pagination and role chips
- Add a simple login gate for writes
- Write 1–2 tests (Jest on server, React Testing Library)

Good luck — ship MVP first, then iterate!
