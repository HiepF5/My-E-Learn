# MY LEARN E — Reference: roadmap, checklist, time

Companion to `SKILL.md`. Use for detailed planning and tick-through.

---

## 1. Phased delivery (merged from all MD specs)

### Phase A — Foundation (≈ 1–2 weeks)

- [x] Git: `main` / `develop` / `feature/*`
- [x] `backend`: Express, `app.js` + `server.js`, Helmet, CORS, Morgan, JSON body
- [x] `config/database.js` (Sequelize + MySQL)
- [x] `.env.example`: `PORT`, `DB_*`, `JWT_SECRET`
- [x] Error middleware + unified JSON error shape
- [x] `database/migrations` — Knex or Sequelize migrations

### Phase B — DB Phase 1 (10 tables)

Per **FULL DATABASE PRODUCTION VERSION**:

1. `users`
2. `user_settings`
3. `topics`
4. `vocabulary`
5. `vocabulary_topic_map` (optional in minimal MVP; include if multi-topic from day one)
6. `review_progress`
7. `review_history`
8. `touch_history`
9. `error_notebook`
10. `daily_learning_log`
11. `daily_review_queue` — spec lists as part of “first real” set; include early for “today” performance.

- [x] Phase B implemented with Sequelize migrations (**option C**): created 11 tables + minimum indexes.

**Indexes** (minimum):

- `review_progress (user_id, next_review)`
- `review_history (user_id, word_id)`
- `error_notebook (user_id)`

### Phase C — Auth (≈ 3–5 days)

- [ ] `users` model; bcrypt hash; JWT sign/verify
- [ ] `middlewares/auth.middleware.js` — Bearer token
- [ ] Routes: register, login
- [ ] Protect vocabulary/review/errors routes

### Phase D — Vocabulary & content (≈ 1 week)

- [ ] CRUD vocabulary; link topics via map table
- [ ] Validators for create/update
- [ ] Optional: `collocations`, `word_family` (later phase)

### Phase E — Review engine (≈ 1.5–2 weeks) — **critical path**

- [ ] `review.service.js`: intervals, ease factor, wrong reset, `next_review` datetime
- [ ] `POST /api/review/submit` updates `review_progress` + append `review_history`
- [ ] `GET /api/review/today` — due words + limits + ordering (wrong_count, next_review)
- [ ] `jobs/review.job.js` — nightly queue generation into `daily_review_queue`
- [ ] Optional: rating Again/Hard/Good/Easy mapping

### Phase F — 3-touch (≈ 1 week)

- [ ] `touch_history` read/update per user/word
- [ ] Business rule: all three touches true → eligible for “learned” / progression flags
- [ ] API endpoints as needed (e.g. `PATCH` touch steps or dedicated submit)

### Phase G — Error notebook (≈ 1 week)

- [ ] `error_notebook` CRUD; fields: type, wrong, corrected, repeat_count, fixed
- [ ] Optional: `error_tags`, `error_tag_map`
- [ ] Dashboard metrics: top repeated errors

### Phase H — Web admin React (≈ 2–4 weeks total, can overlap)

**Week 1 (UI spec):** layout + routes + sidebar  
**Week 2:** dashboard + vocabulary (table, form, search, pagination)  
**Week 3:** review queue page + error notebook  
**Week 4:** topics + auth UI + axios interceptor  

Extra production items:

- [ ] Bulk CSV import (word, meaning, topic)
- [ ] Ant Design Table where heavy data

### Phase I — Flutter mobile (≈ 3–5 weeks)

**Week 1:** splash, auth, home “today mission”  
**Week 2:** review card flow (PageView / swipe), 4 difficulty buttons  
**Week 3:** 3-touch screens (recognize → type → sentence)  
**Week 4:** error notebook  
**Week 5:** topic daily + speaking stub + daily summary  

Tech: Riverpod, Dio, optional Hive later.

### Phase J — AI rule engine (≈ 2+ weeks, after core stable)

- [ ] `src/ai/` modules: priority, false-master heuristic, error patterns (rule-based)
- [ ] `POST /api/ai/generate-today-plan` (JSON plan: topic, counts, mistake_focus)
- [ ] No LLM required for Phase J.1

### Phase K — Stretch

- [ ] `streak_tracking`, heatmap UI
- [ ] `weak_word_detector` table + boosting
- [ ] `confusion_pairs` / pair confusion boosting
- [ ] Speaking/writing records, `ai_feedback`
- [ ] LLM sentence correction (Phase 2+)

---

## 2. Eight-week “code roadmap” (from MY LEARN E open-source doc)

| Week | Focus |
|------|--------|
| 1 | DB + auth |
| 2 | Vocabulary CRUD |
| 3 | Review engine |
| 4 | Touch engine |
| 5 | Error notebook |
| 6 | Flutter mobile sync |
| 7 | Dashboard |
| 8 | AI correction |

**Note:** Specs also suggest **API before heavy UI**; weeks 6–7 can swap if web admin is prioritized over mobile.

---

## 3. Full granular checklist (copy-paste)

### Infrastructure

- [ ] Node LTS, `npm`/`pnpm` lockfile
- [ ] Backend scripts: `dev`, `start`, `migrate`
- [ ] MySQL 8+ local or Docker

### Backend modules

- [ ] `routes/auth.route.js`
- [ ] `routes/vocabulary.route.js`
- [ ] `routes/review.route.js`
- [ ] `routes/error.route.js`
- [ ] Matching controllers, services, repositories
- [ ] `validators/` for each resource
- [ ] `constants/` intervals, review modes enum

### Review domain

- [ ] `calculateNextReview` + ease factor + response time hook (optional)
- [ ] `review_history` insert on each submit
- [ ] Daily cap (e.g. max 20–30 items) for “today”

### Mobile contract

- [ ] Same DTOs as web; document field names (`snake_case` JSON vs camelCase — **pick one API convention and document**; many teams use camelCase in JSON with Sequelize `underscored: true`)

### Quality

- [ ] No secrets in repo
- [ ] Lint + format on backend/frontend
- [ ] Smoke test script or Postman collection (optional)

---

## 4. DB tables — full 24-table vision (later migrations)

Remaining tables from production doc (add incrementally): `collocations`, `word_family`, `error_tags`, `error_tag_map`, `streak_tracking`, `speaking_records`, `writing_records`, `ai_feedback`, `weak_word_detector`, etc.

---

## 5. Success criteria (MVP “done”)

1. User can register/login.
2. User can add words and see them in admin.
3. User completes reviews; **next_review** and **history** update correctly.
4. “Today” returns a deterministic, ordered queue.
5. Error notebook stores and lists personal mistakes.
6. Mobile or web can run through **one full day** of learning without manual DB edits.
