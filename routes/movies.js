const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { urlRegex } = require("../utils/validation");
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

router.get("/", getMovies);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(urlRegex),
      trailerLink: Joi.string().required().regex(urlRegex),
      thumbnail: Joi.string().required().regex(urlRegex),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);
router.delete(
  "/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie
);

module.exports = router;
