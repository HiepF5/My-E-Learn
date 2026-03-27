const Topic = require("../models/topic.model");

const createTopic = (payload, options = {}) => Topic.create(payload, options);

const listTopics = () =>
  Topic.findAll({
    order: [["id", "DESC"]],
  });

const findTopicById = (id, options = {}) => Topic.findByPk(id, options);

const updateTopic = async (id, payload, options = {}) => {
  await Topic.update(payload, { where: { id }, ...options });
  return findTopicById(id, options);
};

const deleteTopic = (id, options = {}) =>
  Topic.destroy({
    where: { id },
    ...options,
  });

module.exports = {
  createTopic,
  listTopics,
  findTopicById,
  updateTopic,
  deleteTopic,
};
