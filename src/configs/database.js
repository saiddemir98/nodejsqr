const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_CONNECITON_DBNAME,
  process.env.MYSQL_CONNECITON_USER,
  process.env.MYSQL_CONNECITON_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.MYSQL_CONNECITON_HOST,
  }
);

module.exports = sequelize;
