const Movie = require("../models/movie");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const ForbiddenError = require("../errors/ForbiddenError");
const { STATUS_OK, STATUS_CREATED } = require("../utils/statuses");

const getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });

    if (!movies) {
      throw new NotFoundError("Фильмы не найдены!");
    }

    res.status(STATUS_OK).send({ data: movies });
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;

    const movie = await Movie.create({ owner, ...req.body });

    res.status(STATUS_CREATED).send({ data: movie });
  } catch (err) {
    if (err.name === "CastError") {
      return next(
        new BadRequestError("Переданы некоректные данные для создания фильма!")
      );
    }
    if (err.code === 11000) {
      return next(new ConflictError("Такой фильм уже есть!"));
    }
    return next(err);
  }
};

git

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
