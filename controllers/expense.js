const Expense = require("../models/expense");
const Expneses = require("../models/expense");

exports.getExpenses = (req, res, next) => {
  req.user
    .getExpenses()
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.addExpense = (req, res, next) => {
  const { id, price, description, categary } = req.body;
  console.log(req.user.id, ",,,header");
  Expense.create({ price, description, categary, userId: req.user.id })
    .then((result) => {
      res.json({
        id: result.id,
        price,
        description,
        categary,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.deleteExpense = (req, res, next) => {
  const prodId = req.params.userId;
  Expense.destroy({ where: { id: prodId, userId: req.user.id } })
    .then((rows) => {
      console.log("sussfully deleted", rows);
      res.json({
        message: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
