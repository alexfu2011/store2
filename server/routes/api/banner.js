const express = require("express");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Banner = require("../../models/banner");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../utils/upload").single("image");

router.get("/", async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.status(200).json(banners);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/list", auth.isAuth, async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.status(200).json(banners);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/add", auth.isAuth, jsonParser, async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            res.status(400).json({
                error: "Your request could not be processed. Please try again."
            });
        } else {
            const image = req.file.filename;
            try {
                const userId = req.session._userId;
                const banner = new Banner({ _userId: userId, name: req.body.name, image: image, isActive: req.body.isActive });
                await banner.save();
                res.status(200).json({ banner });
            } catch {
                res.status(400).json({
                    error: "Your request could not be processed. Please try again."
                });
            }
        }
    });
});

router.delete("/delete/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const bannerId = req.params.id;
        await Banner.findByIdAndDelete(bannerId);
        res.status(200).json({});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/update/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const bannerId = req.params.id;
        const {name, isActive, ...rest} = req.body;
        const banner = await Banner.findByIdAndUpdate(bannerId, {name, isActive});
        res.status(200).json({banner});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;