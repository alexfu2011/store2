const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const Counter = require("../../models/counter");
const Discount = require("../../models/discount");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const Profile = require("../../models/profile");
const router = express.Router();
const auth = require("../../middleware/auth");

router.post("/add", auth.isAuth, jsonParser, async (req, res) => {
  try {
    const cart = req.body.cartId;
    const total = req.body.total;
    const code = req.body.code;
    const user = req.session._userId;
    let discountTotal = 0;
    Discount.findOne({ code }).then(discount => {
      discountTotal = (1 - discount.percentage / 100) * total;
    });

    const order = new Order({
      cart,
      user,
      total,
      discount: discountTotal
    });

    Counter.findOneAndUpdate(
      { _id: "orderIdSeqGenerator" },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true
      }, (error, counter) => {
        if (error) {
          console.log("find counter sequence encountered error ", error);
          throw error;
        }
        order.orderID += counter.seq;
        Order.create(order, (error, doc) => {
          if (error) {
            console.log("save order encountered error ", error);
            throw error;
          } else {
            res.status(200).json({
              success: true,
              message: `Your order has been placed successfully!`,
              order: { _id: order._id }
            });
          }
        })
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.get("/:page", auth.isAuth, async (req, res) => {
  try {
    const page = req.params.page;
    let options;
    if (page == "active") {
      options = { isActive: 1 };
    } else if (page == "completed") {
      options = { isActive: 2 };
    } else if (page == "cancelled") {
      options = { isActive: 3 };
    } else {
      options = {};
    }
    const orders = await Order.find(options).populate("cart");

    const newOrders = orders.filter(order => order.cart);

    if (newOrders.length > 0) {
      const newDataSet = [];

      newOrders.map(async doc => {
        const cartId = doc.cart._id;

        const cart = await Cart.findById(cartId).populate("user", "-password").populate({
          path: "products.product"
        });

        const profile = await Profile.findOne({ _userId: cart.user._id });

        const order = {
          _id: doc._id,
          orderID: doc.orderID,
          total: parseFloat(Number(doc.total.toFixed(2))),
          discount: doc.discount,
          created: doc.created,
          isActive: doc.isActive,
          cartId: cartId,
          user: cart.user,
          profile: profile,
          products: cart.products
        };

        newDataSet.push(order);

        if (newDataSet.length === newOrders.length) {
          res.status(200).json({
            orders: newDataSet
          });
        }
      });
    } else {
      res.status(200).json({
        orders: []
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.put("/update/:orderId", auth.isAuth, jsonParser, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const {
      cartId,
      products,
      isActive
    } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { isActive });
    products.map(async product => {
      await Cart.updateOne({ "_id": cartId, "products._id": product._id }, {
        "$set": {
          "products.$.quantity": product.quantity,
          "products.$.status": product.status
        }
      });
    });
    res.status(200).json(order);
  }
  catch (err) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

// fetch order api
router.get("/:orderId", auth.isAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user = req.user._id;

    const orderDoc = await Order.findOne({ _id: orderId, user }).populate({
      path: "cart"
    });

    if (!orderDoc) {
      res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    const cart = await Cart.findById(orderDoc.cart._id).populate({
      path: "products.product",
      populate: {
        path: "brand"
      }
    });

    let order = {
      _id: orderDoc._id,
      cartId: orderDoc.cart._id,
      total: orderDoc.total,
      totalTax: 0,
      created: cart.created,
      products: cart.products
    };

    order = caculateTaxAmount(order);

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.delete("/cancel/:orderId", auth.isAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

router.put("/cancel/item/:itemId", auth.isAuth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;

    const foundCart = await Cart.findOne({ "products._id": itemId });
    const foundCartProduct = foundCart.products.find(p => p._id == itemId);

    await Cart.updateOne(
      { "products._id": itemId },
      {
        "products.$.status": "Cancelled"
      }
    );

    await Product.updateOne(
      { _id: foundCartProduct.product },
      { $inc: { quantity: 1 } }
    );

    const cart = await Cart.findOne({ _id: cartId });
    const items = cart.products.filter(item => item.status === "Cancelled");

    // All items are cancelled => Cancel order
    if (cart.products.length === items.length) {
      await Order.deleteOne({ _id: orderId });
      await Cart.deleteOne({ _id: cartId });

      return res.status(200).json({
        success: true,
        orderCancelled: true,
        message: "You order has been cancelled successfully!"
      });
    }

    res.status(200).json({
      success: true,
      message: "Item has been cancelled successfully!"
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
});

// calculate order tax amount
const caculateTaxAmount = order => {
  const taxRate = taxConfig.stateTaxRate;

  order.totalTax = 0;

  if (order.products && order.products.length > 0) {
    order.products.map(item => {
      if (item.product) {
        if (item.product.taxable) {
          const price = Number(item.product.price).toFixed(2);
          const taxAmount = Math.round(price * taxRate * 100) / 100;
          item.priceWithTax = parseFloat(price) + parseFloat(taxAmount);
          order.totalTax += taxAmount;
        }

        item.totalPrice = parseFloat(item.totalPrice.toFixed(2));
      }
    });
  }

  order.totalWithTax = order.total + order.totalTax;

  order.total = parseFloat(Number(order.total.toFixed(2)));
  order.totalTax = parseFloat(
    Number(order.totalTax && order.totalTax.toFixed(2))
  );
  order.totalWithTax = parseFloat(Number(order.totalWithTax.toFixed(2)));
  return order;
};

const increaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: +item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;