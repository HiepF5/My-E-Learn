const topicService = require("../services/topic.service");

const list = async (req, res, next) => {
  try {
    const data = await topicService.getAllTopics();
    return res.status(200).json({
      success: true,
      data,
      message: "Topic list",
    });
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await topicService.getTopicById(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data,
      message: "Topic detail",
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await topicService.createTopic(req.body);
    return res.status(201).json({
      success: true,
      data,
      message: "Topic created",
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await topicService.updateTopic(Number(req.params.id), req.body);
    return res.status(200).json({
      success: true,
      data,
      message: "Topic updated",
    });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await topicService.removeTopic(Number(req.params.id));
    return res.status(200).json({
      success: true,
      data: null,
      message: "Topic deleted",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
