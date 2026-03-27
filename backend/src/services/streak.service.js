const streakRepository = require("../repositories/streak.repository");

const toDateOnly = (date) => date.toISOString().slice(0, 10);

const daysAgoDateOnly = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toDateOnly(d);
};

const calcCurrentStreak = (descDates) => {
  if (!descDates.length) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const first = new Date(descDates[0]);
  first.setHours(0, 0, 0, 0);
  const firstDiffDays = Math.round((today.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  if (firstDiffDays > 1) return 0;

  let expected = first;
  for (const isoDate of descDates) {
    const current = new Date(isoDate);
    current.setHours(0, 0, 0, 0);
    if (current.getTime() !== expected.getTime()) break;
    streak += 1;
    expected = new Date(expected.getTime() - 24 * 60 * 60 * 1000);
  }
  return streak;
};

const calcBestStreak = (ascDates) => {
  if (!ascDates.length) return 0;
  let best = 1;
  let current = 1;

  for (let i = 1; i < ascDates.length; i += 1) {
    const prev = new Date(ascDates[i - 1]);
    const cur = new Date(ascDates[i]);
    prev.setHours(0, 0, 0, 0);
    cur.setHours(0, 0, 0, 0);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) current += 1;
    else current = 1;
    if (current > best) best = current;
  }
  return best;
};

const getCurrent = async (userId) => {
  const rowsDesc = await streakRepository.listByUserDesc(userId, 400);
  const descDates = rowsDesc.map((r) => r.study_date);
  const ascDates = [...descDates].reverse();

  return {
    current_streak: calcCurrentStreak(descDates),
    best_streak: calcBestStreak(ascDates),
    last_study_date: descDates[0] || null,
  };
};

const checkInToday = async (userId) => {
  const today = toDateOnly(new Date());
  let row = await streakRepository.findByUserAndDate(userId, today);
  if (!row) {
    row = await streakRepository.create({
      user_id: userId,
      study_date: today,
      did_study: true,
    });
  } else if (!row.did_study) {
    row.did_study = true;
    await streakRepository.save(row);
  }
  return getCurrent(userId);
};

const getHeatmap = async (userId, days = 90) => {
  const safeDays = Math.min(Math.max(Number(days) || 90, 7), 365);
  const fromDate = daysAgoDateOnly(safeDays - 1);
  const rows = await streakRepository.listByUserSince(userId, fromDate);
  return rows.map((r) => ({
    study_date: r.study_date,
    did_study: r.did_study,
  }));
};

module.exports = {
  getCurrent,
  checkInToday,
  getHeatmap,
};
