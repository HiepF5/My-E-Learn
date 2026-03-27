const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AiFeedback = sequelize.define(
  "AiFeedback",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    source_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "writing",
    },
    source_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    feedback_text: { type: DataTypes.TEXT, allowNull: false },
    suggestions: { type: DataTypes.TEXT, allowNull: true },
    model_name: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    tableName: "ai_feedback",
    underscored: true,
    timestamps: true,
  }
);

module.exports = AiFeedback;

