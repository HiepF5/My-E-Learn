const validateWordIdParam = (req, res, next) => {
  if (!/^\d+$/.test(String(req.params.wordId))) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "invalid word id",
    });
  }
  return next();
};

const validatePatchTouchStep = (req, res, next) => {
  const { touch_step, done } = req.body || {};

  if (![1, 2, 3].includes(touch_step)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "touch_step must be 1, 2, or 3",
    });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "done must be boolean",
    });
  }

  return next();
};

module.exports = {
  validateWordIdParam,
  validatePatchTouchStep,
};
