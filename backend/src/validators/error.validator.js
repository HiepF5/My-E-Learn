const validateIdParam = (req, res, next) => {
  if (!/^\d+$/.test(String(req.params.id))) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "invalid error id",
    });
  }
  return next();
};

const validateCreateError = (req, res, next) => {
  const { error_type, wrong_text, corrected_text, repeat_count, fixed } = req.body || {};

  if (!wrong_text || typeof wrong_text !== "string" || !wrong_text.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "wrong_text is required",
    });
  }

  if (corrected_text !== undefined && typeof corrected_text !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "corrected_text must be a string",
    });
  }

  if (error_type !== undefined && typeof error_type !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "error_type must be a string",
    });
  }

  if (
    repeat_count !== undefined &&
    (!Number.isInteger(repeat_count) || repeat_count < 1)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "repeat_count must be an integer >= 1",
    });
  }

  if (fixed !== undefined && typeof fixed !== "boolean") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "fixed must be boolean",
    });
  }

  return next();
};

const validateUpdateError = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "request body cannot be empty",
    });
  }
  return validateCreateError(req, res, next);
};

const validateFixedPayload = (req, res, next) => {
  if (typeof req.body?.fixed !== "boolean") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "fixed must be boolean",
    });
  }
  return next();
};

module.exports = {
  validateIdParam,
  validateCreateError,
  validateUpdateError,
  validateFixedPayload,
  validateCreateTag: (req, res, next) => {
    const tagName = req.body?.tag_name;
    if (!tagName || typeof tagName !== "string" || !tagName.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "tag_name is required",
      });
    }
    return next();
  },
  validateSetErrorTags: (req, res, next) => {
    const tagIds = req.body?.tag_ids;
    if (
      !Array.isArray(tagIds) ||
      !tagIds.every((id) => Number.isInteger(id) && id > 0)
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "tag_ids must be an array of positive integers",
      });
    }
    return next();
  },
};
