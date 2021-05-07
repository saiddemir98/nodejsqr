const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Manager = sequelize.define(
  "manager",
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
    surname: {
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
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notNull: true,
      },
    },
    emailStatus: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: Sequelize.STRING(60),
      required: true,
      allowNull: false,
      validate: {
        len: [6, 500],
        notNull: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING(11),
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
        len: [6, 255],
        notNull: true,
      },
    },
    avatar: {
      type: Sequelize.STRING(150),
    },
  },
  {
    timestamp: true,
  }
);

module.exports = Manager;
