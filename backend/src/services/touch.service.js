const touchRepository = require("../repositories/touch.repository");
const vocabularyRepository = require("../repositories/vocabulary.repository");

const ensureVocabularyExists = async (wordId) => {
  const item = await vocabularyRepository.findVocabularyById(wordId);
  if (!item) {
    const error = new Error("vocabulary not found");
    error.statusCode = 404;
    throw error;
  }
};

const withEligibility = (row) => {
  const payload = row.toJSON();
  return {
    ...payload,
    eligible_for_learned:
      payload.touch1_done && payload.touch2_done && payload.touch3_done,
  };
};

const getOrCreateTouchHistory = async (userId, wordId) => {
  await ensureVocabularyExists(wordId);
  let row = await touchRepository.findByUserAndWord(userId, wordId);
  if (!row) {
    row = await touchRepository.create({
      user_id: userId,
      word_id: wordId,
      touch1_done: false,
      touch2_done: false,
      touch3_done: false,
    });
  }
  return withEligibility(row);
};

const updateTouchStep = async (userId, wordId, touchStep, done = true) => {
  await ensureVocabularyExists(wordId);
  let row = await touchRepository.findByUserAndWord(userId, wordId);
  if (!row) {
    row = await touchRepository.create({
      user_id: userId,
      word_id: wordId,
      touch1_done: false,
      touch2_done: false,
      touch3_done: false,
    });
  }

  if (touchStep === 1) row.touch1_done = done;
  if (touchStep === 2) row.touch2_done = done;
  if (touchStep === 3) row.touch3_done = done;

  await touchRepository.save(row);
  return withEligibility(row);
};

module.exports = {
  getOrCreateTouchHistory,
  updateTouchStep,
};
