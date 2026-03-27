const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Topic = sequelize.define(
  "Topic",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    topic_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "topics",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Topic;
