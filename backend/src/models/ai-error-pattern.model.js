const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AiErrorPattern = sequelize.define(
  "AiErrorPattern",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    pattern_name: { type: DataTypes.STRING(255), allowNull: false },
    error_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    last_detected_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "ai_error_patterns",
    underscored: true,
    timestamps: true,
  }
);

module.exports = AiErrorPattern;
