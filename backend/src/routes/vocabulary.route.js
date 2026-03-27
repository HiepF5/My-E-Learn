const router = require("express").Router();
const vocabularyController = require("../controllers/vocabulary.controller");
const contentController = require("../controllers/content.controller");
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
router.get("/:id", vocabularyController.getById);
router.post("/", validateCreate, vocabularyController.create);
router.put("/:id", validateUpdate, vocabularyController.update);
router.delete("/:id", vocabularyController.remove);

router.get("/:id/collocations", validateVocabularyId, contentController.listCollocations);
router.post(
  "/:id/collocations",
  validateVocabularyId,
  validateCollocationBody,
  contentController.createCollocation
);
router.delete(
  "/:id/collocations/:collocationId",
  validateVocabularyId,
  validateCollocationId,
  contentController.deleteCollocation
);

router.get("/:id/word-family", validateVocabularyId, contentController.listWordFamily);
router.post(
  "/:id/word-family",
  validateVocabularyId,
  validateWordFamilyBody,
  contentController.createWordFamily
);
router.delete(
  "/:id/word-family/:wordFamilyId",
  validateVocabularyId,
  validateWordFamilyId,
  contentController.deleteWordFamily
);

module.exports = router;
