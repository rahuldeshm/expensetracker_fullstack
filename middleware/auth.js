const jwt = require("jsonwebtoken");
const User = require("./../models/user");

const authenticate = (req, res, next) => {
  const token = req.headers.authorisation;

  try {
    const userId = jwt.verify(token, process.env.token_key);
    User.findById(userId.id)
      .then((user) => {
        console.log("authenticated");
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("invalid token");
    res.status(405).json({ err: "invalid token" });
  }
};

module.exports = authenticate;
