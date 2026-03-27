const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ErrorTagMap = sequelize.define(
  "ErrorTagMap",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    error_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "error_tag_map",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ErrorTagMap;
