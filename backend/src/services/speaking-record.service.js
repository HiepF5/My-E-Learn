const speakingRecordRepository = require("../repositories/speaking-record.repository");

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const createSpeakingRecord = async (userId, payload) => {
  return speakingRecordRepository.createSpeakingRecord({
    user_id: userId,
    word_id: payload.word_id || null,
    prompt_text: payload.prompt_text || null,
    transcript_text: payload.transcript_text || null,
    audio_url: payload.audio_url || null,
    score: payload.score ?? null,
    reviewed_at: payload.reviewed_at ? new Date(payload.reviewed_at) : null,
  });
};

const listSpeakingRecords = async (userId, limit = 30) => {
  const safeLimit = clamp(Number(limit) || 30, 1, 100);
  return speakingRecordRepository.listSpeakingRecordsByUser(userId, safeLimit);
};

module.exports = {
  createSpeakingRecord,
  listSpeakingRecords,
};

