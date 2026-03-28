const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConfusionPair = sequelize.define(
  "ConfusionPair",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    confused_with_word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    wrong_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    last_wrong_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "confusion_pairs",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ConfusionPair;
