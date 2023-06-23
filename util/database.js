const Sequelize = require("sequelize");
const sequelize = new Sequelize("expense", "root", "Rahul123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
