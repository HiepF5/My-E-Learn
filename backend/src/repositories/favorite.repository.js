const sequelize = require("../config/database");

const listWithWords = async (userId) => {
  const [rows] = await sequelize.query(
    `SELECT fw.word_id, v.word, fw.created_at
     FROM favorite_words fw
     INNER JOIN vocabulary v ON v.id = fw.word_id
     WHERE fw.user_id = :uid
     ORDER BY fw.created_at DESC`,
    { replacements: { uid: userId } }
  );
  return rows.map((r) => ({
    word_id: Number(r.word_id),
    word: r.word,
    created_at: r.created_at,
  }));
};

const add = async (userId, wordId) => {
  await sequelize.query(
    `INSERT INTO favorite_words (user_id, word_id, created_at) VALUES (:uid, :wid, NOW())`,
    { replacements: { uid: userId, wid: wordId } }
  );
};

const remove = async (userId, wordId) => {
  const [result] = await sequelize.query(
    `DELETE FROM favorite_words WHERE user_id = :uid AND word_id = :wid`,
    { replacements: { uid: userId, wid: wordId } }
  );
  return result.affectedRows > 0;
};

const exists = async (userId, wordId) => {
  const [rows] = await sequelize.query(
    `SELECT 1 FROM favorite_words WHERE user_id = :uid AND word_id = :wid LIMIT 1`,
    { replacements: { uid: userId, wid: wordId } }
  );
  return rows.length > 0;
};

module.exports = {
  listWithWords,
  add,
  remove,
  exists,
};
