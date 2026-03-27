const errorService = require("../services/error.service");

const list = async (req, res, next) => {
  try {
    const data = await errorService.listErrors(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Error notebook list",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await errorService.createError(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Error notebook item created",
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await errorService.updateError(
      Number(req.params.id),
      req.user.userId,
      req.body
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Error notebook item updated",
    });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await errorService.deleteError(Number(req.params.id), req.user.userId);
    return res.status(200).json({
      success: true,
      data: null,
      message: "Error notebook item deleted",
    });
  } catch (error) {
    return next(error);
  }
};

const setFixed = async (req, res, next) => {
  try {
    const data = await errorService.markFixed(
      Number(req.params.id),
      req.user.userId,
      req.body.fixed
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Error notebook fixed status updated",
    });
  } catch (error) {
    return next(error);
  }
};

const incrementRepeat = async (req, res, next) => {
  try {
    const data = await errorService.increaseRepeatCount(
      Number(req.params.id),
      req.user.userId
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Error repeat count incremented",
    });
  } catch (error) {
    return next(error);
  }
};

const topRepeated = async (req, res, next) => {
  try {
    const data = await errorService.getTopRepeated(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "Top repeated errors",
    });
  } catch (error) {
    return next(error);
  }
};

const listTags = async (req, res, next) => {
  try {
    const data = await errorService.listTags();
    return res.status(200).json({
      success: true,
      data,
      message: "Error tags list",
    });
  } catch (error) {
    return next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const data = await errorService.createTag(req.body.tag_name);
    return res.status(201).json({
      success: true,
      data,
      message: "Error tag created",
    });
  } catch (error) {
    return next(error);
  }
};

const getErrorTags = async (req, res, next) => {
  try {
    const data = await errorService.getErrorTags(Number(req.params.id), req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Error tags",
    });
  } catch (error) {
    return next(error);
  }
};

const setErrorTags = async (req, res, next) => {
  try {
    const data = await errorService.setErrorTags(
      Number(req.params.id),
      req.user.userId,
      req.body.tag_ids
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Error tags updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  setFixed,
  incrementRepeat,
  topRepeated,
  listTags,
  createTag,
  getErrorTags,
  setErrorTags,
};
