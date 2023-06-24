const Expneses = require("../models/expense");

exports.getExpenses = (req, res, next) => {
  Expneses.findAll()
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.addExpense = (req, res, next) => {
  const { price, description, categary } = req.body;
  Expneses.create({ price, description, categary })
    .then((result) => {
      console.log(result.id); // Access the insertId property
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
  console.log(prodId);
  Expneses.destroy({ where: { id: prodId } })
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
