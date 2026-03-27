const reviewService = require("../services/review.service");

const getToday = async (req, res, next) => {
  try {
    const data = await reviewService.getTodayReview(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "Today review queue",
    });
  } catch (error) {
    return next(error);
  }
};

const submit = async (req, res, next) => {
  try {
    const data = await reviewService.submitReview({
      userId: req.user.userId,
      wordId: req.body.word_id,
      answerResult: req.body.answer_result,
      responseTimeMs: req.body.response_time_ms,
      reviewMode: req.body.review_mode,
      rating: req.body.rating,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Review submitted",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getToday,
  submit,
};
