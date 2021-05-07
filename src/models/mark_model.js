const Sequelize = require("sequelize");

const sequelize = require("../configs/database");

const Mark = sequelize.define(
  "mark",
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
    avatar: {
      type: Sequelize.STRING(300),
    },
  },
  {
    timestamp: true,
  }
);

module.exports = Mark;
