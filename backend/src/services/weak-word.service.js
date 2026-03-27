const reviewRepository = require("../repositories/review.repository");
const weakWordRepository = require("../repositories/weak-word.repository");

const RECENT_DAYS = 14;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const computeWeakScore = ({ wrong, correct, recentWrong }) => {
  const w = Number(wrong) || 0;
  const c = Number(correct) || 0;
  const rw = Number(recentWrong) || 0;
  const total = w + c + 1;
  const wrongRate = w / total;

  let score = w * 8 + rw * 12 + wrongRate * 25;
  if (c > 0 && w > c) score += 5;
  return Number(score.toFixed(4));
};

const buildRecentWrongMap = async (userId) => {
  const since = new Date();
  since.setDate(since.getDate() - RECENT_DAYS);
  const rows = await reviewRepository.countRecentWrongsByWord(userId, since);
  const map = new Map();
  for (const row of rows) {
    const wid = Number(row.word_id);
    const cnt = Number(row.wrong_cnt) || 0;
    map.set(wid, cnt);
  }
  return map;
};

const recomputeAndPersist = async (userId) => {
  const progressRows = await reviewRepository.findAllProgressForUser(userId, 5000);
  const recentMap = await buildRecentWrongMap(userId);

  const wordIds = new Set();
  for (const p of progressRows) wordIds.add(Number(p.word_id));
  for (const wid of recentMap.keys()) wordIds.add(wid);

  const now = new Date();
  const rows = [];

  for (const wid of wordIds) {
    const progress = progressRows.find((p) => Number(p.word_id) === wid);
    const wrong = progress ? Number(progress.wrong_count) || 0 : 0;
    const correct = progress ? Number(progress.correct_count) || 0 : 0;
    const recentWrong = recentMap.get(wid) || 0;

    if (wrong === 0 && recentWrong === 0) continue;

    rows.push({
      user_id: userId,
      word_id: wid,
      weak_score: computeWeakScore({ wrong, correct, recentWrong }),
      wrong_count_snapshot: wrong,
      correct_count_snapshot: correct,
      recent_wrong_count: recentWrong,
      last_computed_at: now,
    });
  }

  await weakWordRepository.replaceAllForUser(userId, rows);
};

const listWeakWords = async (userId, limit = 30) => {
  const safeLimit = clamp(Number(limit) || 30, 1, 100);
  await recomputeAndPersist(userId);
  const rows = await weakWordRepository.findByUserOrderByScore(userId, safeLimit);
  return rows.map((r) => {
    const j = r.toJSON();
    return {
      word_id: j.word_id,
      weak_score: Number(j.weak_score),
      wrong_count_snapshot: j.wrong_count_snapshot,
      correct_count_snapshot: j.correct_count_snapshot,
      recent_wrong_count: j.recent_wrong_count,
      last_computed_at: j.last_computed_at,
    };
  });
};

module.exports = {
  listWeakWords,
  recomputeAndPersist,
  computeWeakScore,
};
