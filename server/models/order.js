const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const OrderLogSchema = new Schema({
  status: Number,
  created: {
    type: Date,
    default: Date.now
  }
});

const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  orderID: {
    type: Number,
    default: Math.random().toString().substr(2, 8)
  },
  logs: [OrderLogSchema],
  total: {
    type: Number,
    default: 0
  },
  discount: Number,
  isActive: {
    type: Number,
    default: 1
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Order', OrderSchema);
