const router = require("express").Router();
const aiFeedbackController = require("../controllers/ai-feedback.controller");
const { validateListQuery, validateCreateAiFeedback } = require("../validators/ai-feedback.validator");

router.get("/", validateListQuery, aiFeedbackController.list);
router.post("/", validateCreateAiFeedback, aiFeedbackController.create);

module.exports = router;

