const SpeakingRecord = require("../models/speaking-record.model");

const createSpeakingRecord = (payload) => SpeakingRecord.create(payload);

const listSpeakingRecordsByUser = (userId, limit = 30) =>
  SpeakingRecord.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit,
  });

module.exports = {
  createSpeakingRecord,
  listSpeakingRecordsByUser,
};

