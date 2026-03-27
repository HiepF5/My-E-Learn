const { Sequelize } = require("sequelize");
const ErrorNotebook = require("../models/error-notebook.model");

const createError = (payload) => ErrorNotebook.create(payload);

const listErrorsByUser = (userId) =>
  ErrorNotebook.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });

const findByIdAndUser = (id, userId) =>
  ErrorNotebook.findOne({
    where: { id, user_id: userId },
  });

const updateByIdAndUser = async (id, userId, payload) => {
  await ErrorNotebook.update(payload, { where: { id, user_id: userId } });
  return findByIdAndUser(id, userId);
};

const deleteByIdAndUser = (id, userId) =>
  ErrorNotebook.destroy({
    where: { id, user_id: userId },
  });

const topRepeatedErrors = (userId, limit = 5) =>
  ErrorNotebook.findAll({
    where: { user_id: userId },
    order: [["repeat_count", "DESC"]],
    limit,
  });

const incrementRepeat = async (id, userId) => {
  const item = await findByIdAndUser(id, userId);
  if (!item) return null;

  await ErrorNotebook.update(
    { repeat_count: Sequelize.literal("repeat_count + 1") },
    { where: { id, user_id: userId } }
  );

  return findByIdAndUser(id, userId);
};

module.exports = {
  createError,
  listErrorsByUser,
  findByIdAndUser,
  updateByIdAndUser,
  deleteByIdAndUser,
  topRepeatedErrors,
  incrementRepeat,
};
