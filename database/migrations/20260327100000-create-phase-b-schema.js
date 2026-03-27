"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(100), allowNull: true, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      avatar_url: { type: Sequelize.STRING(255), allowNull: true },
      timezone: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Asia/Ho_Chi_Minh",
      },
      learning_goal: { type: Sequelize.STRING(255), allowNull: true },
      level: { type: Sequelize.STRING(20), allowNull: true },
      status: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
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

    await queryInterface.createTable("user_settings", {
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
      daily_target_words: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      review_reminder_time: { type: Sequelize.TIME, allowNull: true },
      preferred_theme: { type: Sequelize.STRING(50), allowNull: true },
      notification_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.createTable("topics", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      topic_name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      level: { type: Sequelize.STRING(20), allowNull: true },
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

    await queryInterface.createTable("vocabulary", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      word: { type: Sequelize.STRING(100), allowNull: false },
      phonetic: { type: Sequelize.STRING(100), allowNull: true },
      meaning: { type: Sequelize.TEXT, allowNull: true },
      example_sentence: { type: Sequelize.TEXT, allowNull: true },
      audio_url: { type: Sequelize.STRING(255), allowNull: true },
      image_url: { type: Sequelize.STRING(255), allowNull: true },
      difficulty: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
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

    await queryInterface.createTable("vocabulary_topic_map", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      topic_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "topics", key: "id" },
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("review_progress", {
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
      level: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      ease_factor: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 2.5,
      },
      interval_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      next_review: { type: Sequelize.DATE, allowNull: true },
      correct_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      wrong_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      last_review: { type: Sequelize.DATE, allowNull: true },
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

    await queryInterface.createTable("review_history", {
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
      answer_result: { type: Sequelize.BOOLEAN, allowNull: false },
      response_time_ms: { type: Sequelize.INTEGER, allowNull: true },
      review_mode: { type: Sequelize.STRING(50), allowNull: true },
      reviewed_at: {
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

    await queryInterface.createTable("touch_history", {
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
      touch1_done: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      touch2_done: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      touch3_done: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("error_notebook", {
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
      error_type: { type: Sequelize.STRING(50), allowNull: true },
      wrong_text: { type: Sequelize.TEXT, allowNull: true },
      corrected_text: { type: Sequelize.TEXT, allowNull: true },
      explanation: { type: Sequelize.TEXT, allowNull: true },
      repeat_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      fixed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
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

    await queryInterface.createTable("daily_learning_log", {
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
      learned_words: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      reviewed_words: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      mistakes_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      study_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      log_date: { type: Sequelize.DATEONLY, allowNull: false },
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

    await queryInterface.createTable("daily_review_queue", {
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
      queue_date: { type: Sequelize.DATEONLY, allowNull: false },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("daily_review_queue");
    await queryInterface.dropTable("daily_learning_log");
    await queryInterface.dropTable("error_notebook");
    await queryInterface.dropTable("touch_history");
    await queryInterface.dropTable("review_history");
    await queryInterface.dropTable("review_progress");
    await queryInterface.dropTable("vocabulary_topic_map");
    await queryInterface.dropTable("vocabulary");
    await queryInterface.dropTable("topics");
    await queryInterface.dropTable("user_settings");
    await queryInterface.dropTable("users");
  },
};
