const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Collocation = sequelize.define(
  "Collocation",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    word_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    collocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "collocations",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Collocation;
