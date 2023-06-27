const Order = require("../models/order");
const Razorpay = require("razorpay");
exports.createOrder = async (req, res, next) => {
  console.log("createorder");
  try {
    const rspay = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });
    const amount = 2500;
    rspay.orders.create({ amount: amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      } else {
        req.user
          .createOrder({ orderId: order.id, status: "PENDING" })
          .then((result) => {
            return res.status(201).json({ order, key_id: rspay.key_id });
          })
          .catch((err) => console.log(err));
      }
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "some error occured" });
  }
};

exports.updateOrder = (req, res, next) => {
  console.log("update Order");
  Order.findOne({
    where: { orderId: req.body.order_id, userId: req.user.id },
  })
    .then((order) => {
      order.paymentId = req.body.payment_id;
      order.status = req.body.payment_id === null ? "FAILED" : "SUCCESS";
      return order.save();
    })
    .then((saveres) => {
      if (req.body.payment_id !== null) {
        res.status(201).json({ message: "You Are Premium user now" });
      } else {
        res.status(401).json({ message: "Payment Failed" });
      }
    })
    .catch((err) => {
      res
        .status(401)
        .json({ message: "some error occered while Updation premium" });
    });
};
