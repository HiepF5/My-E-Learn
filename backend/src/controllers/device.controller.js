const deviceService = require("../services/device.service");

const register = async (req, res, next) => {
  try {
    const data = await deviceService.registerDeviceToken(req.user.userId, req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "Device token registered",
    });
  } catch (error) {
    return next(error);
  }
};

const unregister = async (req, res, next) => {
  try {
    const data = await deviceService.unregisterDeviceToken(req.user.userId, req.body || {});
    return res.status(200).json({
      success: true,
      data,
      message: "Device token removed",
    });
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await deviceService.listDeviceTokens(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
      message: "Device tokens",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  unregister,
  list,
};
