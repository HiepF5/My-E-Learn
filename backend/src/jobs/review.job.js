const cron = require("node-cron");
const reviewService = require("../services/review.service");

const startReviewJobs = () => {
  // Run every day at 00:00
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await reviewService.generateDailyReviewQueue();
      console.log(
        `[review.job] queue generated for ${result.queueDate}, total=${result.total}`
      );
    } catch (error) {
      console.error("[review.job] failed to generate daily queue:", error.message);
    }
  });
};

module.exports = {
  startReviewJobs,
};
