const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ErrorNotebook = sequelize.define(
  "ErrorNotebook",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    error_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    wrong_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    corrected_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    repeat_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    fixed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "error_notebook",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ErrorNotebook;
