const sequelize = require("../config/database");
const vocabularyRepository = require("../repositories/vocabulary.repository");

const withTopicIds = async (item) => {
  if (!item) return null;
  const topic_ids = await vocabularyRepository.getTopicIdsByWordId(item.id);
  return {
    ...item.toJSON(),
    topic_ids,
  };
};

const createVocabulary = async (payload) => {
  const { topic_ids = [], ...vocabularyPayload } = payload;

  return sequelize.transaction(async (transaction) => {
    const item = await vocabularyRepository.createVocabulary(vocabularyPayload, {
      transaction,
    });

    await vocabularyRepository.replaceTopicMap(item.id, topic_ids, { transaction });
    return withTopicIds(item);
  });
};

const getAllVocabulary = async () => {
  const list = await vocabularyRepository.findAllVocabulary();
  return Promise.all(list.map((item) => withTopicIds(item)));
};

const getVocabularyById = async (id) => {
  const item = await vocabularyRepository.findVocabularyById(id);
  if (!item) {
    const error = new Error("vocabulary not found");
    error.statusCode = 404;
    throw error;
  }
  return withTopicIds(item);
};

const updateVocabulary = async (id, payload) => {
  const existing = await vocabularyRepository.findVocabularyById(id);
  if (!existing) {
    const error = new Error("vocabulary not found");
    error.statusCode = 404;
    throw error;
  }

  const { topic_ids, ...vocabularyPayload } = payload;
  return sequelize.transaction(async (transaction) => {
    const updated = await vocabularyRepository.updateVocabulary(id, vocabularyPayload, {
      transaction,
    });

    if (topic_ids !== undefined) {
      await vocabularyRepository.replaceTopicMap(id, topic_ids, { transaction });
    }

    return withTopicIds(updated);
  });
};

const removeVocabulary = async (id) => {
  const deleted = await vocabularyRepository.deleteVocabulary(id);
  if (!deleted) {
    const error = new Error("vocabulary not found");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  createVocabulary,
  getAllVocabulary,
  getVocabularyById,
  updateVocabulary,
  removeVocabulary,
};
