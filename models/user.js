const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  username: Sequelize.STRING,
  email: { type: Sequelize.STRING, primaryKey: true },
  phone: Sequelize.STRING,
  password: Sequelize.STRING,
});

module.exports = User;
