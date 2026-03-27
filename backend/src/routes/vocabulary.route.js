const router = require("express").Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
    message: "Vocabulary route protected and ready",
  });
});

module.exports = router;
