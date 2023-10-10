const router = require("express").Router();
const auth = require("../middlewares/auth");

const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

router.use("/signup", createUser);
router.use("/signin", login);

router.use("/users", auth, require("./users"));
router.use("/movies", auth, require("./movies"));

router.use(() => {
  throw new NotFoundError("Запрашиваемый ресурс не найден!");
});

module.exports = router;
