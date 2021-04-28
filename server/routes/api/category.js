const express = require("express");
const category = require("../../models/category");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/user/:id", auth.isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const categories = await category.find({ _userId: id });
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
        const categories = await category.find({ _userId: id });
        res.status(200).json(categories);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;