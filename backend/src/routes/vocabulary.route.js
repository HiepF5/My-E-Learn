const router = require("express").Router();
const vocabularyController = require("../controllers/vocabulary.controller");
const {
  validateCreate,
  validateUpdate,
} = require("../validators/vocabulary.validator");

router.get("/", vocabularyController.list);
router.get("/:id", vocabularyController.getById);
router.post("/", validateCreate, vocabularyController.create);
router.put("/:id", validateUpdate, vocabularyController.update);
router.delete("/:id", vocabularyController.remove);

module.exports = router;
