const router = require("express").Router();
const favoriteController = require("../controllers/favorite.controller");

router.get("/", favoriteController.list);
router.post("/", favoriteController.add);
router.get("/check/:wordId", favoriteController.check);
router.delete("/:wordId", favoriteController.remove);

module.exports = router;
