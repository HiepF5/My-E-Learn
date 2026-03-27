const AiFeedback = require("../models/ai-feedback.model");

const createAiFeedback = (payload) => AiFeedback.create(payload);

const listAiFeedbackByUser = (userId, limit = 30) =>
  AiFeedback.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit,
  });

module.exports = {
  createAiFeedback,
  listAiFeedbackByUser,
};

