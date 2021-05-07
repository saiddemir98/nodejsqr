const router = require("express").Router();
const menuControllers = require("../controllers/menu_controllers");
const multerControllers = require("../controllers/multer_controllers");
const validatorMiddleware = require("../middlewares/validation_middlewares");

//menu ye atılacak istekler
router.post("/", menuControllers.addMenu);
router.delete("/", menuControllers.deleteMenu);
router.patch("/", menuControllers.updateMenu);
router.get("/all/", menuControllers.getMenuList);
//category ye yapılacak istekler
router.post(
  "/category-add",
  multerControllers.uploadCategoryImage,
  menuControllers.addCategory
);
router.delete("/category-delete", menuControllers.deleteCategory);
router.post(
  "/category-update",
  multerControllers.uploadCategoryImage,
  menuControllers.updateCategory
);
router.get("/category-list/:menuId", menuControllers.getCategoryList);
//subcategorye atılacak istekler
router.post(
  "/subcategory-add",
  multerControllers.uploadSubcategoryImage,
  menuControllers.addSubCategory
);
router.delete("/subcategory-delete", menuControllers.deleteSubCategory);
router.post(
  "/subcategory-update",
  multerControllers.uploadSubcategoryImage,
  menuControllers.updateSubCategory
);
router.get("/subcategory-list/:categoryId", menuControllers.getSubCategoryList);
//producta atılacak istekler
router.post(
  "/product-add",
  multerControllers.uploadProductImage,
  menuControllers.addProduct
);
router.delete("/product-delete", menuControllers.deleteProduct);
router.post(
  "/product-update",
  multerControllers.uploadProductImage,
  menuControllers.updateProduct
);
router.get("/product-list/:subcategoryId", menuControllers.getProductList);
module.exports = router;
