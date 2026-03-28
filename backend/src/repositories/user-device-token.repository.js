const { Op } = require("sequelize");
const UserDeviceToken = require("../models/user-device-token.model");

const upsertToken = async (userId, token, platform = null) => {
  const t = String(token || "").trim();
  if (!t) return null;

  const existing = await UserDeviceToken.findOne({
    where: { user_id: userId, token: t },
  });
  if (existing) {
    existing.platform = platform || existing.platform;
    return existing.save();
  }
  return UserDeviceToken.create({
    user_id: userId,
    token: t,
    platform,
  });
};

const removeByUserAndToken = async (userId, token) => {
  const t = String(token || "").trim();
  if (!t) return 0;
  return UserDeviceToken.destroy({
    where: { user_id: userId, token: { [Op.eq]: t } },
  });
};

const listByUser = (userId) =>
  UserDeviceToken.findAll({
    where: { user_id: userId },
    order: [["updated_at", "DESC"]],
  });

module.exports = {
  upsertToken,
  removeByUserAndToken,
  listByUser,
};
