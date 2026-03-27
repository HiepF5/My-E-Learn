const router = require("express").Router();
const weakWordController = require("../controllers/weak-word.controller");
const { validateWeakWordsQuery } = require("../validators/weak-word.validator");

router.get("/", validateWeakWordsQuery, weakWordController.list);

module.exports = router;
