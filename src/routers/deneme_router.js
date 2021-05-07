const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const deneme = () => {
  var your_uuid = uuidv4();
  console.log(your_uuid);
};

router.get("/test", deneme);

module.exports = router;
