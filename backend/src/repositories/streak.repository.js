const { Op } = require("sequelize");
const StreakTracking = require("../models/streak-tracking.model");

const findByUserAndDate = (userId, studyDate) =>
  StreakTracking.findOne({
    where: {
      user_id: userId,
      study_date: studyDate,
    },
  });

const create = (payload, options = {}) => StreakTracking.create(payload, options);

const save = (row, options = {}) => row.save(options);

const listByUserDesc = (userId, limit = 365) =>
  StreakTracking.findAll({
    where: { user_id: userId, did_study: true },
    order: [["study_date", "DESC"]],
    limit,
  });

const listByUserSince = (userId, fromDate) =>
  StreakTracking.findAll({
    where: {
      user_id: userId,
      did_study: true,
      study_date: { [Op.gte]: fromDate },
    },
    order: [["study_date", "ASC"]],
  });

module.exports = {
  findByUserAndDate,
  create,
  save,
  listByUserDesc,
  listByUserSince,
};
