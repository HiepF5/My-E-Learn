# Learning platform — backlog (from [learning platform.md](learning%20platform.md))

This file tracks items from the product doc that are **not** fully implemented yet, plus gaps between **web-admin** and the doc’s admin spec (sections IX–XI).

## Admin web (`web-admin`) vs doc X–XI

**Implemented routes (approximate mapping):**

| Doc idea | Current app |
|----------|-------------|
| Topic management | `/topics` |
| Vocabulary management | `/vocabulary` |
| Errors | `/errors` |
| Review-related views | `/review` |
| Extra ops / AI | `/phase-k`, `/ai-patterns`, `/streak` |

**Gaps / KPI dashboard (doc XI):**

- No dedicated **user management** page (`/admin/users` style): list users, roles, status — needs read APIs and `ADMIN` guards.
- No **reports** hub (`/admin/reports`): export or charts.
- **Sentence bank** (doc IX) — not a first-class admin page yet.
- **AI logs** as a dedicated audit UI — partial via AI-related pages only.
- **KPI cards** on dashboard: *Total users*, *Today active users*, *Words reviewed today*, *Weakest topic* — require **metrics endpoints** (aggregations over `users`, `review_history`, `review_progress`, errors by topic, etc.) before UI work.

## Platform features (doc XV, XVI, XX)

| Item | Notes |
|------|--------|
| Split learning (word left, personal note right) | Needs **per-user notes** model + API + web layout. |
| Web learner dark mode | `web-client`: theme toggle + persisted preference. |
| Learning history chart (7-day review, Chart.js) | Needs **history series API** (e.g. reviews per day for user) + Chart.js on `/learn/history`. |

## Ops reminder

- After pulling **user `role`** migration, run DB migrate, then `npm run seed:demo` (creates `admin` / `admin123` for web-admin and `demo` / `demo123` for learners).
- Web-admin login **requires** `role === ADMIN`. Learners use **web-client** (`npm run dev` in `web-client`, port 5174).
- If the API uses a strict `CORS_ORIGIN` list, add `http://localhost:5174` for the learner web app.
