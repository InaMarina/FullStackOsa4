const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const cors = require("cors");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

logger.info("connecting from app.js to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;