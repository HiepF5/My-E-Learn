const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StreakTracking = sequelize.define(
  "StreakTracking",
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
    study_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    did_study: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "streak_tracking",
    underscored: true,
    timestamps: true,
  }
);

module.exports = StreakTracking;
