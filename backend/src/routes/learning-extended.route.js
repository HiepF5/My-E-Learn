const router = require("express").Router();
const c = require("../controllers/learning-extended.controller");

router.get("/sentence-mining", c.sentenceMiningList);
router.post("/sentence-mining", c.sentenceMiningCreate);
router.get("/shadowing", c.shadowingList);
router.post("/shadowing", c.shadowingCreate);
router.post("/grammar-micro", c.grammarMicro);
router.get("/dictation", c.dictationList);
router.post("/dictation", c.dictationCreate);
router.get("/knowledge-graph/edges", c.kgList);
router.post("/knowledge-graph/edges", c.kgCreate);
router.post("/whisper-transcripts", c.whisperCreate);

module.exports = router;
