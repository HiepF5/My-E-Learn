const validateCreate = (req, res, next) => {
  const { word } = req.body;
  if (!word || typeof word !== "string" || !word.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "word is required",
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
      message: "invalid vocabulary id",
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

const validateSharedFields = (req, res, next) => {
  const { difficulty, topic_ids, word } = req.body;

  if (word !== undefined && (typeof word !== "string" || !word.trim())) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "word must be a non-empty string",
    });
  }

  if (difficulty !== undefined) {
    const isValidDifficulty =
      Number.isInteger(difficulty) && difficulty >= 1 && difficulty <= 5;
    if (!isValidDifficulty) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "difficulty must be an integer between 1 and 5",
      });
    }
  }

  if (topic_ids !== undefined) {
    const isValidTopicIds =
      Array.isArray(topic_ids) &&
      topic_ids.every((id) => Number.isInteger(id) && id > 0);
    if (!isValidTopicIds) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "topic_ids must be an array of positive integers",
      });
    }
  }

  return next();
};

module.exports = {
  validateCreate,
  validateUpdate,
};
