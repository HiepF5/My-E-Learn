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

- [x] `users` model; bcrypt hash; JWT sign/verify
- [x] `middlewares/auth.middleware.js` — Bearer token
- [x] Routes: register, login
- [x] Protect vocabulary/review/errors routes

### Phase D — Vocabulary & content (≈ 1 week)

- [x] CRUD vocabulary; link topics via map table
- [x] Validators for create/update
- [x] Optional: `collocations`, `word_family` (later phase)

### Phase E — Review engine (≈ 1.5–2 weeks) — **critical path**

- [x] `review.service.js`: intervals, ease factor, wrong reset, `next_review` datetime
- [x] `POST /api/review/submit` updates `review_progress` + append `review_history`
- [x] `GET /api/review/today` — due words + limits + ordering (wrong_count, next_review)
- [x] `jobs/review.job.js` — nightly queue generation into `daily_review_queue`
- [x] Optional: rating Again/Hard/Good/Easy mapping

### Phase F — 3-touch (≈ 1 week)

- [x] `touch_history` read/update per user/word
- [x] Business rule: all three touches true → eligible for “learned” / progression flags
- [x] API endpoints as needed (e.g. `PATCH` touch steps or dedicated submit)

### Phase G — Error notebook (≈ 1 week)

- [x] `error_notebook` CRUD; fields: type, wrong, corrected, repeat_count, fixed
- [x] Optional: `error_tags`, `error_tag_map`
- [x] Dashboard metrics: top repeated errors

### Phase H — Web admin React (≈ 2–4 weeks total, can overlap)

**Week 1 (UI spec):** layout + routes + sidebar  
**Week 2:** dashboard + vocabulary (table, form, search, pagination)  
**Week 3:** review queue page + error notebook  
**Week 4:** topics + auth UI + axios interceptor  

Extra production items:

- [x] Bulk CSV import (word, meaning, topic)
- [x] Ant Design Table where heavy data

### Phase I — Flutter mobile (≈ 3–5 weeks)

**Week 1:** splash, auth, home “today mission”  
**Week 2:** review card flow (PageView / swipe), 4 difficulty buttons  
**Week 3:** 3-touch screens (recognize → type → sentence)  
**Week 4:** error notebook  
**Week 5:** topic daily + speaking stub + daily summary  

Tech: Riverpod, Dio, optional Hive later.

- [x] Week 1 scaffold: splash, auth, home "today mission"
- [x] Week 2 scaffold: review card flow + rating buttons
- [x] Week 3 scaffold: 3-touch review guidance screen
- [x] Week 4 scaffold: error notebook screen
- [x] Week 5 scaffold: topic + daily summary screen
- [x] Phase I+ productionize: secure token persistence, API base URL via flavor, Hive offline cache fallback

### Phase J — AI rule engine (≈ 2+ weeks, after core stable)

- [x] `src/ai/` modules: priority, false-master heuristic, error patterns (rule-based)
- [x] `POST /api/ai/generate-today-plan` (JSON plan: topic, counts, mistake_focus)
- [x] No LLM required for Phase J.1

### Phase K — Stretch

- [ ] `streak_tracking`, heatmap UI (**backend API done; UI pending**)
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

- [x] Node LTS, `npm`/`pnpm` lockfile
- [x] Backend scripts: `dev`, `start`, `migrate`
- [x] MySQL 8+ local or Docker

### Backend modules

- [x] `routes/auth.route.js`
- [x] `routes/vocabulary.route.js`
- [x] `routes/review.route.js`
- [x] `routes/error.route.js`
- [x] `routes/topics.route.js` (implemented as `routes/topic.route.js`)
- [x] `routes/ai.route.js` (Phase J — `POST /api/ai/generate-today-plan`)
- [x] Matching controllers, services, repositories
- [x] `validators/` for each resource
- [x] `constants/` intervals, review modes enum

### Review domain

- [x] `calculateNextReview` + ease factor + response time hook (optional)
- [x] `review_history` insert on each submit
- [x] Daily cap (e.g. max 20–30 items) for “today”

### Mobile contract

- [x] Same DTOs as web; document field names (`snake_case` JSON vs camelCase — **pick one API convention and document**; many teams use camelCase in JSON with Sequelize `underscored: true`)
- [x] Convention chot: **API JSON dung `snake_case`** cho request/response (vd: `word_id`, `topic_name`, `error_type`, `review_mode`).
- [x] Client contract:
  - **React web-admin**: su dung field `snake_case` truc tiep tu API, khong doi key sang camelCase.
  - **Flutter mobile**: parse map `snake_case` truc tiep trong model/service.

### Quality

- [x] No secrets in repo
- [x] Lint + format on backend/frontend
- [x] Smoke test script or Postman collection (optional)
  - Script: `backend/scripts/smoke-test.js`
  - Run: `cd backend && npm run smoke`
  - Optional auth checks: set `SMOKE_USERNAME` + `SMOKE_PASSWORD` (and optional `SMOKE_BASE_URL`)

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

---

## 6. Notes — items added beyond original roadmap

- [x] Added project-level `.gitignore` (includes `node_modules/`, `.env*`, logs).
- [x] Added OpenAPI 3.0 spec at `backend/src/docs/openapi.yaml`.
- [x] Added Swagger UI endpoint at `GET /api/docs`.
- [x] Added OpenAPI JSON endpoint at `GET /api/openapi.json`.
- [x] Added API-doc rule in `.cursor/rules/agent-memory-workflow.mdc`:
  implementation of API is not complete until OpenAPI/Swagger is updated.
- [x] Added `nodemon` and switched backend `dev` script to auto-reload.

---

## 7. Checklist ưu tiên tiếp theo (cao → thấp)

Các mục **ở trên ưu tiên hơn**; tick khi hoàn thành.

### P1 — Làm trước (nền tảng sản phẩm)

- [x] **Topics end-to-end**: API CRUD `topics` (list/create/update/delete) + liên kết `vocabulary_topic_map`; Web admin **Topic Manager** đầy đủ (thay trang scaffold).
- [x] **Đồng bộ checklist §3** (Infrastructure / Backend modules / Review domain / Quality) với code thực tế — cập nhật tick `[x]` hoặc ghi chú “đã có ở …”.
- [x] **Chuẩn hóa API JSON**: chọn một convention (`snake_case` hoặc `camelCase` cho body/response) + cập nhật `openapi.yaml` + ghi rõ cho Flutter/React.

### P2 — Chất lượng & vận hành

- [x] **Quality**: ESLint/Prettier cho `backend` + `web-admin`; tùy chọn `flutter analyze` cho `mobile-app`.
- [x] **CI**: pipeline chạy lint + build (ít nhất web-admin + backend).
- [x] **Secrets**: đảm bảo `.env` không vào git; chỉ `.env.example` trong repo.
- [x] **Smoke test**: script hoặc Postman/Thunder collection bám OpenAPI (tùy chọn nhưng nên có).

### P3 — Tính năng lõi tiếp theo

- [x] **Review**: daily cap rõ ràng (ví dụ max 20–30) + tài liệu hành vi; (tuỳ chọn) hook `response_time_ms` trong thuật toán.
- [x] **Phase J**: `backend/src/ai/` rule-based (priority, false-master, error patterns) + `POST /api/ai/generate-today-plan` + OpenAPI.
- [x] **Mobile**: màn **3-touch** thật (Recognize → Type → Sentence) gọi `/api/review/touch/...`; queue sync khi có mạng.

### P4 — Mở rộng & production

- [ ] **Phase K**: `streak_tracking` + heatmap UI (**backend API done; UI pending**); `weak_word_detector`; `confusion_pairs`; speaking/writing + `ai_feedback`.
- [ ] **LLM** (sau rule engine): sửa câu / gợi ý — chỉ khi Phase J ổn.
- [x] **Deploy**: Docker Compose (MySQL + API), CORS theo domain production, biến môi trường staging/prod.
