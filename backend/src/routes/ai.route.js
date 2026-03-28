const router = require("express").Router();
const aiController = require("../controllers/ai.controller");
const { validateGenerateTodayPlan } = require("../validators/ai.validator");

router.post("/generate-today-plan", validateGenerateTodayPlan, aiController.generateTodayPlan);
router.get("/error-patterns", aiController.listErrorPatterns);
router.post("/correct-sentence", aiController.postCorrectSentence);
router.post("/topics-llm", aiController.postTopicsLlm);
router.post("/transcribe", aiController.postTranscribeStub);
router.post("/pronunciation-score", aiController.postPronunciationStub);

module.exports = router;
