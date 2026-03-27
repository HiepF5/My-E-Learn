const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReviewHistory = sequelize.define(
  "ReviewHistory",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    answer_result: { type: DataTypes.BOOLEAN, allowNull: false },
    response_time_ms: { type: DataTypes.INTEGER, allowNull: true },
    review_mode: { type: DataTypes.STRING(50), allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "review_history",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ReviewHistory;
