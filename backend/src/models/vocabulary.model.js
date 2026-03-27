const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vocabulary = sequelize.define(
  "Vocabulary",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    word: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phonetic: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    meaning: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    example_sentence: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    audio_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "vocabulary",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Vocabulary;
