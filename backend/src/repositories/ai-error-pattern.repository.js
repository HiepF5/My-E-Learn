const AiErrorPattern = require("../models/ai-error-pattern.model");

const recordDetection = async (userId, patternName) => {
  const name = String(patternName || "").trim();
  if (!name) return null;

  const existing = await AiErrorPattern.findOne({
    where: { user_id: userId, pattern_name: name },
  });
  if (existing) {
    existing.error_count = Number(existing.error_count) + 1;
    existing.last_detected_at = new Date();
    return existing.save();
  }

  return AiErrorPattern.create({
    user_id: userId,
    pattern_name: name,
    error_count: 1,
    last_detected_at: new Date(),
  });
};

const listByUser = (userId, limit = 50) =>
  AiErrorPattern.findAll({
    where: { user_id: userId },
    order: [
      ["error_count", "DESC"],
      ["last_detected_at", "DESC"],
    ],
    limit,
  });

module.exports = {
  recordDetection,
  listByUser,
};
