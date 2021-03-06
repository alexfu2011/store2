const express = require("express");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Category = require("../../models/category");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/list", auth.isAuth, async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/add", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const userId = req.session._userId;
        const category = new Category({_userId: userId, name: req.body.name, isActive: req.body.isActive});
        await category.save();
        res.status(200).json({category});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.delete("/delete/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/update/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const {name, isActive, ...rest} = req.body;
        const category = await Category.findByIdAndUpdate(categoryId, {name, isActive});
        res.status(200).json({category});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;