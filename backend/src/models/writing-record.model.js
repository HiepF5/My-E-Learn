const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WritingRecord = sequelize.define(
  "WritingRecord",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    prompt_text: { type: DataTypes.TEXT, allowNull: true },
    written_text: { type: DataTypes.TEXT, allowNull: true },
    corrected_text: { type: DataTypes.TEXT, allowNull: true },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "writing_records",
    underscored: true,
    timestamps: true,
  }
);

module.exports = WritingRecord;

