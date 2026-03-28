"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sentence_mining_entries", {
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
      sentence_text: { type: Sequelize.TEXT, allowNull: false },
      source_note: { type: Sequelize.STRING(500), allowNull: true },
      topic_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: "topics", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
    await queryInterface.addIndex("sentence_mining_entries", ["user_id"], {
      name: "sentence_mining_user_idx",
    });

    await queryInterface.createTable("shadowing_sessions", {
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
      topic_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: "topics", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      reference_audio_url: { type: Sequelize.STRING(500), allowNull: true },
      user_audio_url: { type: Sequelize.STRING(500), allowNull: true },
      duration_sec: { type: Sequelize.INTEGER, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
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
    await queryInterface.addIndex("shadowing_sessions", ["user_id"], {
      name: "shadowing_sessions_user_idx",
    });

    await queryInterface.createTable("grammar_micro_logs", {
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
      log_date: { type: Sequelize.DATEONLY, allowNull: false },
      prompt: { type: Sequelize.TEXT, allowNull: true },
      user_answer: { type: Sequelize.TEXT, allowNull: true },
      score: { type: Sequelize.INTEGER, allowNull: true },
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
    await queryInterface.addIndex("grammar_micro_logs", ["user_id", "log_date"], {
      unique: true,
      name: "grammar_micro_user_day_uidx",
    });

    await queryInterface.createTable("dictation_attempts", {
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
      expected_text: { type: Sequelize.TEXT, allowNull: true },
      user_transcript: { type: Sequelize.TEXT, allowNull: true },
      score: { type: Sequelize.INTEGER, allowNull: true },
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
    await queryInterface.addIndex("dictation_attempts", ["user_id"], {
      name: "dictation_attempts_user_idx",
    });

    await queryInterface.createTable("knowledge_graph_edges", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      word_id_a: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "vocabulary", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      word_id_b: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "vocabulary", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      relation_type: { type: Sequelize.STRING(64), allowNull: false },
      weight: { type: Sequelize.DECIMAL(5, 3), allowNull: false, defaultValue: 1.0 },
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
    await queryInterface.addIndex("knowledge_graph_edges", ["word_id_a", "word_id_b", "relation_type"], {
      unique: true,
      name: "kg_edges_pair_relation_uidx",
    });

    await queryInterface.createTable("whisper_transcripts", {
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
      audio_url: { type: Sequelize.STRING(500), allowNull: true },
      transcript: { type: Sequelize.TEXT, allowNull: true },
      model: { type: Sequelize.STRING(64), allowNull: true },
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
    await queryInterface.addIndex("whisper_transcripts", ["user_id"], {
      name: "whisper_transcripts_user_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("whisper_transcripts");
    await queryInterface.dropTable("knowledge_graph_edges");
    await queryInterface.dropTable("dictation_attempts");
    await queryInterface.removeIndex("grammar_micro_logs", "grammar_micro_user_day_uidx");
    await queryInterface.dropTable("grammar_micro_logs");
    await queryInterface.dropTable("shadowing_sessions");
    await queryInterface.dropTable("sentence_mining_entries");
  },
};
