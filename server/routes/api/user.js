const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require("../../models/user");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get('/', auth.isAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put("/update/:userId", auth.isAuth, jsonParser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      name,
      phone,
      province,
      city,
      address,
      email,
      description,
      isActive
    } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      name,
      phone,
      province,
      city,
      address,
      email,
      description,
      isActive
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


module.exports = router;