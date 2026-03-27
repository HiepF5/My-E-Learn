const topicRepository = require("../repositories/topic.repository");

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

module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  removeTopic,
};
