const sequelize = require("../config/database");
const WeakWordDetector = require("../models/weak-word-detector.model");

const replaceAllForUser = async (userId, rows) => {
  await sequelize.transaction(async (transaction) => {
    await WeakWordDetector.destroy({ where: { user_id: userId }, transaction });
    if (rows.length) {
      await WeakWordDetector.bulkCreate(rows, { transaction });
    }
  });
};

const findByUserOrderByScore = (userId, limit = 30) =>
  WeakWordDetector.findAll({
    where: { user_id: userId },
    order: [["weak_score", "DESC"]],
    limit,
  });

module.exports = {
  replaceAllForUser,
  findByUserOrderByScore,
};
