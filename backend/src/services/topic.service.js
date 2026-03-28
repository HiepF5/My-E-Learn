const topicRepository = require("../repositories/topic.repository");
const aiService = require("./ai.service");
const reviewService = require("./review.service");
const errorRepository = require("../repositories/error.repository");

const createTopic = async (payload) => {
  const normalized = {
    topic_name: payload.topic_name.trim(),
    description: payload.description || null,
    level: payload.level || null,
  };
  return topicRepository.createTopic(normalized);
};

const getAllTopics = async () => topicRepository.listTopics();

const getTopicById = async (id) => {
  const item = await topicRepository.findTopicById(id);
  if (!item) {
    const error = new Error("topic not found");
    error.statusCode = 404;
    throw error;
  }
  return item;
};

const updateTopic = async (id, payload) => {
  const found = await topicRepository.findTopicById(id);
  if (!found) {
    const error = new Error("topic not found");
    error.statusCode = 404;
    throw error;
  }

  const normalized = {
    ...payload,
  };
  if (normalized.topic_name !== undefined) {
    normalized.topic_name = normalized.topic_name.trim();
  }

  return topicRepository.updateTopic(id, normalized);
};

const removeTopic = async (id) => {
  const deleted = await topicRepository.deleteTopic(id);
  if (!deleted) {
    const error = new Error("topic not found");
    error.statusCode = 404;
    throw error;
  }
};

/**
 * Single payload for mobile home + topic screen: plan + live counts.
 */
const getTodayMission = async (userId, query = {}) => {
  const payload = {
    daily_target_words: query.daily_target_words,
    review_cap: query.review_cap,
  };
  const planData = await aiService.generateTodayPlan(userId, payload);
  const reviewItems = await reviewService.getTodayReview(
    userId,
    Number(query.review_cap) || undefined
  );
  const topErrors = await errorRepository.topRepeatedErrors(userId, 20);

  const counts = planData.today_plan?.counts || {};
  return {
    date: new Date().toISOString().slice(0, 10),
    generated_at: planData.generated_at,
    review_due_count: reviewItems.length,
    new_words_target: counts.new_words_target ?? null,
    review_queue_target: counts.review_queue_target ?? null,
    touch_focus: counts.touch_focus ?? null,
    top_errors_count: topErrors.length,
    today_plan: planData.today_plan,
  };
};

module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  removeTopic,
  getTodayMission,
};
