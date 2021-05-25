const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Discount = require("../../models/discount");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get('/', auth.isAuth, async (req, res) => {
  try {
    const disounts = await Discount.find();
    res.status(200).json(disounts);
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;