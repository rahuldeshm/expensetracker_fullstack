const User = require("../models/user");
const Expense = require("../models/expense");
const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

exports.getLeaderboard = async (req, res, next) => {
  if (!req.user.ispremium) {
    return res.status(403).json({ err: "USER is not PREMIUM" });
  }
  // const totalexpense = {};
  // const array = [];
  // const expense = await Expense.findAll({
  //   attributes: [
  //     "userId",
  //     [sequelize.fn("sum", sequelize.col("expense.price")), "total"],
  //   ],
  //   group: ["userId"],
  // });
  // console.log(expense);
  const leaderbordofuser = await User.findAll({
    attributes: [
      "id",
      "username",
      [sequelize.fn("sum", sequelize.col("expenses.price")), "total"],
    ],
    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],
    group: ["user.id"],
    order: [["total", "desc"]],
  });
  // console.log(leaderbordofuser);
  // for (e of expense) {
  //   if (totalexpense[e.userId]) {
  //     totalexpense[e.userId] = totalexpense[e.userId] + e.price;
  //   } else {
  //     totalexpense[e.userId] = e.price;
  //   }
  // }

  // users.forEach((e) => {
  //   array.push({
  //     username: e.username,
  //     total: totalexpense[e.id] || 0,
  //   });
  // });
  // array.sort((b, a) => a.total - b.total);
  res.status(201).json(leaderbordofuser);
};
