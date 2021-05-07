const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const SubCategory = sequelize.define(
  "subcategory",
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
      validate: {
        len: [2, 30],
        notNull: true,
      },
    },
    subcategoryimage: {
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

module.exports = SubCategory;
