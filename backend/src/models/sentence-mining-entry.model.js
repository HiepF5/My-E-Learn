const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "SentenceMiningEntry",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    sentence_text: { type: DataTypes.TEXT, allowNull: false },
    source_note: { type: DataTypes.STRING(500), allowNull: true },
    topic_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  },
  { tableName: "sentence_mining_entries", underscored: true, timestamps: true }
);
