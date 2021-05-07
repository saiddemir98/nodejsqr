const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(30),
      required: true,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 30],
        notNull: true,
      },
    },
    menuMessage: {
      type: Sequelize.STRING(255),
    },
  },
  {
    timestamp: true,
  }
);

module.exports = Menu;
