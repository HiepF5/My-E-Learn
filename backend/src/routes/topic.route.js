const router = require("express").Router();
const topicController = require("../controllers/topic.controller");
const {
  validateCreate,
  validateUpdate,
  validateIdParam,
} = require("../validators/topic.validator");

router.get("/today", topicController.getToday);
router.get("/", topicController.list);
router.get("/:id", validateIdParam, topicController.getById);
router.post("/", validateCreate, topicController.create);
router.put("/:id", validateUpdate, topicController.update);
router.delete("/:id", validateIdParam, topicController.remove);

module.exports = router;
