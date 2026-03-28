const { fn, col, Op } = require("sequelize");
const Vocabulary = require("../models/vocabulary.model");
const VocabularyTopicMap = require("../models/vocabulary-topic-map.model");

const createVocabulary = async (payload, options = {}) => {
  return Vocabulary.create(payload, options);
};

const findAllVocabulary = async () => {
  return Vocabulary.findAll({ order: [["id", "DESC"]] });
};

const findVocabularyUpdatedAfter = async (sinceDate) => {
  if (!sinceDate || Number.isNaN(sinceDate.getTime())) {
    return findAllVocabulary();
  }
  return Vocabulary.findAll({
    where: { updated_at: { [Op.gt]: sinceDate } },
    order: [["updated_at", "ASC"]],
  });
};

const findVocabularyById = async (id, options = {}) => {
  return Vocabulary.findByPk(id, options);
};

const updateVocabulary = async (id, payload, options = {}) => {
  await Vocabulary.update(payload, { where: { id }, ...options });
  return findVocabularyById(id, options);
};

const deleteVocabulary = async (id, options = {}) => {
  return Vocabulary.destroy({ where: { id }, ...options });
};

const replaceTopicMap = async (wordId, topicIds = [], options = {}) => {
  await VocabularyTopicMap.destroy({ where: { word_id: wordId }, ...options });
  if (!topicIds.length) return;

  const rows = topicIds.map((topicId) => ({ word_id: wordId, topic_id: topicId }));
  await VocabularyTopicMap.bulkCreate(rows, options);
};

const getTopicIdsByWordId = async (wordId) => {
  const rows = await VocabularyTopicMap.findAll({ where: { word_id: wordId } });
  return rows.map((row) => row.topic_id);
};

const countWordsPerTopic = async () => {
  const rows = await VocabularyTopicMap.findAll({
    attributes: ["topic_id", [fn("COUNT", col("word_id")), "word_count"]],
    group: ["topic_id"],
    raw: true,
  });
  return rows.map((row) => ({
    topic_id: Number(row.topic_id),
    word_count: Number(row.word_count),
  }));
};

module.exports = {
  createVocabulary,
  findAllVocabulary,
  findVocabularyUpdatedAfter,
  findVocabularyById,
  updateVocabulary,
  deleteVocabulary,
  replaceTopicMap,
  getTopicIdsByWordId,
  countWordsPerTopic,
};
