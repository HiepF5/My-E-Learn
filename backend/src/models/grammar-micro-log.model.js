const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "GrammarMicroLog",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    log_date: { type: DataTypes.DATEONLY, allowNull: false },
    prompt: { type: DataTypes.TEXT, allowNull: true },
    user_answer: { type: DataTypes.TEXT, allowNull: true },
    score: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "grammar_micro_logs", underscored: true, timestamps: true }
);
