const speakingRecordService = require("../services/speaking-record.service");

const list = async (req, res, next) => {
  try {
    const data = await speakingRecordService.listSpeakingRecords(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "Speaking records list",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await speakingRecordService.createSpeakingRecord(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Speaking record created",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
};

