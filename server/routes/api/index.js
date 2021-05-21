const router = require("express").Router();

const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const categoryRoutes = require("./category");
const productRoutes = require("./product");
const profileRoutes = require("./profile");
const cartRoutes = require("./cart");
const orderRoutes = require("./order");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/profile", profileRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

module.exports = router;