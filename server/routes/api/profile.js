const express = require("express");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Profile = require("../../models/profile");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth.isAuth, async (req, res) => {
    try {
        const userId = req.session._userId;
        const profile = await Profile.findOne({ _userId: userId });
        res.status(200).json(profile);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/save", auth.isAuth, jsonParser, async (req, res) => {
    const {
        address,
        city,
        person,
        phone,
        ...rest
    } = req.body;
    const userId = req.session._userId;
    let profile = {};
    Profile.countDocuments({ _userId: userId }).then(async (count) => {
        if (count == 0) {
            profile = new Profile({
                _userId: userId,
                address: address,
                city: city,
                person: person,
                phone: phone
            });
            await profile.save();
        } else {
            profile = await Profile.updateOne({ _userId: userId }, {
                address: address,
                city: city,
                person: person,
                phone: phone
            });
        }
    });
    res.status(200).json(profile);
});

module.exports = router;