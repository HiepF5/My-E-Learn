const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyReviewQueue = sequelize.define(
  "DailyReviewQueue",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    queue_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "pending" },
  },
  {
    tableName: "daily_review_queue",
    underscored: true,
    timestamps: true,
  }
);

module.exports = DailyReviewQueue;
