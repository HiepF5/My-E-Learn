const vocabularyService = require("../services/vocabulary.service");

const list = async (req, res, next) => {
  try {
    const data = await vocabularyService.getAllVocabulary();
    return res.status(200).json({
      success: true,
      data,
      message: "Vocabulary list",
    });
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await vocabularyService.getVocabularyById(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data,
      message: "Vocabulary detail",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await vocabularyService.createVocabulary(req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Vocabulary created",
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await vocabularyService.updateVocabulary(
      Number(req.params.id),
      req.body
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Vocabulary updated",
    });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await vocabularyService.removeVocabulary(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data: null,
      message: "Vocabulary deleted",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
