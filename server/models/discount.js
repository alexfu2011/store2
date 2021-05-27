const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const DiscountSchema = new Schema({
  code: String,
  percentage: String,
  quantity: Number,
  from: Date,
  to: Date,
  isActive: {
      type: Number,
      default: 1
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Discount', DiscountSchema);
