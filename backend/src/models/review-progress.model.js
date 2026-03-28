const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReviewProgress = sequelize.define(
  "ReviewProgress",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    ease_factor: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 2.5 },
    interval_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    next_review: { type: DataTypes.DATE, allowNull: true },
    correct_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    wrong_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    fake_known_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    last_review: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "review_progress",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ReviewProgress;
