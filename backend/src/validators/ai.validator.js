const { REVIEW_LIMIT } = require("../constants/review.constants");

const validateGenerateTodayPlan = (req, res, next) => {
  const body = req.body || {};
  if (Object.keys(body).length === 0) {
    return next();
  }

  const { daily_target_words, review_cap } = body;

  if (daily_target_words !== undefined && daily_target_words !== null) {
    if (!Number.isInteger(daily_target_words) || daily_target_words < 1 || daily_target_words > 50) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "daily_target_words must be an integer between 1 and 50",
      });
    }
  }

  if (review_cap !== undefined && review_cap !== null) {
    if (
      !Number.isInteger(review_cap) ||
      review_cap < REVIEW_LIMIT.MIN ||
      review_cap > REVIEW_LIMIT.MAX
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `review_cap must be an integer between ${REVIEW_LIMIT.MIN} and ${REVIEW_LIMIT.MAX}`,
      });
    }
  }

  return next();
};

module.exports = {
  validateGenerateTodayPlan,
};
