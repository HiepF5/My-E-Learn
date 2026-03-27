const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WordFamily = sequelize.define(
  "WordFamily",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    root_word_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    related_word: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    relation_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "word_family",
    underscored: true,
    timestamps: true,
  }
);

module.exports = WordFamily;
