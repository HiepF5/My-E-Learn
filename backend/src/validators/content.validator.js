const validateVocabularyId = (req, res, next) => {
  if (!/^\d+$/.test(String(req.params.id))) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "invalid vocabulary id",
    });
  }
  return next();
};

const validateCollocationBody = (req, res, next) => {
  const { collocation } = req.body;
  if (!collocation || typeof collocation !== "string" || !collocation.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "collocation is required",
    });
  }
  return next();
};

const validateWordFamilyBody = (req, res, next) => {
  const { related_word } = req.body;
  if (!related_word || typeof related_word !== "string" || !related_word.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "related_word is required",
    });
  }
  return next();
};

const validatePositiveIdParam = (paramName, message) => (req, res, next) => {
  if (!/^\d+$/.test(String(req.params[paramName]))) {
    return res.status(400).json({
      success: false,
      data: null,
      message,
    });
  }
  return next();
};

const validateCollocationId = validatePositiveIdParam(
  "collocationId",
  "invalid collocation id"
);
const validateWordFamilyId = validatePositiveIdParam(
  "wordFamilyId",
  "invalid word family id"
);

module.exports = {
  validateVocabularyId,
  validateCollocationBody,
  validateWordFamilyBody,
  validateCollocationId,
  validateWordFamilyId,
};
