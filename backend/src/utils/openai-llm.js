/**
 * Optional OpenAI Chat Completions call for learner feedback (Phase 4).
 * Requires OPENAI_API_KEY in environment.
 */

const DEFAULT_MODEL = "gpt-4o-mini";

const parseJsonFromContent = (content) => {
  const trimmed = String(content || "").trim();
  if (!trimmed) return { feedback: "", suggestions: null };
  try {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const parsed = JSON.parse(trimmed.slice(start, end + 1));
      return {
        feedback: String(parsed.feedback || parsed.feedback_text || "").trim(),
        suggestions: parsed.suggestions != null ? String(parsed.suggestions) : null,
      };
    }
  } catch (_) {
    /* fall through */
  }
  return { feedback: trimmed, suggestions: null };
};

/**
 * @param {object} opts
 * @param {string} opts.learnerText
 * @param {string} [opts.sourceType]
 * @returns {Promise<{ feedbackText: string, suggestions: string|null, model: string }>}
 */
const generateLearnerFeedback = async ({ learnerText, sourceType = "general" }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not configured");
    err.statusCode = 503;
    throw err;
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const system =
    "You help Vietnamese learners improve English. Respond with a single JSON object only, no markdown: " +
    '{"feedback":"short encouragement and corrections","suggestions":"1-3 concrete next steps"}';

  const user = `Context: ${sourceType}. Learner wrote:\n\n${learnerText.trim()}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText || "OpenAI request failed";
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 500 ? 400 : 502;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  const { feedback, suggestions } = parseJsonFromContent(content);
  if (!feedback) {
    const err = new Error("Empty model response");
    err.statusCode = 502;
    throw err;
  }

  return {
    feedbackText: feedback,
    suggestions,
    model,
  };
};

/**
 * @param {object} opts
 * @param {string} opts.sentence
 * @returns {Promise<{ corrected: string, notes: string|null, model: string }>}
 */
const correctSentence = async ({ sentence }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not configured");
    err.statusCode = 503;
    throw err;
  }
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const system =
    "You correct English for Vietnamese learners. Reply with JSON only: " +
    '{"feedback":"corrected sentence","suggestions":"short note or empty"}';
  const user = `Sentence:\n${String(sentence || "").trim()}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText || "OpenAI request failed";
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 500 ? 400 : 502;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  const parsed = parseJsonFromContent(content);
  const corrected = parsed.feedback || String(content || "").trim();
  return { corrected, notes: parsed.suggestions, model };
};

/**
 * @param {object} opts
 * @param {string} [opts.goal]
 * @param {string} [opts.level]
 */
const suggestTopicsFromLlm = async ({ goal = "", level = "" } = {}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not configured");
    err.statusCode = 503;
    throw err;
  }
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const system =
    'Suggest 5–8 short English learning topic names for one learner. JSON only: {"topics":["..."]}';
  const user = `Goal: ${goal}. Level: ${level}.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText || "OpenAI request failed";
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 500 ? 400 : 502;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  let topics = [];
  try {
    const t = String(content || "").trim();
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const o = JSON.parse(t.slice(start, end + 1));
      if (Array.isArray(o.topics)) topics = o.topics.map((x) => String(x));
    }
  } catch (_) {
    /* ignore */
  }

  return { topics, model };
};

module.exports = {
  generateLearnerFeedback,
  correctSentence,
  suggestTopicsFromLlm,
};
