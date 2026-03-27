/**
 * Heuristic: looks "learned" (level / counts) but still makes mistakes.
 */
const isFalseMaster = (progress) => {
  const level = Number(progress.level) || 1;
  const wrong = Number(progress.wrong_count) || 0;
  const correct = Number(progress.correct_count) || 0;
  const total = wrong + correct;

  if (total === 0) return false;

  const wrongRate = wrong / total;

  if (level >= 4 && wrong >= 1 && wrongRate >= 0.2) return true;
  if (correct >= 5 && wrong >= 2 && wrongRate >= 0.15) return true;
  if (level >= 3 && wrong >= 3) return true;

  return false;
};

module.exports = {
  isFalseMaster,
};
