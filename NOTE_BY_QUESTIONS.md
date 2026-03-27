# MY LEARN E - Note theo tung cau hoi

Muc dich: ghi lai nhung yeu cau ban da giao va nhung gi da duoc tao/sua de de tong hop.

> Quy uoc:
> - Trang thai: DONE / PARTIAL / BLOCKED
> - Chi liet ke thay doi thuc te da duoc tao/sua

---

## 01) "Doc toan bo file MD... tao 1 bo skill agent"

- Trang thai: DONE
- Da lam:
  - Doc cac file MD trong repo.
  - Tao bo skill agent cho du an.
- Files tao/sua:
  - `.cursor/skills/my-learn-e-project/SKILL.md`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`

---

## 02) "Thuc hien phase A Git: main / develop / feature/*"

- Trang thai: DONE
- Da lam:
  - Khoi tao git branch flow.
  - Co cac nhanh: `main`, `develop`, `feature/bootstrap`.

---

## 03) "Tao bo ghi nho rule... chua ro phai hoi lai, xong viec phai danh dau"

- Trang thai: DONE
- Da lam:
  - Tao rule always apply cho Cursor.
- Files tao/sua:
  - `.cursor/rules/agent-memory-workflow.mdc`

---

## 04) "Them shell/git/fetch trong mcp"

- Trang thai: DONE (huong dan cau hinh) + NOTE loi package git MCP
- Da lam:
  - Huong dan block `mcp.json`.
  - Phan tich log loi: `@modelcontextprotocol/server-git` bi 404 npm.
- Ghi chu:
  - De xuat dung `shell` va GitLens MCP cho thao tac git.

---

## 05) "Lam 4 muc con lai cua Phase A (khong lam muc backend)"

- Trang thai: DONE
- Da lam:
  - Tao `config/database.js`
  - Tao `.env.example`
  - Tao error middleware
  - Tao thu muc migration
- Files tao/sua:
  - `backend/src/config/database.js`
  - `.env.example`
  - `backend/src/middlewares/error.middleware.js`
  - `database/migrations/.gitkeep`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 06) "Tao gitignore loai bo node_modules"

- Trang thai: DONE
- Da lam:
  - Tao `.gitignore` bo qua `node_modules`, `.env*`, logs, file rac he dieu hanh.
- Files tao/sua:
  - `.gitignore`

---

## 07) "Lam tiep muc backend trong Phase A"

- Trang thai: DONE
- Da lam:
  - Scaffold backend co Express + Helmet + CORS + Morgan + JSON body.
  - Them `health` endpoint.
- Files tao/sua:
  - `backend/package.json`
  - `backend/src/app.js`
  - `backend/src/server.js`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 08) "Phase B DB (Sequelize, option C)"

- Trang thai: DONE
- Da lam:
  - Tao migration schema 11 bang + index toi thieu.
  - Cai `sequelize`, `mysql2`, `sequelize-cli`.
  - Them script migrate.
  - Chay migrate thanh cong.
- Files tao/sua:
  - `database/migrations/20260327100000-create-phase-b-schema.js`
  - `database/migrations/20260327101000-add-phase-b-indexes.js`
  - `backend/config/config.js`
  - `backend/package.json`
  - `.env` (tao theo thong tin DB ban cung cap)
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 09) "Phase C Auth"

- Trang thai: DONE
- Da lam:
  - User model + auth service (`bcrypt`, `jwt`).
  - Bearer auth middleware.
  - Route `register/login`.
  - Protect route: vocabulary/review/errors.
- Files tao/sua:
  - `backend/src/models/user.model.js`
  - `backend/src/repositories/user.repository.js`
  - `backend/src/services/auth.service.js`
  - `backend/src/controllers/auth.controller.js`
  - `backend/src/middlewares/auth.middleware.js`
  - `backend/src/routes/auth.route.js`
  - `backend/src/routes/vocabulary.route.js`
  - `backend/src/routes/review.route.js`
  - `backend/src/routes/error.route.js`
  - `backend/src/app.js`
  - `backend/package.json`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 10) "Moi API phai co Swagger + OpenAPI 3.0"

- Trang thai: DONE
- Da lam:
  - Tao OpenAPI 3.0 spec.
  - Bat Swagger UI va endpoint JSON spec.
  - Cap nhat rule bat buoc API docs.
- Files tao/sua:
  - `backend/src/docs/openapi.yaml`
  - `backend/src/app.js` (`/api/docs`, `/api/openapi.json`)
  - `.cursor/rules/agent-memory-workflow.mdc`

---

## 11) "Toi muon dung nodemon"

- Trang thai: DONE
- Da lam:
  - Cai `nodemon`.
  - Script `dev` dung nodemon.
- Files tao/sua:
  - `backend/package.json`

---

## 12) "Phase D Vocabulary & content lam tiep"

- Trang thai: DONE
- Da lam (bat buoc):
  - CRUD vocabulary.
  - Link topic qua `vocabulary_topic_map`.
  - Validators create/update.
- Da lam (optional):
  - `collocations` + `word_family` (migration + API + docs).
- Files tao/sua:
  - `backend/src/models/vocabulary.model.js`
  - `backend/src/models/vocabulary-topic-map.model.js`
  - `backend/src/repositories/vocabulary.repository.js`
  - `backend/src/services/vocabulary.service.js`
  - `backend/src/controllers/vocabulary.controller.js`
  - `backend/src/validators/vocabulary.validator.js`
  - `backend/src/routes/vocabulary.route.js`
  - `database/migrations/20260327103000-add-collocations-and-word-family.js`
  - `backend/src/models/collocation.model.js`
  - `backend/src/models/word-family.model.js`
  - `backend/src/repositories/content.repository.js`
  - `backend/src/services/content.service.js`
  - `backend/src/controllers/content.controller.js`
  - `backend/src/validators/content.validator.js`
  - `backend/src/docs/openapi.yaml` (update them path/schema moi)
  - `backend/config/config.js` (fix load `.env` khi migrate)
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 13) "Note lai nhung gi them moi chua co trong tai lieu"

- Trang thai: DONE
- Da lam:
  - Them section notes ngoai roadmap trong file roadmap.
- Files tao/sua:
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`

---

## 14) "Phase E - Review engine (critical path)"

- Trang thai: DONE
- Da lam:
  - Tao `review.service.js` voi interval, ease_factor, reset khi sai, cap nhat `next_review`.
  - Tao `POST /api/review/submit` de cap nhat `review_progress` va ghi `review_history`.
  - Tao `GET /api/review/today` voi due items, support `limit`, sap xep `wrong_count DESC`, `next_review ASC`.
  - Tao `jobs/review.job.js` chay hang ngay 00:00 de tao `daily_review_queue`.
  - Da ho tro optional rating mapping: `Again/Hard/Good/Easy`.
  - Cap nhat OpenAPI/Swagger cho review endpoints.
- Files tao/sua:
  - `backend/src/models/review-progress.model.js`
  - `backend/src/models/review-history.model.js`
  - `backend/src/models/daily-review-queue.model.js`
  - `backend/src/repositories/review.repository.js`
  - `backend/src/services/review.service.js`
  - `backend/src/controllers/review.controller.js`
  - `backend/src/validators/review.validator.js`
  - `backend/src/routes/review.route.js`
  - `backend/src/jobs/review.job.js`
  - `backend/src/server.js`
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 15) "Phase F - 3-touch"

- Trang thai: DONE
- Da lam:
  - Tao `touch_history` read/update theo `user_id + word_id`.
  - Implement business rule: du 3 touch (`touch1_done && touch2_done && touch3_done`) thi
    tra `eligible_for_learned = true`.
  - Them API endpoints:
    - `GET /api/review/touch/:wordId`
    - `PATCH /api/review/touch/:wordId` (body `touch_step`, `done`)
  - Cap nhat OpenAPI 3.0 + Swagger cho 3-touch endpoints.
- Files tao/sua:
  - `backend/src/models/touch-history.model.js`
  - `backend/src/repositories/touch.repository.js`
  - `backend/src/services/touch.service.js`
  - `backend/src/controllers/touch.controller.js`
  - `backend/src/validators/touch.validator.js`
  - `backend/src/routes/review.route.js`
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 16) "Phase G - Error notebook"

- Trang thai: DONE (bat buoc) / PARTIAL (optional tags)
- Da lam:
  - Implement `error_notebook` CRUD day du field:
    `error_type`, `wrong_text`, `corrected_text`, `repeat_count`, `fixed`, `explanation`.
  - Them dashboard metric endpoint top repeated errors:
    `GET /api/errors/top-repeated?limit=...`.
  - Them endpoint thao tac:
    - `GET /api/errors`
    - `POST /api/errors`
    - `PUT /api/errors/:id`
    - `PATCH /api/errors/:id/fixed`
    - `PATCH /api/errors/:id/repeat`
    - `DELETE /api/errors/:id`
  - Cap nhat OpenAPI 3.0 + Swagger cho tat ca endpoints tren.
- Chua lam:
  - Khong con (optional tags da duoc lam o muc 17).
- Files tao/sua:
  - `backend/src/models/error-notebook.model.js`
  - `backend/src/repositories/error.repository.js`
  - `backend/src/services/error.service.js`
  - `backend/src/controllers/error.controller.js`
  - `backend/src/validators/error.validator.js`
  - `backend/src/routes/error.route.js`
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick checklist)

---

## 17) "Optional: error_tags, error_tag_map"

- Trang thai: DONE
- Da lam:
  - Tao migration cho bang `error_tags` va `error_tag_map`.
  - Tao model/repository/service/controller/validator cho tags.
  - Them API:
    - `GET /api/errors/tags`
    - `POST /api/errors/tags`
    - `GET /api/errors/:id/tags`
    - `PUT /api/errors/:id/tags`
  - Chay migrate thanh cong.
  - Cap nhat OpenAPI/Swagger cho tags API.
  - Tick checklist optional trong Phase G.
- Files tao/sua:
  - `database/migrations/20260327104000-add-error-tags.js`
  - `backend/src/models/error-tag.model.js`
  - `backend/src/models/error-tag-map.model.js`
  - `backend/src/repositories/error-tag.repository.js`
  - `backend/src/services/error.service.js`
  - `backend/src/controllers/error.controller.js`
  - `backend/src/validators/error.validator.js`
  - `backend/src/routes/error.route.js`
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`

---

## 18) "Phase H - Web admin React"

- Trang thai: DONE (MVP scaffold + pages + extras)
- Da lam:
  - Scaffold `web-admin` voi React + Vite.
  - Week 1: layout + routes + sidebar + auth guard + login page + axios interceptor.
  - Week 2: dashboard + vocabulary manager (table/form/search/pagination).
  - Week 3: review queue page + error notebook page.
  - Week 4: topic page scaffold.
  - Extra:
    - Bulk CSV import (word, meaning, topic IDs)
    - Ant Design Table cho man hinh du lieu nang.
  - Build web-admin thanh cong.
- Files tao/sua:
  - `web-admin/package.json`
  - `web-admin/vite.config.js`
  - `web-admin/index.html`
  - `web-admin/src/main.jsx`
  - `web-admin/src/App.jsx`
  - `web-admin/src/styles.css`
  - `web-admin/src/services/api.js`
  - `web-admin/src/layouts/AdminLayout.jsx`
  - `web-admin/src/routes/index.jsx`
  - `web-admin/src/pages/LoginPage.jsx`
  - `web-admin/src/pages/DashboardPage.jsx`
  - `web-admin/src/pages/VocabularyPage.jsx`
  - `web-admin/src/pages/ReviewPage.jsx`
  - `web-admin/src/pages/ErrorPage.jsx`
  - `web-admin/src/pages/TopicPage.jsx`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md` (tick extras)

---

## 19) "Tiep (Phase I - Flutter mobile)"

- Trang thai: DONE (scaffold MVP)
- Da lam:
  - Tao `mobile-app` Flutter project scaffold.
  - Dung `Riverpod + Dio + go_router`.
  - Flow co san:
    - Splash -> Login -> Home
    - Review screen (rating Again/Hard/Good/Easy + submit)
    - Error notebook screen
    - Topic screen
    - Daily summary screen
    - Profile + logout
  - Tao reusable bottom navigation + progress card.
  - Cap nhat roadmap tick cho Week 1-5 (scaffold level).
- Files tao/sua:
  - `mobile-app/pubspec.yaml`
  - `mobile-app/lib/main.dart`
  - `mobile-app/lib/routes/app_router.dart`
  - `mobile-app/lib/providers/auth_provider.dart`
  - `mobile-app/lib/services/api_client.dart`
  - `mobile-app/lib/services/review_service.dart`
  - `mobile-app/lib/models/review_item.dart`
  - `mobile-app/lib/widgets/app_bottom_nav.dart`
  - `mobile-app/lib/widgets/today_progress_card.dart`
  - `mobile-app/lib/screens/splash/splash_screen.dart`
  - `mobile-app/lib/screens/auth/login_screen.dart`
  - `mobile-app/lib/screens/home/home_screen.dart`
  - `mobile-app/lib/screens/review/review_screen.dart`
  - `mobile-app/lib/screens/error_note/error_notebook_screen.dart`
  - `mobile-app/lib/screens/topic/topic_screen.dart`
  - `mobile-app/lib/screens/summary/daily_summary_screen.dart`
  - `mobile-app/lib/screens/profile/profile_screen.dart`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`

---

## 20) "Productionize mobile (secure token + flavor env + Hive cache)"

- Trang thai: DONE
- Da lam:
  - Them secure token persistence bang `flutter_secure_storage`.
  - Auth bootstrap luc app start: tu dong doc token, set Bearer token, giu session.
  - Them API base URL theo build flavor qua `--dart-define`:
    `API_BASE_URL`.
  - Them Hive offline cache fallback cho:
    - review queue (`review_today`)
    - error notebook (`errors_list`)
  - Chinh router redirect de doi auth bootstrap (`isReady`) truoc khi dieu huong.
  - Cap nhat roadmap them dong Phase I+ productionize da hoan thanh.
- Files tao/sua:
  - `mobile-app/pubspec.yaml`
  - `mobile-app/lib/config/app_env.dart`
  - `mobile-app/lib/services/secure_storage_service.dart`
  - `mobile-app/lib/services/cache_service.dart`
  - `mobile-app/lib/services/api_client.dart`
  - `mobile-app/lib/providers/auth_provider.dart`
  - `mobile-app/lib/services/review_service.dart`
  - `mobile-app/lib/services/error_service.dart`
  - `mobile-app/lib/routes/app_router.dart`
  - `mobile-app/lib/main.dart`
  - `mobile-app/lib/screens/splash/splash_screen.dart`
  - `mobile-app/lib/screens/home/home_screen.dart`
  - `mobile-app/lib/screens/review/review_screen.dart`
  - `mobile-app/lib/screens/error_note/error_notebook_screen.dart`
  - `mobile-app/lib/screens/profile/profile_screen.dart`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`

---

## 23) "Dọn dist ve trang thai truoc build va tiep tuc P1.3"

- Trang thai: DONE
- Da lam:
  - Don `web-admin/dist` ve trang thai truoc khi chay build (xoa artifact moi sinh).
  - Tiep tuc P1.3 va chot convention API JSON: **snake_case**.
  - Cap nhat OpenAPI de ghi ro convention cho request/response.
  - Cap nhat roadmap/checklist: danh dau xong muc P1.3 va ghi ro contract cho React/Flutter.
- Files tao/sua:
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 24) "@reference-roadmap lam tiep"

- Trang thai: DONE (P2.1)
- Da lam:
  - Tiep tuc theo roadmap, chon muc uu tien cao nhat chua xong: **P2.1 Quality**.
  - Setup ESLint + Prettier cho `backend` va `web-admin`.
  - Them script `lint`, `lint:fix`, `format`, `format:check` vao ca hai package.
  - Them config:
    - `backend/eslint.config.cjs`
    - `web-admin/eslint.config.js`
    - `.prettierrc.json`
    - `.prettierignore`
  - Chay `npm run lint` cho ca `backend` va `web-admin` thanh cong.
  - Cap nhat roadmap: tick xong `Lint + format on backend/frontend` va `P2 Quality`.
- Files tao/sua:
  - `backend/package.json`
  - `backend/eslint.config.cjs`
  - `web-admin/package.json`
  - `web-admin/eslint.config.js`
  - `.prettierrc.json`
  - `.prettierignore`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 25) "Lam tiep roadmap - P2.2 CI"

- Trang thai: DONE
- Da lam:
  - Them GitHub Actions CI cho `backend` va `web-admin`.
  - Pipeline chay khi `push`/`pull_request` vao `main`, `develop`.
  - Backend job: `npm ci` + `npm run lint`.
  - Web-admin job: `npm ci` + `npm run lint` + `npm run build`.
  - Verify secrets: check tracked env files, ket qua chi co `.env.example`.
  - Cap nhat roadmap: tick xong muc P2.2 (CI).
  - Cap nhat roadmap: tick xong muc P2.3 (Secrets).
- Files tao/sua:
  - `.github/workflows/ci.yml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 26) "Tiep tuc roadmap - P2.4 smoke test"

- Trang thai: DONE
- Da lam:
  - Them smoke test script backend: `backend/scripts/smoke-test.js`.
  - Them npm script: `backend/package.json` -> `npm run smoke`.
  - Smoke test check:
    - `GET /health`
    - `GET /api/openapi.json`
    - Auth checks (optional) neu set `SMOKE_USERNAME` + `SMOKE_PASSWORD`:
      - `POST /api/auth/login`
      - `GET /api/topics`
      - `GET /api/review/today?limit=1`
  - Da chay `npm run smoke` thanh cong (public checks pass, auth checks skip vi chua set env test user).
  - Cap nhat roadmap: tick xong P2.4 Smoke test.
- Files tao/sua:
  - `backend/scripts/smoke-test.js`
  - `backend/package.json`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 27) "Tiep tuc roadmap - P3.1 review cap va behavior"

- Trang thai: DONE
- Da lam:
  - Tao constants review: `backend/src/constants/review.constants.js`
    - `REVIEW_LIMIT` (default=30, min=1, max=100)
    - `INTERVALS`, `RATING_MAP`
    - `ALLOWED_RATINGS`, `ALLOWED_REVIEW_MODES`
  - Refactor `review.service.js` su dung constants de minh bach daily cap.
  - Bo sung optional hook `response_time_ms` vao tinh ease factor:
    - correct <= 2500ms: `+0.03`
    - correct >= 15000ms: `-0.03`
  - Cap nhat `review.validator.js` validate `review_mode` theo enum.
  - Cap nhat OpenAPI:
    - `GET /api/review/today` mo ta daily cap + default 30 + behavior clamp 1..100
    - `ReviewSubmitRequest.review_mode` enum
    - `ReviewSubmitRequest.response_time_ms` behavior note
  - Cap nhat roadmap: tick xong P3.1 va checklist constants.
- Files tao/sua:
  - `backend/src/constants/review.constants.js`
  - `backend/src/services/review.service.js`
  - `backend/src/validators/review.validator.js`
  - `backend/src/docs/openapi.yaml`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 28) "P3.2 Phase J - AI rule engine"

- Trang thai: DONE
- Da lam:
  - Them module rule-based trong `backend/src/ai/`:
    - `priority.js` — diem uu tien tu `review_progress`
    - `false-master.js` — heuristic "hoc nham nhung van sai"
    - `error-patterns.js` — `mistake_focus` tu error notebook
    - `plan-generator.js` — ghep plan JSON
  - Them `POST /api/ai/generate-today-plan` (JWT), body optional: `daily_target_words`, `review_cap`
  - Service: `backend/src/services/ai.service.js`; controller, validator, route
  - Mo rong repo: `review.repository.findProgressByUser`, `vocabulary.repository.countWordsPerTopic`
  - Cap nhat OpenAPI (tag AI + schemas)
  - Smoke test: them check `/api/ai/generate-today-plan` khi co `SMOKE_USERNAME`/`SMOKE_PASSWORD`
  - Cap nhat roadmap: Phase J + P3 Phase J
- Files tao/sua:
  - `backend/src/ai/priority.js`
  - `backend/src/ai/false-master.js`
  - `backend/src/ai/error-patterns.js`
  - `backend/src/ai/plan-generator.js`
  - `backend/src/services/ai.service.js`
  - `backend/src/controllers/ai.controller.js`
  - `backend/src/validators/ai.validator.js`
  - `backend/src/routes/ai.route.js`
  - `backend/src/app.js`
  - `backend/src/repositories/review.repository.js`
  - `backend/src/repositories/vocabulary.repository.js`
  - `backend/src/docs/openapi.yaml`
  - `backend/scripts/smoke-test.js`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 29) "Tiep tuc roadmap - P3.3 mobile 3-touch that"

- Trang thai: DONE
- Da lam:
  - Cap nhat `ReviewScreen` thanh flow 3-touch that:
    - Step 1: Recognize
    - Step 2: Type
    - Step 3: Sentence
  - Goi backend touch API:
    - `GET /api/review/touch/:wordId`
    - `PATCH /api/review/touch/:wordId`
  - Chi cho phep cham diem `Again/Hard/Good/Easy` sau khi xong ca 3 step.
  - Them queue sync khi offline/online trong `ReviewService`:
    - pending `review/submit`
    - pending `review/touch` patch
    - auto sync khi load `getTodayReview`.
  - Cap nhat roadmap tick xong P3 mobile.
- Files tao/sua:
  - `mobile-app/lib/models/touch_history_item.dart`
  - `mobile-app/lib/services/review_service.dart`
  - `mobile-app/lib/screens/review/review_screen.dart`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## 30) "Chuyen P4 - Deploy nho (Docker Compose + env/CORS)"

- Trang thai: DONE
- Da lam:
  - Them deploy baseline bang Docker Compose:
    - `mysql` (MySQL 8) + volume `mysql_data`
    - `backend` build tu `backend/Dockerfile`
  - Backend ho tro CORS theo env:
    - `CORS_ORIGIN` nhan danh sach domain phan tach boi dau phay
    - mac dinh `*` cho local
  - Mo rong env:
    - `.env.example` them `DB_PORT`, `CORS_ORIGIN`
    - `database.js` doc `DB_PORT`
  - Them file deploy:
    - `docker-compose.yml`
    - `backend/Dockerfile`
    - `backend/.dockerignore`
  - Cap nhat roadmap: tick Deploy trong P4.
- Files tao/sua:
  - `docker-compose.yml`
  - `backend/Dockerfile`
  - `backend/.dockerignore`
  - `backend/src/app.js`
  - `backend/src/config/database.js`
  - `.env.example`
  - `.cursor/skills/my-learn-e-project/reference-roadmap.md`
  - `NOTE_BY_QUESTIONS.md`

---

## Cach su dung file note nay

- Moi yeu cau moi: them 1 section moi o cuoi file.
- Moi section nen co:
  - cau hoi/yeu cau
  - trang thai
  - da lam gi
  - file tao/sua

