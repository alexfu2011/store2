const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Discount = require("../../models/discount");
const router = express.Router();
const auth = require("../../middleware/auth");
const shortId = require("../../utils/shortid");

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

router.post("/add", auth.isAuth, jsonParser, async (req, res) => {
  try {
    const {
      percentage,
      quantity,
      from,
      to
    } = req.body;
    const discount = new Discount({
      code: shortId(),
      percentage,
      quantity,
      from,
      to
    });
    await discount.save();
    res.status(200).json(discount);
  } catch (err) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete("/delete/:id", auth.isAuth, jsonParser, async (req, res) => {
    try {
        const discountId = req.params.id;
        await Discount.findByIdAndDelete(discountId);
        res.status(200).json({});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.put("/update/:discountId", auth.isAuth, jsonParser, async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const {
      code,
      percentage,
      quantity,
      from,
      to,
      isActive
    } = req.body;
    const discount = await Discount.findByIdAndUpdate(discountId, {
      code,
      percentage,
      quantity,
      from,
      to,
      isActive
    });
    res.status(200).json(discount);
  } catch (err) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;