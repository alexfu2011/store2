const router = require("express").Router();

const authRoutes = require("./auth");
const homeRoutes = require("./home");
const categoryRoutes = require("./category");
const productRoutes = require("./product");
const profileRoutes = require("./profile");
const cartRoutes = require("./cart");
const orderRoutes = require("./order");
const userRoutes = require("./user");
const discountRoutes = require("./discount");
const bannerRoutes = require("./banner");

router.use("/auth", authRoutes);
router.use("/home", homeRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/profile", profileRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/user", userRoutes);
router.use("/discount", discountRoutes);
router.use("/banner", bannerRoutes);

module.exports = router;