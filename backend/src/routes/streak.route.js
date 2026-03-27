const router = require("express").Router();
const streakController = require("../controllers/streak.controller");
const { validateDaysQuery } = require("../validators/streak.validator");

router.get("/current", streakController.getCurrent);
router.post("/check-in", streakController.checkIn);
router.get("/heatmap", validateDaysQuery, streakController.heatmap);

module.exports = router;
