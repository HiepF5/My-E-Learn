#!/usr/bin/env node
/**
 * MY LEARN E — demo / fake database seed
 *
 * Run (after migrations):  cd backend && npm run seed:demo
 *
 * Credentials:
 *   - Learner: `demo` / `demo123` (role USER)
 *   - Admin (content): `admin` / `admin123` (role ADMIN) — use for web-admin after migration `add-user-role`
 *
 * -----------------------------------------------------------------------------
 * Flashcard QA checklist (manual, after seed + login)
 * -----------------------------------------------------------------------------
 * SRS Review (/review):
 *   - Queue non-empty: user must have review_progress with next_review <= now.
 *   - Tap card: flip shows meaning / example / phonetic from vocabulary.
 *   - 3-touch (Recognize → Type → Sentence) then rating bar; PageView does NOT
 *     swipe between cards (NeverScrollableScrollPhysics); advance only after rate.
 * Browse flashcards (Vocabulary → Flashcards):
 *   - Uses GET /vocabulary; swipe PageView + tap flip; no POST /review/submit.
 * -----------------------------------------------------------------------------
 */

const path = require("path");
const bcrypt = require("bcrypt");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const sequelize = require("../src/config/database");
const User = require("../src/models/user.model");
const Topic = require("../src/models/topic.model");
const Vocabulary = require("../src/models/vocabulary.model");
const VocabularyTopicMap = require("../src/models/vocabulary-topic-map.model");
const ReviewProgress = require("../src/models/review-progress.model");
const TouchHistory = require("../src/models/touch-history.model");
const Collocation = require("../src/models/collocation.model");
const WordFamily = require("../src/models/word-family.model");

const DEMO_USER = "demo";
const DEMO_EMAIL = "demo@mylearne.local";
const DEMO_PASSWORD = "demo123";

const ADMIN_USER = "admin";
const ADMIN_EMAIL = "admin@mylearne.local";
const ADMIN_PASSWORD = "admin123";

/** @type {Array<{ word: string; phonetic: string; meaning: string; example: string; difficulty: number }>} */
const DEMO_WORDS = [
  {
    word: "abandon",
    phonetic: "/əˈbændən/",
    meaning: "từ bỏ, bỏ rơi",
    example: "They had to abandon the vehicle in the snow.",
    difficulty: 2,
  },
  {
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    meaning: "đạt được, hoàn thành",
    example: "She achieved her goal after months of work.",
    difficulty: 1,
  },
  {
    word: "ancient",
    phonetic: "/ˈeɪnʃənt/",
    meaning: "cổ xưa",
    example: "We visited an ancient temple.",
    difficulty: 2,
  },
  {
    word: "approach",
    phonetic: "/əˈprəʊtʃ/",
    meaning: "tiếp cận; phương pháp",
    example: "His approach to teaching is very practical.",
    difficulty: 2,
  },
  {
    word: "available",
    phonetic: "/əˈveɪləbl/",
    meaning: "có sẵn, rảnh",
    example: "Tickets are still available online.",
    difficulty: 1,
  },
  {
    word: "benefit",
    phonetic: "/ˈbenɪfɪt/",
    meaning: "lợi ích",
    example: "Regular exercise has many health benefits.",
    difficulty: 1,
  },
  {
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    meaning: "thử thách",
    example: "Learning a new language is a fun challenge.",
    difficulty: 2,
  },
  {
    word: "community",
    phonetic: "/kəˈmjuːnəti/",
    meaning: "cộng đồng",
    example: "The local community organized a clean-up day.",
    difficulty: 2,
  },
  {
    word: "consequence",
    phonetic: "/ˈkɒnsɪkwəns/",
    meaning: "hậu quả",
    example: "Every choice has a consequence.",
    difficulty: 3,
  },
  {
    word: "culture",
    phonetic: "/ˈkʌltʃə/",
    meaning: "văn hóa",
    example: "Vietnamese food reflects rich culture.",
    difficulty: 1,
  },
  {
    word: "decade",
    phonetic: "/ˈdekeɪd/",
    meaning: "thập kỷ",
    example: "The city changed a lot over the past decade.",
    difficulty: 2,
  },
  {
    word: "diverse",
    phonetic: "/daɪˈvɜːs/",
    meaning: "đa dạng",
    example: "The team has diverse skills.",
    difficulty: 2,
  },
  {
    word: "economy",
    phonetic: "/ɪˈkɒnəmi/",
    meaning: "kinh tế",
    example: "The global economy affects everyone.",
    difficulty: 2,
  },
  {
    word: "environment",
    phonetic: "/ɪnˈvaɪrənmənt/",
    meaning: "môi trường",
    example: "We should protect the environment.",
    difficulty: 2,
  },
  {
    word: "evidence",
    phonetic: "/ˈevɪdəns/",
    meaning: "bằng chứng",
    example: "Scientists need evidence before they conclude.",
    difficulty: 2,
  },
  {
    word: "feature",
    phonetic: "/ˈfiːtʃə/",
    meaning: "đặc điểm; tính năng",
    example: "This app has a dark mode feature.",
    difficulty: 1,
  },
  {
    word: "global",
    phonetic: "/ˈɡləʊbl/",
    meaning: "toàn cầu",
    example: "English is a global language.",
    difficulty: 1,
  },
  {
    word: "impact",
    phonetic: "/ˈɪmpækt/",
    meaning: "tác động",
    example: "Small habits can have a big impact.",
    difficulty: 2,
  },
  {
    word: "individual",
    phonetic: "/ˌɪndɪˈvɪdʒuəl/",
    meaning: "cá nhân",
    example: "Each individual learns at a different pace.",
    difficulty: 3,
  },
  {
    word: "issue",
    phonetic: "/ˈɪʃuː/",
    meaning: "vấn đề; số báo",
    example: "We discussed the issue calmly.",
    difficulty: 1,
  },
  {
    word: "major",
    phonetic: "/ˈmeɪdʒə/",
    meaning: "chính; chuyên ngành",
    example: "Traffic is a major problem in big cities.",
    difficulty: 1,
  },
  {
    word: "opportunity",
    phonetic: "/ˌɒpəˈtjuːnəti/",
    meaning: "cơ hội",
    example: "This job is a great opportunity.",
    difficulty: 2,
  },
  {
    word: "policy",
    phonetic: "/ˈpɒləsi/",
    meaning: "chính sách",
    example: "The school updated its attendance policy.",
    difficulty: 2,
  },
  {
    word: "pressure",
    phonetic: "/ˈpreʃə/",
    meaning: "áp lực",
    example: "Students feel pressure before exams.",
    difficulty: 2,
  },
  {
    word: "resource",
    phonetic: "/rɪˈsɔːs/",
    meaning: "nguồn lực, tài nguyên",
    example: "The library is a useful learning resource.",
    difficulty: 2,
  },
  {
    word: "response",
    phonetic: "/rɪˈspɒns/",
    meaning: "phản hồi",
    example: "We are waiting for a response from support.",
    difficulty: 2,
  },
  {
    word: "society",
    phonetic: "/səˈsaɪəti/",
    meaning: "xã hội",
    example: "Education benefits all of society.",
    difficulty: 2,
  },
  {
    word: "tradition",
    phonetic: "/trəˈdɪʃn/",
    meaning: "truyền thống",
    example: "Tet is an important tradition in Vietnam.",
    difficulty: 2,
  },
];

async function ensureAdminUser() {
  const existing = await User.findOne({ where: { username: ADMIN_USER } });
  if (existing) return;
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await sequelize.transaction(async (transaction) => {
    const admin = await User.create(
      {
        username: ADMIN_USER,
        email: ADMIN_EMAIL,
        password_hash: passwordHash,
        role: "ADMIN",
      },
      { transaction }
    );
    await ensureUserSettingsRow(admin.id, transaction);
  });
  console.log(`[seed-demo] Created admin user "${ADMIN_USER}" / "${ADMIN_PASSWORD}" (role ADMIN).`);
}

async function ensureUserSettingsRow(userId, transaction) {
  const [rows] = await sequelize.query(
    `SELECT id FROM user_settings WHERE user_id = :uid LIMIT 1`,
    { replacements: { uid: userId }, transaction }
  );
  if (rows.length) return;
  await sequelize.query(
    `INSERT INTO user_settings (user_id, daily_target_words, notification_enabled, created_at, updated_at)
     VALUES (:uid, 15, 1, NOW(), NOW())`,
    { replacements: { uid: userId }, transaction }
  );
}

async function main() {
  const existing = await User.findOne({ where: { username: DEMO_USER } });
  if (existing) {
    console.log(`[seed-demo] User "${DEMO_USER}" already exists — skip demo payload (idempotent).`);
    console.log(`[seed-demo] Learner login: ${DEMO_USER} / ${DEMO_PASSWORD}`);
    await ensureAdminUser();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const yesterday = new Date(Date.now() - 48 * 60 * 60 * 1000);

  await sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        username: DEMO_USER,
        email: DEMO_EMAIL,
        password_hash: passwordHash,
        role: "USER",
      },
      { transaction }
    );

    const passwordHashAdmin = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create(
      {
        username: ADMIN_USER,
        email: ADMIN_EMAIL,
        password_hash: passwordHashAdmin,
        role: "ADMIN",
      },
      { transaction }
    );

    await ensureUserSettingsRow(user.id, transaction);

    const tDaily = await Topic.create(
      { topic_name: "Daily core", description: "Demo topic for everyday words", level: "B1" },
      { transaction }
    );
    const tTravel = await Topic.create(
      { topic_name: "Travel", description: "Demo travel vocabulary", level: "A2" },
      { transaction }
    );

    const vocabRows = [];
    for (let i = 0; i < DEMO_WORDS.length; i += 1) {
      const w = DEMO_WORDS[i];
      const v = await Vocabulary.create(
        {
          word: w.word,
          phonetic: w.phonetic,
          meaning: w.meaning,
          example_sentence: w.example,
          difficulty: w.difficulty,
        },
        { transaction }
      );
      vocabRows.push(v);
      const topicId = i % 2 === 0 ? tDaily.id : tTravel.id;
      await VocabularyTopicMap.create({ word_id: v.id, topic_id: topicId }, { transaction });
    }

    const firstThree = vocabRows.slice(0, 3);
    await Collocation.bulkCreate(
      [
        { word_id: firstThree[0].id, collocation: "abandon ship", example: "The crew was told to abandon ship." },
        { word_id: firstThree[1].id, collocation: "achieve success", example: "Hard work helps you achieve success." },
        { word_id: firstThree[2].id, collocation: "ancient history", example: "That problem is ancient history now." },
      ],
      { transaction }
    );

    await WordFamily.bulkCreate(
      [
        { root_word_id: firstThree[0].id, related_word: "abandoned", relation_type: "past_participle" },
        { root_word_id: firstThree[0].id, related_word: "abandonment", relation_type: "noun" },
        { root_word_id: firstThree[1].id, related_word: "achievement", relation_type: "noun" },
      ],
      { transaction }
    );

    for (let i = 0; i < vocabRows.length; i += 1) {
      const v = vocabRows[i];
      await ReviewProgress.create(
        {
          user_id: user.id,
          word_id: v.id,
          level: 1 + (i % 3),
          ease_factor: 2.5,
          interval_days: 1,
          next_review: yesterday,
          correct_count: i % 4,
          wrong_count: i % 3,
          fake_known_count: 0,
          last_review: null,
        },
        { transaction }
      );
    }

    const quickRatingCount = 8;
    for (let i = 0; i < quickRatingCount && i < vocabRows.length; i += 1) {
      await TouchHistory.create(
        {
          user_id: user.id,
          word_id: vocabRows[i].id,
          touch1_done: true,
          touch2_done: true,
          touch3_done: true,
        },
        { transaction }
      );
    }

    console.log(`[seed-demo] Created learner id=${user.id} (${DEMO_USER} / ${DEMO_PASSWORD}), admin (${ADMIN_USER} / ${ADMIN_PASSWORD})`);
    console.log(`[seed-demo] Topics: ${tDaily.id} Daily core, ${tTravel.id} Travel`);
    console.log(`[seed-demo] Vocabulary: ${vocabRows.length} words, review_progress due, touch done for first ${quickRatingCount}`);
  });

  console.log("[seed-demo] Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed-demo] Failed:", err);
  process.exit(1);
});
