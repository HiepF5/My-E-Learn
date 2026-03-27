---
name: my-learn-e-project
description: >-
  MY LEARN E — open-source English learning app (Anki/Quizlet-style, optimized for Vietnamese learners).
  Covers stack (Express, MySQL, React admin, Flutter), folder placement, naming, layered backend architecture,
  review/3-touch/error-notebook priorities, and phased roadmap. Use when building or planning this repo,
  adding features to backend/web-admin/mobile-app, or when the user mentions MY LEARN E, spaced repetition,
  review engine, or Vietnamese learning flow.
---

# MY LEARN E — Agent Skill

## Product intent (do not skip)

- **Core value**: personal memory management for English — not “more flashcards.”
- **Priority order** (from specs): **review engine → error notebook → active recall → flashcard UI**.
- **Do not** ship many features before the review scheduler and queue are solid.

---

## Technology stack (locked for this project)

| Layer | Choice | Notes |
|-------|--------|--------|
| API | **Node.js + Express** | `controller → service → repository`; no DB in controllers |
| ORM / DB access | **Sequelize** (or **Knex** + raw for migrations) | Migrations under `database/migrations` |
| Database | **MySQL** | Production schema targets ~24 tables; **Phase 1: 10 tables** (see reference) |
| Admin web | **React + Vite**, **Redux Toolkit**, **Axios** | Ant Design preferred for tables/forms |
| Mobile | **Flutter**, **Dart** | **Riverpod** for state; **Dio** for HTTP |
| Jobs | **node-cron** | Daily review queue generation (~midnight) |
| Auth API | **JWT** + **bcrypt** | Helmet, CORS, Morgan |
| Mobile cache / offline | **Hive** (later) | Local-first sync strategy |
| Push (later) | **FCM** | Reminders |

**AI / LLM**: Phase 2+; **Phase 1 = rule-based** priority and scheduling (no chat-first AI).

---

## Monorepo layout — where code lives

```text
MY-LEARN-E/
├── backend/                 # Express API
│   └── src/
│       ├── config/          # DB, env
│       ├── controllers/     # HTTP in/out only
│       ├── services/        # Business logic, review math
│       ├── repositories/    # DB queries
│       ├── routes/
│       ├── middlewares/     # auth, error handler
│       ├── models/          # Sequelize models
│       ├── jobs/            # cron: daily queue
│       ├── validators/
│       ├── utils/
│       ├── constants/
│       ├── ai/              # Phase 2+: rule engines → later ML/LLM
│       ├── app.js
│       └── server.js
├── web-admin/               # React (Vite)
│   └── src/
│       ├── assets/
│       ├── layouts/
│       ├── pages/
│       ├── components/
│       ├── services/        # axios api client
│       ├── hooks/
│       ├── store/           # Redux slices
│       ├── routes/
│       ├── utils/
│       └── constants/
├── mobile-app/              # Flutter
│   └── lib/
│       ├── screens/         # splash, auth, home, review, vocabulary, error_note, topic, profile
│       ├── widgets/
│       ├── services/        # Dio, ReviewService, etc.
│       ├── providers/       # Riverpod
│       ├── models/
│       ├── routes/
│       └── utils/
├── database/                # migrations, optional seeds
└── docs/                    # architecture notes (optional; do not create unless asked)
```

---

## API response shape (backend)

Standard JSON:

```json
{ "success": true, "data": {}, "message": "OK" }
```

Errors: consistent `success: false`, HTTP status aligned with error type; central `error.middleware`.

---

## Core HTTP surface (MVP → production)

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login` (JWT).
- **Vocabulary**: `GET/POST /api/vocabulary`, `PUT/DELETE /api/vocabulary/:id`.
- **Review**: `GET /api/review/today`, `POST /api/review/submit`.
- **Errors**: `GET/POST /api/errors` (error notebook).
- **Topics / daily**: `GET /api/topic/today`, `POST /api/topic` (as spec evolves).
- **AI (later)**: e.g. `POST /api/ai/generate-today-plan`.

---

## Naming conventions

### Files (backend)

- **kebab-case** for route files: `vocabulary.route.js`, `auth.route.js`.
- **camelCase** or **kebab** for others per existing folder; **stay consistent** — prefer `*.controller.js`, `*.service.js`, `*.repository.js`, `*.middleware.js`.

### JavaScript / React

- **Variables, functions**: `camelCase` (`calculateNextReview`, `reviewProgress`).
- **React components**: `PascalCase` files and exports (`Dashboard.jsx`, `VocabularyPage.jsx`).
- **Redux slices**: `camelCase` slice names + `Slice` suffix file optional (`vocabularySlice.js`).

### Database (MySQL)

- **snake_case** table and column names: `review_progress`, `next_review`, `user_id`, `touch1_done`.
- **PascalCase** Sequelize model names mapping to tables (`ReviewProgress` → table `review_progresses` or explicit `tableName`).

### Flutter / Dart

- **snake_case** for library files: `review_screen.dart`, `error_note_screen.dart`.
- **PascalCase** for classes/widgets: `ReviewScreen`, `TodayProgressCard`.
- **Providers**: `*Notifier`, `*Provider` suffixes where idiomatic.

### Git branches

- `main`, `develop`, `feature/*` (e.g. `feature/review-submit`).

---

## Code-writing rules (project)

1. **Thin controllers**: parse/validate input, call service, map to HTTP; no SQL or Sequelize in controllers.
2. **Services own rules**: spaced repetition intervals, ease factor, queue composition, 3-touch completion.
3. **Repositories own persistence**: one place per aggregate/query; reuse from services.
4. **Validators** at the edge (Joi/Zod/express-validator — pick one per project and stick to it).
5. **Secrets**: only `process.env`; never commit `.env`; document `.env.example`.
6. **Security**: JWT in `Authorization` header; bcrypt cost ≥ 10; Helmet + CORS configured.
7. **React**: API calls in `services/api.js` with axios instance + **interceptors** for token; pages consume hooks/store.
8. **Flutter**: API in `services/`; UI in `screens/` + small `widgets/`; avoid huge build methods.
9. **IDs**: prefer **BIGINT** compatible types in DB for production scale.
10. **Soft deletes / audit** (when tables go production-wide): `deleted_at` or `status`, plus `created_at` / `updated_at`.

---

## Review engine rules (must implement correctly)

- **Intervals** (base): e.g. `1, 3, 7, 14, 30, 60` days (extend to 120 as in advanced spec).
- **Wrong answer**: reset level / shorten interval; adjust **ease_factor** (e.g. −0.2) per spec.
- **Rating buttons** (Again / Hard / Good / Easy): map to interval changes (Again = reset; Hard = short; Good = schedule; Easy = jump).
- **3-touch**: `touch1_done` (recognize) → `touch2_done` (type) → `touch3_done` (sentence); mark learned only when all true.
- **Daily queue** (conceptual mix): due reviews + weak words + today’s topic slice + error-linked items — implement in **service** + optional `daily_review_queue` job.

---

## Estimated timeline (solo dev, part-time — adjust for full-time)

| Phase | Scope | Rough duration |
|-------|--------|----------------|
| **0** | Repo scaffold, ESLint/Prettier, Docker MySQL optional, `.env.example` | 3–5 days |
| **1** | DB Phase 1 (10 tables), migrations, users + auth JWT | 1–1.5 weeks |
| **2** | Vocabulary + topics CRUD, import CSV (admin) | 1 week |
| **3** | Review engine + `review_history` + today endpoint + submit | 1.5–2 weeks |
| **4** | Touch history + 3-touch flow (API + minimal UI) | 1 week |
| **5** | Error notebook + tags | 1 week |
| **6** | Web admin: layout, dashboard, vocab, review queue, errors, auth | 2–3 weeks |
| **7** | Flutter: auth, home “today”, review UI, 3-touch, errors | 3–4 weeks |
| **8** | Cron queue, streaks, `daily_learning_log`, polish | 1 week |
| **9** | AI rule layer (`src/ai/`), priority score, optional plan endpoint | 2+ weeks |
| **10** | Offline (Hive), FCM, AI/LLM personalization | ongoing |

**Original spec “8-week roadmap”** (aggressive): week-by-week mapping is in [reference-roadmap.md](reference-roadmap.md).

---

## Master checklist (high level)

Use [reference-roadmap.md](reference-roadmap.md) for the **full** per-week checklist.

- [ ] Monorepo folders + backend boots + DB connects
- [ ] Phase 1 migrations applied (10 tables)
- [ ] Register/login + JWT middleware
- [ ] Vocabulary + topic map CRUD
- [ ] `review_progress` + `calculateNextReview` + submit + history
- [ ] `GET /api/review/today` backed by queue or query
- [ ] Cron job fills `daily_review_queue`
- [ ] `touch_history` + 3-touch completion rules
- [ ] `error_notebook` + list/create
- [ ] web-admin: login, dashboard, vocab table, review, errors
- [ ] Flutter: today → review → 3-touch → error list
- [ ] Rule-based priority / AI folder stub (no GPT dependency in MVP)

---

## Anti-patterns (explicit)

- Building **flashcard-only** UX before **scheduling + recall** logic.
- **Controller** or **React page** issuing raw SQL or Sequelize.
- **GPT chat** before **review + error + priority** engines.
- **Deleting** user learning rows permanently without strategy (prefer soft delete for content).

---

## Additional documentation

- Detailed **week-by-week plan**, **full checklist**, and **DB Phase 1 table list**: [reference-roadmap.md](reference-roadmap.md).
