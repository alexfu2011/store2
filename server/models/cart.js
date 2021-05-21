const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  totalPrice: {
    type: Number
  },
  status: {
    type: String,
    default: 'not-processed',
    enum: ['not-processed', 'processing', 'shipped', 'delivered', 'cancelled']
  }
});

module.exports = Mongoose.model('CartItem', CartItemSchema);

const CartSchema = new Schema({
  products: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Cart', CartSchema);
