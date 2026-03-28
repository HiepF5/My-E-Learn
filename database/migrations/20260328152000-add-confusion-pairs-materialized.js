"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("confusion_pairs", {
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
      confused_with_word_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "vocabulary", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      wrong_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      last_wrong_at: { type: Sequelize.DATE, allowNull: true },
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
    await queryInterface.addIndex(
      "confusion_pairs",
      ["user_id", "word_id", "confused_with_word_id"],
      {
        unique: true,
        name: "confusion_pairs_user_words_uidx",
      }
    );
    await queryInterface.addIndex("confusion_pairs", ["user_id", "wrong_count"], {
      name: "confusion_pairs_user_wrong_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("confusion_pairs", "confusion_pairs_user_wrong_idx");
    await queryInterface.removeIndex("confusion_pairs", "confusion_pairs_user_words_uidx");
    await queryInterface.dropTable("confusion_pairs");
  },
};
