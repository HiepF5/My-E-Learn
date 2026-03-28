const userLearningRepository = require("../repositories/user-learning.repository");

const getLearningState = async (userId) => userLearningRepository.getLearningState(userId);

const patchLearningState = async (userId, body) => {
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(body, "last_review_word_id")) {
    const v = body.last_review_word_id;
    if (v === null) {
      payload.last_review_word_id = null;
    } else {
      const n = Number(v);
      if (!Number.isInteger(n) || n <= 0) {
        const e = new Error("last_review_word_id must be null or positive integer");
        e.statusCode = 400;
        throw e;
      }
      payload.last_review_word_id = n;
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, "last_screen")) {
    const s = body.last_screen;
    if (s === null || s === undefined) {
      payload.last_screen = null;
    } else if (typeof s !== "string") {
      const e = new Error("last_screen must be string or null");
      e.statusCode = 400;
      throw e;
    } else {
      payload.last_screen = s.slice(0, 64);
    }
  }
  await userLearningRepository.patchLearningState(userId, payload);
  return getLearningState(userId);
};

module.exports = {
  getLearningState,
  patchLearningState,
};
