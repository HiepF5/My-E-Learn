import api from "./api";

/**
 * @returns {Promise<{ last_review_word_id?: number, last_screen?: string }>}
 */
export async function getLearningState() {
  try {
    const res = await api.get("/me/learning-state");
    return res.data?.data || {};
  } catch {
    return {};
  }
}

/**
 * @param {{ lastReviewWordId?: number, clearLastReviewWord?: boolean, lastScreen?: string }} opts
 */
export async function patchLearningState({ lastReviewWordId, clearLastReviewWord, lastScreen } = {}) {
  const body = {};
  if (clearLastReviewWord) body.last_review_word_id = null;
  else if (lastReviewWordId != null) body.last_review_word_id = lastReviewWordId;
  if (lastScreen != null) body.last_screen = lastScreen;
  if (Object.keys(body).length === 0) return;
  try {
    await api.patch("/me/learning-state", body);
  } catch {
    /* best-effort */
  }
}
