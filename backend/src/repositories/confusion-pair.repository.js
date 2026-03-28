const ConfusionPair = require("../models/confusion-pair.model");

const recordWrongSelection = async (
  userId,
  wordId,
  confusedWithWordId,
  { transaction } = {}
) => {
  if (!userId || !wordId || !confusedWithWordId) return null;
  if (Number(wordId) === Number(confusedWithWordId)) return null;

  const existing = await ConfusionPair.findOne({
    where: {
      user_id: userId,
      word_id: wordId,
      confused_with_word_id: confusedWithWordId,
    },
    transaction,
  });

  const now = new Date();
  if (existing) {
    existing.wrong_count = Number(existing.wrong_count) + 1;
    existing.last_wrong_at = now;
    return existing.save({ transaction });
  }

  return ConfusionPair.create(
    {
      user_id: userId,
      word_id: wordId,
      confused_with_word_id: confusedWithWordId,
      wrong_count: 1,
      last_wrong_at: now,
    },
    { transaction }
  );
};

const listByUser = (userId, limit = 50) =>
  ConfusionPair.findAll({
    where: { user_id: userId },
    order: [
      ["wrong_count", "DESC"],
      ["last_wrong_at", "DESC"],
    ],
    limit,
  });

module.exports = {
  recordWrongSelection,
  listByUser,
};
