const uploadFile = require("../middlewares/multer_middlewares");
const uploadProductImage = async (req, res,next) => {
    try {
      await uploadFile.uploadProductImageMiddleware(req, res);
      
      next();
    } catch (err) {
      console.log(err);
        next(err);
    }
  };
  const uploadSubcategoryImage = async (req, res,next) => {
    try {
      await uploadFile.uploadSubcategoryImageMiddleware(req, res);
      
      next();
    } catch (err) {
      console.log(err);
        next(err);
    }
  };
  const uploadCategoryImage= async (req, res,next) => {
    try {
      await uploadFile.uploadCategoryImageMiddleware(req, res);
      
      next();
    } catch (err) {
      console.log(err);
        next(err);
    }
  };
  
  
  module.exports={
    uploadProductImage,
    uploadSubcategoryImage,
    uploadCategoryImage
  }