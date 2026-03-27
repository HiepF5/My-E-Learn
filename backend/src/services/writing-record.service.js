const writingRecordRepository = require("../repositories/writing-record.repository");

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const createWritingRecord = async (userId, payload) => {
  return writingRecordRepository.createWritingRecord({
    user_id: userId,
    word_id: payload.word_id || null,
    prompt_text: payload.prompt_text || null,
    written_text: payload.written_text || null,
    corrected_text: payload.corrected_text || null,
    score: payload.score ?? null,
    reviewed_at: payload.reviewed_at ? new Date(payload.reviewed_at) : null,
  });
};

const listWritingRecords = async (userId, limit = 30) => {
  const safeLimit = clamp(Number(limit) || 30, 1, 100);
  return writingRecordRepository.listWritingRecordsByUser(userId, safeLimit);
};

module.exports = {
  createWritingRecord,
  listWritingRecords,
};

