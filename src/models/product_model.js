const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Product = sequelize.define(
  "product",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      required: true,
      allowNull: false,
      validate: {
        len: [2, 50],
        notNull: true,
      },
    },
    explanation: {
      type: Sequelize.STRING(255),
      required: true,
    },
    productimage: {
      type: Sequelize.STRING(300),
      required: true,
      allowNull: false,
      defaultValue: process.env.WEB_SITE_URL + "uploads/default.jpg",
      validate: {
        len: [3, 300],
        notNull: true,
      },
    },
    price: {
      type: Sequelize.DOUBLE,
      required: true,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
  },
  {
    timestamp: true,
  }
);

module.exports = Product;
