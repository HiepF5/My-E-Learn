const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "DictationAttempt",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    expected_text: { type: DataTypes.TEXT, allowNull: true },
    user_transcript: { type: DataTypes.TEXT, allowNull: true },
    score: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "dictation_attempts", underscored: true, timestamps: true }
);
