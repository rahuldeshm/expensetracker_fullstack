const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function isStringInvalid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

exports.signup = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: "bad request. something is missing" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw err;
        }
        try {
          const user = new User({ username, email, phone, password: hash });
          console.log(username, email, phone, password);
          const result = await user.save();
          const token = jwt.sign(
            { id: result.id, username: result.username },
            process.env.token_key
          );
          res.json({
            message: "Login Successful",
            ispremium: result.ispremium,
            displayName: result.username,
            email: req.body.email,
            verified: result.verified,
            phone: result.phone,
            idToken: token,
          });
        } catch (err) {
          console.log(err);
          res.status(403).json(err);
        }
      });
    }
  } catch (err) {
    res.status(403).json(err);
  }
};

exports.signin = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      bcrypt.compare(
        req.body.password,
        result.password,
        async (err, response) => {
          if (err) {
            throw new Error("something went wrong");
          }
          if (response === true) {
            const token = jwt.sign(
              { id: result.id, username: result.username },
              process.env.token_key
            );
            res.json({
              message: "Login Successful",
              ispremium: result.ispremium,
              displayName: result.username,
              phone: result.phone,
              email: req.body.email,
              verified: result.verified,
              idToken: token,
            });
          } else {
            res.status(401).json({ err: "User not authorized" });
          }
        }
      );
    } else {
      res.status(404).json({ err: "user not found" });
    }
  });
};
