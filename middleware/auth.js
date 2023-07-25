const jwt = require("jsonwebtoken");
const User = require("./../models/user");

const authenticate = (req, res, next) => {
  const token = req.headers.authorisation;
  console.log("added cicd pipeline");

  try {
    const userId = jwt.verify(token, process.env.token_key);
    User.findByPk(userId.id)
      .then((user) => {
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
