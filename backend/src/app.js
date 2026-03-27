const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const openapiSpec = YAML.load(path.join(__dirname, "docs", "openapi.yaml"));

app.get("/api/openapi.json", (req, res) => {
  res.status(200).json(openapiSpec);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/vocabulary", authMiddleware, require("./routes/vocabulary.route"));
app.use("/api/topics", authMiddleware, require("./routes/topic.route"));
app.use("/api/review", authMiddleware, require("./routes/review.route"));
app.use("/api/errors", authMiddleware, require("./routes/error.route"));
app.use("/api/ai", authMiddleware, require("./routes/ai.route"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
    message: "Backend is running",
  });
});

app.use(errorMiddleware);

module.exports = app;
