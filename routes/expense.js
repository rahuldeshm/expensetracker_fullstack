const express = require("express");

const expense = require("../controllers/expense");

const router = express.Router();

router.get("/expenses", expense.getExpenses);
router.post("/expenses", expense.addExpense);
router.delete("/expenses/:userId", expense.deleteExpense);

module.exports = router;
