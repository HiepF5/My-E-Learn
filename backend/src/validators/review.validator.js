const {
  ALLOWED_RATINGS,
  ALLOWED_REVIEW_MODES,
} = require("../constants/review.constants");

const validateSubmitReview = (req, res, next) => {
  const { word_id, answer_result, selected_word_id, response_time_ms, rating, review_mode } = req.body || {};

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

  if (selected_word_id !== undefined && selected_word_id !== null) {
    if (!Number.isInteger(selected_word_id) || selected_word_id <= 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "selected_word_id must be a positive integer",
      });
    }
  }

  if (review_mode !== undefined && !ALLOWED_REVIEW_MODES.includes(review_mode)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `review_mode must be one of ${ALLOWED_REVIEW_MODES.join(", ")}`,
    });
  }

  return next();
};

module.exports = {
  validateSubmitReview,
};
