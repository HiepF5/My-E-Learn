const router = require("express").Router();

router.get("/today", (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
    message: "Review route protected and ready",
  });
});

module.exports = router;
