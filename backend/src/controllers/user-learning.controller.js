const userLearningService = require("../services/user-learning.service");

const getState = async (req, res, next) => {
  try {
    const data = await userLearningService.getLearningState(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Learning state",
    });
  } catch (error) {
    return next(error);
  }
};

const patchState = async (req, res, next) => {
  try {
    const data = await userLearningService.patchLearningState(req.user.userId, req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "Learning state updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getState,
  patchState,
};
