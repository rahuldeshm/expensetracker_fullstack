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
    console.log(username, email, phone, password);
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ err: "bad request. something is missing" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw err;
        }
        try {
          const result = await User.create({
            username,
            email,
            phone,
            password: hash,
          });

          const token = jwt.sign(
            { id: result.id, username: result.username },
            process.env.token_key
          );
          console.log(token, result.ispremium, result.id, result.username);
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
          res.status(403).json(err);
        }
      });
    }
  } catch (err) {
    res.status(403).json(err);
  }
};

exports.signin = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } }).then((result) => {
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
