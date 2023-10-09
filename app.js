const mongoose = require("mongoose");
const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/bitfilmsdb");

app.use("/users", require("./routes/users"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
