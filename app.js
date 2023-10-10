const mongoose = require("mongoose");
const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/bitfilmsdb");

app.use(express.json());

app.use(requestLogger);

app.use("/", require("./routes/index"));

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
