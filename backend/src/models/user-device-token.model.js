const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserDeviceToken = sequelize.define(
  "UserDeviceToken",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    token: { type: DataTypes.STRING(512), allowNull: false },
    platform: { type: DataTypes.STRING(32), allowNull: true },
  },
  {
    tableName: "user_device_tokens",
    underscored: true,
    timestamps: true,
  }
);

module.exports = UserDeviceToken;
