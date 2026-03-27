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
const corsOriginEnv = process.env.CORS_ORIGIN || "*";
const allowedOrigins = corsOriginEnv
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const corsOptions =
  allowedOrigins.length === 1 && allowedOrigins[0] === "*"
    ? {}
    : {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error("CORS origin not allowed"));
        },
      };

app.use(helmet());
app.use(cors(corsOptions));
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
app.use("/api/ai/feedback", authMiddleware, require("./routes/ai-feedback.route"));
app.use("/api/streak", authMiddleware, require("./routes/streak.route"));
app.use("/api/weak-words", authMiddleware, require("./routes/weak-word.route"));
app.use("/api/speaking-records", authMiddleware, require("./routes/speaking-record.route"));
app.use("/api/writing-records", authMiddleware, require("./routes/writing-record.route"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
    message: "Backend is running",
  });
});

app.use(errorMiddleware);

module.exports = app;
