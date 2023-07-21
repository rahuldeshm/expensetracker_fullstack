const express = require("express");
const authenticate = require("../middleware/auth");

const expense = require("../controllers/expense");

const router = express.Router();

router.get("/expenses", authenticate, expense.getExpenses);
router.get("/expenset", authenticate, expense.getExpenset);
router.post("/expenses", authenticate, expense.addExpense);
router.delete("/expenses/:userId", authenticate, expense.deleteExpense);

module.exports = router;
