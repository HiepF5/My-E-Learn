const router = require("express").Router();
const aiController = require("../controllers/ai.controller");
const { validateGenerateTodayPlan } = require("../validators/ai.validator");

router.post("/generate-today-plan", validateGenerateTodayPlan, aiController.generateTodayPlan);

module.exports = router;
