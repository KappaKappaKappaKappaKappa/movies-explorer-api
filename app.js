const mongoose = require("mongoose");
const express = require("express");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/bitfilmsdb");

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
