const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VocabularyTopicMap = sequelize.define(
  "VocabularyTopicMap",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    topic_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    word_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "vocabulary_topic_map",
    underscored: true,
    timestamps: true,
  }
);

module.exports = VocabularyTopicMap;
