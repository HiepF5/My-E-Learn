const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const { validateSubmitReview } = require("../validators/review.validator");

router.get("/today", reviewController.getToday);
router.post("/submit", validateSubmitReview, reviewController.submit);

module.exports = router;
