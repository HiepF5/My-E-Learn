const validateCreate = (req, res, next) => {
  const { topic_name } = req.body;
  if (!topic_name || typeof topic_name !== "string" || !topic_name.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "topic_name is required",
    });
  }
  return validateSharedFields(req, res, next);
};

const validateUpdate = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "invalid topic id",
    });
  }

  if (Object.keys(req.body || {}).length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "request body cannot be empty",
    });
  }

  return validateSharedFields(req, res, next);
};

const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "invalid topic id",
    });
  }
  return next();
};

const validateSharedFields = (req, res, next) => {
  const { topic_name, description, level } = req.body;

  if (topic_name !== undefined && (typeof topic_name !== "string" || !topic_name.trim())) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "topic_name must be a non-empty string",
    });
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "description must be a string",
    });
  }

  if (level !== undefined && level !== null && typeof level !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "level must be a string",
    });
  }

  return next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateIdParam,
};
