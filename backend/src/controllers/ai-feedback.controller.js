const aiFeedbackService = require("../services/ai-feedback.service");

const list = async (req, res, next) => {
  try {
    const data = await aiFeedbackService.listAiFeedback(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "AI feedback list",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await aiFeedbackService.createAiFeedback(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "AI feedback created",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
};

