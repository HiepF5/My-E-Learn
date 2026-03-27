const weakWordService = require("../services/weak-word.service");

const list = async (req, res, next) => {
  try {
    const data = await weakWordService.listWeakWords(req.user.userId, req.query.limit);
    return res.status(200).json({
      success: true,
      data,
      message: "Weak words list",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
};
