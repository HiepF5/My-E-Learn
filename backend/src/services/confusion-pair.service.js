const reviewRepository = require("../repositories/review.repository");

const RECENT_DAYS = 14;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const listConfusedWords = async (userId, limit = 15) => {
  const safeLimit = clamp(Number(limit) || 15, 1, 50);

  const since = new Date();
  since.setDate(since.getDate() - RECENT_DAYS);

  const rows = await reviewRepository.countRecentWrongSelectionsByWord(userId, since);
  const sorted = rows
    .slice()
    .sort((a, b) => Number(b.wrong_selection_cnt) - Number(a.wrong_selection_cnt));

  return sorted
    .slice(0, safeLimit)
    .map((r) => Number(r.selected_word_id))
    .filter((wid) => Number.isFinite(wid) && wid > 0);
};

module.exports = {
  listConfusedWords,
};

