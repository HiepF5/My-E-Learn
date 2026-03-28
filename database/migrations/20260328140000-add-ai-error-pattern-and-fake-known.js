"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("review_progress", "fake_known_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.createTable("ai_error_patterns", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      pattern_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      error_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      last_detected_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("ai_error_patterns", ["user_id", "pattern_name"], {
      unique: true,
      name: "ai_error_patterns_user_pattern_uidx",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("ai_error_patterns", "ai_error_patterns_user_pattern_uidx");
    await queryInterface.dropTable("ai_error_patterns");
    await queryInterface.removeColumn("review_progress", "fake_known_count");
  },
};
