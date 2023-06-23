const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true }));

app.use("/auth", authRoutes);

sequelize.sync().then(() => {
  app.listen(3000);
});
