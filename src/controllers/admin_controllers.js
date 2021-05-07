const jwt = require("jsonwebtoken");
const Manager = require("../models/manager_model");

const createError = require("http-errors");

const profileUpdate = async (req, res, next) => {
  try {
    console.log(req.file.filename);
    const logginJwtToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(
      logginJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET
    );
    const manager = await Manager.findByPk(decodedToken.managerId);
    if (!manager) {
      throw createError(500, "Lütfen giriş yaparak deneyiniz!");
    }
    try {
      if (!req.file) {
        throw createError(500, "Bir hata çıktı daha sonra tekrar deneyiniz.");
      }
      const result = await Manager.update(
        { avatar: req.file.filename },
        {
          where: {
            id: decodedToken.managerId,
          },
        }
      );
      console.log(req.file);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
const profileShow = async (req, res, next) => {
  try {
    const logginJwtToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(
      logginJwtToken,
      process.env.CONFIRM_LOGED_JWT_SECRET
    );
    const manager = await Manager.findByPk(decodedToken.managerId, {
      attributes: [
        "id",
        "name",
        "surname",
        "email",
        "phoneNumber",
        "address",
        "avatar",
      ],
    });
    if (!manager) {
      throw createError(
        500,
        "Hesabınıza şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz."
      );
    }
    return res.json({
      id: manager.id,
      name: manager.name,
      surname: manager.surname,
      email: manager.email,
      phoneNumber: manager.phoneNumber,
      address: manager.address,
      avatar: manager.avatar,
      jwt: logginJwtToken,
    });
  } catch (error) {
    if (error.status === 500) {
      next(error);
    } else {
      createError(500, "Bir hata çıktı lütfen daha sonra tekrar deneyiniz.");
    }
  }
};

module.exports = {
  profileUpdate,
  profileShow,
};
