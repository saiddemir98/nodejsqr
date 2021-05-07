const { validationResult } = require("express-validator");
var createError = require("http-errors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Manager = require("../models/manager_model");
const path = require("path");

const login = async (req, res, next) => {
  try {
    const manager = await Manager.findOne({ where: { email: req.body.email } });
    if (!manager) {
      throw createError(400, "Kullanıcı adı veya şifre hatalı");
    }
    if (manager && manager.emailStatus == false) {
      throw createError(400, "Lütfen mailinizi onaylayınız.");
    }
    const passVerify = await bcrypt.compare(
      req.body.password,
      manager.password
    );
    if (!passVerify) {
      throw createError(400, "Kullanıcı adı veya şifre hatalı");
    }

    const logginJwtToken = jwt.sign(
      { managerId: manager.id },
      process.env.CONFIRM_LOGED_JWT_SECRET,
      { expiresIn: "1d" }
    );
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
    next(error);
  }
};
const register = async (req, res, next) => {
  const errArray = validationResult(req);
  if (!errArray.isEmpty()) {
    return res.send(errArray.array());
  } else {
    try {
      const result = await Manager.findOne({
        where: { email: req.body.email },
      });
      if (result && result.emailStatus == true) {
        throw createError(
          400,
          "Böyle bir kullanıcı zaten mevcut. Şifrenizi mi unuttunuz?"
        );
      }
      if ((result && result.emailStatus == false) || result == null) {
        //kullanıcı oluşturma işlemleri
        if (result && result.emailStatus == false) {
          await result.destroy();
        }
        const newmanager = await Manager.build({
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          surname: req.body.surname,
        });
        const newManagerResult = await newmanager.save();

        if (!newManagerResult) {
          throw createError(400, "Kullanıcı eklenemedi.");
        }
        //jwt oluşturma işlemleri
        const jwtInfo = {
          id: newmanager.id,
          mail: newmanager.mail,
        };
        const jwtToken = jwt.sign(
          jwtInfo,
          process.env.CONFIRM_MAIL_JWT_SECRET,
          { expiresIn: "15m" }
        );
        //mail gonderme islemleri
        const url = process.env.WEB_SITE_URL + "api/auth/verify?id=" + jwtToken;
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASS,
          },
        });
        transporter.sendMail(
          {
            from: "Nodejs uygulaması <info@nodejskursu.com>",
            to: newmanager.email,
            subject:
              "Kaydınız başarıyla oluşturulmuştur. Giriş bilgileriniz aşşağıdadır",
            text:
              "Kullanıcı Giriş Mailiniz: " +
              req.body.email +
              "    Şifreniz: " +
              req.body.password +
              " \nEmailinizi onaylamak için lütfen şu linke tıklayınız " +
              url,
          },
          (err, info) => {
            if (err) {
              throw createError(400, "Kullanıcı eklenemedi.");
            }
            transporter.close();
          }
        );
        return res.json({ mesaj: "Lütfen mail kutunuzu kontrol ediniz." });
      }
    } catch (err) {
      next(err);
    }
  }
};
const verifyMail = async (req, res, next) => {
  const token = req.query.id;
  try {
    if (!token) {
      throw createError(400, "Lütfen geçerli bir linke tıklayınız.");
    }
    jwt.verify(
      token,
      process.env.CONFIRM_MAIL_JWT_SECRET,
      async (e, decoded) => {
        if (e) {
          throw createError(400, "Kod geçersiz. Lütfen yeniden kayıt olun.");
        }
        const managerResult = await Manager.findByPk(decoded.id);
        if (managerResult.emailStatus) {
          throw createError(400, "Mailinizi zaten onayladınız.");
        }
        const updateResult = await Manager.update(
          { emailStatus: true },
          { where: { id: decoded.id } }
        );
        if (!updateResult) {
          throw new createError(400, "Bir hata çıktı. Lütfen tekrar deneyin.");
        }
        return res.sendFile(
          path.join(__dirname + "/../../public/mailVerification.html")
        );
      }
    );
  } catch (error) {
    next(error);
  }
};
module.exports = {
  login,
  register,
  verifyMail,
};
