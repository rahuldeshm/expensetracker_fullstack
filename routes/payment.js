const express = require("express");
const authenticate = require("../middleware/auth");
const payment = require("../controllers/payment");

const router = express.Router();

router.post("/createOrder", authenticate, payment.createOrder);
router.post("/update", authenticate, payment.updateOrder);
module.exports = router;
