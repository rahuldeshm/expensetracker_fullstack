const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const Expense = require("./models/expense");
const User = require("./models/user");
const paymentRoutes = require("./routes/payment");
const Order = require("./models/order");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true }));

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then(() => {
  app.listen(3000);
});
