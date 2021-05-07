const router = require("express").Router();
const authMiddleware = require("../middlewares/auth_middlewares");
const adminController = require("../controllers/admin_controllers");
//router.post('/profile-update',authMiddleware.isLoggedIn,multerConfig.single('avatar'),adminController.profileUpdate);
router.get("/profile", authMiddleware.isLoggedIn, adminController.profileShow);
module.exports = router;
