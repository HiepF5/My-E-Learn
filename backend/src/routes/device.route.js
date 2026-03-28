const router = require("express").Router();
const deviceController = require("../controllers/device.controller");

router.post("/tokens", deviceController.register);
router.delete("/tokens", deviceController.unregister);
router.get("/tokens", deviceController.list);

module.exports = router;
