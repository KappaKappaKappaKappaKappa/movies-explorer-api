require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { DB_ADRESS } = require("./config");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(DB_ADRESS);

app.use(express.json());

app.use(requestLogger);

app.use("/", require("./routes/index"));

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
