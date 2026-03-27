const ALLOWED_RATINGS = ["Again", "Hard", "Good", "Easy"];

const validateSubmitReview = (req, res, next) => {
  const { word_id, answer_result, response_time_ms, rating } = req.body || {};

  if (!Number.isInteger(word_id) || word_id <= 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "word_id must be a positive integer",
    });
  }

  if (typeof answer_result !== "boolean") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "answer_result must be a boolean",
    });
  }

  if (
    response_time_ms !== undefined &&
    (!Number.isInteger(response_time_ms) || response_time_ms < 0)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "response_time_ms must be a non-negative integer",
    });
  }

  if (rating !== undefined && !ALLOWED_RATINGS.includes(rating)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "rating must be one of Again, Hard, Good, Easy",
    });
  }

  return next();
};

module.exports = {
  validateSubmitReview,
};
