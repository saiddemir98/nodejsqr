const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");

//db bağlantısı
require("./src/configs/database");
require("./src/models/models_relationship");
//routerlar include edilir
const authRouters = require("./src/routers/auth_routers");
const adminRouters = require("./src/routers/admin_routers");
const menuRouters = require("./src/routers/menu_routers");
const testRouter = require("./src/routers/deneme_router");

const errorMiddleware = require("./src/middlewares/errors_middlewares");
//formdan gelen değerler için encoded

app.use("/image", express.static(path.join(__dirname, "/uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(busboyBodyParser({ multi: true }));

app.use("/api", testRouter);
app.use("/api/auth", authRouters);
app.use("/api/admin", adminRouters);
app.use("/api/menu", menuRouters);

//hata yönlendirme son aşama.. altına kod yazma
app.use(errorMiddleware);

///sunucu ayaklandırma ve db sync

app.listen(process.env.PORT, () => {
  console.log("Server ayaklandı..");
});
