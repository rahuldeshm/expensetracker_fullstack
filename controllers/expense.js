const Expense = require("../models/expense");

function isStringInvalid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

exports.getExpenses = async (req, res, next) => {
  const ONEPAGE = +req.headers.perpage || 9;
  const page = +req.query.page || 1;
  try {
    const count = await Expense.count({ userId: req.user._id });

    const rows = await Expense.find({
      userId: req.user._id,
    })
      .limit(ONEPAGE)
      .exec();

    res.json({
      rows: rows,
      count: count,
      perPage: ONEPAGE,
      totalPages: Math.ceil(count / ONEPAGE),
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
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
      const expense = await Expense.findOne({ _id: id }).exec();

      await Expense.updateOne(
        { _id: id },
        { price, description, categary }
      ).exec();

      const preprice = expense.price;
      const totalexpense =
        parseInt(req.user.total) - parseInt(preprice) + parseInt(price);
      await req.user.updateTotalEdit({ total: totalexpense });

      res.json({ id, price, description, categary });
    } else {
      console.log("new here");
      const pro = new Expense({
        price,
        description,
        categary,
        userId: req.user._id,
      });
      const promise1 = await pro.save();
      const totalexpense =
        (req.user.total ? parseInt(req.user.total) : 0) + parseInt(price);
      const promise2 = req.user.updateTotalNew({
        total: totalexpense,
        expenseId: promise1._id,
      });
      res.json({
        id: promise1.id,
        price,
        description,
        categary,
        createdAt: promise1.createdAt,
      });
    }
  } catch (err) {
    console.log("outererr", err);
    res.status(500).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const prodId = req.params.userId;
    const expensetotal = parseInt(req.user.total) - parseInt(req.headers.price);
    await req.user.updateTotalDelete({
      total: expensetotal,
      expenseId: prodId,
    });
    const rows = await Expense.deleteOne({
      _id: prodId,
    });

    console.log("sussfully deleted", rows);
    res.json({
      message: "successfully DELETED ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getExpenset = (req, res, next) => {
  req.user
    .populate("expenses.expenseId")
    .then((rows) => {
      res.json(rows.expenses);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
