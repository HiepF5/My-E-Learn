const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ErrorTag = sequelize.define(
  "ErrorTag",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "error_tags",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ErrorTag;
