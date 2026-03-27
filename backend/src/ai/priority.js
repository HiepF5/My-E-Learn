/**
 * Rule-based priority score for scheduling focus (no ML).
 * Higher = more urgent to review / drill.
 */
const scoreProgress = (progress) => {
  const wrong = Number(progress.wrong_count) || 0;
  const correct = Number(progress.correct_count) || 0;
  const level = Number(progress.level) || 1;
  const ease = Number(progress.ease_factor) || 2.5;
  const total = wrong + correct + 1;

  const wrongRate = wrong / total;
  return wrong * 10 + wrongRate * 50 + level * 2 - ease;
};

const rankProgress = (rows) =>
  [...rows].sort((a, b) => scoreProgress(b) - scoreProgress(a));

module.exports = {
  scoreProgress,
  rankProgress,
};
