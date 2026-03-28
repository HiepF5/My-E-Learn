const aiFeedbackRepository = require("../repositories/ai-feedback.repository");
const { generateLearnerFeedback } = require("../utils/openai-llm");

const ALLOWED_SOURCE_TYPES = ["speaking", "writing", "general"];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const createAiFeedback = async (userId, payload) => {
  const sourceType = String(payload.source_type || "general").toLowerCase();
  if (!ALLOWED_SOURCE_TYPES.includes(sourceType)) {
    const error = new Error("source_type must be one of speaking, writing, general");
    error.statusCode = 400;
    throw error;
  }

  const useLlm = payload.generate_llm === true || payload.generate_llm === "true";
  let feedbackText = payload.feedback_text;
  let suggestions = payload.suggestions || null;
  let modelName = payload.model_name || null;

  if (useLlm) {
    const out = await generateLearnerFeedback({
      learnerText: payload.learner_text,
      sourceType,
    });
    feedbackText = out.feedbackText;
    suggestions = suggestions || out.suggestions;
    modelName = modelName || out.model;
  }

  return aiFeedbackRepository.createAiFeedback({
    user_id: userId,
    source_type: sourceType,
    source_id: payload.source_id || null,
    feedback_text: feedbackText,
    suggestions,
    model_name: modelName,
  });
};

const listAiFeedback = async (userId, limit = 30) => {
  const safeLimit = clamp(Number(limit) || 30, 1, 100);
  return aiFeedbackRepository.listAiFeedbackByUser(userId, safeLimit);
};

module.exports = {
  createAiFeedback,
  listAiFeedback,
};

