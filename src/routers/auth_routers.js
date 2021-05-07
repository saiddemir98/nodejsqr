const router = require("express").Router();
const authControllers = require("../controllers/auth_controllers");
const validatorMiddleware = require("../middlewares/validation_middlewares");

router.post("/login", authControllers.login);
router.post(
  "/register",
  validatorMiddleware.validateNewUser(),
  authControllers.register
);
router.get("/verify", authControllers.verifyMail);
module.exports = router;
