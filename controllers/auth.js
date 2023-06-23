const User = require("../models/user");
function stringValidater(string) {
  if (string == null || string == undefined || string.length == 0) {
    return false;
  } else {
    return true;
  }
}

exports.signup = (req, res, next) => {
  const { username, email, phone, password } = req.body;
  if (
    stringValidater(username) ||
    stringValidater(email) ||
    stringValidater(phone) ||
    stringValidater(password)
  ) {
    return res.status(400).json({ err: "bad request. something is missing" });
  }
  User.create({ username, email, phone, password })
    .then((result) => {
      res.status(201).json({
        id: result.id,
      });
    })
    .catch((err) => {
      res.status(403).json(err);
    });
};

exports.signin = (req, res, next) => {
  User.getUserByEmail(req.body.email).then((res) => {
    console.log(res);
  });
  console.log(req.body);
};
