"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("weak_word_detector", {
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
      word_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "vocabulary", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      weak_score: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0,
      },
      wrong_count_snapshot: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct_count_snapshot: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      recent_wrong_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_computed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

    await queryInterface.addConstraint("weak_word_detector", {
      fields: ["user_id", "word_id"],
      type: "unique",
      name: "uq_weak_word_detector_user_word",
    });

    await queryInterface.addIndex("weak_word_detector", ["user_id", "weak_score"], {
      name: "idx_weak_word_detector_user_score",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("weak_word_detector");
  },
};
