const router = require("express").Router();
const errorController = require("../controllers/error.controller");
const {
  validateIdParam,
  validateCreateError,
  validateUpdateError,
  validateFixedPayload,
  validateCreateTag,
  validateSetErrorTags,
} = require("../validators/error.validator");

router.get("/", errorController.list);
router.get("/top-repeated", errorController.topRepeated);
router.post("/", validateCreateError, errorController.create);
router.put("/:id", validateIdParam, validateUpdateError, errorController.update);
router.patch(
  "/:id/fixed",
  validateIdParam,
  validateFixedPayload,
  errorController.setFixed
);
router.patch("/:id/repeat", validateIdParam, errorController.incrementRepeat);
router.get("/tags", errorController.listTags);
router.post("/tags", validateCreateTag, errorController.createTag);
router.get("/:id/tags", validateIdParam, errorController.getErrorTags);
router.put("/:id/tags", validateIdParam, validateSetErrorTags, errorController.setErrorTags);
router.delete("/:id", validateIdParam, errorController.remove);

module.exports = router;
