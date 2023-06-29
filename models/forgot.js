const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Forgot = sequelize.define("forgot", {
  id: { type: Sequelize.STRING, primaryKey: true },
  userId: Sequelize.INTEGER,
  isactive: Sequelize.BOOLEAN,
});

module.exports = Forgot;
