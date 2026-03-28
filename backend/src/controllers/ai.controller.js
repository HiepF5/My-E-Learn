const aiService = require("../services/ai.service");

const generateTodayPlan = async (req, res, next) => {
  try {
    const data = await aiService.generateTodayPlan(req.user.userId, req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "Today plan generated",
    });
  } catch (error) {
    return next(error);
  }
};

const listErrorPatterns = async (req, res, next) => {
  try {
    const data = await aiService.listErrorPatterns(req.user.userId, req.query || {});
    return res.status(200).json({
      success: true,
      data,
      message: "AI error patterns",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateTodayPlan,
  listErrorPatterns,
};
