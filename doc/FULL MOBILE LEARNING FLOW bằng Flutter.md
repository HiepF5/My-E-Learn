Rất đúng — đến đây dự án mới bắt đầu **biến từ hệ thống kỹ thuật thành sản phẩm học thật** 📱🔥

Vì backend + review engine đã có, thì **Flutter mobile phải thiết kế theo nguyên tắc:**

> **mở app lên là học ngay trong 5 giây, không bị phân tâm**

Stack mobile:

* Flutter
* Dart

---

# I. Mobile learning flow chuẩn production

Flow đúng phải là:

```text id="cbd36p"
Open app
↓
Today Mission
↓
Review Queue
↓
3-touch learning
↓
Error notebook
↓
Daily summary
```

---

👉 Không được để user mở app rồi phải chọn quá nhiều.

---

# II. Full screen architecture

---

```text
lib/
│
├── screens/
│   ├── splash/
│   ├── auth/
│   ├── home/
│   ├── review/
│   ├── vocabulary/
│   ├── error_note/
│   ├── topic/
│   ├── profile/
│
├── widgets/
├── services/
├── providers/
├── models/
├── routes/
├── utils/
```

---

---

# III. Screen 1 — Splash Screen

---

# Mục tiêu:

load nhanh + check token.

---

```dart id="e7qahc"
SplashScreen
→ token?
→ Home / Login
```

---

---

# IV. Screen 2 — Home = Today Mission

Đây là màn quan trọng nhất.

---

# Hiển thị:

---

## Hôm nay cần học:

* 12 từ review
* 3 từ mới
* 2 lỗi cá nhân

---

## 1 topic duy nhất

Ví dụ:

```text id="qq8l21"
Work
```

---

## progress bar:

```text id="shv4yz"
65%
```

---

![Image](https://images.openai.com/static-rsc-4/ymtAi27w0JaK8NaCVxSR1uwsDxOHWZRE7FP_uKK7GnTU2eoOZLgGSxRn7mriNfEx6pMJpqRsY-6o3obzcFcAzJHVadbQ9eMeged8A7qeEP-3adJy1UV_TdlMCqMy5APJOFlOKvk45xVHvaOr8Z0RS3WI-jsLGvfUaDzx6GDPnu8PwE-jyAZfu5Og3SNRv-ax?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/jJg1re7zqxbUBi2F-UuC2PjMKosQwF2d2EsvuaOdMHPfVUDvC1apNiXx88pq6zw6_ShoHKDtRV2OuufiESzuhB9B11qWU4vk5YbPeGRyFhEKPnzbjsN_w8pMn0SXXLzxQqWdHjObc4bPpDz4vZ3kjjHjMaNzz5G1MxJxv4UurCQk28aIs23u9NEtp84X9a9c?purpose=fullsize)

---

# Flutter widget:

```dart id="h6qg7j"
Column(
 children:[
   TodayProgressCard(),
   TopicCard(),
   ReviewButton()
 ]
)
```

---

---

# V. Screen 3 — Review Queue (tim trái app)

---

# Review flow:

```text id="6oow2p"
word
↓
hidden meaning
↓
answer
↓
difficulty
↓
next word
```

---

---

# UI production:

---

## card center

---

## swipe left/right

---

## bottom 4 buttons:

---

## Again

## Hard

## Good

## Easy

---

```dart id="n01nvt"
PageView.builder()
```

---

---

# VI. Screen 4 — 3 Touch Learning Flow

Đây là phần app bạn khác hoàn toàn app khác.

---

# Touch 1 = Recognize

---

Hiện:

```text id="fwl1j8"
abandon
```

---

User chọn nghĩa.

---

---

# Touch 2 = Type

---

Hiện:

```text id="e7ikna"
từ bỏ
```

---

User gõ:

```text id="u7s9z1"
abandon
```

---

---

# Touch 3 = Sentence

---

```text id="0w4h57"
Write one sentence
```

---

---

# Flutter flow:

```dart id="f6a6fc"
if(stage ==1) RecognitionWidget()
if(stage ==2) TypingWidget()
if(stage ==3) SentenceWidget()
```

---

---

# VII. Screen 5 — Vocabulary Card Mode

Giống flashcard nhưng tốt hơn.

---

# Card:

Front:

```text id="8r7d47"
abandon
```

---

Back:

```text id="mv0grm"
meaning
example
pronunciation
collocation
```

---

---

# nên có audio button

---

## audio:

Flutter TTS

---

---

# VIII. Screen 6 — Error Notebook (rất quan trọng)

Đây là phần app mạnh hơn rất nhiều app học từ.

---

# Hiển thị:

---

## lỗi sai gần nhất

## lỗi lặp nhiều nhất

## lỗi chưa sửa

---

---

# mỗi item:

```text id="1ny8eo"
wrong
correct
repeat count
```

---

![Image](https://images.openai.com/static-rsc-4/biB_Efb-X05W9S0tyGTmv9PngxEOFecOcdu2XL-rU1q3L2329zWe0ERzIZnI92D9-F6XOmGEdAQfP5ZVAZDtjQcxDTZoug7JCYZM7gS7Ilu-mX7YIMA1b59OqzrZ8izVwz19YGKgU23cq-iEGW-l6fY_LEl1RMWdFGRpcFdR6t4SpGRc9hwTEP1PRfgo-b_r?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/5YzjljzdXGqHQM3Dv_kDozyne1wCbq4Rho8WLM_Aum9-RnjbBirOuqBeZWt4tFloX6ZcBAAgUwmObcO1CCLgFB-lGyfMhDMzU2p04oB3oaUnltIbQLmwnPzcQ3MFu9jkQoWsUEi2KqAd06nvHzQkFS0K4OtKzDIdMujQIuwefDjBfWDq-NXPIwZeqVdq7R_7?purpose=fullsize)

---

---

# IX. Screen 7 — Topic Daily

---

# Chỉ 1 topic/day

Ví dụ:

```text id="d8bx0d"
Meeting
```

---

---

# trong topic:

---

## 10 words

## 3 sentences

## 1 speaking prompt

---

---

# X. Screen 8 — Speaking Practice

---

# Prompt:

```text id="ctkptk"
Describe your workday
```

---

## record voice:

plugin:

Flutter Sound

---

---

# XI. Screen 9 — Daily Summary

rất quan trọng để tạo dopamine đúng.

---

# summary:

---

## 15 words reviewed

## 4 mistakes

## 2 weak words

## streak +1

---

---

# XII. Navigation chuẩn production

---

# Bottom nav:

---

## Home

## Review

## Errors

## Profile

---

```dart id="6dj2c5"
BottomNavigationBar()
```

---

---

# XIII. State management chuẩn production

Bạn nên dùng:

---

## Provider

hoặc mạnh hơn:

## Riverpod

---

## Với app này:

👉 Riverpod tốt hơn.

---

---

# XIV. API layer mobile

---

```dart id="67kwq9"
Dio client
```

---

plugin:

Dio

---

---

# service:

```dart id="5mjlwm"
class ReviewService {
  Future getTodayReview() async {}
}
```

---

---

# XV. Offline-first rất nên có

---

## local cache:

Hive

---

## vì:

review vẫn học được offline.

---

---

# XVI. Sync strategy production

---

```text id="wnr5i4"
local first
↓
sync background
```

---

---

# XVII. Push notification cực đáng giá sau này

---

review reminder:

---

## 8AM

## 8PM

---

plugin:

Firebase Cloud Messaging

---

---

# XVIII. UI principle cực quan trọng

---

## mỗi màn chỉ 1 hành động chính

---

Sai:

nhiều nút.

---

Đúng:

1 action.

---

---

# XIX. Full user daily flow thật

![Image](https://images.openai.com/static-rsc-4/pI_YTn1NOkWFMtgtt0nbteSQvjuUIClbdU6t80bXBDzq22JLHZHuKtkkFngEUpJF-b7_mXbdtYrL8_Cev_UXJBNz666SGMLvJrk77w9CvJFFlGDtM79ThnGzkgbp6irXLans4_umdjl_GwTNPA6NcIo_WO6gGAUb8ul086fk4OsO2fo9RHE6IoGQSwZA7JMy?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Bnrmhd_c2It_A66lK8eG70U2_ZMWO4Y4wUtHl8pHAB_49Du5rRDUYU6MlJBORfabkLSquFptmg1UdsZKhSDxhdHvq-lotMUGLqNtApac-RSegOxw_WZW8Su6yjUVu_bTWaMKpqZOxO6QOMoNNjKkhRTdV9SRzXw1avVJWJb9m0hN7G5F15mug_dJJgxInOcw?purpose=fullsize)

---

```text id="n4rj6z"
Morning:
review 10 words

Noon:
1 error note

Night:
1 speaking topic
```

---

---

# XX. Giai đoạn build mobile đúng nhất

---

# tuần 1

home + auth

---

# tuần 2

review card

---

# tuần 3

3-touch engine

---

# tuần 4

error notebook

---

# tuần 5

topic + speaking

---

---

# XXI. Nếu muốn app này lên level cực mạnh:

bước tiếp theo nên làm:

# FULL AI PERSONAL LEARNING ENGINE

để app tự hiểu:

> bạn sai kiểu gì
> bạn quên kiểu gì
> bạn nên học gì tiếp theo

🔥 Đây là chỗ app từ tốt → cực mạnh.
