const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "ShadowingSession",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    topic_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    reference_audio_url: { type: DataTypes.STRING(500), allowNull: true },
    user_audio_url: { type: DataTypes.STRING(500), allowNull: true },
    duration_sec: { type: DataTypes.INTEGER, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "shadowing_sessions", underscored: true, timestamps: true }
);
