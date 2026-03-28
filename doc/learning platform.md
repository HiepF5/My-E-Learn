Rất đúng — nếu làm **mobile + web học tập + admin** thì project của bạn bắt đầu có cấu trúc như một **learning platform hoàn chỉnh** 🌐📱🧠

Và quyết định đúng nhất là:

> **1 backend chung → 3 client riêng**

```text id="e7ylr5"
Backend API
├── Mobile Flutter
├── Web Client (Learner)
└── Web Admin (Management)
```

---

Điều này giúp:

* logic review dùng chung
* AI engine dùng chung
* role rõ ràng
* open source dễ scale

---

# I. FULL PRODUCT ARCHITECTURE CHUẨN

---

```text id="u4m38s"
Frontend/
├── mobile_flutter/
├── web_client_react/
├── web_admin_react/

Backend/
├── express_api/
├── ai_engine/
├── mysql/
```

---

## Stack giữ nguyên:

* React
* Flutter
* Express.js
* MySQL

---

---

# II. ROLE LOGIN SYSTEM (rất nên làm ngay từ đầu)

---

## Role chuẩn production:

```text id="dhrg5e"
ADMIN
LEARNER
EDITOR
```

---

## nếu muốn đơn giản phase 1:

```text id="u1e5a8"
ADMIN
USER
```

---

---

# III. LOGIN FLOW

---

## login xong backend trả role:

```json id="vv71lb"
{
  "token": "...",
  "role": "USER"
}
```

---

## frontend route theo role:

```text id="u12j7l"
ADMIN → /admin/dashboard
USER → /learn/home
```

---

---

# IV. DATABASE ROLE TABLE PRODUCTION

---

```sql id="mijc7f"
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);
```

---

---

## user_roles

```sql id="qor1dr"
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id INT,
    PRIMARY KEY(user_id, role_id)
);
```

---

---

# V. USERS TABLE nên nâng cấp

---

```sql id="89xho4"
ALTER TABLE users
ADD role_default VARCHAR(20);
```

---

---

# VI. WEB CLIENT = learner web học thật

Đây là phần rất đáng làm vì nhiều người học trên desktop tốt hơn mobile.

---

# learner web nên có:

---

## Dashboard

---

```text id="te1qsv"
Today's topic
Review queue
Weak words
Mistake notebook
```

---

---

## Flashcard web mode

Card lớn giữa màn.

---

## flip card

---

## keyboard shortcut:

```text id="yw8lnm"
space = flip
1-4 = answer
```

🔥 desktop cực mạnh.

---

---

# VII. WEB CLIENT UI thân thiện

---

## Màu xanh lá nhẹ bạn chọn rất hợp:

---

## primary:

```text id="41jglp"
#7BC47F
```

---

## background:

```text id="yv7sfi"
#F6FBF7
```

---

## card:

```text id="i7xrlg"
white + radius 20px
```

---

---

## layout:

```text id="0jxqlk"
sidebar trái
content giữa
```

---

---

# VIII. Web learner pages chuẩn

---

```text id="j5f8eb"
/learn/dashboard
/learn/review
/learn/topic
/learn/errors
/learn/history
```

---

---

# IX. WEB ADMIN = cực quan trọng

Admin không chỉ CRUD user.

Admin phải quản learning content.

---

# admin pages:

---

## User management

## Topic management

## Vocabulary management

## Sentence bank

## AI logs

## Review statistics

---

---

# X. Admin UI production pages

---

```text id="5ejksk"
/admin/users
/admin/topics
/admin/words
/admin/errors
/admin/reports
```

---

---

# XI. Admin dashboard cần KPI thật

---

Ví dụ:

```text id="6ofw0z"
Total users
Today active users
Words reviewed today
Weakest topic
```

---

---

# XII. Role middleware backend

---

Express middleware:

```javascript id="2zj0ol"
function allowRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}
```

---

---

## route:

```javascript id="br78x7"
router.get('/admin/users', auth, allowRole('ADMIN'))
```

---

---

# XIII. JWT payload nên chứa role

---

```json id="apgu4l"
{
  "id": 12,
  "role": "ADMIN"
}
```

---

---

# XIV. WEB CLIENT nên có thêm feature desktop-only cực mạnh

---

# Typing practice full keyboard

---

Ví dụ:

```text id="29m8zt"
type answer + enter
```

---

🔥 desktop mạnh hơn mobile phần này.

---

---

# XV. Một ý tưởng rất mạnh cho web

---

# Split learning mode

---

## trái:

word

## phải:

note cá nhân

---

Giống workspace học thật.

---

---

# XVI. Web learner nên có dark mode nhẹ

---

Dark mode desktop học tối rất hữu ích.

---

---

# XVII. FULL LOGIN FLOW đa client

---

```text id="az6k1h"
same API
same auth
same role
different UI
```

---

---

# XVIII. Project folder full chuẩn

---

```text id="2vkmbs"
project/
├── backend/
├── mobile/
├── web-admin/
├── web-client/
```

---

---

# XIX. Thứ tự build đúng

---

## Phase 1

auth + role

---

## Phase 2

web learner dashboard

---

## Phase 3

review web

---

## Phase 4

admin content

---

## Phase 5

AI sync all platform

---

---

# XX. Feature rất nên thêm khi có web

---

# Learning history chart

---

Dùng:

Chart.js

---

Hiển thị:

```text id="h6e7xq"
7 day review
```

---

🔥 user rất thích thấy tiến bộ.

---

---

# XXI. Tư duy sản phẩm đúng cho bạn

Mobile = habit
Web = deep learning
Admin = control system

---

🔥 bộ ba này rất đúng.

---
