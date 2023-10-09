const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const { STATUS_OK } = require("../utils/statuses");

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

module.exports = {
  getUser,
  updateUser
};
