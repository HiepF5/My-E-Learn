const sequelize = require("../config/database");

const ensureSettingsRow = async (userId, transaction) => {
  const [rows] = await sequelize.query(
    `SELECT id FROM user_settings WHERE user_id = :uid LIMIT 1`,
    { replacements: { uid: userId }, transaction }
  );
  if (rows.length) return;
  await sequelize.query(
    `INSERT INTO user_settings (user_id, daily_target_words, notification_enabled, created_at, updated_at)
     VALUES (:uid, 10, 1, NOW(), NOW())`,
    { replacements: { uid: userId }, transaction }
  );
};

const getLearningState = async (userId) => {
  const [rows] = await sequelize.query(
    `SELECT last_review_word_id, last_screen FROM user_settings WHERE user_id = :uid LIMIT 1`,
    { replacements: { uid: userId } }
  );
  if (!rows.length) {
    return { last_review_word_id: null, last_screen: null };
  }
  const r = rows[0];
  return {
    last_review_word_id: r.last_review_word_id != null ? Number(r.last_review_word_id) : null,
    last_screen: r.last_screen || null,
  };
};

const patchLearningState = async (userId, { last_review_word_id, last_screen }) => {
  await sequelize.transaction(async (transaction) => {
    await ensureSettingsRow(userId, transaction);
    const sets = [];
    const repl = { uid: userId };
    if (last_review_word_id !== undefined) {
      if (last_review_word_id === null) {
        sets.push("last_review_word_id = NULL");
      } else {
        sets.push("last_review_word_id = :lrid");
        repl.lrid = last_review_word_id;
      }
    }
    if (last_screen !== undefined) {
      if (last_screen === null) {
        sets.push("last_screen = NULL");
      } else {
        sets.push("last_screen = :lsc");
        repl.lsc = last_screen;
      }
    }
    if (!sets.length) return;
    sets.push("updated_at = NOW()");
    await sequelize.query(
      `UPDATE user_settings SET ${sets.join(", ")} WHERE user_id = :uid`,
      { replacements: repl, transaction }
    );
  });
};

module.exports = {
  getLearningState,
  patchLearningState,
  ensureSettingsRow,
};
