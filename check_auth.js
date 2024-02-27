let cfg = require("./config.json");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Token not provided." });
  }

  jwt.verify(token, cfg.auth.jwt_key, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid token." });
    }
    req.userData = decoded;
    req.isAdmin = decoded && decoded.role === "admin";
    next();
  });
};
