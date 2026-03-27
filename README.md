# MY LEARN E — Runbook (Short)

Quick setup guide for running the project in local mode or Docker mode.

## 1) Local Run (Backend + MySQL on host)

### Prerequisites
- Node.js 20+
- MySQL 8+

### Setup
1. Create `.env` from `.env.example` at repo root.
2. Update DB values:
   - `DB_HOST=localhost`
   - `DB_PORT=3306`
   - `DB_NAME`, `DB_USER`, `DB_PASS`
   - `JWT_SECRET`
   - `CORS_ORIGIN` (example: `http://localhost:5173`)

### Run backend
```bash
cd backend
npm install
npm run migrate
npm run dev
```

Backend URLs:
- Health: `http://localhost:5000/health`
- Swagger: `http://localhost:5000/api/docs`

## 2) Docker Run (MySQL + Backend together)

### Setup
1. Create `.env` from `.env.example` at repo root.
2. Recommended for Docker:
   - `DB_NAME=mylearne`
   - `DB_USER=mylearne`
   - `DB_PASS=mylearne_password`
   - `DB_ROOT_PASS=root_password`
   - `JWT_SECRET=change_me`
   - `CORS_ORIGIN=http://localhost:5173`

### Start stack
```bash
docker compose up --build -d
```

### Run migrations in container
```bash
docker compose exec backend npm run migrate
```

### Stop stack
```bash
docker compose down
```

## 3) Migrate Commands (Reference)

From `backend` directory:
```bash
npm run migrate
npm run migrate:undo
```

With Docker:
```bash
docker compose exec backend npm run migrate
docker compose exec backend npm run migrate:undo
```

## 4) Troubleshooting DB

### `Access denied for user ''@'localhost'`
- Cause: env vars not loaded (empty DB user/pass).
- Fix:
  - Ensure `.env` exists at repo root.
  - Check `DB_USER` and `DB_PASS`.
  - Restart backend after env changes.

### Backend cannot connect to DB in Docker
- Ensure backend uses `DB_HOST=mysql` (already set in `docker-compose.yml`).
- Check MySQL health:
```bash
docker compose ps
docker compose logs mysql
```

### Migration fails because DB not ready
- Wait until MySQL is healthy, then rerun:
```bash
docker compose exec backend npm run migrate
```

### Port already in use (`3306` or `5000`)
- Stop conflicting service/process, or change mapped ports in `docker-compose.yml`.

## 5) Quick Health Checklist (Post-Deploy)

Run these 3 commands after deploy:

```bash
docker compose ps
curl http://localhost:5000/health
curl http://localhost:5000/api/openapi.json
```
