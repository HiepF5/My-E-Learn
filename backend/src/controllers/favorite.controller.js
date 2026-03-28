const favoriteService = require("../services/favorite.service");

const list = async (req, res, next) => {
  try {
    const data = await favoriteService.list(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Favorite words",
    });
  } catch (error) {
    return next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const wordId = Number(req.body?.word_id);
    if (!Number.isInteger(wordId) || wordId <= 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "word_id must be a positive integer",
      });
    }
    const data = await favoriteService.addFavorite(req.user.userId, wordId);
    return res.status(201).json({
      success: true,
      data,
      message: "Added to favorites",
    });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const wordId = Number(req.params.wordId);
    if (!Number.isInteger(wordId) || wordId <= 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "invalid word id",
      });
    }
    await favoriteService.removeFavorite(req.user.userId, wordId);
    return res.status(200).json({
      success: true,
      data: null,
      message: "Removed from favorites",
    });
  } catch (error) {
    return next(error);
  }
};

const check = async (req, res, next) => {
  try {
    const wordId = Number(req.params.wordId);
    if (!Number.isInteger(wordId) || wordId <= 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "invalid word id",
      });
    }
    const isFav = await favoriteService.isFavorite(req.user.userId, wordId);
    return res.status(200).json({
      success: true,
      data: { is_favorite: isFav },
      message: "Favorite status",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  add,
  remove,
  check,
};
