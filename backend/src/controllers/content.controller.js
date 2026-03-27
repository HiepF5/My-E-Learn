const contentService = require("../services/content.service");

const listCollocations = async (req, res, next) => {
  try {
    const data = await contentService.getCollocations(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data,
      message: "Collocations list",
    });
  } catch (error) {
    return next(error);
  }
};

const createCollocation = async (req, res, next) => {
  try {
    const data = await contentService.addCollocation(Number(req.params.id), req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Collocation created",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCollocation = async (req, res, next) => {
  try {
    await contentService.removeCollocation(
      Number(req.params.id),
      Number(req.params.collocationId)
    );
    return res.status(200).json({
      success: true,
      data: null,
      message: "Collocation deleted",
    });
  } catch (error) {
    return next(error);
  }
};

const listWordFamily = async (req, res, next) => {
  try {
    const data = await contentService.getWordFamily(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data,
      message: "Word family list",
    });
  } catch (error) {
    return next(error);
  }
};

const createWordFamily = async (req, res, next) => {
  try {
    const data = await contentService.addWordFamily(Number(req.params.id), req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Word family item created",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteWordFamily = async (req, res, next) => {
  try {
    await contentService.removeWordFamily(
      Number(req.params.id),
      Number(req.params.wordFamilyId)
    );
    return res.status(200).json({
      success: true,
      data: null,
      message: "Word family item deleted",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listCollocations,
  createCollocation,
  deleteCollocation,
  listWordFamily,
  createWordFamily,
  deleteWordFamily,
};
