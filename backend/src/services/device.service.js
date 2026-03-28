const userDeviceTokenRepository = require("../repositories/user-device-token.repository");

const registerDeviceToken = async (userId, payload = {}) => {
  const token = payload.token || payload.device_token;
  const platform = payload.platform || null;
  return userDeviceTokenRepository.upsertToken(userId, token, platform);
};

const unregisterDeviceToken = async (userId, payload = {}) => {
  const token = payload.token || payload.device_token;
  const n = await userDeviceTokenRepository.removeByUserAndToken(userId, token);
  return { removed: n };
};

const listDeviceTokens = async (userId) => userDeviceTokenRepository.listByUser(userId);

module.exports = {
  registerDeviceToken,
  unregisterDeviceToken,
  listDeviceTokens,
};
