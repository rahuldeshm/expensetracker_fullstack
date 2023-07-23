const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./util/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const Expense = require("./models/expense");
const User = require("./models/user");
const paymentRoutes = require("./routes/payment");
const Order = require("./models/order");
const premiumRoutes = require("./routes/premium");
const Forgot = require("./models/forgot");
const profileRoutes = require("./routes/profile");
const Download = require("./models/FileDownloaded");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
// const https = require("https");

const app = express();

app.use(cors());
// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "accress.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json({ extended: true }));

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/premium", premiumRoutes);
app.use("/profile", profileRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgot);
Forgot.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize.sync().then(() => {
  // https.createServer({ key: privateKey, cert: certificate }, app).listen(3000);
  app.listen(process.env.PORT || 3000);
});
