const writingRecordService = require("../services/writing-record.service");

const list = async (req, res, next) => {
  try {
    const data = await writingRecordService.listWritingRecords(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "Writing records list",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await writingRecordService.createWritingRecord(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Writing record created",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
};

