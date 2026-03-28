# Audit: bảng doc vs migration repo

Đối chiếu [FULL DATABASE PRODUCTION VERSION.md](FULL%20DATABASE%20PRODUCTION%20VERSION.md) (20 bảng đánh số I–VII) với `database/migrations/`.

## 20 bảng trong doc — trạng thái trong repo

| # | Bảng doc | Migration |
|---|----------|-----------|
| 1 | `users` | `20260327100000-create-phase-b-schema.js` |
| 2 | `user_settings` | cùng phase-b |
| 3 | `topics` | cùng phase-b |
| 4 | `vocabulary` | cùng phase-b |
| 5 | `vocabulary_topic_map` | cùng phase-b |
| 6 | `collocations` | `20260327103000-add-collocations-and-word-family.js` |
| 7 | `word_family` | cùng migration collocations |
| 8 | `review_progress` | phase-b + cột `fake_known_count` trong `20260328140000-add-ai-error-pattern-and-fake-known.js` |
| 9 | `review_history` | phase-b + cột `selected_word_id` trong `20260328131000-add-review-history-selected-word-id.js` |
| 10 | `touch_history` | phase-b |
| 11 | `daily_review_queue` | phase-b |
| 12 | `error_notebook` | phase-b |
| 13 | `error_tags` | `20260327104000-add-error-tags.js` |
| 14 | `error_tag_map` | cùng error-tags |
| 15 | `daily_learning_log` | phase-b |
| 16 | `streak_tracking` | `20260328120000-add-streak-tracking.js` |
| 17 | `speaking_records` | `20260328132000-add-speaking-writing-ai-feedback.js` |
| 18 | `writing_records` | cùng speaking-writing |
| 19 | `ai_feedback` | cùng speaking-writing |
| 20 | `weak_word_detector` | `20260328130000-add-weak-word-detector.js` |

## Bảng bổ sung ngoài doc gốc (mở rộng)

| Bảng | Mục đích |
|------|----------|
| `ai_error_patterns` | `20260328140000-add-ai-error-pattern-and-fake-known.js` — pattern lỗi học viên cho AI plan |

## Bảng bổ sung (roadmap đã migrate)

| Bảng | Migration |
|------|-----------|
| `user_device_tokens` | `20260328151000-add-user-device-tokens.js` |
| `confusion_pairs` | `20260328152000-add-confusion-pairs-materialized.js` |
| `sentence_mining_entries`, `shadowing_sessions`, `grammar_micro_logs`, `dictation_attempts`, `knowledge_graph_edges`, `whisper_transcripts` | `20260328153000-extended-learning-and-knowledge-graph.js` |

API: `/api/devices/tokens`, `/api/vocabulary/sync`, `/api/learning/*`, `/api/ai/correct-sentence`, `/api/ai/topics-llm`, `/api/ai/transcribe`, `/api/ai/pronunciation-score`.

Cập nhật file này khi thêm migration mới.
