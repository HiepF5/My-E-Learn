const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const { validateSubmitReview } = require("../validators/review.validator");
const touchController = require("../controllers/touch.controller");
const {
  validateWordIdParam,
  validatePatchTouchStep,
} = require("../validators/touch.validator");

router.get("/today", reviewController.getToday);
router.post("/submit", validateSubmitReview, reviewController.submit);
router.get("/touch/:wordId", validateWordIdParam, touchController.getTouchHistory);
router.patch(
  "/touch/:wordId",
  validateWordIdParam,
  validatePatchTouchStep,
  touchController.patchTouchStep
);

module.exports = router;
