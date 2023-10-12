const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");

const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

router.use(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required(),
    }),
  }),
  createUser
);
router.use(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.use("/users", auth, require("./users"));
router.use("/movies", auth, require("./movies"));

router.use(() => {
  throw new NotFoundError("Запрашиваемый ресурс не найден!");
});

module.exports = router;
