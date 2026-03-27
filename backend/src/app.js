const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/vocabulary", authMiddleware, require("./routes/vocabulary.route"));
app.use("/api/review", authMiddleware, require("./routes/review.route"));
app.use("/api/errors", authMiddleware, require("./routes/error.route"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
    message: "Backend is running",
  });
});

app.use(errorMiddleware);

module.exports = app;
