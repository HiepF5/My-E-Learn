const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TouchHistory = sequelize.define(
  "TouchHistory",
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
    word_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    touch1_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    touch2_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    touch3_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "touch_history",
    underscored: true,
    timestamps: true,
  }
);

module.exports = TouchHistory;
