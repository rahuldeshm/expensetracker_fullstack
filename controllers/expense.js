const Expense = require("../models/expense");

function isStringInvalid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

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

exports.addExpense = async (req, res, next) => {
  const { id, price, description, categary } = req.body;
  if (
    isStringInvalid(price) ||
    isStringInvalid(description) ||
    isStringInvalid(categary)
  ) {
    return res.status(400).json({ err: "bad request. something is missing" });
  }

  try {
    if (!!id) {
      const expense = await Expense.findByPk(id);
      console.log("this is running updating");

      const preprice = expense.price;
      const totalexpense =
        parseInt(req.user.total) - parseInt(preprice) + parseInt(price);
      expense.price = price;
      expense.description = description;
      expense.categary = categary;
      const promise1 = expense.save();
      const promise2 = req.user.update({ total: totalexpense });
      Promise.all([promise1, promise2])
        .then(() => {
          res.json({ id, price, description, categary });
        })
        .catch((err) => {
          throw new Error("something went wrong while updating in database");
        });
    } else {
      console.log("new here");
      const promise1 = Expense.create({
        price,
        description,
        categary,
        userId: req.user.id,
      });
      const totalexpense =
        (req.user.total ? parseInt(req.user.total) : 0) + parseInt(price);
      const promise2 = req.user.update({ total: totalexpense });
      Promise.all([promise1, promise2])
        .then(() => {
          res.json({ id: promise1.id, price, description, categary });
        })
        .catch((err) => {
          console.log(err);
          throw new Error("something went wrong while updating in database");
        });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
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
