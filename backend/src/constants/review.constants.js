const REVIEW_LIMIT = {
  DEFAULT: 30,
  MIN: 1,
  MAX: 100,
};

const INTERVALS = [1, 3, 7, 14, 30, 60, 120];

const RATING_MAP = {
  Again: { levelDelta: -999, multiplier: 0, easeDelta: -0.2, forceInterval: 1 },
  Hard: { levelDelta: 0, multiplier: 0.7, easeDelta: -0.05 },
  Good: { levelDelta: 1, multiplier: 1, easeDelta: 0 },
  Easy: { levelDelta: 2, multiplier: 1.3, easeDelta: 0.1 },
};

const ALLOWED_RATINGS = Object.keys(RATING_MAP);
const ALLOWED_REVIEW_MODES = ["recognize", "type", "sentence", "flashcard"];

module.exports = {
  REVIEW_LIMIT,
  INTERVALS,
  RATING_MAP,
  ALLOWED_RATINGS,
  ALLOWED_REVIEW_MODES,
};
