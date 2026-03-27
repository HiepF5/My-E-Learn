const contentRepository = require("../repositories/content.repository");
const vocabularyRepository = require("../repositories/vocabulary.repository");

const ensureVocabularyExists = async (wordId) => {
  const item = await vocabularyRepository.findVocabularyById(wordId);
  if (!item) {
    const error = new Error("vocabulary not found");
    error.statusCode = 404;
    throw error;
  }
};

const getCollocations = async (wordId) => {
  await ensureVocabularyExists(wordId);
  return contentRepository.listCollocations(wordId);
};

const addCollocation = async (wordId, payload) => {
  await ensureVocabularyExists(wordId);
  return contentRepository.createCollocation({
    word_id: wordId,
    collocation: payload.collocation,
    example: payload.example,
  });
};

const removeCollocation = async (wordId, collocationId) => {
  const deleted = await contentRepository.deleteCollocation(collocationId, wordId);
  if (!deleted) {
    const error = new Error("collocation not found");
    error.statusCode = 404;
    throw error;
  }
};

const getWordFamily = async (wordId) => {
  await ensureVocabularyExists(wordId);
  return contentRepository.listWordFamily(wordId);
};

const addWordFamily = async (wordId, payload) => {
  await ensureVocabularyExists(wordId);
  return contentRepository.createWordFamily({
    root_word_id: wordId,
    related_word: payload.related_word,
    relation_type: payload.relation_type,
  });
};

const removeWordFamily = async (wordId, wordFamilyId) => {
  const deleted = await contentRepository.deleteWordFamily(wordFamilyId, wordId);
  if (!deleted) {
    const error = new Error("word family item not found");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  getCollocations,
  addCollocation,
  removeCollocation,
  getWordFamily,
  addWordFamily,
  removeWordFamily,
};
