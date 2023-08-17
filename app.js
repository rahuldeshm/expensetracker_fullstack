const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expense");
// const paymentRoutes = require("./routes/payment");
// const premiumRoutes = require("./routes/premium");
// const profileRoutes = require("./routes/profile");
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
// app.use("/payment", paymentRoutes);
// app.use("/premium", premiumRoutes);
// app.use("/profile", profileRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.f5cboss.mongodb.net/expense?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("connected");
    app.listen(process.env.PORT || 3001);
  })
  .catch((err) => console.log(err));
// https.createServer({ key: privateKey, cert: certificate }, app).listen(3000);
