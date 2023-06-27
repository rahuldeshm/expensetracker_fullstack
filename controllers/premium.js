const User = require("../models/user");
const Expense = require("../models/expense");
const { Sequelize } = require("sequelize");

exports.getLeaderboard = (req, res, next) => {
  if (req.user.ispremium !== true) {
    return res.status(403).json({ err: "USER is not PREMIUM" });
  }
  const totalexpense = {};
  const array = [];
  Expense.findAll().then((expense) => {
    for (e of expense) {
      if (totalexpense[e.userId]) {
        totalexpense[e.userId] = totalexpense[e.userId] + e.price;
      } else {
        totalexpense[e.userId] = e.price;
      }
    }
    console.log(totalexpense);

    User.findAll().then((users) => {
      users.forEach((e) => {
        array.push({
          username: e.username,
          total: totalexpense[e.id] ? totalexpense[e.id] : 0,
        });
      });
      array.sort((b, a) => a.total - b.total);
      res.status(201).json(array);
    });
  });
};
