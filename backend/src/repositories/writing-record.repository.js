const WritingRecord = require("../models/writing-record.model");

const createWritingRecord = (payload) => WritingRecord.create(payload);

const listWritingRecordsByUser = (userId, limit = 30) =>
  WritingRecord.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    limit,
  });

module.exports = {
  createWritingRecord,
  listWritingRecordsByUser,
};

