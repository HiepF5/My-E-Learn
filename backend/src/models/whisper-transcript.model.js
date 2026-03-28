const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "WhisperTranscript",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    audio_url: { type: DataTypes.STRING(500), allowNull: true },
    transcript: { type: DataTypes.TEXT, allowNull: true },
    model: { type: DataTypes.STRING(64), allowNull: true },
  },
  { tableName: "whisper_transcripts", underscored: true, timestamps: true }
);
