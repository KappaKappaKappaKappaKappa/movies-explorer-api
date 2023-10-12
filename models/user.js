const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Удаляет лишние пробелы в начале и конце строки
    lowercase: true, // Преобразует в нижний регистр
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Некоректный email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false, // Cкроет поле при запросах к базе данных
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model("user", userSchema);
