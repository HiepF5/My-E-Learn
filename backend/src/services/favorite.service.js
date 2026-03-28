const Vocabulary = require("../models/vocabulary.model");
const favoriteRepository = require("../repositories/favorite.repository");

const list = async (userId) => favoriteRepository.listWithWords(userId);

const addFavorite = async (userId, wordId) => {
  const v = await Vocabulary.findByPk(wordId);
  if (!v) {
    const e = new Error("vocabulary not found");
    e.statusCode = 404;
    throw e;
  }
  try {
    await favoriteRepository.add(userId, wordId);
  } catch (err) {
    if (err.original?.code === "ER_DUP_ENTRY") return { word_id: wordId, already_exists: true };
    throw err;
  }
  return { word_id: wordId };
};

const removeFavorite = async (userId, wordId) => {
  const ok = await favoriteRepository.remove(userId, wordId);
  if (!ok) {
    const e = new Error("favorite not found");
    e.statusCode = 404;
    throw e;
  }
  return { removed: true };
};

const isFavorite = async (userId, wordId) => favoriteRepository.exists(userId, wordId);

module.exports = {
  list,
  addFavorite,
  removeFavorite,
  isFavorite,
};
