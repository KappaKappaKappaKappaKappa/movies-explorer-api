const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const AuthError = require("../errors/AuthError");
const { STATUS_OK, STATUS_CREATED } = require("../utils/statuses");

const getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("Пользователь не найден!");
    }

    res.status(STATUS_OK).send({
      data: user,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный id пользователя!"));
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("Пользователь не найден!");
    }

    res.status(STATUS_OK).send({ data: updatedUser });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new ConflictError("Пользователь с такими данными уже существует!")
      );
    }

    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный id пользователя!"));
    }

    return next(err);
  }
};

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    if (password.length < 8) {
      throw new BadRequestError("Пароль должен быть минимум из 8 символов");
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    res.status(STATUS_CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные в метод создания пользователя!"
        )
      );
    }

    if (err.code === 11000) {
      return next(
        new ConflictError("Пользователь с таким email уже существует!")
      );
    }

    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthError("Неправильные почта или пароль!");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new AuthError("Неправильные почта или пароль!");
    }

    const payload = { _id: user._id };

    const token = jwt.sign(payload, "secret-key", { expiresIn: "1w" });

    res.status(STATUS_OK).send({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
