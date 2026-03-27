const router = require("express").Router();
const speakingRecordController = require("../controllers/speaking-record.controller");
const {
  validateListQuery,
  validateCreateSpeakingRecord,
} = require("../validators/speaking-record.validator");

router.get("/", validateListQuery, speakingRecordController.list);
router.post("/", validateCreateSpeakingRecord, speakingRecordController.create);

module.exports = router;

