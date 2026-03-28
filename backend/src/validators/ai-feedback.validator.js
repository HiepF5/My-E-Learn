const ALLOWED_SOURCE_TYPES = ["speaking", "writing", "general"];

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

const validateCreateAiFeedback = (req, res, next) => {
  const { source_type, source_id, feedback_text, suggestions, model_name, generate_llm, learner_text } =
    req.body || {};

  const useLlm = generate_llm === true || generate_llm === "true";
  if (useLlm) {
    if (!learner_text || typeof learner_text !== "string" || !learner_text.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "learner_text is required when generate_llm is true",
      });
    }
  } else if (!feedback_text || typeof feedback_text !== "string" || !feedback_text.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "feedback_text is required unless generate_llm is true with learner_text",
    });
  }
  if (source_type !== undefined && !ALLOWED_SOURCE_TYPES.includes(String(source_type).toLowerCase())) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "source_type must be one of speaking, writing, general",
    });
  }
  if (source_id !== undefined && (!Number.isInteger(source_id) || source_id <= 0)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "source_id must be a positive integer",
    });
  }
  if (suggestions !== undefined && typeof suggestions !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "suggestions must be a string",
    });
  }
  if (model_name !== undefined && typeof model_name !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "model_name must be a string",
    });
  }
  return next();
};

module.exports = {
  validateListQuery,
  validateCreateAiFeedback,
};

