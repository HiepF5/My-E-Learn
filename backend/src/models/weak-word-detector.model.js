const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WeakWordDetector = sequelize.define(
  "WeakWordDetector",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    weak_score: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      defaultValue: 0,
    },
    wrong_count_snapshot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    correct_count_snapshot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    recent_wrong_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_computed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "weak_word_detector",
    underscored: true,
    timestamps: true,
  }
);

module.exports = WeakWordDetector;
