const router = require("express").Router();

const authRoutes = require("./auth");
const categoryRoutes = require("./category");
const productRoutes = require("./product");

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);

module.exports = router;