const express = require("express");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Category = require("../../models/category");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/user/:id", auth.isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const categories = await Category.find({ _userId: id });
        res.status(200).json(categories);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/user/:id", auth.isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const categories = await Category.find({ _userId: id });
        res.status(200).json(categories);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/add/user/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const id = req.params.id;
        const category = new Category({_userId: id, name: req.body.name});
        await category.save();
        res.status(200).json({category});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});


module.exports = router;