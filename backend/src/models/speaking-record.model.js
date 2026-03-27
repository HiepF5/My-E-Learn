const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SpeakingRecord = sequelize.define(
  "SpeakingRecord",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    prompt_text: { type: DataTypes.TEXT, allowNull: true },
    transcript_text: { type: DataTypes.TEXT, allowNull: true },
    audio_url: { type: DataTypes.STRING(255), allowNull: true },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "speaking_records",
    underscored: true,
    timestamps: true,
  }
);

module.exports = SpeakingRecord;

