const User = require("../models/user");
const UserServices = require("../services/Userservices");
const S3Services = require("../services/S3services");
const Download = require("../models/FileDownloaded");
// const Expense = require("../models/expense");
// const { Sequelize } = require("sequelize");
// const sequelize = require("../util/database");

exports.getLeaderboard = async (req, res, next) => {
  if (!req.user.ispremium) {
    return res.status(403).json({ err: "USER is not PREMIUM" });
  }
  const leaderbordofuser = await User.findAll({
    attributes: ["username", "total"],
    order: [["total", "desc"]],
  });
  //so to optimize it we will use the new column in the database where we will store total price in it.
  //this is the approch of using JOINTs but this don't do the calculations and other things
  //but this calculations will definitely happpen on the database.
  // const leaderbordofuser = await User.findAll({
  //   attributes: [
  //     "id",
  //     "username",
  //     [sequelize.fn("sum", sequelize.col("expenses.price")), "total"],
  //   ],
  //   include: [
  //     {
  //       model: Expense,
  //       attributes: [],
  //     },
  //   ],
  //   group: ["user.id"],
  //   order: [["total", "desc"]],
  // });

  // console.log(leaderbordofuser);

  //this is very bad code as it involves all the iteration and it will take much time
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

exports.getDownload = async (req, res, next) => {
  if (!req.user.ispremium) {
    return res.status(403).json({ err: "USER is not PREMIUM" });
  }
  try {
    const expenses = await UserServices.getExpenses(req, {});
    const stringified = JSON.stringify(expenses);
    const filename = `Expense${req.user.id}${new Date()}.txt`;
    const fileUrl = await S3Services.uploadtoS3(stringified, filename);
    console.log(fileUrl);
    const dowlist = await Download.create({
      userId: req.user.id,
      url: fileUrl,
    });
    console.log(dowlist);
    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", success: false, err: err });
  }
};

exports.getdownloaded = async (req, res, body) => {
  try {
    const alldownloads = await req.user.getDownloads();
    res.status(200).json(alldownloads);
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "some Error occured" });
  }
};
