const jwt = require("jsonwebtoken");
const Product = require("../models/product_model");
const createError = require("http-errors");
const SubCategory = require("../models/subcategory_model");
const Category = require("../models/category_model");
const Menu = require("../models/menu_model");
const fs = require("fs");
const sequelize = require("../configs/database");
const { validationResult } = require("express-validator");

//TODO MENU FUNCTIONS
const addMenu = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler menü oluşturabilirler!");
    }
    const newMenu = await Menu.build({
      managerId: decodedToken.managerId,
      name: req.body.name,
      menuMessage: req.body.menuMessage,
    });
    const result = await newMenu.save();
    if (!result) {
      throw createError(400, "Menü ekleme sırasında bir hata oluştu.");
    }
    return res.json({ message: "Menü başarıyla eklenmiştir." });
  } catch (error) {
    next(error);
  }
};
const deleteMenu = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler menü silebilir!");
    }
    const result = await Menu.destroy({
      where: {
        id: req.body.id,
        managerId: decodedToken.managerId,
      },
    });
    if (!result) {
      throw createError(400, "Menü silme sırasında bir hata oluştu.");
    }
    const deleteDir = "./uploads/" + req.body.id;
    try {
      fs.rmdir(deleteDir, { recursive: true }, (error) => {
        if (error) throw error;
        console.log("İşlem başarılı...");
      });
    } catch (error) {
      next(error);
    }
    return res.json({ message: "Menü başarıyla silinmiştir." });
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler menü güncelleyebilir!");
    }
    const result = await Menu.update(
      { name: req.body.name, menuMessage: req.body.menuMessage },
      {
        where: {
          id: req.body.id,
          managerId: decodedToken.managerId,
        },
      }
    );
    if (!result) {
      throw createError(400, "Menü güncelleme sırasında bir hata oluştu.");
    }
    if (result[0] == 0) {
      throw createError(400, "Lütfen kendi menünüzü güncellemeye çalışın");
    }
    return res.json({ message: "Menü başarıyla güncellenmiştir." });
  } catch (error) {
    next(error);
  }
};

const getMenuList = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler menü oluşturabilirler!");
    }
    const result = await Menu.findAll({
      where: { managerId: decodedToken.managerId },
      attributes: ["id", "name", "menuMessage", "managerId", "updatedAt"],
      include: {
        model: Category,
        attributes: ["menuId", "id", "name", "categoryimage", "updatedAt"],
        include: {
          model: SubCategory,
          attributes: [
            "categoryId",
            "id",
            "name",
            "subcategoryimage",
            "updatedAt",
          ],
          include: {
            model: Product,
            attributes: [
              "subcategoryId",
              "id",
              "name",
              "explanation",
              "price",
              "productimage",
            ],
          },
        },
      },
    });

    return res.send(result);
  } catch (error) {
    next(error);
  }
};

//TODO CATEGORY FUNCTIONS
const addCategory = async (req, res, next) => {
  try {
    var newCategory;
    if (req.file) {
      newCategory = await Category.build({
        menuId: req.body.menuId,
        name: req.body.name,
        categoryimage:
          process.env.WEB_SITE_URL +
          "image/" +
          req.body.menuId +
          "/" +
          req.file.filename,
      });
    } else {
      newCategory = await Category.build({
        menuId: req.body.menuId,
        name: req.body.name,
      });
    }

    const addResult = await newCategory.save();
    if (!addResult) {
      throw createError(
        300,
        "Kategori ekleme sırasında bir hata meydana geldi."
      );
    }
    return res.json({
      message: "Kategori başarıyla eklenmiştir",
      addedCategory: addResult,
    });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    console.log("deneme");
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori silebilir!");
    }
    const resultCategory = await Category.findByPk(req.body.id);
    const resultMenu = await Menu.findByPk(resultCategory.menuId);
    if (!resultMenu) {
      throw createError(
        400,
        "Lütfen kategori ve menü seçtikten sonra silmeye çalışınız."
      );
    }
    if (resultMenu.managerId != decodedToken.managerId) {
      throw createError(400, "Sadece kendi kategorilerinizi silebilirsiniz.");
    }
    const categoryResult = await Category.findByPk(req.body.id);
    const deleteDir =
      "./uploads/" + categoryResult.menuId + "/" + categoryResult.id;
    if (
      categoryResult.categoryimage !=
      process.env.WEB_SITE_URL + "image/default.jpg"
    ) {
      fs.unlink(
        "./uploads/" +
          categoryResult.categoryimage.replace(
            process.env.WEB_SITE_URL + "image/",
            ""
          ),
        (error) => {
          if (error) throw error;
          console.log("İşlem başarılı...");
        }
      );
    }
    fs.rmdir(deleteDir, { recursive: true }, (error) => {
      if (error) throw error;
      console.log("İşlem başarılı...");
    });

    const result = await Category.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (!result) {
      throw createError(
        300,
        "Kategori silme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla silinmiştir" });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori silebilir!");
    }
    const resultCategory = await Category.findByPk(req.body.id);
    const resultMenu = await Menu.findByPk(resultCategory.menuId);
    if (!resultMenu) {
      throw createError(
        400,
        "Lütfen kategori ve menü seçtikten sonra silmeye çalışınız."
      );
    }
    if (resultMenu.managerId != decodedToken.managerId) {
      throw createError(400, "Sadece kendi kategorilerinizi silebilirsiniz.");
    }
    var result;
    if (req.file) {
      result = await Category.update(
        {
          name: req.body.name,
          categoryimage:
            process.env.WEB_SITE_URL +
            "image/" +
            req.body.menuId +
            "/" +
            req.file.filename,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      if (
        categoryResult.categoryimage !=
        process.env.WEB_SITE_URL + "image/default.jpg"
      ) {
        fs.unlink(
          "./uploads/" +
            resultCategory.categoryimage.replace(
              process.env.WEB_SITE_URL + "image/",
              ""
            ),
          (error) => {
            if (error) throw error;
            console.log("İşlem başarılı...");
          }
        );
      }
    } else {
      result = await Category.update(
        { name: req.body.name },
        {
          where: {
            id: req.body.id,
          },
        }
      );
    }
    if (!result) {
      throw createError(
        300,
        "Kategori silme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla silinmiştir" });
  } catch (error) {
    next(error);
  }
};

const getCategoryList = async (req, res, next) => {
  try {
    const result = await Category.findAll({
      where: { menuId: req.params.menuId },
      attributes: ["id", "name"],
    });
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

//TODO SUBCATEGORY FUNCTIONS
const addSubCategory = async (req, res, next) => {
  try {
    var newSubCategory;
    if (req.file) {
      newSubCategory = await SubCategory.build({
        categoryId: req.body.categoryId,
        name: req.body.name,
        subcategoryimage:
          process.env.WEB_SITE_URL +
          "image/" +
          req.body.menuId +
          "/" +
          req.body.categoryId +
          "/" +
          req.file.filename,
      });
    } else {
      newSubCategory = await SubCategory.build({
        categoryId: req.body.categoryId,
        name: req.body.name,
      });
    }
    //console.log(process.env.WEB_SITE_URL+'image/'+req.body.menuId+'/'+req.body.categoryId+'/'+req.file.filename);
    const addResult = await newSubCategory.save();
    if (!addResult) {
      throw createError(
        300,
        "Kategori ekleme sırasında bir hata meydana geldi."
      );
    }
    return res.json({
      message: "Ekleme başarıyla tamamlandı.",
      addedSubcategory: addResult,
    });
  } catch (error) {
    next(error);
  }
};
const deleteSubCategory = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori silebilir!");
    }
    const resultManager = await sequelize.query(
      "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id IN (SELECT categories.menuId FROM categories WHERE id IN (SELECT subcategories.categoryId FROM subcategories WHERE id =" +
        req.body.id +
        ")))"
    );

    if (!resultManager) {
      throw createError(
        400,
        "Lütfen alt kategori seçtikten sonra silmeye çalışınız."
      );
    }
    if (
      resultManager[0][0] == null ||
      resultManager[0][0].id != decodedToken.managerId
    ) {
      throw createError(
        400,
        "Sadece kendi alt kategorilerinizi silebilirsiniz."
      );
    }
    const subcategoryToBeDelete = await SubCategory.findByPk(req.body.id);
    const categoryResult = await Category.findByPk(
      subcategoryToBeDelete.categoryId
    );
    const deleteDir =
      "./uploads/" +
      categoryResult.menuId +
      "/" +
      categoryResult.id +
      "/" +
      subcategoryToBeDelete.id;
    fs.rmdir(deleteDir, { recursive: true }, (error) => {
      if (error) throw error;
      console.log("İşlem başarılı...");
    });

    if (
      subcategoryToBeDelete.subcategoryimage !=
      process.env.WEB_SITE_URL + "image/default.jpg"
    ) {
      fs.unlink(
        "./uploads/" +
          subcategoryToBeDelete.subcategoryimage.replace(
            process.env.WEB_SITE_URL + "/image/",
            ""
          ),
        (error) => {
          if (error) throw error;
          console.log("İşlem başarılı...");
        }
      );
    }

    const result = await SubCategory.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (!result) {
      throw createError(
        300,
        "Kategori silme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla silinmiştir" });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    console.log(req.body);
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori silebilir!");
    }
    const resultManager = await sequelize.query(
      "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id IN (SELECT categories.menuId FROM categories WHERE id IN (SELECT subcategories.categoryId FROM subcategories WHERE id =" +
        req.body.id +
        ")))"
    );

    if (!resultManager) {
      throw createError(
        400,
        "Lütfen alt kategori seçtikten sonra silmeye çalışınız."
      );
    }
    if (
      resultManager[0][0] == null ||
      resultManager[0][0].id != decodedToken.managerId
    ) {
      throw createError(
        400,
        "Sadece kendi alt kategorilerinizi silebilirsiniz."
      );
    }
    const subcategoryToBeDelete = await SubCategory.findByPk(req.body.id);
    const categoryResult = await Category.findByPk(
      subcategoryToBeDelete.categoryId
    );
    var result;
    if (req.file) {
      result = await SubCategory.update(
        {
          name: req.body.name,
          subcategoryimage:
            process.env.WEB_SITE_URL +
            "image/" +
            categoryResult.menuId +
            "/" +
            subcategoryToBeDelete.categoryId +
            "/" +
            req.file.filename,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      if (
        subcategoryToBeDelete.subcategoryimage !=
        process.env.WEB_SITE_URL + "image/default.jpg"
      ) {
        fs.unlink(
          "./uploads/" +
            subcategoryToBeDelete.subcategoryimage.replace(
              process.env.WEB_SITE_URL + "image/",
              ""
            ),
          (error) => {
            if (error) throw error;
            console.log("İşlem başarılı...");
          }
        );
      }
    } else {
      result = await SubCategory.update(
        { name: req.body.name },
        {
          where: {
            id: req.body.id,
          },
        }
      );
    }

    if (!result) {
      throw createError(
        300,
        "Kategori silme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla silinmiştir" });
  } catch (error) {
    next(error);
  }
};

const getSubCategoryList = async (req, res, next) => {
  try {
    const result = await SubCategory.findAll({
      where: { categoryId: req.params.categoryId },
      attributes: ["id", "name"],
    });
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

//TODO PRODUCT FUNCTIONS
const addProduct = async (req, res, next) => {
  try {
    const resultSubCategory = await SubCategory.findByPk(
      req.body.subcategoryId
    );
    const resultCategory = await Category.findByPk(
      resultSubCategory.categoryId
    );

    var newProduct;
    if (req.file) {
      newProduct = await Product.build({
        subcategoryId: req.body.subcategoryId,
        name: req.body.name,
        explanation: req.body.explanation,
        price: req.body.price,
        productimage:
          process.env.WEB_SITE_URL +
          "image/" +
          resultCategory.menuId +
          "/" +
          resultSubCategory.categoryId +
          "/" +
          req.body.subcategoryId +
          "/" +
          req.file.filename,
      });
    } else {
      newProduct = await Product.build({
        subcategoryId: req.body.subcategoryId,
        name: req.body.name,
        explanation: req.body.explanation,
        price: req.body.price,
      });
    }
    const addResult = await newProduct.save();
    if (!addResult) {
      throw createError(300, "Ürün ekleme sırasında bir hata meydana geldi.");
    }
    return res.json({
      message: "Ürüm başarıyla eklenmiştir",
      addedProduct: addResult,
    });
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori silebilir!");
    }
    const resultManager = await sequelize.query(
      "SELECT managers.id FROM managers WHERE id IN (SELECT menus.managerId FROM menus WHERE id IN (SELECT categories.menuId FROM categories WHERE id IN (SELECT subcategories.categoryId FROM subcategories WHERE id IN (SELECT products.subcategoryId FROM products WHERE id=" +
        req.body.id +
        "))))"
    );

    if (!resultManager) {
      throw createError(400, "Lütfen ürün seçtikten sonra silmeye çalışınız.");
    }
    if (
      resultManager[0][0] == null ||
      resultManager[0][0].id != decodedToken.managerId
    ) {
      throw createError(400, "Sadece kendi ürünlerinizi silebilirsiniz.");
    }
    const productToBeDelete = await Product.findByPk(req.body.id);

    const result = await Product.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (
      productToBeDelete.productimage !=
      process.env.WEB_SITE_URL + "image/default.jpg"
    ) {
      fs.unlink(
        "./uploads/" +
          productToBeDelete.productimage.replace(
            process.env.WEB_SITE_URL + "/image/",
            ""
          ),
        (error) => {
          if (error) throw error;
          console.log("İşlem başarılı...");
        }
      );
    }

    if (!result) {
      throw createError(
        300,
        "Kategori silme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla silinmiştir" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    var decodedToken;
    const verifyJwtToken = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(
      verifyJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET,
      (e, decoded) => {
        if (e) {
          throw createError(404, "Lütfen düzgün giriş yapınız.");
        }
        decodedToken = decoded;
      }
    );
    if (!decodedToken.managerId) {
      throw createError(400, "Sadece yöneticiler kategori güncelleyebilir!");
    }
    const resultProduct = await Product.findByPk(req.body.id);
    const resultSubCategory = await SubCategory.findByPk(
      resultProduct.subcategoryId
    );
    const resultCategory = await Category.findByPk(
      resultSubCategory.categoryId
    );
    const resultMenu = await Menu.findByPk(resultCategory.menuId);
    if (!resultMenu) {
      throw createError(
        400,
        "Lütfen kategori ve menü seçtikten sonra güncellemeye çalışınız."
      );
    }
    if (resultMenu.managerId != decodedToken.managerId) {
      throw createError(
        400,
        "Sadece kendi kategorilerinizi güncelleyebilirsiniz."
      );
    }
    var result;
    if (req.file) {
      result = await Product.update(
        {
          ame: req.body.name,
          explanation: req.body.explanation,
          price: req.body.price,
          productimage:
            process.env.WEB_SITE_URL +
            "image/" +
            resultCategory.menuId +
            "/" +
            resultSubCategory.categoryId +
            "/" +
            req.body.subcategoryId +
            "/" +
            req.file.filename,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      if (
        resultProduct.productimage !=
        process.env.WEB_SITE_URL + "image/default.jpg"
      ) {
        fs.unlink(
          "./uploads/" +
            resultProduct.productimage.replace(
              process.env.WEB_SITE_URL + "/image/",
              ""
            ),
          (error) => {
            if (error) throw error;
            console.log("İşlem başarılı...");
          }
        );
      }
    } else {
      result = await Product.update(
        {
          name: req.body.name,
          explanation: req.body.explanation,
          price: req.body.price,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
    }
    if (!result) {
      throw createError(
        300,
        "Kategori güncelleme sırasında bir hata meydana geldi."
      );
    }
    return res.json({ message: "Kategori başarıyla güncellenmiştir" });
  } catch (error) {
    next(error);
  }
};

const getProductList = async (req, res, next) => {
  try {
    const result = await Product.findAll({
      where: { subcategoryId: req.params.subcategoryId },
      attributes: ["id", "name", "explanation", "productimage", "price"],
    });
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMenu,
  deleteMenu,
  updateMenu,
  getMenuList,

  addCategory,
  deleteCategory,
  updateCategory,
  getCategoryList,

  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryList,

  addProduct,
  deleteProduct,
  updateProduct,
  getProductList,
};
