const streakService = require("../services/streak.service");

const getCurrent = async (req, res, next) => {
  try {
    const data = await streakService.getCurrent(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Current streak",
    });
  } catch (error) {
    return next(error);
  }
};

const checkIn = async (req, res, next) => {
  try {
    const data = await streakService.checkInToday(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Checked in for today",
    });
  } catch (error) {
    return next(error);
  }
};

const heatmap = async (req, res, next) => {
  try {
    const data = await streakService.getHeatmap(req.user.userId, req.query.days);
    return res.status(200).json({
      success: true,
      data,
      message: "Streak heatmap",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCurrent,
  checkIn,
  heatmap,
};
