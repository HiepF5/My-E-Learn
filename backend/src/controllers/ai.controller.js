const aiService = require("../services/ai.service");
const { correctSentence, suggestTopicsFromLlm } = require("../utils/openai-llm");
const WhisperTranscript = require("../models/whisper-transcript.model");

const generateTodayPlan = async (req, res, next) => {
  try {
    const data = await aiService.generateTodayPlan(req.user.userId, req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "Today plan generated",
    });
  } catch (error) {
    return next(error);
  }
};

const listErrorPatterns = async (req, res, next) => {
  try {
    const data = await aiService.listErrorPatterns(req.user.userId, req.query || {});
    return res.status(200).json({
      success: true,
      data,
      message: "AI error patterns",
    });
  } catch (error) {
    return next(error);
  }
};

const postCorrectSentence = async (req, res, next) => {
  try {
    const sentence = req.body?.sentence || req.body?.learner_text;
    const data = await correctSentence({ sentence });
    return res.status(200).json({
      success: true,
      data,
      message: "LLM sentence correction",
    });
  } catch (error) {
    return next(error);
  }
};

const postTopicsLlm = async (req, res, next) => {
  try {
    const data = await suggestTopicsFromLlm(req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "LLM topic suggestions",
    });
  } catch (error) {
    return next(error);
  }
};

/** Stub: store row; set OPENAI + audio pipeline for real Whisper. */
const postTranscribeStub = async (req, res, next) => {
  try {
    const row = await WhisperTranscript.create({
      user_id: req.user.userId,
      audio_url: req.body?.audio_url || null,
      transcript: req.body?.transcript || "[pending: configure Whisper / upload]",
      model: req.body?.model || "stub",
    });
    return res.status(201).json({
      success: true,
      data: row,
      message: "Transcript stub stored; wire Whisper API for real STT",
    });
  } catch (error) {
    return next(error);
  }
};

const postPronunciationStub = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        score: null,
        feedback: "Pronunciation scoring not configured; integrate speech assessment API.",
        reference_text: req.body?.reference_text || null,
      },
      message: "Pronunciation stub",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateTodayPlan,
  listErrorPatterns,
  postCorrectSentence,
  postTopicsLlm,
  postTranscribeStub,
  postPronunciationStub,
};
