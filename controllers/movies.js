const Movie = require("../models/user");
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
    } else if (err.code === 11000) {
      return next(new ConflictError("Такой фильм уже есть!"));
    } else {
      return next(err);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError("Выбранный фильм не найден!");
    }
    if (movie.owner.toString() !== owner) {
      throw new ForbiddenError("Недостаточно прав для удаления фильма!");
    }
    const deletedMovie = await Movie.deleteOne({ _id: movieId });
    res.status(STATUS_OK).send("Фильм успешно удален!");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
