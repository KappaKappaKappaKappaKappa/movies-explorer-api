require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { errors } = require("celebrate");
const helmet = require("helmet");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { DB_ADRESS } = require("./config");
const { limiter } = require("./middlewares/limiter");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(DB_ADRESS);

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.use("/", require("./routes/index"));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
