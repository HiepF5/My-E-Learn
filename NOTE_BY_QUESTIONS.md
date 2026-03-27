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

## Cach su dung file note nay

- Moi yeu cau moi: them 1 section moi o cuoi file.
- Moi section nen co:
  - cau hoi/yeu cau
  - trang thai
  - da lam gi
  - file tao/sua

