"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_settings", "last_review_word_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    });
    await queryInterface.addColumn("user_settings", "last_screen", {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    await queryInterface.createTable("favorite_words", {
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addConstraint("favorite_words", {
      fields: ["user_id", "word_id"],
      type: "unique",
      name: "uq_favorite_words_user_word",
    });
    await queryInterface.addIndex("favorite_words", ["user_id"], { name: "idx_favorite_words_user" });

    await queryInterface.createTable("vocabulary_user_notes", {
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
      note_text: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.addConstraint("vocabulary_user_notes", {
      fields: ["user_id", "word_id"],
      type: "unique",
      name: "uq_vocabulary_user_notes_user_word",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vocabulary_user_notes");
    await queryInterface.dropTable("favorite_words");
    await queryInterface.removeColumn("user_settings", "last_screen");
    await queryInterface.removeColumn("user_settings", "last_review_word_id");
  },
};
