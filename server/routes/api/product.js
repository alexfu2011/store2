const express = require("express");
const Product = require("../../models/product");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth.isAuth, async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/user/:id", auth.isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const products = await Product.find({ _userId: id });
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;