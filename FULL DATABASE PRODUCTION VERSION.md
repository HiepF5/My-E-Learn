Tuyệt vời. Nếu bạn muốn dự án này **đi được 3–5 năm mà không phải đập DB làm lại**, thì database phải thiết kế theo kiểu:

> **MVP đơn giản ở bề mặt, nhưng lõi đủ chuẩn production** ⚙️📚

Với app **MY LEARN E**, kiến trúc DB nên chia thành 6 domain:

```text
1. User Domain
2. Learning Content Domain
3. Review Engine Domain
4. Error Tracking Domain
5. Activity Domain
6. AI / Future Expansion Domain
```

---

# I. Full Database Production Version (chuẩn production)

---

# Tổng số bảng khuyến nghị phase production:

```text
18 bảng lõi
+ 6 bảng mở rộng tương lai
= 24 bảng chuẩn production
```

---

# II. USER DOMAIN

---

# 1. users

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    learning_goal VARCHAR(255),
    level VARCHAR(20),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

# Vì sao cần:

* sau này multi-device
* profile cá nhân
* timezone review đúng giờ

---

---

# 2. user_settings

```sql
CREATE TABLE user_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    daily_target_words INT DEFAULT 10,
    review_reminder_time TIME,
    preferred_theme VARCHAR(50),
    notification_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

---

# III. CONTENT DOMAIN

---

# 3. topics

```sql
CREATE TABLE topics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    topic_name VARCHAR(100) NOT NULL,
    description TEXT,
    level VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 4. vocabulary

```sql
CREATE TABLE vocabulary (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    meaning TEXT,
    example_sentence TEXT,
    audio_url VARCHAR(255),
    image_url VARCHAR(255),
    difficulty INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 5. vocabulary_topic_map

```sql
CREATE TABLE vocabulary_topic_map (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    topic_id BIGINT,
    word_id BIGINT,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (word_id) REFERENCES vocabulary(id)
);
```

---

💡 vì 1 từ có thể thuộc nhiều topic.

---

---

# 6. collocations

```sql
CREATE TABLE collocations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    word_id BIGINT,
    collocation VARCHAR(255),
    example TEXT,
    FOREIGN KEY (word_id) REFERENCES vocabulary(id)
);
```

---

---

# 7. word_family

```sql
CREATE TABLE word_family (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    root_word_id BIGINT,
    related_word VARCHAR(100),
    relation_type VARCHAR(50),
    FOREIGN KEY (root_word_id) REFERENCES vocabulary(id)
);
```

---

---

# IV. REVIEW ENGINE DOMAIN

---

# 8. review_progress

```sql
CREATE TABLE review_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    word_id BIGINT,
    level INT DEFAULT 1,
    ease_factor DECIMAL(3,2) DEFAULT 2.5,
    interval_days INT DEFAULT 1,
    next_review DATETIME,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    last_review DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (word_id) REFERENCES vocabulary(id)
);
```

---

---

# 9. review_history

```sql
CREATE TABLE review_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    word_id BIGINT,
    answer_result BOOLEAN,
    response_time_ms INT,
    review_mode VARCHAR(50),
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 10. touch_history

```sql
CREATE TABLE touch_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    word_id BIGINT,
    touch1_done BOOLEAN DEFAULT FALSE,
    touch2_done BOOLEAN DEFAULT FALSE,
    touch3_done BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 11. daily_review_queue

```sql
CREATE TABLE daily_review_queue (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    word_id BIGINT,
    queue_date DATE,
    status VARCHAR(20) DEFAULT 'pending'
);
```

---

💡 bảng này cực mạnh:

review hôm nay load cực nhanh.

---

---

# V. ERROR NOTE DOMAIN (phần cực quan trọng)

---

# 12. error_notebook

```sql
CREATE TABLE error_notebook (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    error_type VARCHAR(50),
    wrong_text TEXT,
    corrected_text TEXT,
    explanation TEXT,
    repeat_count INT DEFAULT 1,
    fixed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 13. error_tags

```sql
CREATE TABLE error_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(50)
);
```

---

---

# 14. error_tag_map

```sql
CREATE TABLE error_tag_map (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    error_id BIGINT,
    tag_id BIGINT
);
```

---

---

# VI. ACTIVITY DOMAIN

---

# 15. daily_learning_log

```sql
CREATE TABLE daily_learning_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    learned_words INT DEFAULT 0,
    reviewed_words INT DEFAULT 0,
    mistakes_count INT DEFAULT 0,
    study_minutes INT DEFAULT 0,
    log_date DATE
);
```

---

---

# 16. streak_tracking

```sql
CREATE TABLE streak_tracking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    streak_days INT DEFAULT 0,
    last_active_date DATE
);
```

---

---

# 17. speaking_records

```sql
CREATE TABLE speaking_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    topic_id BIGINT,
    audio_url VARCHAR(255),
    transcript TEXT,
    score INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 18. writing_records

```sql
CREATE TABLE writing_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    topic_id BIGINT,
    original_text TEXT,
    corrected_text TEXT,
    score INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# VII. AI FUTURE DOMAIN

---

# 19. ai_feedback

```sql
CREATE TABLE ai_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    source_type VARCHAR(50),
    source_id BIGINT,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

---

# 20. weak_word_detector

```sql
CREATE TABLE weak_word_detector (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    word_id BIGINT,
    fail_score INT DEFAULT 0
);
```

---

---

# VIII. INDEX cực quan trọng production

---

# review_progress

```sql
CREATE INDEX idx_review_user_next 
ON review_progress(user_id, next_review);
```

---

# review_history

```sql
CREATE INDEX idx_review_history_user_word
ON review_history(user_id, word_id);
```

---

# error notebook

```sql
CREATE INDEX idx_error_user
ON error_notebook(user_id);
```

---

---

# IX. Quan hệ chuẩn production

![Image](https://images.openai.com/static-rsc-4/Sgv-ouLzgYXIGT8TqekWjOg0xiEguGu_DaYNjCh0k1qMrJlUPuDeZoZf9L448IcHtfOMdyAdARDdltaO4f24LTtzzpLXRFeP6Rd9q3sKhWIOGFwPxDfXdi-aqhOsEVBVanqT1NR0vhvJS0v-AX2eGjFLfRGSgyJZPJkvuw9V8EnJ8-AuCeY9ECT0DIylg0Fz?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/KFwM7Fr798Led5CQQQOzR_AckfilT51zGw3jLhwSOtxa5Rqw-9EcO0eBDmmDGgFrgCZzTEsT3mB7Wsg7y2AI0rPA0ofbbvj1MYb6FRd85v6yTNOl9-qGbrb9kkCL3k-77O5BrJPuVi3NtMXNim39YziPFuybeRrzlppFC0MImjDkfWkk1MXYY_5UGyVGhna9?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/I1dcPqUpuVDA0828LE6KxioI1sqfhXRJRKjZrr4W1z2nw7be2-e_yG3hIwbEq94K9dIunBydQGg0gYtl61obt93pvfMdh29C7vEExYvCWqihKerD665ZKWnU2aGtrgFQZaQzm6LfS0fFNWWW9DulNn5AzXHGbRfv8XwQgHlw4LKYwAeQgt-U5KNpWBw7ziTb?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/I9An5704u9J_sRtGPnKo3ZlC2CyKtEaApLpOcWcVRzskSdypgKgmpWUytuRZ7mW9OWX9AOoQE0Bip0_QlVCYrBm7b5PO_e8LLbOp9zLIGofZmycTPmCAEOkS7yYnd7YxPNosDvlnMUUeEIfUSh_wOwuW00wVKVTbCatjXWPWBm57PS6dvkluva7EBq9YpHmm?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/4LWy0mod6wA-i6ZIWjb4l05Oq5VxBbRkQhFkilBDB0NZ1CM315NwjxsSLix8FFbvb-RXxqbHiNTBd-0_PX261LDsKFOkdzpipolSK5C0bmQwU08lcC4Saik7zbtvcX1NEwGAkcVaWwCLLpr4KgxW3HaariGKdXMAKhswpRBQ20ttiij45xi6UAfxH4Q9bWyE?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/OtDTG4LuMDwZaram62P6JwtOnXi6hH1vN-9tBIHAHeM3jNH-Odx1dh5yjEtZGoEqgqchmoI5C91XwLUYRv24N9Ni0hqAL_nAHzZ4GbBgks3KboBXZof0e2WoHZ5nw0-6EHT5pn7tx31c28vsmcg-2L4eDKJQEy-PRz2x_JUz02cx0rDHITnGtlL_BC3VuEu0?purpose=fullsize)

---

```text
users
 ├── review_progress
 ├── review_history
 ├── error_notebook
 ├── speaking_records
 ├── writing_records

vocabulary
 ├── collocations
 ├── word_family
 ├── review_progress
```

---

---

# X. Production rule cực quan trọng

---

## Không xóa cứng dữ liệu

luôn có:

```sql
deleted_flag
```

hoặc:

```sql
status
```

---

## audit field luôn có:

```sql
created_at
updated_at
created_by
updated_by
```

---

---

# XI. Nếu build thật nên tách migration:

---

## folder:

```text
/database/migrations
```

---

## dùng:

Sequelize

hoặc:

Knex.js

---

---

# XII. Bản enterprise hơn nữa nên thêm:

---

## content versioning

## sync offline mobile

## import personal dictionary

## audio pronunciation cache

---

---

# XIII. Gợi ý cực chuẩn cho bạn hiện tại

---

## Phase 1 chỉ tạo 10 bảng:

vì 24 bảng quá lớn.

---

## Nên chạy thật:

```text
users
topics
vocabulary
review_progress
review_history
error_notebook
daily_learning_log
touch_history
daily_review_queue
user_settings
```

---

---

# XIV. Nếu muốn, bước tiếp theo cực giá trị:

## Tôi có thể viết tiếp:

### FULL EXPRESS BACKEND chuẩn production theo DB này

gồm:

✅ auth
✅ review engine
✅ vocabulary CRUD
✅ error notebook
✅ spaced repetition scheduler

👉 copy chạy được ngay 🔥
