const { scoreProgress, rankProgress } = require("./priority");
const { isFalseMaster } = require("./false-master");
const { buildMistakeFocus } = require("./error-patterns");

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const pickPrimaryTopic = (topics, wordCounts) => {
  if (!topics.length) return null;

  const countByTopic = new Map(wordCounts.map((r) => [r.topic_id, r.word_count]));
  let best = topics[0];
  let bestCount = countByTopic.get(Number(best.id)) || 0;

  for (const t of topics) {
    const c = countByTopic.get(Number(t.id)) || 0;
    if (c > bestCount) {
      best = t;
      bestCount = c;
    }
  }

  return best;
};

const buildTodayPlan = ({
  topics,
  wordCounts,
  topErrors,
  progressRows,
  weakWords = [],
  confusedWordIds = [],
  dailyTargetWords = 10,
  reviewCap = 30,
}) => {
  const safeDaily = clamp(Number(dailyTargetWords) || 10, 1, 50);
  const safeReview = clamp(Number(reviewCap) || 30, 1, 100);

  const ranked = rankProgress(progressRows);
  const falseMasterIds = ranked.filter(isFalseMaster).map((p) => p.word_id);
  // Weak-word IDs are recomputed using weak_score (includes recent mistakes from review_history),
  // so the rule engine can boost words that are currently failing recently.
  const primaryWeakWordIds = Array.isArray(weakWords) && weakWords.length
    ? weakWords.slice(0, 15).map((w) => Number(w.word_id))
    : ranked.slice(0, 15).map((p) => p.word_id);

  // Pair confusion boost: prioritize words the learner repeatedly selects when answering incorrectly.
  const boostedConfusedWordIds = Array.isArray(confusedWordIds) && confusedWordIds.length
    ? confusedWordIds.slice(0, 15).map((wid) => Number(wid))
    : [];

  const weakWordIds = Array.from(new Set([...primaryWeakWordIds, ...boostedConfusedWordIds])).slice(0, 15);

  const priorityPreview = ranked.slice(0, 8).map((p) => ({
    word_id: p.word_id,
    priority_score: Number(scoreProgress(p).toFixed(2)),
  }));

  const primary = pickPrimaryTopic(topics, wordCounts);

  return {
    topic: primary
      ? {
          id: primary.id,
          topic_name: primary.topic_name,
          level: primary.level,
        }
      : null,
    counts: {
      new_words_target: safeDaily,
      review_queue_target: safeReview,
      touch_focus: Math.min(10, Math.max(3, Math.floor(safeDaily / 2))),
    },
    mistake_focus: buildMistakeFocus(topErrors),
    weak_word_ids: weakWordIds,
    false_master_word_ids: falseMasterIds.slice(0, 20),
    priority_preview: priorityPreview,
    meta: {
      rule_engine_version: "1.0.0",
      llm: false,
    },
  };
};

module.exports = {
  buildTodayPlan,
  pickPrimaryTopic,
};
