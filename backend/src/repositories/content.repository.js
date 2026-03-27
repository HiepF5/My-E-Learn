const Collocation = require("../models/collocation.model");
const WordFamily = require("../models/word-family.model");

const listCollocations = (wordId) => {
  return Collocation.findAll({
    where: { word_id: wordId },
    order: [["id", "DESC"]],
  });
};

const createCollocation = ({ word_id, collocation, example }) => {
  return Collocation.create({ word_id, collocation, example });
};

const deleteCollocation = (id, wordId) => {
  return Collocation.destroy({ where: { id, word_id: wordId } });
};

const listWordFamily = (wordId) => {
  return WordFamily.findAll({
    where: { root_word_id: wordId },
    order: [["id", "DESC"]],
  });
};

const createWordFamily = ({ root_word_id, related_word, relation_type }) => {
  return WordFamily.create({ root_word_id, related_word, relation_type });
};

const deleteWordFamily = (id, wordId) => {
  return WordFamily.destroy({ where: { id, root_word_id: wordId } });
};

module.exports = {
  listCollocations,
  createCollocation,
  deleteCollocation,
  listWordFamily,
  createWordFamily,
  deleteWordFamily,
};
