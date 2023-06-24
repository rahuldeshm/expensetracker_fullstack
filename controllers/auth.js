const User = require("../models/user");
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
    if (
      isStringInvalid(username) ||
      isStringInvalid(email) ||
      isStringInvalid(phone) ||
      isStringInvalid(password)
    ) {
      return res.status(400).json({ err: "bad request. something is missing" });
    }
    const result = await User.create({ username, email, phone, password });

    res.status(201).json({
      id: result.id,
    });
  } catch {
    (err) => {
      res.status(403).json(err);
    };
  }
};

exports.signin = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } }).then((result) => {
    if (result) {
      if (result.password === req.body.password) {
        res.json({ message: "Login Successful" });
      } else {
        res.status(401).json({ err: "User not authorized" });
      }
    } else {
      res.status(404).json({ err: "user not found" });
    }
  });
  console.log(req.body);
};
