const express = require("express");
const Product = require("../../models/product");
const Order = require("../../models/order");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth.isAuth, async (req, res) => {
    try {
        const TotalActiveProducts = await Product.countDocuments({isActive: 1});
        const TotalInctiveProducts = await Product.countDocuments({isActive: 2});
        const TotalActiveOrders = await Order.countDocuments({isActive: 1});
        const TotalInctiveOrders = await Order.countDocuments({isActive: 2});
        res.status(200).json({TotalActiveProducts, TotalInctiveProducts, TotalActiveOrders, TotalInctiveOrders});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;