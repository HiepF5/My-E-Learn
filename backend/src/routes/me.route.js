const router = require("express").Router();
const userLearningController = require("../controllers/user-learning.controller");

router.get("/learning-state", userLearningController.getState);
router.patch("/learning-state", userLearningController.patchState);

module.exports = router;
