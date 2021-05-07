const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Branch = sequelize.define(
  "branch",
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
    email: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING(10),
      required: true,
      allowNull: false,
      validate: {
        len: [10, 10],
        isNumeric: true,
        notNull: true,
      },
    },
    address: {
      type: Sequelize.STRING(255),
      required: true,
      allowNull: false,
      validate: {
        len: [6, 350],
        notNull: true,
      },
    },
    postCode: {
      type: Sequelize.STRING(10),
      required: true,
      allowNull: false,
      validate: {
        len: [2, 10],
        notNull: true,
      },
    },
    tableCount: {
      type: Sequelize.INTEGER,
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

module.exports = Branch;
