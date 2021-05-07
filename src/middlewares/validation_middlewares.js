const { body } = require("express-validator");

const validateNewUser = () => {
  return [
    body("name")
      .isLength({ min: 2, max: 30 })
      .withMessage("İsim en az 2 karakter olmalı"),
    body("email").trim().isEmail().withMessage("Geçerli bir mail giriniz"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Şifre en az 6 karakter olmalı"),
    body("repassword")
      .trim()
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Şifreler aynı değil");
        }
        return true;
      }),
    body("phoneNumber")
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage("Lütfen doğru bir telefon numarası giriniz!"),
    body("address")
      .isLength({ min: 6, max: 500 })
      .withMessage("Lütfen geçerli bir adres giriniz"),
  ];
};
module.exports = {
  validateNewUser,
};
