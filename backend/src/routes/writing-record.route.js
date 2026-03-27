const router = require("express").Router();
const writingRecordController = require("../controllers/writing-record.controller");
const {
  validateListQuery,
  validateCreateWritingRecord,
} = require("../validators/writing-record.validator");

router.get("/", validateListQuery, writingRecordController.list);
router.post("/", validateCreateWritingRecord, writingRecordController.create);

module.exports = router;

