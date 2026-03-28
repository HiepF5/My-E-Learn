const sequelize = require("../config/database");

const getNote = async (userId, wordId) => {
  const [rows] = await sequelize.query(
    `SELECT note_text, updated_at FROM vocabulary_user_notes WHERE user_id = :uid AND word_id = :wid LIMIT 1`,
    { replacements: { uid: userId, wid: wordId } }
  );
  if (!rows.length) return null;
  return { note_text: rows[0].note_text, updated_at: rows[0].updated_at };
};

const upsertNote = async (userId, wordId, noteText) => {
  await sequelize.query(
    `INSERT INTO vocabulary_user_notes (user_id, word_id, note_text, created_at, updated_at)
     VALUES (:uid, :wid, :txt, NOW(), NOW())
     ON DUPLICATE KEY UPDATE note_text = :txt2, updated_at = NOW()`,
    { replacements: { uid: userId, wid: wordId, txt: noteText, txt2: noteText } }
  );
  return getNote(userId, wordId);
};

const deleteNote = async (userId, wordId) => {
  const [result] = await sequelize.query(
    `DELETE FROM vocabulary_user_notes WHERE user_id = :uid AND word_id = :wid`,
    { replacements: { uid: userId, wid: wordId } }
  );
  return result.affectedRows > 0;
};

module.exports = {
  getNote,
  upsertNote,
  deleteNote,
};
