const { Op, fn, col } = require("sequelize");
const ReviewProgress = require("../models/review-progress.model");
const ReviewHistory = require("../models/review-history.model");
const DailyReviewQueue = require("../models/daily-review-queue.model");

const findProgressByUserAndWord = (userId, wordId) => {
  return ReviewProgress.findOne({ where: { user_id: userId, word_id: wordId } });
};

const createProgress = (payload, options = {}) => {
  return ReviewProgress.create(payload, options);
};

const saveProgress = (progress, options = {}) => progress.save(options);

const createHistory = (payload, options = {}) => {
  return ReviewHistory.create(payload, options);
};

const findTodayDueReviews = async (userId, limit = 30) => {
  return ReviewProgress.findAll({
    where: {
      user_id: userId,
      next_review: { [Op.lte]: new Date() },
    },
    order: [
      ["wrong_count", "DESC"],
      ["next_review", "ASC"],
    ],
    limit,
  });
};

const clearQueueByDate = (queueDate, options = {}) => {
  return DailyReviewQueue.destroy({ where: { queue_date: queueDate }, ...options });
};

const createQueueItems = (rows, options = {}) => {
  if (!rows.length) return Promise.resolve([]);
  return DailyReviewQueue.bulkCreate(rows, options);
};

const findDueRowsForQueue = (limit = 1000) => {
  return ReviewProgress.findAll({
    where: {
      next_review: { [Op.lte]: new Date() },
    },
    order: [
      ["wrong_count", "DESC"],
      ["next_review", "ASC"],
    ],
    limit,
  });
};

const findProgressByUser = (userId, limit = 50) => {
  return ReviewProgress.findAll({
    where: { user_id: userId },
    order: [
      ["wrong_count", "DESC"],
      ["next_review", "ASC"],
    ],
    limit,
  });
};

const findAllProgressForUser = (userId, limit = 5000) =>
  ReviewProgress.findAll({
    where: { user_id: userId },
    order: [["wrong_count", "DESC"]],
    limit,
  });

const countRecentWrongsByWord = (userId, sinceDate) =>
  ReviewHistory.findAll({
    attributes: ["word_id", [fn("COUNT", col("id")), "wrong_cnt"]],
    where: {
      user_id: userId,
      answer_result: false,
      reviewed_at: { [Op.gte]: sinceDate },
    },
    group: ["word_id"],
    raw: true,
  });

module.exports = {
  findProgressByUserAndWord,
  createProgress,
  saveProgress,
  createHistory,
  findTodayDueReviews,
  clearQueueByDate,
  createQueueItems,
  findDueRowsForQueue,
  findProgressByUser,
  findAllProgressForUser,
  countRecentWrongsByWord,
};
