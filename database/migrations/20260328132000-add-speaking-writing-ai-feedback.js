"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("speaking_records", {
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
        allowNull: true,
        references: { model: "vocabulary", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      prompt_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      transcript_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      audio_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      reviewed_at: {
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

    await queryInterface.createTable("writing_records", {
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
        allowNull: true,
        references: { model: "vocabulary", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      prompt_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      written_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      corrected_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      reviewed_at: {
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

    await queryInterface.createTable("ai_feedback", {
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
      source_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "writing",
      },
      source_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      feedback_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      suggestions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      model_name: {
        type: Sequelize.STRING(100),
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

    await queryInterface.addIndex("speaking_records", ["user_id", "created_at"], {
      name: "idx_speaking_records_user_created",
    });
    await queryInterface.addIndex("writing_records", ["user_id", "created_at"], {
      name: "idx_writing_records_user_created",
    });
    await queryInterface.addIndex("ai_feedback", ["user_id", "created_at"], {
      name: "idx_ai_feedback_user_created",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ai_feedback");
    await queryInterface.dropTable("writing_records");
    await queryInterface.dropTable("speaking_records");
  },
};

