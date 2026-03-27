const topicRepository = require("../repositories/topic.repository");
const vocabularyRepository = require("../repositories/vocabulary.repository");
const errorRepository = require("../repositories/error.repository");
const reviewRepository = require("../repositories/review.repository");
const { buildTodayPlan } = require("../ai/plan-generator");

const generateTodayPlan = async (userId, payload = {}) => {
  const [topics, wordCounts, topErrors, progressRows] = await Promise.all([
    topicRepository.listTopics(),
    vocabularyRepository.countWordsPerTopic(),
    errorRepository.topRepeatedErrors(userId, 20),
    reviewRepository.findProgressByUser(userId, 80),
  ]);

  const plan = buildTodayPlan({
    topics,
    wordCounts,
    topErrors,
    progressRows,
    dailyTargetWords: payload.daily_target_words,
    reviewCap: payload.review_cap,
  });

  return {
    generated_at: new Date().toISOString(),
    today_plan: plan,
  };
};

module.exports = {
  generateTodayPlan,
};
