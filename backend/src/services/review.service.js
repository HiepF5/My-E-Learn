const { Op } = require("sequelize");
const sequelize = require("../config/database");
const reviewRepository = require("../repositories/review.repository");
const Vocabulary = require("../models/vocabulary.model");
const {
  REVIEW_LIMIT,
  INTERVALS,
  RATING_MAP,
} = require("../constants/review.constants");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const applyResponseTimeAdjustment = (easeFactor, responseTimeMs, answerResult) => {
  if (!answerResult || !Number.isInteger(responseTimeMs) || responseTimeMs < 0) {
    return easeFactor;
  }

  // Optional lightweight hook: fast correct answers slightly increase ease,
  // very slow correct answers slightly decrease ease.
  if (responseTimeMs <= 2500) return clamp(easeFactor + 0.03, 1.3, 3.5);
  if (responseTimeMs >= 15000) return clamp(easeFactor - 0.03, 1.3, 3.5);
  return easeFactor;
};

const calculateNextReview = ({ level, easeFactor, answerResult, rating, responseTimeMs }) => {
  if (!answerResult) {
    return {
      level: 1,
      easeFactor: clamp(easeFactor - 0.2, 1.3, 3.5),
      intervalDays: 1,
    };
  }

  const ratingRule = RATING_MAP[rating] || RATING_MAP.Good;
  const nextLevel = clamp(level + ratingRule.levelDelta, 1, INTERVALS.length - 1);
  const baseInterval = INTERVALS[nextLevel];
  const ratedEase = clamp(easeFactor + ratingRule.easeDelta, 1.3, 3.5);
  const nextEase = applyResponseTimeAdjustment(ratedEase, responseTimeMs, answerResult);
  const intervalDays =
    ratingRule.forceInterval || Math.max(1, Math.round(baseInterval * nextEase * ratingRule.multiplier));

  return {
    level: nextLevel,
    easeFactor: Number(nextEase.toFixed(2)),
    intervalDays,
  };
};

const getTodayReview = async (userId, limit = REVIEW_LIMIT.DEFAULT) => {
  const safeLimit = clamp(Number(limit) || REVIEW_LIMIT.DEFAULT, REVIEW_LIMIT.MIN, REVIEW_LIMIT.MAX);
  const rows = await reviewRepository.findTodayDueReviews(userId, safeLimit);
  if (!rows.length) return [];

  const wordIds = [...new Set(rows.map((r) => Number(r.word_id)))];
  const vocabs = await Vocabulary.findAll({
    where: { id: { [Op.in]: wordIds } },
  });
  const byId = new Map(vocabs.map((v) => [Number(v.id), v]));

  return rows.map((p) => {
    const plain = p.get ? p.get({ plain: true }) : p;
    const v = byId.get(Number(plain.word_id));
    return {
      ...plain,
      word: v ? v.word : null,
      meaning: v ? v.meaning : null,
      example_sentence: v ? v.example_sentence : null,
      phonetic: v ? v.phonetic : null,
    };
  });
};

const submitReview = async ({
  userId,
  wordId,
  answerResult,
  selectedWordId,
  responseTimeMs,
  reviewMode,
  rating,
}) => {
  return sequelize.transaction(async (transaction) => {
    let progress = await reviewRepository.findProgressByUserAndWord(userId, wordId);
    if (!progress) {
      progress = await reviewRepository.createProgress(
        {
          user_id: userId,
          word_id: wordId,
          level: 1,
          ease_factor: 2.5,
          interval_days: 1,
          next_review: new Date(),
          correct_count: 0,
          wrong_count: 0,
          fake_known_count: 0,
        },
        { transaction }
      );
    }

    const next = calculateNextReview({
      level: progress.level,
      easeFactor: Number(progress.ease_factor),
      answerResult,
      rating,
      responseTimeMs,
    });

    progress.level = next.level;
    progress.ease_factor = next.easeFactor;
    progress.interval_days = next.intervalDays;
    progress.last_review = new Date();
    progress.next_review = new Date(Date.now() + next.intervalDays * 24 * 60 * 60 * 1000);
    if (answerResult) progress.correct_count += 1;
    else progress.wrong_count += 1;

    if (
      answerResult &&
      Number.isInteger(responseTimeMs) &&
      responseTimeMs > 6000
    ) {
      progress.fake_known_count = (Number(progress.fake_known_count) || 0) + 1;
    }

    await reviewRepository.saveProgress(progress, { transaction });

    await reviewRepository.createHistory(
      {
        user_id: userId,
        word_id: wordId,
        answer_result: answerResult,
        selected_word_id: selectedWordId || null,
        response_time_ms: responseTimeMs || null,
        review_mode: reviewMode || null,
        reviewed_at: new Date(),
      },
      { transaction }
    );

    return progress;
  });
};

const generateDailyReviewQueue = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const dueRows = await reviewRepository.findDueRowsForQueue(1000);
  const queueRows = dueRows.map((row) => ({
    user_id: row.user_id,
    word_id: row.word_id,
    queue_date: today,
    status: "pending",
  }));

  await sequelize.transaction(async (transaction) => {
    await reviewRepository.clearQueueByDate(today, { transaction });
    await reviewRepository.createQueueItems(queueRows, { transaction });
  });

  return {
    queueDate: today,
    total: queueRows.length,
  };
};

module.exports = {
  calculateNextReview,
  getTodayReview,
  submitReview,
  generateDailyReviewQueue,
};
