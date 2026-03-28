"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_device_tokens", {
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
      token: { type: Sequelize.STRING(512), allowNull: false },
      platform: { type: Sequelize.STRING(32), allowNull: true },
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
    await queryInterface.addIndex("user_device_tokens", ["user_id"], {
      name: "user_device_tokens_user_idx",
    });
    await queryInterface.addIndex("user_device_tokens", ["user_id", "token"], {
      name: "user_device_tokens_user_token_uidx",
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("user_device_tokens", "user_device_tokens_user_token_uidx");
    await queryInterface.removeIndex("user_device_tokens", "user_device_tokens_user_idx");
    await queryInterface.dropTable("user_device_tokens");
  },
};
