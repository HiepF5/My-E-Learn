const sequelize = require("../config/database");
const reviewRepository = require("../repositories/review.repository");

const INTERVALS = [1, 3, 7, 14, 30, 60, 120];
const RATING_MAP = {
  Again: { levelDelta: -999, multiplier: 0, easeDelta: -0.2, forceInterval: 1 },
  Hard: { levelDelta: 0, multiplier: 0.7, easeDelta: -0.05 },
  Good: { levelDelta: 1, multiplier: 1, easeDelta: 0 },
  Easy: { levelDelta: 2, multiplier: 1.3, easeDelta: 0.1 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const calculateNextReview = ({ level, easeFactor, answerResult, rating }) => {
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
  const nextEase = clamp(easeFactor + ratingRule.easeDelta, 1.3, 3.5);
  const intervalDays =
    ratingRule.forceInterval || Math.max(1, Math.round(baseInterval * nextEase * ratingRule.multiplier));

  return {
    level: nextLevel,
    easeFactor: Number(nextEase.toFixed(2)),
    intervalDays,
  };
};

const getTodayReview = async (userId, limit = 30) => {
  const safeLimit = clamp(Number(limit) || 30, 1, 100);
  return reviewRepository.findTodayDueReviews(userId, safeLimit);
};

const submitReview = async ({
  userId,
  wordId,
  answerResult,
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
        },
        { transaction }
      );
    }

    const next = calculateNextReview({
      level: progress.level,
      easeFactor: Number(progress.ease_factor),
      answerResult,
      rating,
    });

    progress.level = next.level;
    progress.ease_factor = next.easeFactor;
    progress.interval_days = next.intervalDays;
    progress.last_review = new Date();
    progress.next_review = new Date(Date.now() + next.intervalDays * 24 * 60 * 60 * 1000);
    if (answerResult) progress.correct_count += 1;
    else progress.wrong_count += 1;

    await reviewRepository.saveProgress(progress, { transaction });

    await reviewRepository.createHistory(
      {
        user_id: userId,
        word_id: wordId,
        answer_result: answerResult,
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
