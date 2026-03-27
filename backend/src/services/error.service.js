const errorRepository = require("../repositories/error.repository");
const errorTagRepository = require("../repositories/error-tag.repository");

const createError = async (userId, payload) => {
  return errorRepository.createError({
    user_id: userId,
    error_type: payload.error_type || null,
    wrong_text: payload.wrong_text || null,
    corrected_text: payload.corrected_text || null,
    explanation: payload.explanation || null,
    repeat_count: payload.repeat_count || 1,
    fixed: payload.fixed || false,
  });
};

const listErrors = async (userId) => {
  return errorRepository.listErrorsByUser(userId);
};

const updateError = async (id, userId, payload) => {
  const found = await errorRepository.findByIdAndUser(id, userId);
  if (!found) {
    const error = new Error("error notebook item not found");
    error.statusCode = 404;
    throw error;
  }

  return errorRepository.updateByIdAndUser(id, userId, payload);
};

const deleteError = async (id, userId) => {
  const deleted = await errorRepository.deleteByIdAndUser(id, userId);
  if (!deleted) {
    const error = new Error("error notebook item not found");
    error.statusCode = 404;
    throw error;
  }
};

const markFixed = async (id, userId, fixed) => {
  return updateError(id, userId, { fixed });
};

const increaseRepeatCount = async (id, userId) => {
  const updated = await errorRepository.incrementRepeat(id, userId);
  if (!updated) {
    const error = new Error("error notebook item not found");
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

const getTopRepeated = async (userId, limit = 5) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 50);
  return errorRepository.topRepeatedErrors(userId, safeLimit);
};

const listTags = async () => errorTagRepository.listTags();

const createTag = async (tagName) => {
  const normalized = String(tagName || "").trim().toLowerCase();
  if (!normalized) {
    const error = new Error("tag_name is required");
    error.statusCode = 400;
    throw error;
  }
  const existing = await errorTagRepository.findTagByName(normalized);
  if (existing) return existing;
  return errorTagRepository.createTag(normalized);
};

const setErrorTags = async (id, userId, tagIds = []) => {
  const found = await errorRepository.findByIdAndUser(id, userId);
  if (!found) {
    const error = new Error("error notebook item not found");
    error.statusCode = 404;
    throw error;
  }
  await errorTagRepository.replaceTagMap(id, tagIds);
  const updatedTagIds = await errorTagRepository.listTagIdsByErrorId(id);
  return {
    error_id: id,
    tag_ids: updatedTagIds,
  };
};

const getErrorTags = async (id, userId) => {
  const found = await errorRepository.findByIdAndUser(id, userId);
  if (!found) {
    const error = new Error("error notebook item not found");
    error.statusCode = 404;
    throw error;
  }
  const tagIds = await errorTagRepository.listTagIdsByErrorId(id);
  return {
    error_id: id,
    tag_ids: tagIds,
  };
};

module.exports = {
  createError,
  listErrors,
  updateError,
  deleteError,
  markFixed,
  increaseRepeatCount,
  getTopRepeated,
  listTags,
  createTag,
  setErrorTags,
  getErrorTags,
};
