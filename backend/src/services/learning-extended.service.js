const SentenceMiningEntry = require("../models/sentence-mining-entry.model");
const ShadowingSession = require("../models/shadowing-session.model");
const GrammarMicroLog = require("../models/grammar-micro-log.model");
const DictationAttempt = require("../models/dictation-attempt.model");
const KnowledgeGraphEdge = require("../models/knowledge-graph-edge.model");
const WhisperTranscript = require("../models/whisper-transcript.model");

const listSentenceMining = (userId, limit = 50) =>
  SentenceMiningEntry.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit: Math.min(Math.max(Number(limit) || 50, 1), 100),
  });

const createSentenceMining = (userId, body) => {
  const sentence_text = String(body.sentence_text || "").trim();
  if (!sentence_text) {
    const err = new Error("sentence_text is required");
    err.statusCode = 400;
    throw err;
  }
  return SentenceMiningEntry.create({
    user_id: userId,
    sentence_text,
    source_note: body.source_note || null,
    topic_id: body.topic_id || null,
  });
};

const listShadowing = (userId, limit = 30) =>
  ShadowingSession.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit: Math.min(Math.max(Number(limit) || 30, 1), 100),
  });

const createShadowing = (userId, body) =>
  ShadowingSession.create({
    user_id: userId,
    topic_id: body.topic_id || null,
    reference_audio_url: body.reference_audio_url || null,
    user_audio_url: body.user_audio_url || null,
    duration_sec: body.duration_sec != null ? Number(body.duration_sec) : null,
    notes: body.notes || null,
  });

const upsertGrammarMicro = async (userId, body) => {
  const logDate = body.log_date || new Date().toISOString().slice(0, 10);
  const [row, created] = await GrammarMicroLog.findOrCreate({
    where: { user_id: userId, log_date: logDate },
    defaults: {
      user_id: userId,
      log_date: logDate,
      prompt: body.prompt || null,
      user_answer: body.user_answer || null,
      score: body.score != null ? Number(body.score) : null,
    },
  });
  if (!created) {
    if (body.prompt != null) row.prompt = body.prompt;
    if (body.user_answer != null) row.user_answer = body.user_answer;
    if (body.score != null) row.score = Number(body.score);
    await row.save();
  }
  return row;
};

const createDictation = (userId, body) => {
  const expected = String(body.expected_text || "").trim();
  const got = String(body.user_transcript || "").trim();
  const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  let score = null;
  if (expected && got) {
    score = norm(expected) === norm(got) ? 100 : Math.round(
      (2 * expected.split(/\s+/).filter((w) => norm(got).includes(norm(w))).length) /
        Math.max(1, expected.split(/\s+/).length) *
        50
    );
  }
  return DictationAttempt.create({
    user_id: userId,
    word_id: body.word_id || null,
    expected_text: expected || null,
    user_transcript: got || null,
    score,
  });
};

const listDictation = (userId, limit = 30) =>
  DictationAttempt.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit: Math.min(Math.max(Number(limit) || 30, 1), 100),
  });

const listKnowledgeEdges = async (wordId) => {
  const wid = Number(wordId);
  if (!wid) {
    return KnowledgeGraphEdge.findAll({ order: [["weight", "DESC"]], limit: 200 });
  }
  const { Op } = require("sequelize");
  return KnowledgeGraphEdge.findAll({
    where: { [Op.or]: [{ word_id_a: wid }, { word_id_b: wid }] },
    limit: 100,
  });
};

const upsertKnowledgeEdge = (body) =>
  KnowledgeGraphEdge.create({
    word_id_a: Number(body.word_id_a),
    word_id_b: Number(body.word_id_b),
    relation_type: String(body.relation_type || "related").slice(0, 64),
    weight: body.weight != null ? Number(body.weight) : 1,
  });

const createWhisperTranscript = (userId, body) =>
  WhisperTranscript.create({
    user_id: userId,
    audio_url: body.audio_url || null,
    transcript: body.transcript || null,
    model: body.model || null,
  });

module.exports = {
  listSentenceMining,
  createSentenceMining,
  listShadowing,
  createShadowing,
  upsertGrammarMicro,
  createDictation,
  listDictation,
  listKnowledgeEdges,
  upsertKnowledgeEdge,
  createWhisperTranscript,
};
