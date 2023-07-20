const Expense = require("../models/expense");
const sequelize = require("../util/database");

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
  const t = await sequelize.transaction();
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
      const promise1 = expense.save({ transaction: t });
      const promise2 = req.user.update(
        { total: totalexpense },
        { transaction: t }
      );
      Promise.all([promise1, promise2])
        .then(async () => {
          await t.commit();
          res.json({ id, price, description, categary });
        })
        .catch(async (err) => {
          await t.rollback();
          throw new Error("something went wrong while updating in database");
        });
    } else {
      console.log("new here");
      const promise1 = Expense.create(
        {
          price,
          description,
          categary,
          userId: req.user.id,
        },
        { transaction: t }
      );
      const totalexpense =
        (req.user.total ? parseInt(req.user.total) : 0) + parseInt(price);
      const promise2 = req.user.update(
        { total: totalexpense },
        { transaction: t }
      );
      Promise.all([promise1, promise2])
        .then(async ([created]) => {
          await t.commit();
          res.json({
            id: created.id,
            price,
            description,
            categary,
            createdAt: created.createdAt,
          });
        })
        .catch(async (err) => {
          console.log(err);
          await t.rollback();
          throw new Error("something went wrong while updating in database");
        });
    }
  } catch (err) {
    console.log("outererr");
    await t.rollback();
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const prodId = req.params.userId;
    const expensetotal = parseInt(req.user.total) - parseInt(req.headers.price);
    await req.user.update({ total: expensetotal }, { transaction: t });

    const rows = await Expense.destroy({
      where: { id: prodId, userId: req.user.id },
      transaction: t,
    });

    await t.commit();
    console.log("sussfully deleted", rows);
    res.json({
      message: "success",
    });
  } catch (err) {
    console.log("firsterr");
    await t.rollback();
    console.log(err);
    res.status(500).json({ error: err });
  }
};
