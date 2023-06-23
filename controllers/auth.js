const User = require("../models/user");

exports.signup = (req, res, next) => {
  User.findByPk(req.body.email).then((result) => {
    if (result) {
      return res
        .status(405)
        .json({ err: "Email Already present please login." });
    } else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      }).then((result) => {
        res.json({
          id: result.id,
        });
      });
    }
  });
};
exports.signin = (req, res, next) => {
  User.getUserByEmail(req.body.email).then((res) => {
    console.log(res);
  });
  console.log(req.body);
};
