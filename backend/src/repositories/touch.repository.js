const TouchHistory = require("../models/touch-history.model");

const findByUserAndWord = (userId, wordId) => {
  return TouchHistory.findOne({
    where: { user_id: userId, word_id: wordId },
  });
};

const create = (payload, options = {}) => {
  return TouchHistory.create(payload, options);
};

const save = (touchHistory, options = {}) => {
  return touchHistory.save(options);
};

module.exports = {
  findByUserAndWord,
  create,
  save,
};
