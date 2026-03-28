const router = require("express").Router();
const { allowRole } = require("../middlewares/role.middleware");
const vocabularyController = require("../controllers/vocabulary.controller");
const contentController = require("../controllers/content.controller");
const requireAdmin = allowRole("ADMIN");
const {
  validateCreate,
  validateUpdate,
} = require("../validators/vocabulary.validator");
const {
  validateVocabularyId,
  validateCollocationBody,
  validateWordFamilyBody,
  validateCollocationId,
  validateWordFamilyId,
} = require("../validators/content.validator");

router.get("/", vocabularyController.list);
router.get("/sync", vocabularyController.sync);
router.get("/:id", vocabularyController.getById);
router.post("/", requireAdmin, validateCreate, vocabularyController.create);
router.put("/:id", requireAdmin, validateUpdate, vocabularyController.update);
router.delete("/:id", requireAdmin, vocabularyController.remove);

router.get("/:id/collocations", validateVocabularyId, contentController.listCollocations);
router.post(
  "/:id/collocations",
  requireAdmin,
  validateVocabularyId,
  validateCollocationBody,
  contentController.createCollocation
);
router.delete(
  "/:id/collocations/:collocationId",
  requireAdmin,
  validateVocabularyId,
  validateCollocationId,
  contentController.deleteCollocation
);

router.get("/:id/word-family", validateVocabularyId, contentController.listWordFamily);
router.post(
  "/:id/word-family",
  requireAdmin,
  validateVocabularyId,
  validateWordFamilyBody,
  contentController.createWordFamily
);
router.delete(
  "/:id/word-family/:wordFamilyId",
  requireAdmin,
  validateVocabularyId,
  validateWordFamilyId,
  contentController.deleteWordFamily
);

module.exports = router;
