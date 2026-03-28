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

## CORE FEATURES.md — sections V–VII (not in current MVP scope)

From [CORE FEATURES.md](CORE%20FEATURES.md):

| Section | Idea | Status |
|---------|------|--------|
| V.1 | Ultra-fast offline word search | Partial: vocabulary list search only |
| V.2 | Recent mistakes widget on home | Backlog: surface last errors on home |
| V.3 | Learning mood (Easy / Focus / Quick) + AI mode | Backlog: needs product + AI contract |
| V.4 | Light session timer (“5 min done”) | Backlog |
| V.5 | End-of-week summary (“42 words learned”) | Backlog: needs analytics API |
| VI | Personal English Garden (growth metaphor) | Backlog: habit UX, no DB yet |
| VII | “Today most fragile word” + AI | Backlog: ranking model + home widget |

**Section VIII (avoid early):** continuous AI chat, leaderboard, heavy social, long tests — intentionally not scheduled.

## Platform features (doc XV, XVI, XX)

| Item | Notes |
|------|--------|
| Split learning (word left, personal note right) | Mobile: per-word notes on vocabulary detail + API. Web learner split layout still backlog. |
| Web learner dark mode | `web-client`: theme toggle + persisted preference. |
| Learning history chart (7-day review, Chart.js) | Needs **history series API** (e.g. reviews per day for user) + Chart.js on `/learn/history`. |

## Ops reminder

- After pulling **user `role`** migration, run DB migrate, then `npm run seed:demo` (creates `admin` / `admin123` for web-admin and `demo` / `demo123` for learners).
- Web-admin login **requires** `role === ADMIN`. Learners use **web-client** (`npm run dev` in `web-client`, port **5180** — admin stays on **5173**).
- If the API uses a strict `CORS_ORIGIN` list, add `http://localhost:5180` for the learner web app.
