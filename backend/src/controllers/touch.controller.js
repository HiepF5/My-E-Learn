const touchService = require("../services/touch.service");

const getTouchHistory = async (req, res, next) => {
  try {
    const data = await touchService.getOrCreateTouchHistory(
      req.user.userId,
      Number(req.params.wordId)
    );
    return res.status(200).json({
      success: true,
      data,
      message: "Touch history",
    });
  } catch (error) {
    return next(error);
  }
};

const patchTouchStep = async (req, res, next) => {
  try {
    const data = await touchService.updateTouchStep(
      req.user.userId,
      Number(req.params.wordId),
      req.body.touch_step,
      req.body.done !== undefined ? req.body.done : true
    );

    return res.status(200).json({
      success: true,
      data,
      message: "Touch step updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTouchHistory,
  patchTouchStep,
};
