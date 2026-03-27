/**
 * Aggregate error notebook rows into mistake_focus weights (rule-based).
 */
const normalizeWeights = (entries) => {
  const sum = entries.reduce((acc, e) => acc + e.weight, 0);
  if (sum <= 0) return entries.map((e) => ({ ...e, weight: 0 }));
  return entries.map((e) => ({
    ...e,
    weight: Math.round((e.weight / sum) * 1000) / 1000,
  }));
};

const buildMistakeFocus = (errorRows) => {
  const buckets = new Map();

  for (const row of errorRows) {
    const key = row.error_type && String(row.error_type).trim()
      ? String(row.error_type).trim().toLowerCase()
      : "uncategorized";
    const repeat = Number(row.repeat_count) || 1;
    const prev = buckets.get(key) || 0;
    buckets.set(key, prev + repeat);
  }

  const entries = [...buckets.entries()].map(([error_type, weight]) => ({
    error_type,
    weight,
  }));

  return normalizeWeights(entries);
};

module.exports = {
  buildMistakeFocus,
};
