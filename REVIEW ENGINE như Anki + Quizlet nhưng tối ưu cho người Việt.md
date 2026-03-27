Đây là phần **quan trọng nhất của toàn bộ dự án** — nếu Review Engine làm tốt thì app của bạn **có giá trị thật**, còn nếu làm sai thì chỉ là app flashcard bình thường.

Ta sẽ thiết kế:

> **Review Engine = sức mạnh của Anki + sự dễ dùng của Quizlet + tối ưu cho người Việt học tiếng Anh** 🔥📚

---

# I. Vấn đề của người Việt khi học từ vựng

Người Việt thường sai ở 5 điểm:

---

## 1. Nhớ nghĩa nhưng không bật ra được khi dùng

Ví dụ:

Biết:

```text id="ks6a6a"
abandon = từ bỏ
```

nhưng không nói được.

---

## 2. Học từ đơn lẻ quá nhiều

Không nhớ collocation.

---

## 3. Ôn sai thời điểm

Ôn quá sớm → chán
Ôn quá muộn → quên

---

## 4. Không tracking lỗi cá nhân

---

## 5. Chỉ recognition, thiếu recall

---

👉 Vì vậy engine phải khác Anki ở chỗ:

---

# II. Triết lý Review Engine MY LEARN E

---

```text id="h52r5e"
Recognize
→ Recall
→ Produce
→ Error Track
→ Repeat đúng lúc
```

---

Không chỉ flashcard.

---

# III. 4 tầng review engine

---

# Layer 1 = Memory Layer

spaced repetition.

---

# Layer 2 = Recall Layer

ép nhớ chủ động.

---

# Layer 3 = Production Layer

tạo output.

---

# Layer 4 = Error Reinforcement

đè lỗi cá nhân.

---

---

# IV. Scheduling Algorithm (phiên bản production)

---

## Base interval:

```text id="1z1lfq"
1
3
7
14
30
60
120
```

---

## Nhưng thêm trọng số:

```text id="a1rzh5"
difficulty
wrong_count
response_time
```

---

## Công thức:

next_interval = base_interval \times ease_factor \times difficulty_modifier

---

## Trong đó:

---

## ease_factor

ban đầu:

```text id="ouutqv"
2.5
```

---

## nếu sai:

```text id="ixg2nr"
-0.2
```

---

## nếu đúng nhanh:

```text id="sj0ox1"
+0.1
```

---

---

# V. Production algorithm chuẩn code

---

```javascript id="4r6ekd"
function calculateNextReview(progress, correct, responseTime) {

    const intervals = [1,3,7,14,30,60,120];

    if(!correct){
        progress.level = 1;
        progress.ease_factor -= 0.2;
        return 1;
    }

    if(responseTime < 3000){
        progress.ease_factor += 0.1;
    }

    progress.level += 1;

    return Math.round(
        intervals[Math.min(progress.level, intervals.length-1)] 
        * progress.ease_factor
    );
}
```

---

---

# VI. 3-stage review flow (rất quan trọng)

---

# Stage 1 = Recognition

---

Ví dụ:

```text id="i0j69e"
abandon
```

---

User chọn nghĩa.

---

## giống Quizlet.

---

---

# Stage 2 = Recall

---

Hiện:

```text id="x9qv7j"
từ bỏ
```

---

User phải tự gõ:

```text id="oc9v0e"
abandon
```

---

## Đây là phần Anki mạnh.

---

---

# Stage 3 = Production

---

User tạo câu:

```text id="s6j05h"
I abandon ...
```

---

## Đây là phần app khác biệt.

---

---

# VII. 1 từ chỉ pass khi đủ 3 chạm

---

## DB logic

```text id="89zxgt"
touch1_done
touch2_done
touch3_done
```

---

## pass:

```javascript id="d3y83d"
if(t1 && t2 && t3){
    markLearned();
}
```

---

---

# VIII. Review Mode nên có 5 loại

---

# Mode 1 VN → EN

rất hợp người Việt.

---

# Mode 2 EN → VN

---

# Mode 3 Fill blank

Ví dụ:

```text id="9jrtf4"
I ___ coffee every morning.
```

---

# Mode 4 Sentence recall

---

# Mode 5 Listening recall

---

---

# IX. Smart Vietnamese Optimization (đây là phần khác biệt)

---

Người Việt thường nhầm:

---

## borrow / lend

## say / tell

## do / make

## job / work

---

👉 engine phải detect pair confusion.

---

# bảng thêm:

```sql id="ks4s8j"
confusion_pairs
```

---

```sql id="x27a7l"
borrow | lend
say | tell
```

---

## Nếu user sai:

boost review frequency.

---

---

# X. Weak Word Detector

---

Nếu 1 từ sai > 3 lần:

---

```text id="3dk7tv"
dangerous word
```

---

## review mỗi ngày.

---

---

# XI. Error priority engine

---

Nếu word nằm trong lỗi cá nhân:

---

boost:

priority = wrong_count \times 2 + recent_error

---

---

# XII. Daily queue generation (rất quan trọng)

---

## mỗi ngày queue:

---

## 40% review cũ

## 30% weak words

## 20% topic hôm nay

## 10% error words

---

## đây là khác Anki.

---

---

# XIII. Queue SQL production

---

```sql id="6m93n3"
SELECT *
FROM review_progress
WHERE next_review <= NOW()
ORDER BY wrong_count DESC, next_review ASC
LIMIT 30;
```

---

---

# XIV. Session tối ưu cho beginner Việt Nam

---

# session 1

10 phút.

---

# session 2

20 từ max.

---

# session 3

1 topic only.

---

👉 tránh overload.

---

---

# XV. Anti-forgetting strategy

---

Nếu 3 ngày không học:

---

auto inject:

```text id="7mly8z"
forgotten recovery session
```

---

---

# XVI. Recovery Mode

---

Words forgotten:

review ngay theo:

```text id="6kqjlwm"
1h
1d
3d
```

---

---

# XVII. UI flow review production

![Image](https://images.openai.com/static-rsc-4/9YR0qe92fDgglphKAbWqL8BI9QnKj3_gt9PE2rfUVvE2bnpdWRTBWNIshdWHy4bLlZgHCcTwvSSxPLlrg2aijszQ-t9YX9dT2fJm0_qbj_7gOBMJm_TbZk13zI0-mhSZPO8uxcKKpHwkNPSg4-JxHTAlATHdL7W-hKwapYKVsjhkucaX-bzKO6jFtIHuvIHs?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/MVJEFMJmr5T_65IbTPYtzQc4Nxltb-IZkBeEOFfgMPltWb1vqKcJow61cCyTRBLgn4V7r0kTfV4dfgk0iN9QxC7MFV_j3SaxB3A7_od6EseedILeaEto59HkoLSmreilw9X2ddjoBLp8iMZbpD0rRHe3mTS1DJ4yOs9WYJDHrlGHrTUC2kYeGnLrvUAFpZEr?purpose=fullsize)

---

```text id="d85u44"
Word
↓
Meaning hidden
↓
Type answer
↓
Check
↓
Sentence
↓
Rate difficulty
```

---

---

# XVIII. Difficulty rating sau mỗi từ

---

4 nút:

---

## Again

## Hard

## Good

## Easy

---

## giống Anki nhưng đơn giản hơn.

---

---

# XIX. Mapping rating

---

## Again

reset

---

## Hard

+1 day

---

## Good

theo interval chuẩn

---

## Easy

jump 2 levels

---

---

# XX. Production table nên thêm

---

```sql id="l9es5m"
review_session
```

---

để tracking mỗi session.

---

---

# XXI. Điều quan trọng nhất: App bạn nên ưu tiên recall hơn recognition

---

Sai lầm lớn của đa số app Việt:

---

## chỉ multiple choice

=> ảo tưởng nhớ.

---

## phải typing.

---

---

# XXII. Công thức vàng cho người Việt

---

```text id="az4rwa"
1 từ
→ thấy
→ gõ
→ nói
→ đặt câu
→ lặp lại
```

---

---

# XXIII. Nếu đi tiếp đúng hướng, bước sau nên làm:

## FULL MOBILE LEARNING FLOW bằng Flutter

để biến engine này thành app học thật dùng mỗi ngày 📱🔥

vì từ giờ backend đã đủ mạnh, mobile là nơi giá trị thật xuất hiện.
