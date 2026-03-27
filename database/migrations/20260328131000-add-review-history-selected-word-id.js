"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("review_history", "selected_word_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: "vocabulary", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("review_history", ["user_id", "selected_word_id"], {
      name: "idx_review_history_user_selected_word",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "review_history",
      "idx_review_history_user_selected_word"
    );
    await queryInterface.removeColumn("review_history", "selected_word_id");
  },
};

