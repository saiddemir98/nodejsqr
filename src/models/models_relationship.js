const sequelize = require("../configs/database");
const Sequelize = require("sequelize");
const Branch = require("../models/branch_model");
const Category = require("../models/category_model");
const Manager = require("../models/manager_model");
const Mark = require("../models/mark_model");
const Menu = require("../models/menu_model");
const Product = require("../models/product_model");
const SubCategory = require("../models/subcategory_model");
const Worker = require("../models/worker_model");

//Mark(Marka ilişkileri)
Mark.hasMany(Branch, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Branch(Şubenin bağlı oldukları ilişkilker),
Branch.belongsTo(Mark, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(Manager, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(Menu, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Manager(Yönetici ilişkileri)
Manager.hasMany(Branch, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Manager.hasMany(Worker, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Manager.hasMany(Menu, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Worker(Çalışan ilişkileri)
Worker.belongsTo(Manager, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Menu(Menu ilişkileri)
Menu.belongsTo(Manager, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Menu.hasMany(Branch, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Menu.hasMany(Category, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Catergory(Kategorinin baglı oldukları ilişkiler)
Category.hasMany(SubCategory, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Category.belongsTo(Menu, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//SubCategory(Alt kategori ilişkileri),
SubCategory.hasMany(Product, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
SubCategory.belongsTo(Category, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//Produckt(Ürünlerin ilişkileri),
Product.belongsTo(SubCategory, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize
  .sync()
  .then()
  .catch((err) => {
    console.log(err);
  });
