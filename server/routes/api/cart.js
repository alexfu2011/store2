const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();

// Bring in Models & Helpers
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const auth = require("../../middleware/auth");

router.post('/add', auth.isAuth, jsonParser, (req, res) => {
  const user = req.session._userId;
  const products = req.body.products;

  const cart = new Cart({
    user,
    products
  });

  cart.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }

    decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: data.id
    });
  });
});

router.delete('/delete/:cartId', auth.isAuth, (req, res) => {
  Cart.deleteOne({ _id: req.params.cartId }, err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

router.post('/add/:cartId', auth.isAuth, (req, res) => {
  const product = req.body.product;
  const query = { _id: req.params.cartId };

  Cart.updateOne(query, { $push: { products: product } }).exec(err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

router.delete('/delete/:cartId/:productId', auth.isAuth, (req, res) => {
  const product = { product: req.params.productId };
  const query = { _id: req.params.cartId };

  Cart.updateOne(query, { $pull: { products: product } }).exec(err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

const decreaseQuantity = products => {
  const bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: - item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
