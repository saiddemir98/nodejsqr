const multer = require("multer");
const { validationResult } = require("express-validator");
const util = require("util");
const maxSize = 2 * 1024 * 1024;
const fs = require("fs");
const createError = require("http-errors");
const sequelize = require("../configs/database");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const validatorMiddleware = require("../middlewares/validation_middlewares");
const { dir } = require("console");

try {
  const productStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const subcategoryId = req.body.subcategoryId;
      const categoryId = req.body.categoryId;
      const menuId = req.body.menuId;
      const dir =
        "./uploads/" + menuId + "/" + categoryId + "/" + subcategoryId;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + ".png");
    },
  });
  const subcategoryStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const categoryId = req.body.categoryId;
      const menuId = req.body.menuId;
      const dir = "./uploads/" + menuId + "/" + categoryId;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + ".png");
    },
  });
  const categoryStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const menuId = req.body.menuId;
      const dir = "./uploads/" + menuId;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + ".png");
    },
  });
  const managerStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const managerId = req.body.managerId;
      const dir = "./uploads/managers/" + managerId;
      fs.exists(dir, (exist) => {
        if (!exist) {
          return fs.mkdir(dir, (error) => cb(error, dir));
        }
        return cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + req.file.mimetype);
    },
  });

  const productImageFilter = async (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      var decodedToken;
      const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
      jwt.verify(
        verifyJwtToken,
        process.env.CONFIRM_LOGED_JWT_SECRET,
        (e, decoded) => {
          if (e) {
            return cb({ message: "Lütfen düzgün giriş yapınız." }, false);
          }
          decodedToken = decoded;
        }
      );
      if (!decodedToken.managerId) {
        return cb({ message: "Sadece yöneticiler ürün oluşturabilir." }, false);
      }
      const result = await sequelize.query(
        "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id IN (SELECT categories.menuId FROM categories WHERE id IN (SELECT subcategories.categoryId FROM subcategories WHERE id=" +
          req.body.subcategoryId +
          ")))"
      );
      if (result[0][0] == null || result[0][0].id != decodedToken.managerId) {
        return cb(
          { message: "Sadece kendi menünüze ekleme yapabilirsiniz." },
          false
        );
      }

      if (
        req.body.price == null ||
        req.body.price <= 0 ||
        req.body.name == null ||
        req.body.name.length <= 1 ||
        Number.isNaN(Number(req.body.price))
      ) {
        return cb(
          { message: "Fiyat ve ürün ismi kısmı boş geçilemez." },
          false
        );
      }
      cb(null, true);
    } else {
      cb({ message: "Sadece resim dosyaları yükleyebilirsiniz." }, false);
    }
  };
  const subcategoryImageFilter = async (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      var decodedToken;
      const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
      jwt.verify(
        verifyJwtToken,
        process.env.CONFIRM_LOGED_JWT_SECRET,
        (e, decoded) => {
          if (e) {
            return cb({ message: "Lütfen düzgün giriş yapınız." }, false);
          }
          decodedToken = decoded;
        }
      );
      if (!decodedToken.managerId) {
        return cb(
          { message: "Sadece yöneticiler kategori oluşturabilir." },
          false
        );
      }
      const result = await sequelize.query(
        "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id IN (SELECT categories.menuId FROM categories WHERE id=" +
          req.body.categoryId +
          "))"
      );
      if (result[0][0] == null || result[0][0].id != decodedToken.managerId) {
        return cb(
          { message: "Sadece kendi menünüze ekleme yapabilirsiniz." },
          false
        );
      }
      if (req.body.name == null || req.body.name.length <= 1) {
        return cb(
          { message: "Fiyat ve ürün ismi kısmı boş geçilemez." },
          false
        );
      }
      cb(null, true);
    } else {
      cb({ message: "Sadece resim dosyaları yükleyebilirsiniz." }, false);
    }
  };
  const categoryImageFilter = async (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg"
    ) {
      var decodedToken;
      const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
      jwt.verify(
        verifyJwtToken,
        process.env.CONFIRM_LOGED_JWT_SECRET,
        (e, decoded) => {
          if (e) {
            return cb({ message: "Lütfen düzgün giriş yapınız." }, false);
          }
          decodedToken = decoded;
        }
      );
      if (!decodedToken.managerId) {
        return cb(
          { message: "Sadece yöneticiler kategori oluşturabilir." },
          false
        );
      }
      const result = await sequelize.query(
        "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id =" +
          req.body.menuId +
          ")"
      );
      if (result[0][0] == null || result[0][0].id != decodedToken.managerId) {
        return cb(
          { message: "Sadece kendi menünüze ekleme yapabilirsiniz." },
          false
        );
      }
      if (req.body.name == null || req.body.name.length <= 1) {
        return cb({ message: "Kategori ismini boş geçemezsiniz." }, false);
      }
      cb(null, true);
    } else {
      cb({ message: "Sadece resim dosyaları yükleyebilirsiniz." }, false);
    }
  };
  const uploadProductImage = multer({
    storage: productStorage,
    fileFilter: productImageFilter,
    limits: { fileSize: maxSize },
  }).single("productimage");
  const uploadSubcategoryImage = multer({
    storage: subcategoryStorage,
    fileFilter: subcategoryImageFilter,
    limits: { fileSize: maxSize },
  }).single("subcategoryimage");
  const uploadCategoryImage = multer({
    storage: categoryStorage,
    fileFilter: categoryImageFilter,
    limits: { fileSize: maxSize },
  }).single("categoryimage");
  //const uploadManagerImage=multer({storage:managerStorage,fileFilter:myFileFilter,limits: { fileSize: maxSize }});
  const uploadProductImageMiddleware = util.promisify(uploadProductImage);
  const uploadSubcategoryImageMiddleware = util.promisify(
    uploadSubcategoryImage
  );
  const uploadCategoryImageMiddleware = util.promisify(uploadCategoryImage);

  module.exports = {
    uploadProductImageMiddleware,
    uploadSubcategoryImageMiddleware,
    uploadCategoryImageMiddleware,
    //uploadManagerImage
  };
} catch (error) {
  console.log(error);
}
