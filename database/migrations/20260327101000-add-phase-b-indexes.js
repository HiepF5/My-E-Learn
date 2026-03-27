"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("review_progress", ["user_id", "next_review"], {
      name: "idx_review_progress_user_next_review",
    });

    await queryInterface.addIndex("review_history", ["user_id", "word_id"], {
      name: "idx_review_history_user_word",
    });

    await queryInterface.addIndex("error_notebook", ["user_id"], {
      name: "idx_error_notebook_user",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "review_progress",
      "idx_review_progress_user_next_review"
    );
    await queryInterface.removeIndex(
      "review_history",
      "idx_review_history_user_word"
    );
    await queryInterface.removeIndex("error_notebook", "idx_error_notebook_user");
  },
};
