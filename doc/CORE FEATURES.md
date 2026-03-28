Rất đúng hướng 👌
Nếu app của bạn dành cho **người mới học tiếng Anh thật sự**, thì tính năng cần theo nguyên tắc:

> **ít nhưng dùng hằng ngày được — không phô trương AI quá sớm** 🌱📱🧠

Và nếu chọn **màu xanh lá nhẹ**, đây là màu rất phù hợp cho learning psychology vì:

* tạo cảm giác bình tĩnh 😌
* giảm áp lực học
* hợp với habit app dài hạn
* ít gây mệt mắt hơn xanh dương đậm

---

# I. CORE FEATURES THIẾT THỰC NHẤT (nên có thật)

---

# 1. Học ngay khi mở app (Zero-friction entry)

User mở app phải thấy ngay:

```text id="y6j0zb"
Continue today
12 words waiting
```

---

🚫 Không nên bắt chọn menu trước.

---

## UI:

1 nút lớn giữa màn hình:

```text id="22uv40"
Start Learning
```

---

---

# 2. Resume đúng chỗ đang học

Nếu user thoát giữa chừng:

quay lại đúng card trước.

---

## DB field:

```sql id="4pldws"
last_session_word_id
last_screen
```

---

🔥 cực thiết thực vì người dùng mobile hay bị gián đoạn.

---

---

# 3. Quick Review 3 phút

Rất quan trọng.

---

## Chế độ:

```text id="1nls2k"
3-minute review
```

---

Chỉ 5 từ.

---

Vì nhiều ngày user không có thời gian.

---

## UI:

button nhỏ:

```text id="e3feof"
Quick 3 min
```

---

---

# 4. Weak Words riêng biệt

Màn riêng:

```text id="t6j4co"
Your weak words
```

---

Ví dụ:

```text id="7w8t0j"
borrow
lend
although
```

---

🔥 user rất thích vì thấy đúng vấn đề của mình.

---

---

# 5. Favorite words

---

Cho phép save:

⭐

---

Để sau này học riêng.

---

## table:

```sql id="8jvexk"
favorite_words
```

---

---

# 6. Audio cực cần thiết

Mỗi từ cần:

🔊

---

Plugin Flutter:

Flutter TTS

---

Vì người mới học cần nghe cực nhiều.

---

---

# 7. Ví dụ ngắn thay vì ví dụ dài

Sai phổ biến:

sentence dài.

---

Đúng:

```text id="5qljua"
He borrowed money.
```

---

---

# 8. Note cá nhân cực dễ nhập

---

Không nên form dài.

---

Chỉ:

```text id="9eg7pj"
+ Add note
```

---

Ví dụ:

```text id="ck1k1i"
hay nhầm borrow/lend
```

---

---

# 9. Daily streak nhẹ

---

Ví dụ:

```text id="d9f22x"
5 days 🌱
```

---

Không gamification quá mạnh.

---

---

# 10. Daily finish feedback

---

Cuối buổi:

```text id="2cn78a"
You reviewed 14 words today
```

---

Tạo cảm giác hoàn thành.

---

---

# II. UI THÂN THIỆN NHẤT CHO NGƯỜI MỚI

---

# 1. Card bo góc lớn

---

```text id="gskfrx"
24px
```

---

---

# 2. Khoảng trắng nhiều

---

Sai:

nhồi dày.

---

Đúng:

```text id="klr0og"
thở được
```

---

---

# 3. Font to rõ

---

Khuyến nghị:

```text id="i9v1r7"
16–18 body
24+ title
```

---

---

# 4. Chỉ 1 hành động chính mỗi màn

---

Ví dụ:

Review screen:

---

1 card

1 action

---

🚫 tránh nhiều nút.

---

---

# III. MÀU XANH LÁ NHẸ (rất phù hợp)

---

Khuyến nghị palette:

---

## Primary

```text id="z8zkwn"
#7BC47F
```

---

## Secondary

```text id="2o6x48"
#A8D5BA
```

---

## Background

```text id="1onpux"
#F6FBF7
```

---

## Card

```text id="9e7ay2"
#FFFFFF
```

---

## Weak word warning

```text id="x1a1x0"
#FFD9A0
```

---

---

# UI cảm giác:

```text id="p2ij5q"
calm
clean
friendly
```

---

---

# IV. HOME SCREEN nên như sau

---

## Top:

```text id="qzc8h6"
Good evening
```

---

## Main card:

```text id="y9fhl6"
12 words today
```

---

## Secondary:

```text id="r8w8v0"
2 mistakes to fix
```

---

## Bottom:

```text id="7g0m4g"
continue learning
```

---

---

# V. TÍNH NĂNG THỰC TẾ RẤT ĐÁNG THÊM

---

# 1. Search word cực nhanh

---

Search local offline.

---

# 2. Recent mistakes widget

---

Home screen:

```text id="8x9m7m"
Recent:
borrow / lend
```

---

---

# 3. Learning mood selector

---

Trước học:

```text id="2zhlxu"
Easy / Focus / Quick
```

---

AI đổi mode.

---

---

# 4. Session timer nhẹ

---

```text id="rsx4ue"
5 min done
```

---

---

# 5. End-of-week summary

---

```text id="ep51i7"
42 words learned
```

---

---

# VI. Ý TƯỞNG KHÁC RẤT MẠNH CHO APP CỦA BẠN

---

# Personal English Garden 🌱

Mỗi ngày học:

cây lớn dần.

---

Không trẻ con nếu làm tinh tế.

---

Ví dụ:

```text id="6chvqq"
day 1 leaf
day 7 branch
day 30 tree
```

---

🔥 habit cực mạnh.

---

---

# VII. Một feature cực đáng giá sau này

---

# “Từ hôm nay dễ quên nhất”

Home screen:

```text id="sj2e6k"
Today most fragile:
despite
```

---

AI rất mạnh ở đây.

---

---

# VIII. Feature nên tránh lúc đầu

---

🚫 chat AI liên tục
🚫 leaderboard
🚫 social quá sớm
🚫 bài test dài

---

---

# IX. MVP đúng nhất cho launch

---

Chỉ cần:

---

✅ flashcard
✅ review AI
✅ note lỗi
✅ topic daily
✅ weak words
✅ audio
✅ streak nhẹ

---

Là đủ mạnh.

---

---

