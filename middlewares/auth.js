const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");
const { JWT_SECRET } = require("../config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthError("Необходима авторизация!");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError("Необходима авторизация!"));
  }

  req.user = payload;

  next();
};
