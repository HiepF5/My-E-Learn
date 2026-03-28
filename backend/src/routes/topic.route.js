const router = require("express").Router();
const { allowRole } = require("../middlewares/role.middleware");
const topicController = require("../controllers/topic.controller");
const requireAdmin = allowRole("ADMIN");
const {
  validateCreate,
  validateUpdate,
  validateIdParam,
} = require("../validators/topic.validator");

router.get("/today", topicController.getToday);
router.get("/", topicController.list);
router.get("/:id", validateIdParam, topicController.getById);
router.post("/", requireAdmin, validateCreate, topicController.create);
router.put("/:id", requireAdmin, validateUpdate, topicController.update);
router.delete("/:id", requireAdmin, validateIdParam, topicController.remove);

module.exports = router;
