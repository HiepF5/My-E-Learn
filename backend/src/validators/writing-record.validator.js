const validateListQuery = (req, res, next) => {
  const { limit } = req.query || {};
  if (limit !== undefined && (!/^\d+$/.test(String(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "limit must be an integer between 1 and 100",
    });
  }
  return next();
};

const validateCreateWritingRecord = (req, res, next) => {
  const { word_id, prompt_text, written_text, corrected_text, score, reviewed_at } = req.body || {};

  if (word_id !== undefined && (!Number.isInteger(word_id) || word_id <= 0)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "word_id must be a positive integer",
    });
  }
  if (prompt_text !== undefined && typeof prompt_text !== "string") {
    return res.status(400).json({ success: false, data: null, message: "prompt_text must be a string" });
  }
  if (written_text !== undefined && typeof written_text !== "string") {
    return res.status(400).json({ success: false, data: null, message: "written_text must be a string" });
  }
  if (corrected_text !== undefined && typeof corrected_text !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "corrected_text must be a string",
    });
  }
  if (score !== undefined && (Number.isNaN(Number(score)) || Number(score) < 0 || Number(score) > 100)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "score must be a number between 0 and 100",
    });
  }
  if (reviewed_at !== undefined && Number.isNaN(new Date(reviewed_at).getTime())) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "reviewed_at must be a valid datetime",
    });
  }
  return next();
};

module.exports = {
  validateListQuery,
  validateCreateWritingRecord,
};

