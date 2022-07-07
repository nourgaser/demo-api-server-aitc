const router = require("express").Router();

const productRouter = require("./product");
const authRouter = require("./auth");

router.use("/product", productRouter);
router.use("/", authRouter);

module.exports = router;
