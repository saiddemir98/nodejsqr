const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Category = sequelize.define(
  "category",
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
    categoryimage: {
      type: Sequelize.STRING(300),
      required: true,
      allowNull: false,
      defaultValue: process.env.WEB_SITE_URL + "image/default.jpg",
      validate: {
        len: [3, 300],
        notNull: true,
      },
    },
  },
  {
    timestamp: true,
  }
);

module.exports = Category;
